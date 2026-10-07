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

- **Live-Öffnungsstand** nach Münchner Uhr („Jetzt geöffnet · bis 20:00 Uhr“), heutiger Tag in der Tabelle markiert
- **Nächsten Salon finden**: Standort wird nur im Browser verglichen und verlässt das Gerät nicht
- **Spiegel mit LED-Kante**: Licht zieht sich beim Auftritt einmal herum, der Glanz folgt dem Zeiger bzw. beim Handy dem Wischen; jeder Salon hat seine eigene Lichtfarbe
- **Preisliste mit Filter** (Damen, Farbe, Herren, Kinder, Extras) ohne Skript über `:has()`, die Wahl wird gemerkt; direkt ansteuerbar mit `/mira/?art=herren`
- **Fan Card**, die sich beim Hereinscrollen selbst stempelt
- **Etagenanzeige** UG/EG für Salon und Barber im MIRA
- **Aktionsleiste am Handy**: Buchen · Anrufen · Route
- **Galerie** mit Blättern (Pfeiltasten, Wischen), Fokus kehrt zurück
- **Google Maps erst nach Klick** (DSGVO)
- schema.org `HairSalon` je Standort, eigener Titel und eigene Beschreibung je Seite

## Vor dem Livegang

In `tools/build.py` `VORSCHAU = False` setzen (entfernt `noindex`), dann neu bauen.

Offene Punkte beim Kunden:

- [ ] Impressum: Anschrift der GmbH, Geschäftsführung, USt-ID; Hosting-Anbieter für den Datenschutz
- [ ] Barber Shop: Etage (EG?), Telefon (089 54 80 56 05?) und Preise bestätigen
- [ ] Preisliste Isartor
- [ ] Team-Fotos und Namen, ein Porträt des Inhabers für die Startseite
- [ ] Größere Originalfotos (die vorhandenen sind 900 px breit)
- [ ] Gilt die Fan Card in allen Salons oder nur im MIRA?
- [ ] Gehören alle fünf Betriebe zur GmbH, oder läuft Riem separat?
- [ ] Doppelten Planity-Eintrag des MIRA bereinigen
