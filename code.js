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

document.addEventListener("DOMContentLoaded", function() {
  const gespeicherteListe = localStorage.getItem("gespeicherteKomponenten");
  const BauteileListe = document.getElementById("ListeKomponente");
  
  if (gespeicherteListe && BauteileListe) {
    BauteileListe.value = gespeicherteListe;
  }
});

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

startButton.addEventListener("click", function() {
  const gewaehlteKategorie = BauteilAuswahl.value;
  const gewaehltesModellId = ModellAuswahl.value;

  if (!gewaehltesModellId || !DB[gewaehlteKategorie]) {
    anzeigeDiv.textContent = "Bitte wähle zuerst ein konkretes Modell aus!";
    if (specsTitel) specsTitel.innerHTML = "";
    if (BauteilBild) BauteilBild.style.display = "none";
    return;
  }

  const kategorieProdukte = DB[gewaehlteKategorie];
  const gefundenesProdukt = kategorieProdukte.find(item => item.id === gewaehltesModellId);

  if (gefundenesProdukt) {
    anzeigeDiv.textContent = "Du hast ausgewählt: " + gefundenesProdukt.name + " für " + gefundenesProdukt.price;
    
    if (specsTitel) {
      specsTitel.innerHTML = "";
      
      const addSpecLine = (label, value) => {
        if (value !== undefined && value !== "") {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${label}:</strong> ${value}`;
          specsTitel.appendChild(li);
        }
      };

      const liTitle = document.createElement("li");
      liTitle.innerHTML = `<strong>Modell:</strong> ${gefundenesProdukt.name}`;
      specsTitel.appendChild(liTitle);
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

addSpecLine("Preis", gefundenesProdukt.price);
 
    }
    
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

// Holt die erste Zahl aus einem String wie "600W" oder "1200 W" -> 600
function parseWatt(wattString) {
  if (!wattString) return 0;
  const treffer = String(wattString).match(/\d+/);
  return treffer ? parseInt(treffer[0], 10) : 0;
}

// Schätzt den Gesamtverbrauch eines Builds in Watt
function berechneVerbrauch(gpus, cpus) {
  const REST_VERBRAUCH = 100; // Mainboard, RAM, SSDs, Lüfter etc. (Pauschale)
  let watt = REST_VERBRAUCH;
  gpus.forEach(g => watt += parseWatt(g.daten.tdp));
  cpus.forEach(c => watt += parseWatt(c.daten.tdpboost || c.daten.tdpnormal));
  return watt;
}

// Grössen-Rang eines Mainboards: Mini-ITX < Micro-ATX < ATX < E-ATX
function boardRang(formFactor) {
  const f = String(formFactor || "").toLowerCase();
  if (f.includes("e-atx") || f.includes("eatx")) return 4;
  if (f.includes("micro")) return 2;
  if (f.includes("itx")) return 1;
  if (f.includes("atx")) return 3;
  return 0; // unbekannt
}

// Grösster Board-Rang, den ein Gehäuse aufnehmen kann
function caseMaxBoardRang(caseForm) {
  const f = String(caseForm || "").toLowerCase();
  if (f.includes("full-tower") || f.includes("big-tower")) return 4; // bis E-ATX
  if (f.includes("micro-atx")) return 2;
  if (f.includes("mini-itx")) return 1;
  if (f.includes("mini-tower")) return 2;
  if (f.includes("tower")) return 3; // Midi-Tower: bis ATX
  return 4; // unbekannt -> nicht blockieren
}

function pruefeAlleKompatibilitaeten(gespeicherte) {
  const fehler = [];
  const cpus    = gespeicherte.filter(k => k.kategorie === "cpus");
  const mbs     = gespeicherte.filter(k => k.kategorie === "motherboards");
  const rams    = gespeicherte.filter(k => k.kategorie === "rams");
  const kuehler = gespeicherte.filter(k => k.kategorie === "coolers");
  const gpus    = gespeicherte.filter(k => k.kategorie === "gpus");
  const psus    = gespeicherte.filter(k => k.kategorie === "psu");
  const cases   = gespeicherte.filter(k => k.kategorie === "cases");
  const ssds    = gespeicherte.filter(k => k.kategorie === "ssds");

  if (cpus.length > 1) {
    const entfernbar = cpus.map(cpu => ({ label: cpu.daten.name, index: gespeicherte.indexOf(cpu) }));
    fehler.push({ meldung: `Du hast ${cpus.length} CPUs gespeichert. Standard-Mainboards haben nur einen CPU-Sockel.`, vorschlaege: [], entfernbar });
  }

  cpus.forEach(cpu => {
    mbs.forEach(mb => {
      if (cpu.daten.socket !== mb.daten.socket) {
        const vorschlaege = (DB.motherboards || []).filter(m => m.socket === cpu.daten.socket).slice(0, 3).map(m => ({ label: `${m.name} (Sockel ${m.socket})`, neuKat: "motherboards", neuId: m.id }));
        fehler.push({ meldung: `Sockel-Konflikt: CPU "${cpu.daten.name}" (${cpu.daten.socket}) passt nicht zu Mainboard "${mb.daten.name}" (${mb.daten.socket}).`, ersetzeKat: "motherboards", ersetzeId: mb.daten.id, vorschlaege });
      }
    });
  });

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
      const entfernbar = rams.map(ram => ({ label: ram.daten.name, index: gespeicherte.indexOf(ram) }));
      fehler.push({ meldung: `Zu viele RAM-Module: Mainboard "${mb.daten.name}" hat ${maxSlots} RAM-Slots, du hast aber ${belegteSlots} Module gespeichert.`, ersetzeKat: null, ersetzeId: null, vorschlaege: [], entfernbar });
    }
  });

  kuehler.forEach(k => {
    cpus.forEach(cpu => {
      const compat = k.daten.socket_compatibility || "";
      if (compat && !compat.includes(cpu.daten.socket)) {
        const vorschlaege = (DB.coolers || []).filter(c => (c.socket_compatibility || "").includes(cpu.daten.socket)).slice(0, 3).map(c => ({ label: c.name, neuKat: "coolers", neuId: c.id }));
        fehler.push({ meldung: `Kühler-Konflikt: "${k.daten.name}" unterstützt keinen ${cpu.daten.socket}-Sockel.`, ersetzeKat: "coolers", ersetzeId: k.daten.id, vorschlaege });
      }
    });
  });

  // Netzteil-Leistung: reicht die Wattzahl für alle Komponenten?
  if (psus.length > 0 && (gpus.length > 0 || cpus.length > 0)) {
    const psuGesamt = psus.reduce((sum, p) => sum + parseWatt(p.daten.wattage), 0);
    const verbrauch = berechneVerbrauch(gpus, cpus);
    const verbrauchEmpf = Math.ceil(verbrauch * 1.3 / 50) * 50; // +30% Reserve, auf 50W gerundet

    // Hersteller-Empfehlung der GPUs (stärkste Empfehlung + TDP der weiteren GPUs)
    let herstellerEmpf = 0;
    if (gpus.length > 0) {
      const maxEmpf   = Math.max(...gpus.map(g => parseWatt(g.daten.recommended_psu)), 0);
      const tdpSumme  = gpus.reduce((s, g) => s + parseWatt(g.daten.tdp), 0);
      const maxTdp    = Math.max(...gpus.map(g => parseWatt(g.daten.tdp)), 0);
      herstellerEmpf  = maxEmpf + (tdpSumme - maxTdp); // zusätzliche GPUs draufrechnen
    }

    const empfohlen = Math.max(verbrauchEmpf, herstellerEmpf);

    if (psuGesamt < verbrauch || psuGesamt < empfohlen) {
      const zuSchwach = psuGesamt < verbrauch;
      const vorschlaege = (DB.psu || [])
        .filter(p => parseWatt(p.wattage) >= empfohlen)
        .slice(0, 3)
        .map(p => ({ label: `${p.name} (${p.wattage})`, neuKat: "psu", neuId: p.id }));

      const meldung = zuSchwach
        ? `Netzteil zu schwach: Geschätzter Verbrauch ~${verbrauch}W, aber das Netzteil liefert nur ${psuGesamt}W. Empfohlen: mindestens ${empfohlen}W.`
        : `Netzteil knapp: Geschätzter Verbrauch ~${verbrauch}W, Netzteil liefert ${psuGesamt}W – wenig Reserve. Empfohlen: mindestens ${empfohlen}W.`;

      fehler.push({
        meldung,
        ersetzeKat: "psu",
        ersetzeId: psus[0].daten.id,
        vorschlaege
      });
    }
  }

  // Mainboard-Formfaktor muss ins Gehäuse passen
  cases.forEach(cs => {
    const maxRang = caseMaxBoardRang(cs.daten.form_factor);
    mbs.forEach(mb => {
      const bRang = boardRang(mb.daten.formFactor);
      if (bRang && maxRang && bRang > maxRang) {
        const vorschlaege = (DB.motherboards || [])
          .filter(m => boardRang(m.formFactor) <= maxRang && m.socket === mb.daten.socket)
          .slice(0, 3)
          .map(m => ({ label: `${m.name} (${m.formFactor})`, neuKat: "motherboards", neuId: m.id }));
        fehler.push({
          meldung: `Formfaktor-Konflikt: Mainboard "${mb.daten.name}" (${mb.daten.formFactor}) passt nicht in Gehäuse "${cs.daten.name}" (${cs.daten.form_factor}).`,
          ersetzeKat: "motherboards", ersetzeId: mb.daten.id, vorschlaege
        });
      }
    });
  });

  // Netzteil-Formfaktor: Mini-ITX-Gehäuse brauchen meist SFX statt ATX
  cases.forEach(cs => {
    const caseForm = String(cs.daten.form_factor || "").toLowerCase();
    if (!caseForm.includes("mini-itx")) return;
    psus.forEach(p => {
      if (String(p.daten.form_factor || "").toUpperCase() === "ATX") {
        const vorschlaege = (DB.psu || [])
          .filter(x => /sfx/i.test(x.form_factor || ""))
          .slice(0, 3)
          .map(x => ({ label: `${x.name} (${x.form_factor})`, neuKat: "psu", neuId: x.id }));
        fehler.push({
          meldung: `Netzteil-Formfaktor: Gehäuse "${cs.daten.name}" (Mini-ITX) benötigt meist ein SFX/SFX-L-Netzteil, "${p.daten.name}" ist aber ATX.`,
          ersetzeKat: "psu", ersetzeId: p.daten.id, vorschlaege
        });
      }
    });
  });

  // Kühler stark genug für die CPU (tdp_rating vs. Boost-TDP)
  kuehler.forEach(k => {
    const kTdp = parseWatt(k.daten.tdp_rating);
    cpus.forEach(cpu => {
      const cpuTdp = parseWatt(cpu.daten.tdpboost || cpu.daten.tdpnormal);
      if (kTdp && cpuTdp && kTdp < cpuTdp) {
        const vorschlaege = (DB.coolers || [])
          .filter(c => parseWatt(c.tdp_rating) >= cpuTdp && (c.socket_compatibility || "").includes(cpu.daten.socket))
          .slice(0, 3)
          .map(c => ({ label: `${c.name} (${c.tdp_rating})`, neuKat: "coolers", neuId: c.id }));
        fehler.push({
          meldung: `Kühler zu schwach: "${k.daten.name}" (${kTdp}W) reicht nicht für CPU "${cpu.daten.name}" (~${cpuTdp}W unter Last).`,
          ersetzeKat: "coolers", ersetzeId: k.daten.id, vorschlaege
        });
      }
    });
  });

  // Zu viele M.2-SSDs für die vorhandenen M.2-Slots
  mbs.forEach(mb => {
    const maxM2 = parseInt(mb.daten.m2Slots) || 0;
    const m2Ssds = ssds.filter(s => String(s.daten.form_factor || "").toLowerCase().includes("m.2"));
    if (maxM2 && m2Ssds.length > maxM2) {
      const entfernbar = m2Ssds.map(s => ({ label: s.daten.name, index: gespeicherte.indexOf(s) }));
      fehler.push({
        meldung: `Zu viele M.2-SSDs: Mainboard "${mb.daten.name}" hat ${maxM2} M.2-Slots, du hast aber ${m2Ssds.length} M.2-SSDs gespeichert.`,
        ersetzeKat: null, ersetzeId: null, vorschlaege: [], entfernbar
      });
    }
  });

  // Einzelteile, die es nur einmal geben sollte
  [["motherboards", "Mainboards"], ["cases", "Gehäuse"], ["psu", "Netzteile"]].forEach(([kat, label]) => {
    const items = gespeicherte.filter(k => k.kategorie === kat);
    if (items.length > 1) {
      const entfernbar = items.map(it => ({ label: it.daten.name, index: gespeicherte.indexOf(it) }));
      fehler.push({
        meldung: `Du hast ${items.length} ${label} gespeichert – in einem Standard-Build ist normalerweise nur eines möglich.`,
        ersetzeKat: null, ersetzeId: null, vorschlaege: [], entfernbar
      });
    }
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

function entferneKomponente(index) {
  const gespeicherte = ladeSturkturierteDaten();
  if (index < 0 || index >= gespeicherte.length) return;
  gespeicherte.splice(index, 1);
  const neuerText = gespeicherte.map(k => `${k.daten.name} (${k.daten.price})`).join(", ");
  localStorage.setItem("gespeicherteKomponentenDaten", JSON.stringify(gespeicherte));
  localStorage.setItem("gespeicherteKomponenten", neuerText);
  if (BauteileListe) BauteileListe.value = neuerText;
  if (gespeicherte.length === 0) {
    const fehlerDiv   = document.getElementById("KompatibilitaetsFehler");
    const ergebnisDiv = document.getElementById("BuildErgebnis");
    if (fehlerDiv)   { fehlerDiv.style.display = "none";   fehlerDiv.innerHTML = ""; }
    if (ergebnisDiv) { ergebnisDiv.style.display = "none"; ergebnisDiv.className = ""; }
    return;
  }
  const fehler = pruefeAlleKompatibilitaeten(gespeicherte);
  zeigeBuildErgebnis(fehler, gespeicherte);
}

function zeigeBuildErgebnis(fehler, gespeicherte) {
  const fehlerDiv  = document.getElementById("KompatibilitaetsFehler");
  const ergebnisDiv = document.getElementById("BuildErgebnis");

  if (fehler.length > 0) {
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
      if (f.entfernbar && f.entfernbar.length > 0) {
        html += `<div class="fehler-entfernen">Eine Komponente entfernen:<ul>`;
        f.entfernbar.forEach(e => {
          html += `<li><button class="entfernen-btn" data-index="${e.index}">${e.label} entfernen</button></li>`;
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

const fehlerDivGlobal = document.getElementById("KompatibilitaetsFehler");
if (fehlerDivGlobal) {
  fehlerDivGlobal.addEventListener("click", function(e) {
    const vorschlagBtn = e.target.closest(".vorschlag-btn");
    if (vorschlagBtn) {
      ersetzeKomponente(vorschlagBtn.dataset.ersetzeKat, vorschlagBtn.dataset.ersetzeId, vorschlagBtn.dataset.neuKat, vorschlagBtn.dataset.neuId);
      return;
    }
    const entfernenBtn = e.target.closest(".entfernen-btn");
    if (entfernenBtn) {
      entferneKomponente(parseInt(entfernenBtn.dataset.index, 10));
    }
  });
}

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