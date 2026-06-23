"use strict";

const BauteilAuswahl = document.getElementById("Bauteil");
const ModellAuswahl = document.getElementById("ModellAuswahl");
const startButton = document.getElementById("StartButton"); 
const anzeigeDiv = document.getElementById("AusgewaehlterInhalt");
const specsTitel = document.getElementById("AusgewaehlterInhaltSpecs");
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

// 2. Kategorie-Wechsel (Modelle werden sofort geladen, Suche ist freiwillig)
BauteilAuswahl.addEventListener("change", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  
  if (suchLeiste) suchLeiste.value = "";
  ModellAuswahl.innerHTML = '<option value="">-- Modell wählen --</option>';

  if (!gewaehlteKategorie || !DB[gewaehlteKategorie]) return;

  DB[gewaehlteKategorie].forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id; 
    option.textContent = `${item.name} (${item.price})`;
    ModellAuswahl.appendChild(option);
  });
});

// 3. Such-Logik (Freiwillig als Hilfestellung)
if (suchLeiste) {
  suchLeiste.addEventListener("input", function() {
    const suchBegriff = suchLeiste.value.toLowerCase();
    const gewaehlteKategorie = BauteilAuswahl.value;
    
    if (!gewaehlteKategorie || !DB[gewaehlteKategorie]) return;

    const alleProdukte = DB[gewaehlteKategorie];
    const gefilterteProdukte = alleProdukte.filter(item => 
      item.name.toLowerCase().includes(suchBegriff)
    );

    ModellAuswahl.innerHTML = '<option value="">-- Modell wählen --</option>';
    
    gefilterteProdukte.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} (${item.price})`;
      ModellAuswahl.appendChild(option);
    });
  });
}

// 4. Button: Zeigt Info-Text, Bild und Spezifikationen an
startButton.addEventListener("click", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  const gewaehltesModellId = ModellAuswahl.value;

  if (!gewaehltesModellId || !DB[gewaehlteKategorie]) {
    anzeigeDiv.textContent = "Bitte wähle zuerst ein konkretes Modell aus!";
    if (specsTitel) specsTitel.textContent = "";
    if (BauteilBild) BauteilBild.style.display = "none";
    return;
  }

  const kategorieProdukte = DB[gewaehlteKategorie];
  const gefundenesProdukt = kategorieProdukte.find(item => item.id === gewaehltesModellId);

  if (gefundenesProdukt) {
    // Haupttext oben
    anzeigeDiv.textContent = "Du hast ausgewählt: " + gefundenesProdukt.name + " für " + gefundenesProdukt.price;
    
    // Spezifikationen im <h2> auflisten
    if (specsTitel) {
      let specsText = `Spezifikationen: ${gefundenesProdukt.name} | `;
      
      if (gewaehlteKategorie === "gpus") {
        specsText += `VRAM: ${gefundenesProdukt.vram} | Kühlung: ${gefundenesProdukt.cooling_type} | TDP: ${gefundenesProdukt.tdp} | RGB: ${gefundenesProdukt.rgb}`;
      } else if (gewaehlteKategorie === "cases") {
        specsText += `Formfaktor: ${gefundenesProdukt.form_factor} | Farbe: ${gefundenesProdukt.color} | Seitenteil: ${gefundenesProdukt.side_panel}`;
      } else {
        specsText += `Preis: ${gefundenesProdukt.price}`;
      }
      specsTitel.textContent = specsText;
    }
    
    // Bild im Ordner Images/ anzeigen mit Fallback-Sicherung
    if (BauteilBild) {
      BauteilBild.onerror = () => { BauteilBild.src = 'Images/placeholder.jpg'; };
      
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

  if (!gewaehltesModellId || !DB[gewaehlteKategorie]) {
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
		
