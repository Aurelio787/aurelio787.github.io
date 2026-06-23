"use strict";

const BauteilAuswahl = document.getElementById("Bauteil");
const ModellAuswahl = document.getElementById("ModellAuswahl");
const startButton = document.getElementById("StartButton"); 
const anzeigeDiv = document.getElementById("AusgewaehlterInhalt");
const specsTitel = document.getElementById("AusgewaelterInhaltSpecs");
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
    if (specsTitel) specsTitel.innerHTML = ""; // Leeres Feld bei Fehler
    if (BauteilBild) BauteilBild.style.display = "none";
    return;
  }

  const kategorieProdukte = DB[gewaehlteKategorie];
  const gefundenesProdukt = kategorieProdukte.find(item => item.id === gewaehltesModellId);

  if (gefundenesProdukt) {
    // Haupttext oben
    anzeigeDiv.textContent = "Du hast ausgewählt: " + gefundenesProdukt.name + " für " + gefundenesProdukt.price;
    
    // --- HIER FÄNGT DIE 2. METHODE AN ---
    if (specsTitel) {
      // Leere die Liste zuerst, falls vorher etwas drin stand
      specsTitel.innerHTML = "";
      
      // Hilfsfunktion zum Erstellen von Listenelementen
      const addSpecLine = (label, value) => {
        if (value !== undefined && value !== "") {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${label}:</strong> ${value}`;
          specsTitel.appendChild(li);
        }
      };

      // Titel/Produktname als erstes Element hinzufügen
      const liTitle = document.createElement("li");
      liTitle.innerHTML = `<strong>Modell:</strong> ${gefundenesProdukt.name}`;
      specsTitel.appendChild(liTitle);

      // Je nach Kategorie die spezifischen Eigenschaften anhängen
      if (gewaehlteKategorie === "gpus") {
        addSpecLine("Marke", gefundenesProdukt.chip_manufacturer);
        addSpecLine("VRAM", gefundenesProdukt.vram);
        addSpecLine("Kühlung", gefundenesProdukt.cooling_type);
        addSpecLine("TDP", gefundenesProdukt.tdp);
        addSpecLine("RGB", gefundenesProdukt.rgb);
        addSpecLine("Grösse", gefundenesProdukt.size);
      } else if (gewaehlteKategorie === "cases") {
        addSpecLine("Formfaktor", gefundenesProdukt.form_factor);
        addSpecLine("Farbe", gefundenesProdukt.color);
        addSpecLine("Seitenteil", gefundenesProdukt.side_panel);
      }else if (gewaehlteKategorie === "psu")   {
        addSpecLine("Anzahl Watt", gefundenesProdukt.wattage);
        addSpecLine("Sind die Kabel abnehmbar", gefundenesProdukt.certification);
        addSpecLine("Form Faktor", gefundenesProdukt.form_factor);
        addSpecLine("ATX Standart", gefundenesProdukt.atx_standard);
        addSpecLine("warscheinliche Upgrade sicherheit", gefundenesProdukt.warranty);
      }else if (gewaehlteKategorie === "cpus") {
        addSpecLine("Sockel", gefundenesProdukt.socket);
        addSpecLine("RAM Kattegorie", gefundenesProdukt.ram);        
        addSpecLine("Rating", gefundenesProdukt.rating);
        addSpecLine("Cinebench 24 Singlecore Punktzahl", gefundenesProdukt.cinebench24single);
        addSpecLine("Cinebench 24 Multicore Punktzahl", gefundenesProdukt.cinebench24multi);
        addSpecLine("azahl Kerne", gefundenesProdukt.cores);
        addSpecLine("Standart TDP", gefundenesProdukt.tdpnormal);
        addSpecLine("Boost TDP", gefundenesProdukt.tdpboost);
        addSpecLine("L3 Cache", gefundenesProdukt.L3cache);
      }else if ( gewaehlteKategorie === "motherboards") {
        addSpectLine("Chip Satz", gewaehlteKategorie.chipset);
        addSpectLine("Sockel", gewaehlteKategorie.socket);
        addSpectLine("RAM", gewaehlteKategorie.ramType);
        addSpectLine("Anzahl RAM Bänke", gewaehlteKategorie.ramSlots);
        addSpectLine("Form Faktor", gewaehlteKategorie.formFactor);
        addSpectLine("Anzahl M.2 Slots", gewaehlteKategorie.m2Slots);
        addSpectLine("Anzahl Sata Steckplätze", gewaehlteKategorie.sataPorts);
        addSpectLine("Spezielle eigenschaften", gewaehlteKategorie.specialFeatures);
      }else if (gewaehlteKategorie === "ssds") {
        addSpecLine("Form Faktor", gewaehlteKategorie.form_factor);
        addSpecLine("Schnittstelle", gewaehlteKategorie.interface);
        addSpecLine("Kategorie", gewaehlteKategorie.category);
      }else if (gewaehlteKategorie === coolers) {
        addSpecLine("Kühlart", gewaehlteKategorie.cooling_type);
        addSpecLine("Grösse dess Radiators", gewaehlteKategorie.radiator.size);
        addSpecLine("Sockel Kompaktibilität", gewaehlteKategorie.socket_compatibility);
        addSpecLine("Anzahl Lüfter", gewaehlteKategorie.fans);
        addSpecLine("RGB Lüfter?", gewaehlteKategorie.rgb);
      }
      
      // Standardmässig immer den Preis auflisten
      addSpecLine("Preis", gefundenesProdukt.price);
    }
    // --- HIER HÖRT DIE 2. METHODE AUF ---
    
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