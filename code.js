"use strict";

const BauteilAuswahl = document.getElementById("Bauteil");
const ModellAuswahl = document.getElementById("ModellAuswahl");
const startButton = document.getElementById("StartButton"); 
const anzeigeDiv = document.getElementById("AusgewaehlterInhalt");
const BauteilBild = document.getElementById("BauteilBild");
const BauteileListe = document.getElementById("ListeKomponente");
const saveButton = document.getElementById("saveComponent");
const suchLeiste = document.getElementById("SuchLeiste"); 

let DB; 

// 1. Daten laden
fetch('./Datenbank.json')
  .then((response) => response.json())
  .then((json) => {
    DB = json;
    startKonfigurator();
  })
  .catch((error) => console.error("Fehler beim Laden der JSON:", error));

function startKonfigurator() {
  if (!BauteilAuswahl) return;
  BauteilAuswahl.innerHTML = '<option value="">-- Kategorie wählen --</option>';
  
  Object.keys(DB || {}).forEach((kategorie) => {
    const option = document.createElement("option");
    option.value = kategorie; 
    option.textContent = kategorie.charAt(0).toUpperCase() + kategorie.slice(1);
    BauteilAuswahl.appendChild(option);
  });
}

// 2. Kategorie-Wechsel (HIER WURDE DIE LÖSUNG EINGEBAUT)
// Sobald eine Kategorie gewählt wird, werden sofort alle Modelle geladen.
// Das Suchfeld bleibt dadurch freiwillig.
BauteilAuswahl.addEventListener("change", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  
  // Suchfeld bei Kategoriewechsel leeren, damit die Liste nicht versteckt bleibt
  if (suchLeiste) suchLeiste.value = "";

  ModellAuswahl.innerHTML = '<option value="">-- Modell wählen --</option>';

  if (!gewaehlteKategorie || !DB[gewaehlteKategorie]) return;

  // Füllt das Dropdown direkt mit allen Produkten dieser Kategorie
  DB[gewaehlteKategorie].forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id; 
    option.textContent = `${item.name} (${item.price})`;
    ModellAuswahl.appendChild(option);
  });
});

// 3. Such-Logik (Freiwillig als Hilfestellung)
// Filtert nur, wenn etwas in die Suchleiste eingetippt wird
if (suchLeiste) {
  suchLeiste.addEventListener("input", function() {
    const suchBegriff = suchLeiste.value.toLowerCase();
    const gewaehlteKategorie = BauteilAuswahl.value;
    
    if (!gewaehlteKategorie || !DB[gewaehlteKategorie]) return;

    const alleProdukte = DB[gewaehlteKategorie];
    const gefilterteProdukte = alleProdukte.filter(item => 
      item.name.toLowerCase().includes(suchBegriff)
    );

    // Dropdown leeren und mit den gefilterten Ergebnissen befüllen
    ModellAuswahl.innerHTML = '<option value="">-- Modell wählen --</option>';
    
    gefilterteProdukte.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} (${item.price})`;
      ModellAuswahl.appendChild(option);
    });
  });
}

// 4. Button: Zeigt Info-Text und Bauteil-Bild an
startButton.addEventListener("click", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  const gewaehltesModellId = ModellAuswahl.value;

  if (!gewaehltesModellId || !DB[gewaehlteKategorie]) {
    anzeigeDiv.textContent = "Bitte wähle zuerst ein konkretes Modell aus!";
    if (BauteilBild) BauteilBild.style.display = "none";
    return;
  }

  const kategorieProdukte = DB[gewaehlteKategorie];
  const gefundenesProdukt = kategorieProdukte.find(item => item.id === gewaehltesModellId);

  if (gefundenesProdukt) {
    anzeigeDiv.textContent = "Du hast ausgewählt: " + gefundenesProdukt.name + " für " + gefundenesProdukt.price;
    
    if (BauteilBild) {
      if (gewaehlteKategorie === "cpus") {
        const sockelName = gefundenesProdukt.socket.toLowerCase();
        BauteilBild.src = `Images/sockel-${sockelName}.jpg`;
      } else {
        BauteilBild.src = `Images/${gefundenesProdukt.id}.jpg`;
      }
      BauteilBild.style.display = "block";
    }
  }
});

// 5. Button: Speichert die Komponente
saveButton.addEventListener("click", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  const gewaehltesModellId = ModellAuswahl.value;

  if (!gewaehltesModellId) {
    alert("Bitte wähle zuerst ein Modell aus, das du speichern willst!");
    return;
  }

  const kategorieProdukte = DB[gewaehlteKategorie];
  const gefundenesProdukt = kategorieProdukte.find(item => item.id === gewaehltesModellId);

  if (gefundenesProdukt && BauteileListe) {
    if (BauteileListe.value === "Liste deiner Komponenten" || 
        BauteileListe.value === "Liste ihrer Komponenten" || 
        BauteileListe.value === "Deine ausgewählten Komponenten:") {
      BauteileListe.value = "";
    }
    
    if (BauteileListe.value.length > 0) {
      BauteileListe.value += ", ";
    }
    
    BauteileListe.value += gefundenesProdukt.name + " (" + gefundenesProdukt.price + ")";
  }
});