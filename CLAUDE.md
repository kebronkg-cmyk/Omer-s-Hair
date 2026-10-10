# Projekt: Omer's Hair – neue Website (Demo)

## Ziel
Demo-Website für die Friseurkette **Omer's Hair Professional**, die dem Inhaber persönlich gezeigt wird.
Sie ersetzt später die alte, gehackte Seite **omers-hair-mira.de** (versteckter Casino-Spam im Quellcode).
Die Struktur ist von Anfang an für **alle 5 Betriebe** ausgelegt, damit später alles unter einer Domain laufen kann.

**Demo-Umfang (Phase 1):**
1. Startseite mit 5 Standort-Kacheln
2. **Eine komplett fertige Standortseite: Salon MIRA**
3. Barber Shop MIRA und Isartor: nur als Kachel und leere Seitenhülle, Inhalte folgen erst nach Zusage
4. Bogenhausen und Riem Arcaden: Kacheln verlinken vorerst extern auf https://omers-hair.de

## Kunde
- **Inhaber:** Omer Khalil Kotschali, Friseurmeister
- **Firma:** Omer's Hair Professional GmbH, HRB 243711 (Amtsgericht München). Der Salon Riem Arcaden läuft eventuell über eine separate GbR (E-Mail-Domain „omershair-gbr“).
- **Instagram:** https://www.instagram.com/omers_hair_professional

## Bestehende Websites (Referenz)
| Seite | Status | Inhalt |
|---|---|---|
| https://www.omers-hair-mira.de | alt (© 2020), WordPress, **gehackt** | MIRA, Barber MIRA, Zweibrückenstr. |
| https://omers-hair.de | neu (Okt. 2025, Agentur AVIDIS) | Bogenhausen, Riem Arcaden |

**Hosting:** omers-hair-mira.de liegt komplett bei IONOS (Domain, Webspace, Mail). omers-hair.de hat die Domain bei IONOS, der Webspace liegt auf einem Strato-Server, vermutlich dem der Agentur.

## Die 5 Betriebe
| # | Betrieb | Adresse | Telefon | Öffnungszeiten | Buchung |
|---|---|---|---|---|---|
| 1 | **Salon MIRA** | Schleißheimer Str. 506, **UG** (MIRA-Einkaufszentrum), 80933 München | 089 54 80 56 06 | Mo–Sa 9:30–20:00 | https://www.planity.com/de-DE/friseur-omers-hair-80933-munchen |
| 2 | Barber Shop MIRA | Schleißheimer Str. 506, **EG**, 80933 München | 089 54 80 56 05 | Mo–Sa 9:30–20:00 | keine Online-Buchung bekannt (nur Telefon) |

> **Achtung:** Die alte Website nennt Salon = EG, Barber = UG und für den Barber die Nummer 089 46 13 47 86. Das aktuelle Shop-Verzeichnis des MIRA-Centers (mira-einkaufszentrum.de/shops) nennt es umgekehrt, mit 089 54 80 56 05. Hier gilt die **Center-Angabe**, sie ist vermutlich aktueller. Beim Kunden bestätigen lassen.
> MIRA hat auf Planity zwei Einträge für denselben Salon (Duplikat). Den Link oben verwenden.
> Extra-Instagram für MIRA: https://www.instagram.com/omershair_professional_mira/
| 3 | Salon Isartor | Zweibrückenstr. 5–7 (Breiterhof-Passage), 80331 München | 089 621 46 46 9 | Mo–Sa 9:00–19:00 | https://www.planity.com/de-DE/friseur-omers-hair-isartor-80331-munchen |
| 4 | Salon Forum Bogenhausen | Richard-Strauss-Str. 80, 81679 München | 089 999 19 014 | Mo–Fr 9–19, Sa 9–16 | extern → https://omers-hair.de/friseur-muenchen-bogenhausen-im-forum/ |
| 5 | Salon Riem Arcaden | Willy-Brandt-Platz 5, 81829 München | 089 46 13 87 87 | Mo–Sa 10–20 | extern → https://omers-hair.de/salon-riem-arcaden/ |

E-Mail für die Betriebe 1–3: info@omers-hair-mira.de

## Inhalte Salon MIRA
**Bewertung:** 4,7 ★ (207 Bewertungen, Planity)

**Preisliste (Quelle: Planity, Stand Okt. 2026):**
- **Damen:** Waschen, Schneiden, selbst föhnen 34 € · Schüler/Studenten 29 € · Waschen, Schneiden, Föhnen/Styling 49–55 € · Waschen + Föhnen 29–33 € · Keratinbehandlung auf Anfrage
- **Colorationen:** Strähnen artistic ab 99 € · Balayage inkl. Schnitt & Styling 239–259 € · Coloration/Tönung 37–42 € · Glossing 37–42 € · Dauerwelle auf Anfrage
- **Herren:** Schneiden 21 € · Waschen, Schneiden, Stylen 24 € · Maschinenschnitt 16 € · Bartmodell ab 13 € · Bartpflege 9 €
- **Kinder bis 12:** Jungen 17 € · Mädchen 22 € · Mädchen Schneiden + Föhnen 33 €
- **Extras:** Pflege 6 € · Strukturaufbau 22 € · Wimpern 14 € · Augenbrauen 11 € · Ganzgesicht 24 €

