# Omer's Hair Professional – neue Website (Demo)

Statische Website für alle fünf Betriebe. Kein CMS, kein Build zur Laufzeit,
keine Cookies, keine externen Schriften.

## Seiten

| Pfad | Inhalt |
|---|---|
| `/` | Startseite: die fünf Salons als Spiegelreihe, „Nächsten Salon finden“, Handwerk, Bewertungen, Instagram, Bewerbung |
| `/mira/` | **Salon MIRA**, komplett: Preisliste mit Filter, Fan Card, Galerie, Bewertungen, Anfahrt mit Etagenanzeige |
| `/barber-mira/` | Barber Shop MIRA: Grundgerüst (Kontakt, Zeiten, Galerie), Preise folgen |
| `/isartor/` | Salon Isartor: Grundgerüst mit Planity-Buchung, Preise folgen |
| `/impressum/`, `/datenschutz/` | Rechtstexte, Platzhalter sind gelb markiert |
| `/404.html` | Fehlerseite |

Bogenhausen und Riem Arcaden verlinken vorerst auf omers-hair.de.

## Bearbeiten

Alle Angaben (Adressen, Telefon, Zeiten, Preise, Bewertungen) stehen an **einer**
Stelle in `tools/build.py`. Nach einer Änderung:

```sh
python3 tools/build.py
```

Gestaltung: `assets/css/site.css` (alle Farben als Tokens in `:root`),
Funktionen: `assets/js/site.js`. Die Seite funktioniert vollständig ohne Skript
und mit reduzierter Bewegung.

Lokal ansehen: `npx serve .` und `http://localhost:3000` öffnen.

## Funktionen

- **3D-Auftakt** (Startseite): fließende Haarsträhnen aus Chrom mit Neon-Spiegelungen (three.js, lokal gebündelt in `assets/js/hero3d.js`, Quelle `tools/hero3d.src.js`). Folgt Maus und Scrollen, pausiert außerhalb des Bildes; Standbild als Rückfall ohne WebGL.
- **Salon-Ring**: die fünf Salons als gebogene Karten auf einem Zylinder (CSS 3D, jede Karte aus 9–14 Streifen). Dreht sich beim Hereinscrollen langsam herein; ziehen, wischen, Pfeiltasten oder Klick auf eine Seitenkarte drehen, Klick auf die mittlere öffnet den Salon. Ohne Skript: wischbare Reihe.
- **Nächsten Salon finden**: Standort wird nur im Browser verglichen, der Ring dreht zum nächsten Salon und zeigt die Entfernung
- **Live-Öffnungsstand** nach Münchner Uhr, „5/5 Salons jetzt geöffnet“ im ersten Bildschirm
- **Preisliste mit Filter** ohne Skript über `:has()`, Wahl wird gemerkt; direkt ansteuerbar mit `/mira/?art=herren`
- **Fan Card** mit Hologramm-Folie, die Finger bzw. Maus folgt, und Stempeln beim Hereinscrollen
- **Etagenanzeige** UG/EG für Salon und Barber im MIRA, **Aktionsleiste am Handy** (Buchen · Anrufen · Route)
- **Galerie** mit Blättern (Pfeiltasten, Wischen), **Google Maps erst nach Klick** (DSGVO)
- Alles mit reduzierter Bewegung und ohne Skript bedienbar; schema.org `HairSalon` je Standort

## Bilder

Salonfotos MIRA und Isartor in Originalgröße aus den Planity-Einträgen der Salons (vom Inhaber hochgeladen), Barber Shop von der alten Website (nur 900 px). Für Bogenhausen und Riem gibt es noch keine Innenaufnahmen – dort stehen gestaltete Schriftkarten (`tools/karte.html`), bis Fotos kommen.

## Vor dem Livegang

In `tools/build.py` `VORSCHAU = False` setzen (entfernt `noindex`), dann neu bauen.

Offene Punkte beim Kunden:

- [ ] Impressum: Anschrift der GmbH, Geschäftsführung, USt-ID; Hosting-Anbieter für den Datenschutz
- [ ] Barber Shop: Etage (EG?), Telefon (089 54 80 56 05?) und Preise bestätigen
- [ ] Preisliste Isartor
- [ ] Team-Fotos und Namen, ein Porträt des Inhabers für die Startseite
- [ ] Innenfotos von Bogenhausen und Riem Arcaden, größere Fotos vom Barber Shop
- [ ] Gilt die Fan Card in allen Salons oder nur im MIRA?
- [ ] Gehören alle fünf Betriebe zur GmbH, oder läuft Riem separat?
- [ ] Doppelten Planity-Eintrag des MIRA bereinigen
