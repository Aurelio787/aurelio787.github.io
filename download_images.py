"""
Sucht automatisch Produktbilder für alle Komponenten in Datenbank.json
und speichert sie unter Images/{id}.jpg, falls noch nicht vorhanden.
"""

import json
import os
import time
import sys
import requests
from ddgs import DDGS

IMAGES_DIR = "Images"
PLACEHOLDER = os.path.join(IMAGES_DIR, "placeholder.jpg")
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; image-downloader/1.0)"}
DELAY = 1.5  # Sekunden zwischen Anfragen (Rate-Limiting vermeiden)


def bild_herunterladen(url: str, ziel: str) -> bool:
    try:
        r = requests.get(url, headers=HEADERS, timeout=10, stream=True)
        if r.status_code != 200:
            return False
        content_type = r.headers.get("content-type", "")
        if "image" not in content_type:
            return False
        with open(ziel, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        size = os.path.getsize(ziel)
        if size < 2000:          # Zu klein → wahrscheinlich kein echtes Bild
            os.remove(ziel)
            return False
        return True
    except Exception:
        if os.path.exists(ziel):
            os.remove(ziel)
        return False


def suche_und_speichere(name: str, ziel: str) -> bool:
    query = f"{name} product photo"
    try:
        with DDGS() as ddgs:
            ergebnisse = list(ddgs.images(query, max_results=5))
        for treffer in ergebnisse:
            url = treffer.get("image", "")
            if not url:
                continue
            if bild_herunterladen(url, ziel):
                return True
            time.sleep(0.3)
    except Exception as e:
        print(f"  Suchfehler: {e}")
    return False


def main():
    with open("Datenbank.json", encoding="utf-8") as f:
        db = json.load(f)

    os.makedirs(IMAGES_DIR, exist_ok=True)

    fehlend = []
    for kat, items in db.items():
        for item in items:
            if kat == "cpus":
                continue  # CPUs nutzen sockel-{socket}.jpg
            ziel = os.path.join(IMAGES_DIR, f"{item['id']}.jpg")
            if not os.path.exists(ziel):
                fehlend.append((kat, item["id"], item["name"]))

    gesamt = len(fehlend)
    if gesamt == 0:
        print("Alle Bilder sind bereits vorhanden.")
        return

    print(f"{gesamt} fehlende Bilder werden gesucht...\n")
    heruntergeladen = 0
    fehlgeschlagen = 0

    for i, (kat, id_, name) in enumerate(fehlend, 1):
        ziel = os.path.join(IMAGES_DIR, f"{id_}.jpg")
        print(f"[{i}/{gesamt}] {name}", end=" ... ", flush=True)
        if suche_und_speichere(name, ziel):
            print("✓")
            heruntergeladen += 1
        else:
            print("✗ (nicht gefunden)")
            fehlgeschlagen += 1
        time.sleep(DELAY)

    print(f"\nFertig: {heruntergeladen} heruntergeladen, {fehlgeschlagen} fehlgeschlagen.")
    if fehlgeschlagen > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
