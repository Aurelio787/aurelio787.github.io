"use strict";

const BauteilAuswahl = document.getElementById("Bauteil");
const ModellAuswahl = document.getElementById("ModellAuswahl");
const startButton = document.getElementById("StartButton"); 
const anzeigeDiv = document.getElementById("AusgewaehlterInhalt");
const BauteilBild = document.getElementById("BauteilBild");
const BauteileListe = document.getElementById("ListeKomponente");
const saveButton = document.getElementById("saveComponent");
const searchfield = document.getElementById("searchfield");

let DB; 

// Spieldaten aus JSON laden
fetch('./Datenbank.json')
  .then((response) => response.json())
  .then((json) => {
    DB = json;
    startKonfigurator();
  })
  .catch((error) => console.error("Fehler beim Laden der JSON:", error));

function startKonfigurator() {
  BauteilAuswahl.innerHTML = '<option value="">-- Kategorie wählen --</option>';
  if (ModellAuswahl) {
    ModellAuswahl.innerHTML = '<option value="">-- Bitte zuerst Kategorie wählen --</option>';
  }

  Object.keys(DB).forEach((kategorie) => {
    const option = document.createElement("option");
    option.value = kategorie; 
    option.textContent = kategorie.charAt(0).toUpperCase() + kategorie.slice(1);
    BauteilAuswahl.appendChild(option);
  });
}

// Wenn eine Oberkategorie gewählt wird
BauteilAuswahl.addEventListener("change", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  ModellAuswahl.innerHTML = '<option value="">-- Modell wählen --</option>';

  if (!gewaehlteKategorie) return;

  const produkte = DB[gewaehlteKategorie];

  if (produkte && produkte.length > 0) {
    produkte.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; 
      option.textContent = `${item.name} (${item.price})`;
      ModellAuswahl.appendChild(option);
    });
  } else {
    ModellAuswahl.innerHTML = '<option value="">Keine Einträge gefunden</option>';
  }
});

// 1. Button: Zeigt Info-Text und Bauteil-Bild an
startButton.addEventListener("click", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  const gewaehltesModellId = ModellAuswahl.value;

  if (!gewaehltesModellId) {
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


const suchLeiste = document.getElementById("SuchLeiste");

suchLeiste.addEventListener("input", function() {
  const suchBegriff = suchLeiste.value.toLowerCase();
  const gewaehlteKategorie = BauteilAuswahl.value;

  if (!gewaehlteKategorie) return;

  // Alle Produkte der aktuellen Kategorie holen
  const alleProdukte = DB[gewaehlteKategorie];
  
  // Filtern
  const gefilterteProdukte = alleProdukte.filter(item => 
    item.name.toLowerCase().includes(suchBegriff)
  );

  // Dropdown leeren und neu befüllen
  ModellAuswahl.innerHTML = '<option value="">-- Modell wählen --</option>';
  gefilterteProdukte.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} (${item.price})`;
    ModellAuswahl.appendChild(option);
  });
});