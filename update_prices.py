import json
import time
import re
import requests
import urllib.parse

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "de-CH,de;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

DIGITEC_SUCHE = "https://www.digitec.ch/de/search?q={}"
WARTEZEIT_SEKUNDEN = 3

def lade_datenbank(pfad):
    with open(pfad, "r", encoding="utf-8") as datei:
        return json.load(datei)

def speichere_datenbank(pfad, daten):
    with open(pfad, "w", encoding="utf-8") as datei:
        json.dump(daten, datei, indent=2, ensure_ascii=False)

def hole_preis_von_digitec(produktname):
    suchbegriff = urllib.parse.quote(produktname)
    url = DIGITEC_SUCHE.format(suchbegriff)
    try:
        antwort = requests.get(url, headers=HEADERS, timeout=10)
        if antwort.status_code != 200:
            print(f"  Digitec blockiert Anfrage (Status {antwort.status_code})")
            return None
        html = antwort.text
        patterns = [
            r'"salesPrice".*?"value":(\d+\.?\d*)',
            r'"price".*?"value":(\d+\.?\d*)',
            r'CHF\s*(\d+)[.\-]',
        ]
        for pattern in patterns:
            treffer = re.search(pattern, html)
            if treffer:
                preis_zahl = treffer.group(1)
                return str(int(float(preis_zahl))) + ".-"
        print(f"  Kein Preis gefunden fuer: {produktname}")
        return None
    except requests.RequestException as fehler:
        print(f"  Netzwerk-Fehler: {fehler}")
        return None

def main():
    print("Preis-Updater gestartet")
    db = lade_datenbank("Datenbank.json")
    veraenderungen = 0
    for kategorie, produkte in db.items():
        print(f"\nKategorie: {kategorie}")
        for produkt in produkte:
            name = produkt["name"]
            alter_preis = produkt.get("price", "?")
            print(f"  Suche: {name} (aktuell: {alter_preis})")
            neuer_preis = hole_preis_von_digitec(name)
            if neuer_preis and neuer_preis != alter_preis:
                produkt["price"] = neuer_preis
                print(f"  Preis aktualisiert: {alter_preis} -> {neuer_preis}")
                veraenderungen += 1
            elif neuer_preis:
                print(f"  Preis unveraendert: {neuer_preis}")
            else:
                print(f"  Preis bleibt: {alter_preis}")
            time.sleep(WARTEZEIT_SEKUNDEN)
    speichere_datenbank("Datenbank.json", db)
    print(f"\nFertig! {veraenderungen} Preis(e) aktualisiert.")

if __name__ == "__main__":
    main()
