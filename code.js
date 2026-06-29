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

// 1.5 Beim Laden der Seite prüfen, ob bereits gespeicherte Komponenten existieren
document.addEventListener("DOMContentLoaded", function() {
  const gespeicherteListe = localStorage.getItem("gespeicherteKomponenten");
  const BauteileListe = document.getElementById("ListeKomponente");
  
  // Wenn etwas im Speicher gefunden wird und die Textbox existiert, dort einfügen
  if (gespeicherteListe && BauteileListe) {
    BauteileListe.value = gespeicherteListe;
  }
});

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
} else if (gewaehlteKategorie === "psu") {
  addSpecLine("Anzahl Watt", gefundenesProdukt.wattage);
  addSpecLine("Sind die Kabel abnehmbar", gefundenesProdukt.certification);
  addSpecLine("Form Faktor", gefundenesProdukt.form_factor);
  addSpecLine("ATX Standart", gefundenesProdukt.atx_standard);
  addSpecLine("warscheinliche Upgrade sicherheit", gefundenesProdukt.warranty);
} else if (gewaehlteKategorie === "cpus") {
  addSpecLine("Sockel", gefundenesProdukt.socket);
  addSpecLine("RAM Kattegorie", gefundenesProdukt.ram);        
  addSpecLine("Rating", gefundenesProdukt.rating);
  addSpecLine("Cinebench 24 Singlecore Punktzahl", gefundenesProdukt.cinebench24single);
  addSpecLine("Cinebench 24 Multicore Punktzahl", gefundenesProdukt.cinebench24multi);
  addSpecLine("azahl Kerne", gefundenesProdukt.cores);
  addSpecLine("Standart TDP", gefundenesProdukt.tdpnormal);
  addSpecLine("Boost TDP", gefundenesProdukt.tdpboost);
  addSpecLine("L3 Cache", gefundenesProdukt.L3cache);
} else if (gewaehlteKategorie === "motherboards") {
  addSpecLine("Chip Satz", gefundenesProdukt.chipset);
  addSpecLine("Sockel", gefundenesProdukt.socket);
  addSpecLine("RAM", gefundenesProdukt.ramType);
  addSpecLine("Anzahl RAM Bänke", gefundenesProdukt.ramSlots);
  addSpecLine("Form Faktor", gefundenesProdukt.formFactor);
  addSpecLine("Anzahl M.2 Slots", gefundenesProdukt.m2Slots);
  addSpecLine("Anzahl Sata Steckplätze", gefundenesProdukt.sataPorts);
  addSpecLine("Spezielle eigenschaften", gefundenesProdukt.specialFeatures);
} else if (gewaehlteKategorie === "ssds") {
  addSpecLine("Form Faktor", gefundenesProdukt.form_factor);
  addSpecLine("Schnittstelle", gefundenesProdukt.interface);
  addSpecLine("Kategorie", gefundenesProdukt.category);
} else if (gewaehlteKategorie === "coolers") {
  addSpecLine("Kühlart", gefundenesProdukt.cooling_type);
  // Hier prüfen wir, ob es eine Radiatorgröße gibt (Luftkühler haben das nicht)
  if (gefundenesProdukt.radiator_size) {
    addSpecLine("Grösse dess Radiators", gefundenesProdukt.radiator_size);
  }
  addSpecLine("Sockel Kompaktibilität", gefundenesProdukt.socket_compatibility);
  addSpecLine("Anzahl Lüfter", gefundenesProdukt.fans);
  addSpecLine("RGB Lüfter?", gefundenesProdukt.rgb);
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
// 5. Inkompatibilitätsprüfung
function ladeSturkturierteDaten() {
  try {
    return JSON.parse(localStorage.getItem("gespeicherteKomponentenDaten") || "[]");
  } catch {
    return [];
  }
}

function pruefeKompatibilitaet(neueKategorie, neuesProdukt, gespeicherte) {
  const fehler = [];

  const gespeicherteCPUs = gespeicherte.filter(k => k.kategorie === "cpus");
  const gespeicherteMBs  = gespeicherte.filter(k => k.kategorie === "motherboards");
  const gespeicherteKuehler = gespeicherte.filter(k => k.kategorie === "coolers");

  // --- Mehr als eine CPU ---
  if (neueKategorie === "cpus" && gespeicherteCPUs.length >= 1) {
    fehler.push({
      meldung: "Du hast bereits eine CPU gespeichert. Standard-Mainboards haben nur einen CPU-Sockel.",
      vorschlaege: []
    });
  }

  // --- CPU ↔ Mainboard: Sockel-Kompatibilität ---
  if (neueKategorie === "cpus") {
    gespeicherteMBs.forEach(mb => {
      if (mb.daten.socket !== neuesProdukt.socket) {
        const vorschlaege = (DB.motherboards || [])
          .filter(m => m.socket === neuesProdukt.socket)
          .slice(0, 3)
          .map(m => `${m.name} (Sockel ${m.socket})`);
        fehler.push({
          meldung: `Sockel-Konflikt: Deine CPU hat Sockel "${neuesProdukt.socket}", aber das gespeicherte Mainboard "${mb.daten.name}" hat Sockel "${mb.daten.socket}".`,
          vorschlaege
        });
      }
    });
  }
  if (neueKategorie === "motherboards") {
    gespeicherteCPUs.forEach(cpu => {
      if (cpu.daten.socket !== neuesProdukt.socket) {
        const vorschlaege = (DB.motherboards || [])
          .filter(m => m.socket === cpu.daten.socket)
          .slice(0, 3)
          .map(m => `${m.name} (Sockel ${m.socket})`);
        fehler.push({
          meldung: `Sockel-Konflikt: Dein Mainboard hat Sockel "${neuesProdukt.socket}", aber die gespeicherte CPU "${cpu.daten.name}" hat Sockel "${cpu.daten.socket}".`,
          vorschlaege
        });
      }
    });
  }

  // --- CPU ↔ Mainboard: RAM-Typ-Kompatibilität ---
  if (neueKategorie === "cpus") {
    gespeicherteMBs.forEach(mb => {
      const cpuRam = neuesProdukt.ram || "";
      const mbRam  = mb.daten.ramType || "";
      if (mbRam && !cpuRam.includes(mbRam)) {
        const vorschlaege = (DB.motherboards || [])
          .filter(m => m.socket === neuesProdukt.socket && cpuRam.includes(m.ramType))
          .slice(0, 3)
          .map(m => `${m.name} (${m.ramType})`);
        fehler.push({
          meldung: `RAM-Konflikt: Deine CPU unterstützt "${cpuRam}", aber das gespeicherte Mainboard "${mb.daten.name}" hat ${mbRam}-Slots.`,
          vorschlaege
        });
      }
    });
  }
  if (neueKategorie === "motherboards") {
    gespeicherteCPUs.forEach(cpu => {
      const cpuRam = cpu.daten.ram || "";
      const mbRam  = neuesProdukt.ramType || "";
      if (cpuRam && !cpuRam.includes(mbRam)) {
        const vorschlaege = (DB.motherboards || [])
          .filter(m => m.socket === cpu.daten.socket && cpuRam.includes(m.ramType))
          .slice(0, 3)
          .map(m => `${m.name} (${m.ramType})`);
        fehler.push({
          meldung: `RAM-Konflikt: Das Mainboard hat ${mbRam}-Slots, aber die gespeicherte CPU "${cpu.daten.name}" unterstützt nur "${cpuRam}".`,
          vorschlaege
        });
      }
    });
  }

  // --- CPU ↔ Kühler: Sockel-Kompatibilität ---
  if (neueKategorie === "coolers") {
    gespeicherteCPUs.forEach(cpu => {
      const compat = neuesProdukt.socket_compatibility || "";
      if (compat && !compat.includes(cpu.daten.socket)) {
        const vorschlaege = (DB.coolers || [])
          .filter(c => (c.socket_compatibility || "").includes(cpu.daten.socket))
          .slice(0, 3)
          .map(c => c.name);
        fehler.push({
          meldung: `Kühler-Konflikt: Dieser Kühler unterstützt nicht Sockel "${cpu.daten.socket}" (kompatibel mit: ${compat}).`,
          vorschlaege
        });
      }
    });
  }
  if (neueKategorie === "cpus") {
    gespeicherteKuehler.forEach(kuehler => {
      const compat = kuehler.daten.socket_compatibility || "";
      if (compat && !compat.includes(neuesProdukt.socket)) {
        const vorschlaege = (DB.coolers || [])
          .filter(c => (c.socket_compatibility || "").includes(neuesProdukt.socket))
          .slice(0, 3)
          .map(c => c.name);
        fehler.push({
          meldung: `Kühler-Konflikt: Dein gespeicherter Kühler "${kuehler.daten.name}" unterstützt keinen ${neuesProdukt.socket}-Sockel.`,
          vorschlaege
        });
      }
    });
  }

  return fehler;
}

function zeigeFehler(fehler) {
  const container = document.getElementById("KompatibilitaetsFehler");
  if (!container) return;

  if (fehler.length === 0) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  let html = "<h3>⚠️ Inkompatibilität erkannt!</h3>";
  fehler.forEach(f => {
    html += `<div class="fehler-eintrag">`;
    html += `<div class="fehler-meldung">❌ ${f.meldung}</div>`;
    if (f.vorschlaege.length > 0) {
      html += `<div class="fehler-vorschlaege">💡 Passende Alternativen:<ul>`;
      f.vorschlaege.forEach(v => { html += `<li>${v}</li>`; });
      html += `</ul></div>`;
    }
    html += `</div>`;
  });

  container.innerHTML = html;
  container.style.display = "block";
}

// 6. Button: Speichert die Komponente
saveButton.addEventListener("click", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  const gewaehltesModellId = ModellAuswahl.value;

  if (!gewaehltesModellId || !DB[gewaehlteKategorie]) {
    alert("Bitte wähle zuerst ein Modell aus, das du speichern willst!");
    return;
  }

  const kategorieProdukte = DB[gewaehlteKategorie];
  const gefundenesProdukt = kategorieProdukte.find(item => item.id === gewaehltesModellId);

  if (!gefundenesProdukt) return;

  // Inkompatibilität prüfen
  const gespeicherteDaten = ladeSturkturierteDaten();
  const fehler = pruefeKompatibilitaet(gewaehlteKategorie, gefundenesProdukt, gespeicherteDaten);
  zeigeFehler(fehler);

  if (BauteileListe) {
    const aktuellerText = BauteileListe.value.trim();
    if (
      aktuellerText === "Liste deiner Komponenten" ||
      aktuellerText === "Liste ihrer Komponenten" ||
      aktuellerText === "Deine ausgewählten Komponenten:"
    ) {
      BauteileListe.value = "";
    }

    const trenner = BauteileListe.value.length > 0 ? ", " : "";
    BauteileListe.value += `${trenner}${gefundenesProdukt.name} (${gefundenesProdukt.price})`;
    localStorage.setItem("gespeicherteKomponenten", BauteileListe.value);
  }

  // Strukturierte Daten für zukünftige Prüfungen speichern
  gespeicherteDaten.push({ kategorie: gewaehlteKategorie, daten: gefundenesProdukt });
  localStorage.setItem("gespeicherteKomponentenDaten", JSON.stringify(gespeicherteDaten));

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
});

const resetButton = document.getElementById("resetButton");

if (resetButton) {
  resetButton.addEventListener("click", function() {
    if (BauteileListe) {
      BauteileListe.value = "";
    }
    localStorage.removeItem("gespeicherteKomponenten");
    localStorage.removeItem("gespeicherteKomponentenDaten");
    const container = document.getElementById("KompatibilitaetsFehler");
    if (container) { container.style.display = "none"; container.innerHTML = ""; }
    alert("Die Komponenten-Liste wurde geleert.");
  });
}