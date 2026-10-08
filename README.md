# Omer's Hair Professional – neue Website (Demo)

Statische Website für alle fünf Betriebe. Kein CMS, kein Build zur Laufzeit,
keine Cookies, keine externen Schriften.

## Seiten

| Pfad | Inhalt |
|---|---|
| `/` | Startseite: die fünf Salons als Spiegelreihe, „Nächsten Salon finden“, Handwerk, Bewertungen, Instagram, Bewerbung |
| `/mira/` | **Salon MIRA**, komplett: Preis-Studio, Fan Card, Galerie, Bewertungen, Anfahrt mit Etagenanzeige |
| `/barber-mira/` | Barber Shop MIRA: Grundgerüst (Kontakt, Zeiten, Galerie), Preise folgen |
| `/isartor/` | Salon Isartor: Grundgerüst mit Planity-Buchung, Preise folgen |
| `/impressum/`, `/datenschutz/` | Rechtstexte, Platzhalter sind gelb markiert |
| `/404.html` | Fehlerseite |

Bogenhausen und Riem Arcaden verlinken vorerst auf omers-hair.de (die Riem-Seite folgt später).

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

- **Ladevorgang**: Rasterlinien ziehen sich auf, Logo mit Glanz, Zähler nach echtem Fortschritt (Schrift, erstes Bild, 3D), dann heben sich die sechs Spalten. Beim Weiterklicken nur kurz, ohne Skript und bei reduzierter Bewegung gar nicht, nach spätestens 3 Sekunden immer offen.
- **Startseite**: Chrom-Strähnen der ersten Fassung (Weiß und Leuchtschild-Blau, `tools/straehnen.src.js`), Markenschrift exakt auf die Rasterbreite eingepasst.
- **Glasschrift der Standortseiten** (`tools/glas3d.src.js`): der Name als Röhren aus Glas, eigene Linien-Buchstaben, innen die gebrochene Lichtumgebung, außen weiße Spiegelkanten, Funkeln und Leuchten; je Salon eigene Lichtstimmung (MIRA Blau, Barber Eis, Isartor mit warmem Akzent). Folgt Maus und Scrollen; Standbild derselben Szene als Rückfall ohne WebGL.
- **Salon-Ring**: die Ladenfronten außen auf einer Trommel, die Mitte wölbt sich nach vorn. Dreht ruhig und gleichmäßig (5,6 s je Karte) und fährt nach jeder Pause weich an. Nur im Selbstlauf läuft ein blaues Licht um den Rahmen, springt als Blitz zur nächsten Karte und lädt deren Rahmen auf (Leinwand über der Bühne, gleiche Projektion wie im CSS). Wischen folgt dem Finger 1:1 mit Schwung; Antippen holt eine Karte nach vorn, unten leuchtet der Weg zum Salon, zweites Tippen öffnet ihn; Tippen daneben lässt den Ring weiterdrehen.
- **Auf einen Blick**: alle Salons mit Adresse, Live-Status, Telefon und Buchung in einer Liste
- **Standortseiten**: Glasschrift über den ganzen ersten Bildschirm mit Buchen, Anrufen, Route unten, direkt darunter die Ladenfront gerade und ganz mit den Eckdaten; Kapitelleiste, die mitläuft
- **Raster**: sechs Spalten mit feinen Linien, Kopf und alle Abschnitte liegen genau darin; Schrift steht immer gleich weit neben einer Linie, Bilder liegen bündig
- **Nächsten Salon finden**: Standort wird nur im Browser verglichen, der Ring dreht zum nächsten Salon und zeigt die Entfernung
- **Live-Öffnungsstand** nach Münchner Uhr, „5/5 Salons jetzt geöffnet“ im ersten Bildschirm
- **Preis-Studio** (MIRA): Reiter mit Lichtschieber, große Ab-Preise in Chrom, Leistungen antippen ergibt einen Richtwert für den Termin, direkt weiter zu Planity
- **Stadtpläne** selbst gerendert aus OpenStreetMap (`tools/karten.py`): leuchtend blaue Straßen, sofort sichtbar, kein Kartendienst beim Besuch
- **Fan Card** mit Hologramm-Folie, die Finger bzw. Maus folgt, und Stempeln beim Hereinscrollen
- **Etagenanzeige** UG/EG für Salon und Barber im MIRA, **Aktionsleiste am Handy** (Buchen · Anrufen · Route)
- **Galerie** gleichmäßig im Raster je nach Bildanzahl, mit Blättern (Pfeiltasten, Wischen)
- **Instagram-Vorschau**: je drei Arbeiten aus dem Hauptprofil (Startseite) und dem MIRA-Profil (Salon MIRA), aus `tools/bilder.py` (`insta()`, Quellen `insta-*.png`)
- Alles mit reduzierter Bewegung und ohne Skript bedienbar; schema.org `HairSalon` je Standort

## Bilder

Ausgewählt und einheitlich bearbeitet mit `tools/bilder.py` (kühles Weiß, tiefe Schwarztöne, Lila und Magenta entsättigt, Blau in den Schatten, Schärfe; die älteren 900-px-Fotos werden hochgerechnet, nachgeschärft und mit feinem Korn versehen):

```sh
python3 tools/bilder.py <ordner-mit-originalen>
```

Quellen: MIRA und Isartor in Originalgröße aus den Planity-Einträgen der Salons, Barber Shop und Isartor-Innenräume von der alten Website (900 px). Alle fünf Salons haben echte Fotos; die Ladenfronten im Ring sind nachts gegradet (Leuchtschild betont).

## Vor dem Livegang

In `tools/build.py` `VORSCHAU = False` setzen (entfernt `noindex`), dann neu bauen.

Offene Punkte beim Kunden:

- [ ] Impressum: Anschrift der GmbH, Geschäftsführung, USt-ID; Hosting-Anbieter für den Datenschutz
- [ ] Barber Shop: Etage (EG?), Telefon (089 54 80 56 05?) und Preise bestätigen
- [ ] Preisliste Isartor
- [ ] Team-Fotos und Namen, ein Porträt des Inhabers für die Startseite
- [ ] Fotos in Originalgröße (die alte Website hat nur 900 px)
- [ ] Gilt die Fan Card in allen Salons oder nur im MIRA?
- [ ] Gehören alle fünf Betriebe zur GmbH, oder läuft Riem separat?
- [ ] Doppelten Planity-Eintrag des MIRA bereinigen

## Stände und „back“

`tools/version.sh liste` zeigt alle gepushten Stände, `tools/version.sh back` stellt den vorherigen wieder her (als neuer Commit, nichts geht verloren).
