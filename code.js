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
  if (gefundenesProdukt.radiator_size) {
    addSpecLine("Grösse dess Radiators", gefundenesProdukt.radiator_size);
  }
  addSpecLine("Sockel Kompaktibilität", gefundenesProdukt.socket_compatibility);
  addSpecLine("Anzahl Lüfter", gefundenesProdukt.fans);
  addSpecLine("RGB Lüfter?", gefundenesProdukt.rgb);
} else if (gewaehlteKategorie === "rams") {
  addSpecLine("Marke", gefundenesProdukt.brand);
  addSpecLine("RAM-Typ", gefundenesProdukt.ram_type);
  addSpecLine("Geschwindigkeit", gefundenesProdukt.speed + " MHz");
  addSpecLine("Kapazität", gefundenesProdukt.capacity + " GB");
  addSpecLine("Module", gefundenesProdukt.modules);
  addSpecLine("CAS-Latenz", gefundenesProdukt.cas_latency);
  addSpecLine("Spannung", gefundenesProdukt.voltage);
  addSpecLine("RGB", gefundenesProdukt.rgb);
  addSpecLine("Formfaktor", gefundenesProdukt.form_factor);
}

// Standardmässig immer den Preis auflisten
addSpecLine("Preis", gefundenesProdukt.price);
 
    }
    // --- HIER HÖRT DIE 2. METHODE AUF ---
    
    // Bild im Ordner Images/ anzeigen mit Fallback-Sicherung
    if (BauteilBild) {
      setzeBildFallback(BauteilBild);
      
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
// 5. Hilfsfunktionen für Build-Prüfung
const BILD_FALLBACK = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#e0e0e0" rx="8"/><text x="150" y="100" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" fill="#999">Kein Bild</text></svg>');

function setzeBildFallback(img) {
  img.onerror = () => { img.onerror = null; img.src = BILD_FALLBACK; };
}

function ladeSturkturierteDaten() {
  try {
    return JSON.parse(localStorage.getItem("gespeicherteKomponentenDaten") || "[]");
  } catch {
    return [];
  }
}

function parsePreis(preisString) {
  if (!preisString) return 0;
  const cleaned = String(preisString).replace(/[^0-9]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

function pruefeAlleKompatibilitaeten(gespeicherte) {
  const fehler = [];
  const cpus    = gespeicherte.filter(k => k.kategorie === "cpus");
  const mbs     = gespeicherte.filter(k => k.kategorie === "motherboards");
  const rams    = gespeicherte.filter(k => k.kategorie === "rams");
  const kuehler = gespeicherte.filter(k => k.kategorie === "coolers");

  // Mehr als eine CPU
  if (cpus.length > 1) {
    fehler.push({ meldung: `Du hast ${cpus.length} CPUs gespeichert. Standard-Mainboards haben nur einen CPU-Sockel.`, vorschlaege: [] });
  }

  // CPU ↔ Mainboard: Sockel
  cpus.forEach(cpu => {
    mbs.forEach(mb => {
      if (cpu.daten.socket !== mb.daten.socket) {
        const vorschlaege = (DB.motherboards || []).filter(m => m.socket === cpu.daten.socket).slice(0, 3).map(m => ({ label: `${m.name} (Sockel ${m.socket})`, neuKat: "motherboards", neuId: m.id }));
        fehler.push({ meldung: `Sockel-Konflikt: CPU "${cpu.daten.name}" (${cpu.daten.socket}) passt nicht zu Mainboard "${mb.daten.name}" (${mb.daten.socket}).`, ersetzeKat: "motherboards", ersetzeId: mb.daten.id, vorschlaege });
      }
    });
  });

  // CPU ↔ Mainboard: RAM-Typ
  cpus.forEach(cpu => {
    mbs.forEach(mb => {
      const cpuRam = cpu.daten.ram || "";
      const mbRam  = mb.daten.ramType || "";
      if (mbRam && !cpuRam.includes(mbRam)) {
        const vorschlaege = (DB.motherboards || []).filter(m => m.socket === cpu.daten.socket && cpuRam.includes(m.ramType)).slice(0, 3).map(m => ({ label: `${m.name} (${m.ramType})`, neuKat: "motherboards", neuId: m.id }));
        fehler.push({ meldung: `RAM-Konflikt: CPU "${cpu.daten.name}" unterstützt ${cpuRam}, aber Mainboard "${mb.daten.name}" hat ${mbRam}-Slots.`, ersetzeKat: "motherboards", ersetzeId: mb.daten.id, vorschlaege });
      }
    });
  });

  // RAM ↔ CPU: RAM-Typ
  rams.forEach(ram => {
    cpus.forEach(cpu => {
      const cpuRam = cpu.daten.ram || "";
      const ramTyp = ram.daten.ram_type || "";
      if (ramTyp && !cpuRam.includes(ramTyp)) {
        const vorschlaege = (DB.rams || []).filter(r => cpuRam.includes(r.ram_type)).slice(0, 3).map(r => ({ label: `${r.name} (${r.ram_type})`, neuKat: "rams", neuId: r.id }));
        fehler.push({ meldung: `RAM-Konflikt: RAM "${ram.daten.name}" (${ramTyp}) ist nicht kompatibel mit CPU "${cpu.daten.name}" (unterstützt ${cpuRam}).`, ersetzeKat: "rams", ersetzeId: ram.daten.id, vorschlaege });
      }
    });
  });

  // RAM ↔ Mainboard: RAM-Typ
  rams.forEach(ram => {
    mbs.forEach(mb => {
      const mbRam  = mb.daten.ramType || "";
      const ramTyp = ram.daten.ram_type || "";
      if (ramTyp && mbRam && ramTyp !== mbRam) {
        const vorschlaege = (DB.rams || []).filter(r => r.ram_type === mbRam).slice(0, 3).map(r => ({ label: `${r.name} (${r.ram_type})`, neuKat: "rams", neuId: r.id }));
        fehler.push({ meldung: `RAM-Konflikt: RAM "${ram.daten.name}" (${ramTyp}) passt nicht zu Mainboard "${mb.daten.name}" (${mbRam}-Slots).`, ersetzeKat: "rams", ersetzeId: ram.daten.id, vorschlaege });
      }
    });
  });

  // RAM-Slot-Overflow
  mbs.forEach(mb => {
    const maxSlots    = parseInt(mb.daten.ramSlots) || 4;
    const belegteSlots = rams.reduce((sum, r) => sum + (r.daten.dimms || 1), 0);
    if (belegteSlots > maxSlots) {
      fehler.push({ meldung: `Zu viele RAM-Module: Mainboard "${mb.daten.name}" hat ${maxSlots} RAM-Slots, du hast aber ${belegteSlots} Module gespeichert.`, ersetzeKat: null, ersetzeId: null, vorschlaege: [] });
    }
  });

  // Kühler ↔ CPU: Sockel
  kuehler.forEach(k => {
    cpus.forEach(cpu => {
      const compat = k.daten.socket_compatibility || "";
      if (compat && !compat.includes(cpu.daten.socket)) {
        const vorschlaege = (DB.coolers || []).filter(c => (c.socket_compatibility || "").includes(cpu.daten.socket)).slice(0, 3).map(c => ({ label: c.name, neuKat: "coolers", neuId: c.id }));
        fehler.push({ meldung: `Kühler-Konflikt: "${k.daten.name}" unterstützt keinen ${cpu.daten.socket}-Sockel.`, ersetzeKat: "coolers", ersetzeId: k.daten.id, vorschlaege });
      }
    });
  });

  return fehler;
}

function ersetzeKomponente(ersetzeKat, ersetzeId, neuKat, neuId) {
  const gespeicherte = ladeSturkturierteDaten();
  const neuDaten = (DB[neuKat] || []).find(item => item.id === neuId);
  if (!neuDaten) return;
  const idx = gespeicherte.findIndex(k => k.kategorie === ersetzeKat && k.daten.id === ersetzeId);
  if (idx === -1) return;
  gespeicherte[idx] = { kategorie: neuKat, daten: neuDaten };
  const neuerText = gespeicherte.map(k => `${k.daten.name} (${k.daten.price})`).join(", ");
  localStorage.setItem("gespeicherteKomponentenDaten", JSON.stringify(gespeicherte));
  localStorage.setItem("gespeicherteKomponenten", neuerText);
  if (BauteileListe) BauteileListe.value = neuerText;
  const fehler = pruefeAlleKompatibilitaeten(gespeicherte);
  zeigeBuildErgebnis(fehler, gespeicherte);
}

function zeigeBuildErgebnis(fehler, gespeicherte) {
  const fehlerDiv  = document.getElementById("KompatibilitaetsFehler");
  const ergebnisDiv = document.getElementById("BuildErgebnis");

  if (fehler.length > 0) {
    // Fehler anzeigen
    let html = "<h3>Inkompatibilität erkannt!</h3>";
    fehler.forEach(f => {
      html += `<div class="fehler-eintrag"><div class="fehler-meldung">${f.meldung}</div>`;
      if (f.vorschlaege && f.vorschlaege.length > 0) {
        html += `<div class="fehler-vorschlaege">Passende Alternativen:<ul>`;
        f.vorschlaege.forEach(v => {
          html += `<li><button class="vorschlag-btn" data-ersetze-kat="${f.ersetzeKat}" data-ersetze-id="${f.ersetzeId}" data-neu-kat="${v.neuKat}" data-neu-id="${v.neuId}">${v.label}</button></li>`;
        });
        html += `</ul></div>`;
      }
      html += `</div>`;
    });
    fehlerDiv.innerHTML = html;
    fehlerDiv.style.display = "block";
    ergebnisDiv.style.display = "none";
    ergebnisDiv.className = "";
  } else {
    // Alles kompatibel → Gesamtpreis berechnen
    fehlerDiv.style.display = "none";
    const gesamt = gespeicherte.reduce((sum, k) => sum + parsePreis(k.daten.price), 0);
    const anzahl = gespeicherte.length;
    ergebnisDiv.innerHTML = `
      <div>Alle ${anzahl} Komponenten sind miteinander kompatibel.</div>
      <div class="preis-gesamt">Geschätzter Gesamtpreis: CHF ${gesamt}.-</div>`;
    ergebnisDiv.className = "kompatibel";
    ergebnisDiv.style.display = "block";
  }
}

// 6. Button: Speichert die Komponente (ohne Kompatibilitätsprüfung)
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

  const gespeicherteDaten = ladeSturkturierteDaten();
  gespeicherteDaten.push({ kategorie: gewaehlteKategorie, daten: gefundenesProdukt });
  localStorage.setItem("gespeicherteKomponentenDaten", JSON.stringify(gespeicherteDaten));

  if (BauteilBild) {
    setzeBildFallback(BauteilBild);
    if (gewaehlteKategorie === "cpus") {
      BauteilBild.src = `Images/sockel-${gefundenesProdukt.socket.toLowerCase()}.jpg`;
    } else {
      BauteilBild.src = `Images/${gefundenesProdukt.id}.jpg`;
    }
    BauteilBild.style.display = "block";
  }
});

// 7. Button: Build prüfen & Gesamtpreis
const buildPruefenButton = document.getElementById("buildPruefenButton");
if (buildPruefenButton) {
  buildPruefenButton.addEventListener("click", function() {
    const gespeicherteDaten = ladeSturkturierteDaten();
    if (gespeicherteDaten.length === 0) {
      alert("Du hast noch keine Komponenten gespeichert!");
      return;
    }
    const fehler = pruefeAlleKompatibilitaeten(gespeicherteDaten);
    zeigeBuildErgebnis(fehler, gespeicherteDaten);
  });
}

// 8. Klick auf Vorschlag-Button → Komponente ersetzen
const fehlerDivGlobal = document.getElementById("KompatibilitaetsFehler");
if (fehlerDivGlobal) {
  fehlerDivGlobal.addEventListener("click", function(e) {
    const btn = e.target.closest(".vorschlag-btn");
    if (!btn) return;
    ersetzeKomponente(btn.dataset.ersetzeKat, btn.dataset.ersetzeId, btn.dataset.neuKat, btn.dataset.neuId);
  });
}

// 10. Button: Liste leeren
const resetButton = document.getElementById("resetButton");
if (resetButton) {
  resetButton.addEventListener("click", function() {
    if (BauteileListe) BauteileListe.value = "";
    localStorage.removeItem("gespeicherteKomponenten");
    localStorage.removeItem("gespeicherteKomponentenDaten");
    const fehlerDiv   = document.getElementById("KompatibilitaetsFehler");
    const ergebnisDiv = document.getElementById("BuildErgebnis");
    if (fehlerDiv)   { fehlerDiv.style.display = "none";   fehlerDiv.innerHTML = ""; }
    if (ergebnisDiv) { ergebnisDiv.style.display = "none"; ergebnisDiv.className = ""; }
    alert("Die Komponenten-Liste wurde geleert.");
  });
}