**Fan Card:** Nach dem 8. Besuch gibt es einen Gutschein über 15 €.

**Schwerpunkte laut beiden Seiten:** Balayage, Haarstyling, Festfrisuren/Hochsteckfrisuren, Haarverlängerung.

## Bilder (nur für die Demo, gehören dem Kunden)
- Logo: https://omers-hair-mira.de/wp-content/uploads/2018/09/Omers-Hair-professional.png
- Neues Logo: https://omers-hair.de/wp-content/uploads/2025/09/imgi_1_Omers-Hair-professional.webp
- MIRA: `https://www.omers-hair-mira.de/wp-content/uploads/2020/01/Omers-Hair-Mira-0{1,2,4,5}.jpg`
- Barber: `https://www.omers-hair-mira.de/wp-content/uploads/2020/02/Barber-Shop-im-Mira-{1,2,3}.jpg`
- Isartor: `https://www.omers-hair-mira.de/wp-content/uploads/2024/09/PHOTO-2024-09-11-11-04-{30,29-2,31-5,31}-900x600.jpg`

Die Bilder lokal in `/assets` speichern, nicht direkt von der alten (gehackten) Domain laden.

## Design
- Am Look von **omers-hair.de** orientieren (Logo, Schwarz als Hauptfarbe, Theme-Color #000000), damit beide Seiten nicht wie zwei Firmen wirken. Bessere Umsetzung ist ausdrücklich erwünscht.
- Mobile-first: Die meisten Besucher kommen über Google Maps auf dem Handy.
- Auf jeder Standortseite gut sichtbar: Buchen-Button (Planity), Anrufen-Button (tel:), Route (Google Maps), Öffnungszeiten.
- Die Startseite zeigt 5 Standort-Kacheln mit Foto, Adresse, Öffnungszeiten und „Termin buchen“.
- Barber Shop optisch etwas eigenständiger (andere Zielgruppe), aber klar Teil der Marke.

## Fehler der alten Seiten, die NICHT übernommen werden
- Englische Texte auf der deutschen Seite („The fan card is worth it“ usw.): alles auf Deutsch, Englisch höchstens optional
- Kein Buchen-Button auf beiden Seiten
- Tippfehler: „Bogenausen“, „DichBewerben“, „ür kreatives“
- Widersprüchliche Angaben („über 15 Jahre Erfahrung“ gegenüber „8 Jahre“ beim Inhaber): **keine Jahreszahl nennen**
- Unvollständige Telefonnummer „089 13 87 87“

## Technik
- Statisches HTML/CSS/JS, kein CMS, kein WordPress
- Ordnerstruktur:
  ```
  /index.html
  /mira/index.html
  /barber-mira/index.html
  /isartor/index.html
  /impressum/index.html
  /datenschutz/index.html
  /assets/
  ```
- SEO: eigener `<title>` und eigene Meta-Description pro Standort, schema.org `HairSalon` (LocalBusiness) als JSON-LD pro Standort
- Google Maps nur per Link oder Klick-Embed (DSGVO), keine externen Fonts ohne lokales Hosting
- **Kein Entwicklername** im Footer, im Impressum, in Meta-Tags oder Code-Kommentaren
- Hosting der Demo: Netlify oder GitHub Pages. Später Umzug auf die Kunden-Domain über den IONOS-Login des Kunden.

## Impressum
Für die Demo als Platzhalter (TODO). Vor dem Livegang die echten Angaben (GmbH, Geschäftsführer, HRB 243711, USt-ID) vom Kunden holen.

## Offen (TODO, vom Kunden einholen)
- Barber Shop: Preise, Etage und Telefon bestätigen (die Angaben widersprechen sich)
- Preisliste Isartor (auf Planity nicht gelistet)
- Team-Fotos und Namen
- Ob alle 5 Betriebe einem Inhaber gehören, oder ob Riem separat läuft

## Arbeitsweise: Stände und „back“
- Nach **jedem Push** den Stand merken: `tools/version.sh merken "kurze Beschreibung"`, committen, pushen.
- Schreibt der Nutzer **„back“**: `tools/version.sh back` ausführen (stellt den Stand vor dem aktuellen wieder her, als neuer Commit, nichts wird gelöscht), pushen, live prüfen und den Link schicken. Mehrmals „back“ geht jeweils einen Stand weiter zurück.
- Liste aller Stände: `tools/version.sh liste` bzw. `tools/staende.txt`.
- Live-Vorschau: https://kebronkg-cmyk.github.io/Omer-s-Hair/ (GitHub Pages, Branch `claude/eager-edison-jcdabw`).

## Gestaltungsregeln (vom Kunden bestätigt)
- Leitfarbe ist das leuchtende Blau des Leuchtschilds. **Kein Lila, kein Pink**, keine Farbverläufe in diese Richtung.
- Keine Gedankenstriche („ – “) in Texten, kurze Sätze statt Einschüben.
- Glas- und Spiegeloptik wie in der Referenz (Denmu, awwwards), Raster aus feinen Linien.
- Fotos nur aus dem Salon, einheitlich bearbeitet (`tools/bilder.py`); keine Außenaufnahmen der Umgebung.
