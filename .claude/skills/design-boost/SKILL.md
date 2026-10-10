---
name: design-boost
description: Gestaltungs-Booster für Websites von Läden, Restaurants, Salons, Studios und Marken — Haltung, starke Gestaltungsentscheidungen und sofort einsetzbare Bausteine (Freistellen und Ausschneiden, Material aus Fotos, Licht, Rahmen, Ornamente aus Vorlagen, Etiketten, Nachrichtenbaukasten, Öffnungsstand, Kapitel, weiche Nachführung, Galerie, Preisliste mit Filtern). Statisch, Vanilla JS, ohne Build. Benutzen bei „mach das schöner / hochwertiger / besonderer“, „eigene Idee für die Seite“, „Website für Laden X“, „Foto freistellen“, „Element aus dem Foto nachbauen“, „besondere Funktion“. Ergänzt impeccable, ersetzt es nicht.
---

# Design-Boost

> **Kurzfassung in acht Sätzen**
> 1. Erst den Ort lesen, dann gestalten — jede starke Entscheidung hat einen Grund im echten Laden.
> 2. Eine eigene Idee pro Seite, die es nirgends sonst gibt, und die auch klein funktioniert.
> 3. Licht als Kante, nie als Fläche; eine Lampe pro Knopfgruppe.
> 4. Material echt statt gemalt: aus Fotos ausschneiden, nahtlos machen, freistellen.
> 5. Ornamente aus einer Vorlage nachzeichnen und über einen Generator überall gleich einsetzen.
> 6. Jede Funktion hat eine Rückfallebene: ohne Skript, ohne Bewegung, ohne Netz steht die Seite.
> 7. Das Handy bekommt eine eigene Komposition.
> 8. Jede Verbesserung wird gemessen, alt gegen neu — erst dann heißt es fertig.

**Diese Datei schränkt nicht ein.** Alle Werte sind erprobte Startwerte, keine
Gesetze. Wo der Auftrag, die Vorlage des Inhabers oder der Ort etwas anderes
verlangt, gewinnt das. Ziel ist Mut mit Handwerk: kühne Ideen, millimetergenau
umgesetzt.

| § | Inhalt |
|---|---|
| 1 | Haltung: woher starke Entscheidungen kommen |
| 2 | Die Boost-Schleife: Ablauf in sieben Schritten |
| 3 | Gestaltungsentscheidungen, die getragen haben |
| 4 | Ausschneiden, Freistellen, Material aus Fotos |
| 5 | Ornamente aus einer Vorlage nachbauen |
| 6 | Bausteine: CSS |
| 7 | Bausteine: Funktionen (JS) |
| 8 | Bewegung mit Regie |
| 9 | Detailliste: was Arbeiten von Vorlagen unterscheidet |
| 10 | Messen statt behaupten |
| 11 | Fallen |

---

## 1. Haltung

- **Die Atmosphäre kommt aus dem Ort.** Palette, Schrift, Material und Licht
  werden aus echten Fotos abgeleitet: Wände, Möbel, Geschirr, Rahmen, Logo,
  Schaufenster. Erst schauen, dann festlegen.
- **Prüftest Leitfarbe:** Verschwände sie, wenn der Laden den Lieferanten
  wechselt (Pflegemarke, Getränkemarke, Lieferportal)? Dann gehört sie ihm
  nicht. Gemessen ist nicht gleich eigen.
- **Vorlagen des Inhabers gewinnen.** Schickt er Visionsbilder, wird deren
  Welt gebaut — Licht, Material, Schrift, Ornament — auch gegen den eigenen
  Geschmack.
- **Inhabergeführt heißt: Die Leute kaufen die Person.** Ein echtes Porträt
  gehört nach oben. Fehlt es, steht der Raum dort und die Frage im Abnahmezettel.
- **Eine eigene Idee pro Seite**, räumlich, aus dem Ort: ein Spiegel, in dem
  der Raum steht und dessen Glanz dem Zeiger folgt; ein Regal mit Haarsträngen
  als Farbwahl; Preisetiketten an einer Lichtstange; das Handy als
  Schaufenster mit LED-Rahmen. **Prüftest:** Funktioniert sie in 400 px
  Breite? Wenn nur riesig, ist es ein Schaustück an der falschen Stelle — dann
  denselben Gedanken klein machen (aus einem Farbfächer über den halben
  Bildschirm wurde eine Tonprobe aus zwei Farbfeldern neben dem Preis).
- **Zurücknehmen ist schwerer als nachlegen.** Ornament wenig, aber dort, wo es
  etwas bedeutet. Ein Motiv, das die ganze Seite trägt, wird schnell Tapete —
  besser einmal als Band, einmal dunkel im Fuß.
- **Echte Inhalte.** Keine Platzhalter, kein Blindtext, keine erfundene Zahl.
  Was unklar ist, bleibt weg und wird gefragt.
- **Kühn im Konzept, pedantisch im Detail.** Ein mutiger Einfall mit einer
  verrutschten Kante wirkt billiger als ein braver ohne.

---

## 2. Die Boost-Schleife

1. **Ort lesen.** Fotos sammeln (eigene, Profil, Vorlagen). Farben messen
   (§ 4.1), Materialien benennen, Licht beschreiben (woher, welche Farbe, wo
   steht es als Kante). Wer kommt, wann, warum — aus Bewertungen verdichten.
2. **These in einem Satz.** „Das Handy ist ein Schaufenster bei Nacht.“ „Der
   Spiegel zeigt den Salon.“ Als Kommentar direkt nach `<body>`:
   THESE · EIGENE WELT · ERSTER BILDSCHIRM · FORM.
3. **Drei Ideen skizzieren, eine wählen.** Für jede: Wo sitzt sie? Was tut sie
   für den Besucher (nicht nur fürs Auge)? Wie sieht sie bei 360 px aus? Ohne
   Skript? Mit reduzierter Bewegung?
4. **Tokens zuerst.** Jeder Gestaltungswert in `:root`: Farben nach Rolle
   (nicht nach Ton), Abstände, Kurven, Dauern, Muster als Daten-URI. Lesbare
   Varianten einer Farbe getrennt vom Ornament (`--gold-schrift` ≠ `--gold`).
5. **Material bauen** (§ 4) und **Ornament generieren** (§ 5).
6. **Bauen, dann einmal gesammelt prüfen** (§ 10): Aufnahmen 1440 und 390
   ansehen, Detektor, Kontrast, Überbreite, Konsole, Bewegung zählen.
7. **Alles in einem Durchgang beheben, einmal bestätigen, aufhören zu
   polieren.** Ergebnis mit Zahlen übergeben (alt → neu).

---

## 3. Gestaltungsentscheidungen, die getragen haben

| Entscheidung | Warum sie trägt | Umsetzung |
|---|---|---|
| **Licht als Kante** (LED, Goldfaden), nie als Fläche hinter Text | Wirkt teuer und ruhig; Flächenschein wirkt billig | 1–1,5 px Linie + enger Schein (§ 6.1) |
| **Eine Lampe pro Knopfgruppe** | Leuchten zwei, führt keiner | Hauptknopf dunkel mit Lichtkante, Nebenknöpfe nur Linie |
| **Schild + Handschrift** statt „leicht + kursives Goldwort“ | Spricht wie der Laden (Versalien am Fenster, Schreibschrift auf der Folie) | ein Wort gesperrte Versalien `letter-spacing ≈ .28em`, Linie darunter, darunter eine Zeile Handschrift |
| **Zweite Farbe nur als Ornament** | Sonst kippt die Ordnung | nie als Textfarbe |
| **Vollflächige Fotos tragen Abschnitte** | Atmosphäre statt Kachel | mehrstufiger Schleier in der Grundfarbe (§ 6.3) |
| **Ein Schleier, der das Bild rettet, tötet es** | Man sieht den Schleier statt des Bildes | Schatten nur hinter dem Textblock; vier Fünftel bleiben offen |
| **Dunkle Variante neu messen**, nicht umkehren | Gold auf Schwarz ist eine andere Farbe als Gold auf Weiß | Leitfarbe neu messen, Ankerfläche tiefer statt heller |
| **Kapitel mit Nummer und Lichtfuge** am Handy | Orientierung in langen Seiten | `data-kapitel`, Fuge leuchtet beim Hereinscrollen, Name in der Leiste (§ 7.5) |
| **Das Anschauliche vor dem Text** | Bild erklärt schneller | Regal, Etiketten, Foto zuerst; Text danach oder aufklappbar |
| **Vorschau statt Liste** | Acht Gruppen auf einen Blick statt 1800 px Scrollweg | Preisetiketten an Lichtstangen (§ 6.6) |
| **Fragen statt alles zeigen** | Eine Preisangabe pro Leistung statt drei | Länge/Größe oben wählen, gemerkt, Filter per `:has()` (§ 6.7) |
| **Die Leiste weicht aus** | Sie versperrt sonst Bild und Text | runter = weg, hoch = da, 6 px Hysterese (§ 7.1) |
| **Telefon im ersten Bildschirm** | Wer anrufen will, soll nicht suchen | als kleine Leuchtschilder |
| **Galerie am Handy zwei nebeneinander** | Mehr Überblick, weniger Scrollen | weiter antippbar, Dialog mit Rückkehr |
| **Termin statt Warenkorb** | Kein Server, keine Zahlung, persönlicher | Auswahl → fertiger Text → WhatsApp/Telefon (§ 7.6) |
| **Ladebildschirm = Rückfallebene** | Was beim Laden steht, muss auch ohne Laden stehen | Logo-Vorhang mit Notausgang (§ 7.3) |

---

## 4. Ausschneiden, Freistellen, Material aus Fotos

Werkzeuge laufen **beim Bauen** (Python/Pillow, numpy), nicht auf der Seite.
Die Seite bekommt nur das fertige Bild.

### 4.1 Farben aus dem Foto messen

```python
# farben.py — Anteile der Hauptfarben eines Fotos
from PIL import Image, ImageOps
import sys
im = ImageOps.exif_transpose(Image.open(sys.argv[1])).convert('RGB'); im.thumbnail((300, 300))
q = im.quantize(colors=8, method=Image.Quantize.MEDIANCUT); pal = q.getpalette()
farben = sorted(q.getcolors(), reverse=True); summe = sum(c for c, _ in farben)
for c, i in farben:
    print('#%02x%02x%02x' % tuple(pal[i*3:i*3+3]), f'{100*c/summe:.0f} %')
```

Für eine einzelne Farbe (Bänke, Logo, Polster) nur gesättigte Pixel im
Farbton zählen und den Mittelwert nehmen. Dunkle Fotos unterschätzen Farben —
das notieren, nicht schönrechnen.

### 4.2 Schärfe prüfen, bevor ein Bild groß wird

```python
# schaerfe.py — Kantenenergie bei gleicher Breite; Mitte zählt (Motiv)
from PIL import Image, ImageOps, ImageFilter, ImageStat
import sys
for f in sys.argv[1:]:
    im = ImageOps.exif_transpose(Image.open(f)).convert('L')
    w, h = im.size; s = im.resize((1200, int(h * 1200 / w)))
    m = s.crop((300, s.height // 4, 900, s.height * 3 // 4))
    print(f, im.size, round(ImageStat.Stat(m.filter(ImageFilter.FIND_EDGES)).mean[0], 1))
```

Liegt ein Bild bei einem Drittel der anderen, gehört es an eine kleine Stelle.
Zusätzlich immer einen 100-%-Ausschnitt der Mitte **ansehen** — Muster
(Tischdecke) täuschen hohe Werte vor. Vor dem Einsetzen EXIF/GPS entfernen
(neu speichern ohne `exif=`).

### 4.3 Detailausschnitt statt Verkleinerung

Aus einem 4000-px-Original einen scharfen Ausschnitt nehmen (Kupferschale,
Naht, Strähne, Stein) ist oft stärker als das ganze Bild klein. Der Ausschnitt
darf nicht über seine Pixel gezogen werden: Zielbreite × Pixeldichte ≤
Ausschnittbreite.

```python
# ausschnitt.py <bild> <x> <y> <breite> <höhe> <ziel.webp>  (Koordinaten im Original)
from PIL import Image, ImageOps
import sys
b, x, y, w, h, ziel = sys.argv[1], *map(int, sys.argv[2:6]), sys.argv[6]
im = ImageOps.exif_transpose(Image.open(b)).convert('RGB').crop((x, y, x + w, y + h))
for faktor in (1, 2):                       # 1x und 2x für srcset
    breite = w // (3 - faktor)              # 2x = volle Breite, 1x = halbe
    im.resize((breite, h * breite // w), Image.LANCZOS).save(ziel.replace('.webp', f'-{faktor}x.webp'), quality=82)
```

### 4.4 Nahtloses Material aus einem Foto (Stein, Holz, Stoff, Leder)

Echter Stein aus der Fassade wirkt anders als jedes Rauschmuster. Zweimal
eindimensional überblenden — so liegt keine Naht mehr am Rand:

```python
# nahtlos.py <foto> <x> <y> <groesse> <ziel.webp>
import sys, numpy as np
from PIL import Image, ImageOps
f, x, y, g, ziel = sys.argv[1], *map(int, sys.argv[2:5]), sys.argv[5]
a = np.asarray(ImageOps.exif_transpose(Image.open(f)).convert('RGB').crop((x, y, x + g, y + g))).astype(float)

def eine_achse(a, achse):
    n = a.shape[achse]
    b = np.roll(a, n // 2, axis=achse)            # Ränder von b sind die Mitte von a → nahtlos
    t = np.abs(np.linspace(-1, 1, n))             # 0 in der Mitte, 1 am Rand
    m = (1 - t) ** 0.8                            # a trägt die Mitte (verdeckt die Naht von b)
    m = m[:, None, None] if achse == 0 else m[None, :, None]
    return a * m + b * (1 - m)

out = eine_achse(eine_achse(a, 1), 0)
Image.fromarray(out.clip(0, 255).astype('uint8')).save(ziel, quality=80)
```

```css
.stein { background: var(--stein) url(stein.webp) 0 0 / 520px; }
/* Hell überlegen, damit Text lesbar bleibt — Farbe aus dem Token. */
.stein::before { content: ''; position: absolute; inset: 0;
  background: color-mix(in oklch, var(--stein-hell) 55%, transparent); }
```

Für stark gemusterte Flächen (Fliesen, Paisley) lieber eine Kachel genau auf
Rapportgrenzen ausschneiden.

### 4.5 Freistellen: das Motiv aus dem Foto lösen

Zwei Wege, je nach Werkzeug in der Umgebung:

```python
# freistellen.py <foto> <x> <y> <b> <h> <ziel.png> [hinweise.png]
#   Rechteck grob ums Motiv. Optional ein Hinweisbild in Fotogröße:
#   weiß = sicher Motiv, schwarz = sicher Hintergrund, grau (128) = offen.
# Weg A: rembg (pip install rembg; lädt beim ersten Lauf ein Modell)
# Weg B: OpenCV GrabCut (pip install opencv-python-headless), ohne Modell
import sys, numpy as np
from PIL import Image, ImageOps, ImageFilter
f, x, y, w, h, ziel = sys.argv[1], *map(int, sys.argv[2:6]), sys.argv[6]
hinweise = sys.argv[7] if len(sys.argv) > 7 else None
foto = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
try:
    from rembg import remove
    rgba = remove(foto)
except ImportError:
    import cv2
    bild = cv2.cvtColor(np.asarray(foto), cv2.COLOR_RGB2BGR)
    maske = np.full(bild.shape[:2], cv2.GC_BGD, np.uint8)
    maske[y:y + h, x:x + w] = cv2.GC_PR_FGD
    if hinweise:
        hw = np.asarray(Image.open(hinweise).convert('L'))
        maske[hw > 200] = cv2.GC_FGD
        maske[hw < 50] = cv2.GC_BGD
    bg, fg = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(bild, maske, None, bg, fg, 8, cv2.GC_INIT_WITH_MASK)
    alpha = np.where((maske == cv2.GC_FGD) | (maske == cv2.GC_PR_FGD), 255, 0).astype('uint8')
    # Weiche Kante: 1–2 px auslaufen lassen, sonst wirkt es ausgeschnitten wie Papier.
    rgba = foto.convert('RGBA'); rgba.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2)))
rgba.crop(rgba.getbbox()).save(ziel)
```

**Immer ansehen** — vor dunklem **und** hellem Grund. GrabCut nur mit
Rechteck ist grob (Servietten bleiben, Ränder fehlen). Ein Hinweisbild mit
wenigen groben Flächen behebt das meist im zweiten Lauf; rembg ist bei
Personen und Produkten von sich aus besser. Haar, Dampf, Glas und Fransen
scheitern am ehesten — Haar lieber mit weicher Maske (§ 4.6) als hart
freigestellt.

**Einsatz: aus dem Rahmen treten.** Das Foto steckt im Rahmen, das
freigestellte Motiv (Person, Teller, Flasche) liegt deckungsgleich darüber
und ragt oben hinaus.

```html
<figure class="ausbruch">
  <img class="ausbruch-grund" src="raum.webp" alt="Der Gastraum mit dem Wandbild">
  <img class="ausbruch-motiv" src="motiv.png" alt="" aria-hidden="true">
</figure>
```
```css
.ausbruch { position: relative; display: grid; isolation: isolate; }
.ausbruch > img { grid-area: 1 / 1; width: 100%; height: auto; }
.ausbruch-grund { clip-path: inset(12% 0 0 0 round 999px 999px 4px 4px); }  /* Rahmen mit Bogen */
.ausbruch-motiv { z-index: 1; filter: drop-shadow(0 18px 22px color-mix(in oklch, var(--schatten) 45%, transparent)); }
```

Motiv und Grund aus **demselben** Foto, gleiche Abmessungen — dann passen sie
ohne Rechnen. Nur der Grund wird beschnitten.

### 4.6 Weiche Masken für organische Formen

Haar, Stoff, Dampf: keine Polygonspitzen, sondern eine SVG-Maske mit
Verjüngung **und** Alpha-Verlauf, leicht weichgezeichnet. Drei Varianten im
Wechsel (`:nth-child(3n+…)`) verhindern, dass es gestempelt aussieht.

```css
.straehne::after {
  content: ''; position: absolute; inset: 12px 0 0;
  background:
    linear-gradient(90deg, color-mix(in oklch, var(--schatten) 32%, transparent), transparent 20%, transparent 78%, color-mix(in oklch, var(--schatten) 34%, transparent)),  /* Rundung */
    linear-gradient(100deg, transparent 28%, color-mix(in oklch, var(--licht) 20%, transparent) 44%, transparent 58%),                                                   /* Glanz */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='400'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55 .006' numOctaves='2' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 -.38'/%3E%3C/filter%3E%3Crect width='80' height='400' filter='url(%23h)'/%3E%3C/svg%3E") 0 0 / 100% 100%,  /* Fasern */
    linear-gradient(180deg, var(--wurzel), var(--ton) 42%, var(--spitze));                                                                                                /* Farbe */
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 240' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23fff'/%3E%3Cstop offset='.74' stop-color='%23fff'/%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='0'/%3E%3C/linearGradient%3E%3Cfilter id='w'%3E%3CfeGaussianBlur stdDeviation='.9'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M1 0H39C40 80 39 140 35 182C31 214 25 232 20 240C15 231 9 213 5 182C1 140 0 80 1 0Z' fill='url(%23f)' filter='url(%23w)'/%3E%3C/svg%3E") 0 0 / 100% 100% no-repeat;
}
```

Die Faserrichtung steckt in `baseFrequency='.55 .006'` (quer fein, längs
grob). Für Holz die Werte tauschen, für Stoff beide ähnlich.

---

## 5. Ornamente aus einer Vorlage nachbauen

Eine Schleife vom Schaufenster, ein Kuppelbogen aus dem Logo, ein Gitter aus
der Tür: einmal genau nachzeichnen, dann überall gleich einsetzen.

1. **Ausschnitt nehmen und in dessen Koordinaten zeichnen** (viewBox =
   Ausschnittgröße, z. B. `0 0 560 900`). Foto und SVG nebeneinander rendern
   und vergleichen, bis die Silhouette stimmt.
2. **Teile von hinten nach vorn**; jedes Teil trägt seine Kante selbst, damit
   das vordere das hintere verdeckt.
3. **Volumen:** ein Verlauf je Fläche in Lichtrichtung des Fotos, weiche
   Glanzbahnen (Weichzeichner, 13–16 % Weiß), dunkle Innenseiten.
4. **Licht nur dort, wo es im Foto steht** (meist Außen- und Unterkanten); die
   übrigen Kanten nur als Hauch. Hinterleuchtung als stark weichgezeichnete
   Silhouette dahinter.
5. **Ein Generator, mehrere Einsätze** über Marken im HTML. Jede Kopie bekommt
   ein eigenes ID-Präfix (sonst greifen Verläufe auf die falsche Kopie).
6. **Ein Zeichen in 40 px ist ein Ausschnitt, keine Verkleinerung** — im Logo
   nur das Erkennbare, der Rest läuft über eine Maske aus.
7. Lichtfarbe als SVG-Attribut, nur Breite und Animation in CSS.

```python
# ornament.py — Gerüst des Generators
import re
from pathlib import Path
TEILE = [  # (Name, Pfad im Ausschnitt-Koordinatenraum, Verlauf) — hinten zuerst
    ('hinten', 'M262 214C262 360 263 560 262 764L120 886C138 776 160 660 178 578Z', 'dunkel'),
    ('vorn',   'M252 196C196 214 128 236 96 252C116 300 138 352 146 404Z', 'hell'),
]
KANTEN = {'vorn': ['M96 252C116 300 138 352 146 404']}   # nur wo im Foto Licht steht
VERLAEUFE = {'dunkel': [(0, '#221d1b'), (.6, '#0b0909'), (1, '#060505')],
             'hell':   [(0, '#4a423d'), (.5, '#141211'), (1, '#040303')]}

def svg(praefix, klasse, licht='#f3cf86', schein=True):
    defs = ''.join(
        f'<linearGradient id="{praefix}-{n}" x1="0" y1="0" x2="1" y2="1">' +
        ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in halte) + '</linearGradient>'
        for n, halte in VERLAEUFE.items())
    defs += f'<filter id="{praefix}-weich"><feGaussianBlur stdDeviation="10"/></filter>'
    teile = []
    for name, d, v in TEILE:
        teile.append(f'<path d="{d}" fill="url(#{praefix}-{v})"/>')
        for k in KANTEN.get(name, []):
            if schein:
                teile.append(f'<path class="schein" d="{k}" stroke="{licht}" filter="url(#{praefix}-weich)"/>')
            teile.append(f'<path class="led" d="{k}" stroke="{licht}" pathLength="1"/>')
    return (f'<svg class="{klasse}" viewBox="0 0 560 900" aria-hidden="true" focusable="false">'
            f'<defs>{defs}</defs>{"".join(teile)}</svg>')

def einsetzen(datei, marke, inhalt):
    p = Path(datei); t = p.read_text()
    neu, n = re.subn(rf'(<!-- ornament:{marke} -->).*?(<!-- /ornament:{marke} -->)',
                     lambda m: m.group(1) + inhalt + m.group(2), t, flags=re.S)
    if not n: raise SystemExit(f'Marke {marke} fehlt in {datei}')
    p.write_text(neu)

einsetzen('index.html', 'gross', svg('og', 'ornament-gross'))
einsetzen('index.html', 'zeichen', svg('oz', 'ornament-zeichen', schein=False))
```

```css
/* Die LED zieht sich einmal nach. pathLength="1" macht die Länge zu 1. */
@media (prefers-reduced-motion: no-preference) {
  .ornament-gross .led { stroke-dasharray: 1; stroke-dashoffset: 1;
    animation: led-zieht 1.6s var(--kurve) .4s forwards; }
  .ornament-gross .schein { opacity: 0; animation: an 1s var(--kurve) 1.3s forwards; }
}
.led { fill: none; stroke-width: 4; stroke-linecap: round; }
.schein { fill: none; stroke-width: 14; opacity: .7; }
@keyframes led-zieht { to { stroke-dashoffset: 0; } }
@keyframes an { to { opacity: .7; } }
```

---

## 6. Bausteine: CSS

Alle Farben sind Tokens. Startwerte:

```css
:root {
  --kurve: cubic-bezier(.22, .61, .36, 1);        /* ease-out, ohne Federn */
  --kurve-fort: cubic-bezier(.55, 0, .75, .3);     /* Abgang beschleunigt */
  --t1: .3s; --t2: .45s; --t3: .9s;
  --licht: #fff8ec;  --schatten: #120c08;
  --led: #f3cf86;    --led-schein: color-mix(in oklch, var(--led) 55%, transparent);
  --knopf-grund: #15110e; --knopf-kante: var(--led);
}
[hidden] { display: none !important; }
```

### 6.1 Hauptknopf mit Lichtkante — eine Lampe pro Gruppe

```css
.knopf { background: var(--knopf-grund); color: var(--licht);
  border: 1px solid var(--knopf-kante); box-shadow: 0 0 10px -1px var(--led-schein); }
.knopf-still { background: transparent; border: 1px solid var(--linie); box-shadow: none; }
@media (hover: hover) and (pointer: fine) {
  .knopf:hover { background: color-mix(in oklch, var(--led) 12%, var(--knopf-grund)); }
}
```

### 6.2 Rahmen mit Bogen und Glanz, der dem Zeiger folgt

```css
.spiegel-rahmen { --lx: 68%; --ly: 22%; position: relative; aspect-ratio: 3 / 4;
  padding: clamp(9px, 1.1vw, 13px); border-radius: 999px 999px 6px 6px; background: var(--rahmen-metall); }
.spiegel-rahmen::before { content: ''; position: absolute; inset: -9px;     /* zweiter, feiner Faden */
  border-radius: 999px 999px 10px 10px; border: 1px solid var(--linie-gold); pointer-events: none; }
.spiegel-glas { position: relative; height: 100%; overflow: hidden; isolation: isolate;
  border-radius: 999px 999px 3px 3px;
  clip-path: inset(0 round 999px 999px 3px 3px); }  /* Safari schneidet animierte Bilder sonst eckig */
.spiegel-bild { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.08); transition: transform 9s var(--kurve); }
.spiegel.da .spiegel-bild { transform: scale(1); }                 /* Kamerafahrt heran */
.spiegel-licht { position: absolute; inset: 0; z-index: 2; pointer-events: none; mix-blend-mode: screen;
  background:
    radial-gradient(circle at var(--lx) var(--ly), color-mix(in oklch, var(--licht) 34%, transparent),
                    color-mix(in oklch, var(--licht) 8%, transparent) 22%, transparent 46%),
    linear-gradient(118deg, transparent calc(var(--lx) - 32%), color-mix(in oklch, var(--licht) 13%, transparent) calc(var(--lx) - 22%), transparent calc(var(--lx) - 8%)); }
/* Beim Wechsel läuft einmal ein Lichtstreif über das Glas. */
.spiegel-glas::after { content: ''; position: absolute; inset: -10% -60%; z-index: 3; opacity: 0; pointer-events: none;
  background: linear-gradient(105deg, transparent 40%, color-mix(in oklch, var(--licht) 32%, transparent) 50%, transparent 60%); }
.spiegel.wechsel .spiegel-glas::after { animation: streif 1s var(--kurve) both; }
@keyframes streif { from { transform: translateX(-70%); opacity: 1; } to { transform: translateX(70%); opacity: 0; } }
```

### 6.3 Mehrstufiger Schleier über vollflächigen Fotos

```css
.abschnitt-bild { position: relative; isolation: isolate; }
.abschnitt-bild > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.abschnitt-bild::before { content: ''; position: absolute; inset: 0; z-index: -1;
  background:
    linear-gradient(to bottom, var(--grund) 0, transparent 18%, transparent 82%, var(--grund) 100%),   /* in die Ränder */
    linear-gradient(90deg, color-mix(in oklch, var(--grund) 88%, transparent) 0,
                    color-mix(in oklch, var(--grund) 60%, transparent) 38%, transparent 62%); }         /* dicht, wo Text steht */
@media (max-width: 40rem) {   /* am Handy gleichmäßig statt seitlich */
  .abschnitt-bild::before { background:
    linear-gradient(to bottom, var(--grund), transparent 18%, transparent 82%, var(--grund)),
    color-mix(in oklch, var(--grund) 62%, transparent); }
}
```

Kanten von Text und Bild **messen**, dann die Verlaufsstufen daraus setzen.
Die kleinste Zeile scheitert zuerst am Kontrast — sie wandert dorthin, wo der
Schleier ohnehin dicht ist.

### 6.4 LED-Rahmen, der sich beim Laden zieht

```html
<div class="led-rahmen" aria-hidden="true"><i class="k-links"></i><i class="k-oben"></i><i class="k-rechts"></i></div>
```
```css
.led-rahmen { position: absolute; inset: 10px; pointer-events: none; }
.led-rahmen i { position: absolute; background: var(--knopf-kante); filter: drop-shadow(0 0 5px var(--led-schein)); }
.k-links  { left: 0; top: 0; bottom: 0; width: 1.5px; transform-origin: 50% 100%; }
.k-oben   { left: 0; right: 0; top: 0; height: 1.5px; transform-origin: 0 50%; }
.k-rechts { right: 0; top: 0; bottom: 0; width: 1.5px; transform-origin: 50% 0; }
@media (prefers-reduced-motion: no-preference) {
  .k-links  { transform: scaleY(0); animation: kante-y .55s var(--kurve) .3s forwards; }
  .k-oben   { transform: scaleX(0); animation: kante-x .6s var(--kurve) .8s forwards; }
  .k-rechts { transform: scaleY(0); animation: kante-y .55s var(--kurve) 1.35s forwards; }
}
@keyframes kante-x { to { transform: scaleX(1); } }
@keyframes kante-y { to { transform: scaleY(1); } }
```

Gerade Kanten als Elemente mit `scale`, nicht als SVG mit `pathLength` +
`non-scaling-stroke` (strichelt in Chrome lückenhaft).

### 6.5 Kapitelfuge

```css
section[data-kapitel] { position: relative; }
.kapitel-fuge { position: absolute; left: var(--rand); right: var(--rand); top: 0; height: 1px; pointer-events: none;
  background: linear-gradient(90deg, transparent, var(--knopf-kante) 12%, var(--knopf-kante) 88%, transparent);
  transform-origin: 0 50%; }
@media (prefers-reduced-motion: no-preference) {
  .kapitel-fuge { transform: scaleX(0); transition: transform .9s var(--kurve); }
  .kapitel-an > .kapitel-fuge { transform: none; }
}
.schild[data-nr]::before { content: attr(data-nr); display: block; letter-spacing: .2em; color: var(--led-schrift); }
```

### 6.6 Etiketten an einer Lichtstange

```css
.etiketten { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2.6rem .8rem; list-style: none; padding: 2.25rem 0 0; }
.etiketten li { position: relative; }
.etiketten li::after { content: ''; position: absolute; left: -.5rem; right: -.5rem; top: -2.25rem; height: 2px; background: var(--led); } /* Stange */
.etiketten li::before { content: ''; position: absolute; z-index: 1; left: 50%; top: -2.25rem; width: 1px; height: 2.9rem;         /* Schnur */
  background: linear-gradient(var(--led-tief), color-mix(in oklch, var(--led-tief) 40%, transparent)); }
.etikett { position: relative; display: grid; grid-template-rows: 1fr auto; gap: .6rem; height: 10.5rem;
  padding: 1.9rem 1rem 1rem; text-align: center; text-decoration: none; color: inherit;
  background: linear-gradient(170deg, var(--papier), var(--knopf-grund) 70%);
  border: 1px solid color-mix(in oklch, var(--led) 28%, transparent);
  clip-path: polygon(22% 0, 78% 0, 100% 10%, 100% 100%, 0 100%, 0 10%);    /* abgeschrägte Schultern */
  transform-origin: 50% 0; transition: transform var(--t2) var(--kurve); }
.etikett-loch { position: absolute; left: calc(50% - 5px); top: .6rem; width: 10px; height: 10px; border-radius: 50%;
  border: 1px solid var(--led-tief); background: var(--grund); }
.etikett-preis { padding-top: .7rem; border-top: 1px solid var(--linie); font-variant-numeric: tabular-nums lining-nums; white-space: nowrap; }
@media (hover: hover) and (pointer: fine) { .etikett:hover { transform: rotate(-2.5deg); } }
/* Einhängen beim Hereinscrollen, 220 ms versetzt → höchstens drei zugleich (§ 7.7). */
@media (prefers-reduced-motion: no-preference) {
  .regal.wartet .etikett { opacity: 0; transform: translateY(-8px) rotate(-4deg); }
  .regal.wartet.da .etikett { opacity: 1; transform: none;
    transition: opacity .45s var(--kurve), transform .6s var(--kurve); transition-delay: calc(var(--i, 0) * 220ms); }
}
```

### 6.7 Karte/Preisliste: fragen statt alles zeigen — ohne Skript

```html
<fieldset class="groessenwahl"><legend>Meine Haare sind</legend>
  <label><input type="radio" name="l" id="l-kurz"><span>kurz</span></label>
  <label><input type="radio" name="l" id="l-lang"><span>lang</span></label>
</fieldset>
<details class="gruppe" name="gruppen" open>
  <summary><span class="gruppe-titel">Schnitt</span><span class="gruppe-ab">ab 39 €</span></summary>
  <ul class="zeilen">
    <li class="zeile" data-hat="kurz lang"><p class="zeile-name">Waschen, Schneiden, Föhnen</p>
      <dl class="zeile-preise"><div data-l="kurz"><dt>kurz</dt><dd>39 €</dd></div><div data-l="lang"><dt>lang</dt><dd>59 €</dd></div></dl></li>
  </ul>
</details>
```
```css
/* Gewählte Größe: nur ihr Preis bleibt — hat eine Leistung sie nicht, bleiben alle. */
.preise:has(#l-kurz:checked) .zeile[data-hat~="kurz"] .zeile-preise > div:not([data-l~="kurz"]) { display: none; }
.preise:has(#l-lang:checked) .zeile[data-hat~="lang"] .zeile-preise > div:not([data-l~="lang"]) { display: none; }
.groessenwahl:not(:has(input:checked)) legend { color: var(--led-schrift); }   /* fragt, solange nichts gewählt ist */
details.gruppe[open] > summary { position: sticky; top: calc(var(--leiste) + 4rem); z-index: 20; background: var(--grund); }
details.gruppe > summary::after { content: ''; width: 1.1rem; height: 1.1rem; transition: transform var(--t2) var(--kurve);
  background: linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat,
              linear-gradient(currentColor, currentColor) center / 1px 100% no-repeat; }
details.gruppe[open] > summary::after { transform: rotate(45deg); }    /* Plus wird Kreuz */
.zeile { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 1.25rem; }
```

Eine Zeile pro Leistung, Preis rechts, `tabular-nums`. Am Gruppenende der
Bestell- oder Buchungsweg. Karte nach Ablauf gegliedert, nicht alphabetisch.

### 6.8 Knopftext, der sich der Kartenbreite anpasst

```html
<a class="knopf" aria-label="Termin in Laden Nord buchen"><span>Termin<span class="lang"> in Laden Nord</span> buchen</span></a>
```
```css
.karte { container-type: inline-size; }
@container (max-width: 21rem) { .karte .lang { display: none; } }
```

Gleich breite Karten brechen gleich um — so stehen Knöpfe nebeneinander auf
derselben Höhe. Den ganzen Text in einen Span legen, sonst gehen Leerzeichen
im `inline-flex` verloren.

### 6.9 Galerie

```css
.galerie { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
@media (min-width: 48rem) { .galerie { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; } }
.galerie button { padding: 0; border: 0; background: none; cursor: zoom-in; }
.galerie img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }   /* Kachel ohne Symbol, ohne Text */
```

Das Format der Kachel nur dann erzwingen, wenn alle Aufnahmen es tragen. Ein
Hochformat in 3:2 gequetscht verliert genau das Motiv — dann die Kachel dem
Bild anpassen.

---

## 7. Bausteine: Funktionen (Vanilla JS)

Jede Funktion steigt still aus, wenn ihr Element fehlt. Ohne Skript steht die
Seite vollständig da.

```js
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const feinZeiger = matchMedia('(hover: hover) and (pointer: fine)').matches;
document.documentElement.classList.add('js');
```

### 7.1 Leiste weicht aus

```js
const leiste = document.querySelector('.leiste');
if (leiste) {
  let letzt = scrollY, weg = false;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (Math.abs(y - letzt) < 6) return;            // Hysterese gegen Flackern
    const runter = y > letzt; letzt = y;
    const neu = runter && y > 160 ? true : (!runter || y < 80) ? false : weg;
    if (neu !== weg) { weg = neu; leiste.classList.toggle('weg', weg);
      document.documentElement.classList.toggle('leiste-weg', weg); }  // klebende Leisten fahren mit
  }, { passive: true });
}
```
```css
.leiste { position: sticky; top: 0; transition: transform var(--t2) var(--kurve); }
.leiste.weg { transform: translateY(-100%); }
html.leiste-weg .klebt-darunter { transform: translateY(calc(-1 * var(--leiste))); }
```

### 7.2 Öffnungsstand nach der Uhr des Ladens

```js
// 18.5 = 18:30; mehrere Fenster pro Tag möglich (Mittagspause)
const ZEITEN = { 0: [[11.5, 14], [17.5, 22]], 1: [[11.5, 14], [17.5, 22]], 2: [],
                 3: [[11.5, 14], [17.5, 22]], 4: [[11.5, 14], [17.5, 22]], 5: [[11.5, 14], [17.5, 22]], 6: [[11.5, 14], [17.5, 22]] };
const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
function ladenzeit(tz = 'Europe/Berlin') {
  const t = Object.fromEntries(new Intl.DateTimeFormat('de-DE', { timeZone: tz, weekday: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { tag: { So: 0, Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6 }[t.weekday.replace('.', '')], h: +t.hour + t.minute / 60 };
}
const uhr = (h) => String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
function stand() {
  const { tag, h } = ladenzeit();
  for (const [a, b] of ZEITEN[tag]) if (h >= a && h < b) return ['Jetzt geöffnet · bis ' + uhr(b), true];
  const spaeter = ZEITEN[tag].find(([a]) => h < a);
  if (spaeter) return ['Heute ab ' + uhr(spaeter[0]), false];
  for (let i = 1; i <= 7; i++) { const t = (tag + i) % 7;
    if (ZEITEN[t].length) return ['Geschlossen · ' + (i === 1 ? 'morgen' : TAGE[t]) + ' ab ' + uhr(ZEITEN[t][0][0]), false]; }
  return ['', false];
}
function zeigen() { for (const el of document.querySelectorAll('.stand')) {
  const [text, offen] = stand(); el.textContent = text; el.classList.toggle('offen', offen); } }
zeigen(); setInterval(zeigen, 60000);
```

Im HTML steht ohne Skript die Wochenübersicht — der Stand ergänzt sie nur.

### 7.3 Vorhang (Ladebildschirm) mit Notausgang

```js
const vorhang = document.querySelector('.vorhang');
if (vorhang) {
  let gemerkt = false; try { gemerkt = sessionStorage.getItem('vorhang') === '1'; } catch (e) {}
  if (ruhig || gemerkt) vorhang.remove();
  else {
    let fort = false; const beginn = performance.now();
    const heben = () => { if (fort) return; fort = true; vorhang.classList.add('geht');
      setTimeout(() => vorhang.remove(), 700); try { sessionStorage.setItem('vorhang', '1'); } catch (e) {} };
    const bild = document.querySelector('.auftakt img');
    (bild?.decode ? bild.decode().catch(() => {}) : Promise.resolve())
      .then(() => setTimeout(heben, Math.max(0, 900 - (performance.now() - beginn))));   // frühestens 0,9 s
    setTimeout(heben, 1800);                                                             // spätestens 1,8 s
  }
}
```
```css
.vorhang { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: var(--grund);
  transition: opacity .6s var(--kurve-fort), visibility 0s .6s;
  animation: notaus .6s var(--kurve-fort) 4s forwards; }        /* ohne Skript nach 4 s weg */
.vorhang.geht { opacity: 0; visibility: hidden; pointer-events: none; }
@keyframes notaus { 99% { opacity: 0; } 100% { opacity: 0; visibility: hidden; transform: translateY(-200vh); } }
@media (prefers-reduced-motion: reduce) { .vorhang { display: none; } }
```

`visibility` allein genügt nicht — ein unsichtbarer Vorhang fängt sonst jeden
Klick. Deshalb wird er am Ende aus dem Bild geschoben.

### 7.4 Licht folgt dem Zeiger (am Handy dem Scrollen)

```js
const rahmen = document.querySelector('.spiegel-rahmen');
if (rahmen && !ruhig) {
  let ziel = null, lauf = false;
  const setzen = () => { lauf = false;
    rahmen.style.setProperty('--lx', ziel[0].toFixed(1) + '%'); rahmen.style.setProperty('--ly', ziel[1].toFixed(1) + '%'); };
  const anfordern = (x, y) => { ziel = [x, y]; if (!lauf) { lauf = true; requestAnimationFrame(setzen); } };
  if (feinZeiger) {
    (document.querySelector('.auftakt') || rahmen).addEventListener('pointermove', (e) => {
      const r = rahmen.getBoundingClientRect();
      anfordern(Math.max(-20, Math.min(120, (e.clientX - r.left) / r.width * 100)),
                Math.max(-10, Math.min(90, (e.clientY - r.top) / r.height * 100)));
    });
  } else addEventListener('scroll', () => {
    const r = rahmen.getBoundingClientRect(), p = 1 - (r.top + r.height) / (innerHeight + r.height);
    anfordern(20 + p * 90, 10 + p * 50);
  }, { passive: true });
}
```

Die Variable am Element setzen, nicht an `<html>` — sonst rechnet der Browser
die ganze Seite neu.

### 7.5 Kapitel in der Leiste

```js
const anzeige = document.querySelector('.leiste-kapitel');
const kapitel = [...document.querySelectorAll('section[data-kapitel]')];
if (kapitel.length && 'IntersectionObserver' in window) {
  const sichtbar = new Set();
  const beob = new IntersectionObserver((es) => {
    for (const e of es) { if (e.isIntersecting) { sichtbar.add(e.target); e.target.classList.add('kapitel-an'); } else sichtbar.delete(e.target); }
    const text = kapitel.find((k) => sichtbar.has(k))?.dataset.kapitel || '';
    if (anzeige && anzeige.textContent !== text) {
      anzeige.textContent = text; anzeige.classList.remove('neu'); void anzeige.offsetWidth; anzeige.classList.add('neu');
    }
  }, { rootMargin: '-30% 0px -60% 0px' });
  kapitel.forEach((k) => beob.observe(k));
}
```

### 7.6 Wunsch-Baukasten → fertige Nachricht (WhatsApp, SMS, Mail)

Auswahl als Radioknöpfe; daraus wird ein Text, den der Gast **vor dem Senden
ändern** kann. Eigene Änderungen bleiben erhalten — eine neue Wahl ersetzt
nur ihre Zeile. Die Nummer steht an genau einer Stelle (`data-whatsapp`).

```js
const form = document.getElementById('wunsch');
if (form) {
  const feld = form.querySelector('textarea'), senden = form.querySelector('[data-whatsapp]');
  const wert = (n) => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const ZEILEN = { groesse: 'Größe', art: 'Art', zeit: 'Wunschzeit' };            // name → Beschriftung
  const zeilen = () => Object.fromEntries(Object.entries(ZEILEN).map(([n, k]) => [k, wert(n)]));
  const vorlage = () => ['Hallo, ich möchte gern anfragen:',
    ...Object.entries(zeilen()).map(([k, v]) => k + ': ' + v), 'Vielen Dank!'].join('\n');
  let vonHand = false;
  const link = () => { senden.href = 'https://wa.me/' + senden.dataset.whatsapp + '?text=' + encodeURIComponent(feld.value.trim()); };
  form.addEventListener('change', (e) => {
    if (e.target === feld) return;
    if (!vonHand) feld.value = vorlage();
    else if (ZEILEN[e.target.name]) { const k = ZEILEN[e.target.name];
      feld.value = feld.value.replace(new RegExp('^' + k + ': .*$', 'm'), k + ': ' + zeilen()[k]); }
    link();
  });
  feld.addEventListener('input', () => { vonHand = feld.value !== vorlage(); link(); });
  form.addEventListener('submit', (e) => e.preventDefault());
  feld.value = vorlage(); link();
}
```

Ausweg „Text kopieren“ (`navigator.clipboard`) mit Rückmeldung, die nach 5 s
verschwindet. Ohne Skript: fertiger Beispieltext und `href` mit dem Anfang
der Nachricht.

### 7.7 Einhängen beim Hereinscrollen

```js
const regal = document.querySelector('.regal');
if (regal && 'IntersectionObserver' in window && !ruhig && regal.getBoundingClientRect().top > innerHeight) {
  const teile = [...regal.querySelectorAll('.etikett')];
  teile.forEach((e, i) => e.style.setProperty('--i', i));   // setProperty — Object.assign(style) ignoriert Variablen still
  regal.classList.add('wartet');
  const beob = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    beob.disconnect(); regal.classList.add('da');
    setTimeout(() => regal.classList.remove('wartet', 'da'), 600 + (teile.length - 1) * 220 + 50);   // danach Hover frei
  }, { rootMargin: '0px 0px -15% 0px' });
  beob.observe(regal);
}
```

Nur, wenn das Element beim Laden noch nicht im Bild ist — sonst sieht der
Besucher es erst verschwinden.

### 7.8 Weiche Nachführung für alles, was dem Scrollen folgt

Grobe Scroll-Schritte am Handy ruckeln sonst. Exponentiell nachführen, ohne
Überschwingen:

```js
function nachfuehren(anwenden, tau = 110) {         // tau in ms
  let ist = 0, ziel = 0, zuletzt = 0, bild = 0;
  const schritt = (t) => {
    const dt = zuletzt ? Math.min(64, t - zuletzt) : 16; zuletzt = t;
    ist += (ziel - ist) * (1 - Math.exp(-dt / tau));
    if (Math.abs(ziel - ist) < .0005) ist = ziel;
    anwenden(ist);
    bild = ist === ziel ? 0 : requestAnimationFrame(schritt); if (!bild) zuletzt = 0;
  };
  return (neu) => { ziel = neu; if (!bild) bild = requestAnimationFrame(schritt); };
}
// Beispiel: eine Lichtkante wandert über 320 px Scrollweg hinab und wird schmaler
const kante = document.querySelector('.wander-kante');
if (kante && !ruhig) {
  const strecke = 400;
  const setze = nachfuehren((p) => {
    kante.style.transform = `translate3d(0, ${(strecke * p).toFixed(2)}px, 0) scaleX(${(1 - .6 * p).toFixed(4)})`;
    kante.style.opacity = String(p < .78 ? 1 : Math.max(0, (1 - p) / .22));
  });
  addEventListener('scroll', () => setze(Math.min(1, scrollY / 320)), { passive: true });
}
```

Schein als vorgerechneter Verlauf (`::after` mit `radial-gradient`), nicht als
`drop-shadow` am bewegten Element. Gemessen: 77 statt 8 Einzelbilder, größter
Sprung 1,9 statt 7,4 px.

### 7.9 Auftritt in Dreiergruppen

```js
if (!ruhig && 'IntersectionObserver' in window) {
  const stuecke = [...document.querySelectorAll('.kopfzeile, .karte, .bild, .stimme')];
  stuecke.forEach((el) => el.classList.add('auftritt'));
  const beob = new IntersectionObserver((es) => {
    es.filter((e) => e.isIntersecting).forEach((e, i) => {
      setTimeout(() => e.target.classList.add('auftritt-da'), Math.floor(i / 3) * 90);   // je drei, dann 90 ms
      beob.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  stuecke.forEach((el) => beob.observe(el));
}
```
```css
.auftritt { opacity: 0; transform: translateY(14px); transition: opacity .6s var(--kurve), transform .7s var(--kurve); }
.auftritt-da { opacity: 1; transform: none; }
```

### 7.10 Großes Bild mit Rückkehr an dieselbe Stelle

```js
const dialog = document.getElementById('gross');
if (dialog?.showModal) {
  const img = document.createElement('img'); dialog.prepend(img);        // kein leeres <img> im Quelltext
  let zurueck = null;
  document.addEventListener('click', (e) => {
    const k = e.target.closest('[data-gross]'); if (!k) return;
    zurueck = k; img.src = k.dataset.gross; img.alt = k.querySelector('img')?.alt || ''; dialog.showModal();
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.closest('.zu')) dialog.close(); });
  dialog.addEventListener('close', () => zurueck?.focus());              // Fokus und Stelle bleiben
}
```

Blättern mit Pfeiltasten und Wischen ergänzen; Esc schließt (kann `<dialog>`
von selbst).

### 7.11 Welcher Standort liegt näher? (nur im Browser)

```js
const ORTE = { nord: { name: 'Nord', lat: 52.5200, lon: 13.4050 }, sued: { name: 'Süd', lat: 52.4500, lon: 13.3800 } };   // Beispielwerte
const km = (a, b) => { const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h)); };
document.getElementById('finder')?.addEventListener('click', () => navigator.geolocation?.getCurrentPosition((p) => {
  const ich = { lat: p.coords.latitude, lon: p.coords.longitude };
  const [ort] = Object.entries(ORTE).sort((a, b) => km(ich, a[1]) - km(ich, b[1]))[0];
  document.getElementById('ort-' + ort)?.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'center' });
}, () => {}, { timeout: 10000, maximumAge: 300000 }));
```

Koordinaten aus OpenStreetMap auf die Hausnummer genau. Im Datenschutz
erwähnen: Der Standort verlässt das Gerät nicht.

### 7.12 Gemerkte Wahl über Seiten hinweg

```js
const merken = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const holen  = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const aus_adresse = new URLSearchParams(location.search).get('ort');
const ort = aus_adresse || holen('ort');
if (ort) document.querySelector(`input[name="ort"][value="${CSS.escape(ort)}"]`)?.click();
document.addEventListener('change', (e) => { if (e.target.name === 'ort') merken('ort', e.target.value); });
```

`?ort=…` und `#gruppe` in Links verwenden, damit Vorschau-Etiketten direkt in
die passende Stelle der Karte führen.

---

## 8. Bewegung mit Regie

- Nur `ease-out`. Kein Federn, kein Zurückschwingen. **Auftritt bremst aus,
  Abgang beschleunigt.**
- Nur `transform` und `opacity` animieren, nie Layout-Eigenschaften.
- Dauern 0,3–0,9 s; Endlosschleifen deutlich langsamer.
- **Höchstens drei Bewegungen gleichzeitig** — der Rest ~90 ms später.
  Gemessen, nicht geschätzt.
- **Kamerafahrt heran, nie heraus** — am Rand stehen Steckdosen und Kabel.
- Hover nur hinter `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion`: Sinnloses (Partikel, Dampf) **abschalten**,
  nicht einfrieren.
- Tempo aus gemessenen Werten rechnen, sobald die Strecke vom Inhalt abhängt.
- Ein Moment pro Seite darf groß sein (Vorhang, LED zieht sich, Lichtstreif).
  Alles andere ist leiser.

---

## 9. Detailliste: was Arbeiten von Vorlagen unterscheidet

- Zwei feine Linien statt einer dicken (Rahmen + äußerer Faden).
- Eine dunkle Fuge zwischen Rahmen und Bild.
- Glanz mit `mix-blend-mode: screen`, nie als weiße Fläche.
- Zahlen in `tabular-nums lining-nums`, Preise rechtsbündig.
- Gesperrte Versalien mit `margin-right: -[spacing]`, damit sie optisch mittig
  stehen.
- `text-wrap: balance` für Überschriften, harte Umbrüche nur an Bedeutungsgrenzen
  (`.zeilenrest { display: block }` erst ab der Breite, wo es gut aussieht).
- Fieldset-Legende mit `float: left`, damit sie nicht die Rahmenlinie
  zerschneidet.
- Mehr Luft über einer Überschrift als darunter.
- Fokusrahmen sichtbar und schön (`outline-offset: 3–4px` in der Leitfarbe).
- `::selection` und `scrollbar-color` in den Farben der Seite.
- `theme-color` passend zum ersten Bildschirm.
- Favicon als Ausschnitt des Zeichens, nicht als Verkleinerung.
- Bilder vorab dekodieren (`img.decode()`), bevor sie gewechselt werden.
- `svh` statt `vh` für den ersten Bildschirm am Handy.
- `text-size-adjust: 100%` gegen aufgeblähte Schrift in App-Browsern.
- Leerzustand und Ladezustand sind dieselbe, fertige Ansicht.
- Jedes Ornament `aria-hidden="true"`, jede Klickfläche mit Namen.

---

## 10. Messen statt behaupten

**Vor jeder Fertigmeldung:**

1. Aufnahmen bei 1440 **und** 390 px — angesehen, nicht nur erzeugt. Vorher
   alle Auftritte abschließen (`auftritt-da` setzen, 1,2 s warten).
2. Detektor: `node .claude/skills/impeccable/scripts/detect.mjs --json .` →
   `[]` oder jede Meldung begründet.
3. Kontrast gegen den gerenderten Grund (Aufnahme ohne Text, hellste Stelle
   hinter jeder Zeile).
4. Überbreite bei 390 und 360 px: kein Element rechts über den Rand.
5. Konsole: `pageerror` und `console.error` leer.
6. Bewegung: gleichzeitig laufende Animationen zählen (`document.getAnimations()`
   pro Bild), Einzelbilder einer Scroll-Folge messen.
7. Verhalten: ohne Skript, mit reduzierter Bewegung, mit Tastatur, mit Touch.
8. **Unverändertes bleibt pixelgleich** — vor und nach einer Änderung Aufnahmen
   anderer Größen vergleichen (`ImageChops.difference(a, b).getbbox() is None`).

**Verbesserung belegen — alt → neu in einer Tabelle:** Wörter im ersten
Bildschirm · Knöpfe im ersten Bildschirm · Höhe je Abschnitt · Abstand bis zum
ersten Anschaulichen · Anzahl Kästen · Preisangaben pro Leistung ·
Verhältnis Überschrift : Text. Wird eine Zahl schlechter, wird nachgebessert,
bevor es fertig heißt.

Beispiel aus einem Salon-Projekt (Handy 390 × 844): Wörter im ersten
Bildschirm 50 → 24, Knöpfe 2 → 1, Startseite 11 301 → 8 898 px,
Preisvorschau 1 803 → 827 px, Preisliste 106 Kästen → 0.

---

## 11. Fallen

| Falle | Auflösung |
|---|---|
| `#` in einer SVG-Daten-URI → Bild bleibt still leer | `%23` |
| Mehrere Inline-Kopien desselben SVG teilen IDs | ID-Präfix je Einsatz |
| CSS-`stroke` überschreibt das `stroke`-Attribut | Farbe am Element, Breite in CSS |
| `pathLength` + `non-scaling-stroke` strichelt in Chrome falsch | Kanten als Elemente mit `scale` |
| `overflow: hidden` mit Rundung schneidet in Safari animierte Bilder eckig | zusätzlich `clip-path: inset(0 round …)` |
| CSS-Animation mit `forwards` überschreibt Inline-Stile aus dem Skript | nur Wartezeit abdecken (`backwards`) |
| `Object.assign(el.style, {'--x': …})` wird still ignoriert | `style.setProperty('--x', …)` |
| `z-index: -1` verschwindet hinter dem `body`-Hintergrund | Elternteil `isolation: isolate` |
| `backdrop-filter` macht ein Element zum Bezugsrahmen für `position: fixed` darin | am Handy ohne Filter oder Struktur ändern |
| Variable an `<html>` beim Scrollen → ganze Seite neu berechnet | am betroffenen Element setzen |
| `drop-shadow` auf bewegtem Element ruckelt | Schein als Verlauf |
| Verlauf mit letztem Halt vor 100 % → harte Linie am Kasten | Ellipse innerhalb des Kastens auslaufen lassen |
| Radialer Verlauf hinter breitem Text — Enden schon bei 82 % | senkrechtes Band statt Ellipse |
| Wischreihe in Flex-Spalte mit `align-items: start` → Seite überbreit | `align-items: stretch` |
| `[hidden]` verliert gegen Klassen mit `display` | `[hidden] { display: none !important; }` |
| `position: sticky` meldet über `offsetTop` die Klebeposition | festen Anker davor messen |
| `setPointerCapture` lenkt `click` auf das Capture-Ziel | gedrücktes Element bei `pointerdown` merken |
| `<details name>` schließt beim Messen alle anderen | zum Messen `name` entfernen, `checkVisibility()` |
| Neue Klasse mit vergebenem Namen zerlegt eine andere Seite | vor dem Benennen `grep` über alle Seiten |
| Zwei Regeln mit demselben Selektor, die zweite gewinnt still | nach dem Einfügen `grep -c` |
| Spezifischere Nachbarregel hebelt Ein-Klassen-Regel aus | Elternselektor davor, nicht `!important` |
| Unsichtbarer Vorhang fängt Klicks | am Ende aus dem Bild schieben |
| Helle Hover-Flächen aus einer hellen Vorgängerfassung | gezielt nach hohen Hellwerten suchen |
| `box-shadow: inset 0 0 0 1px` gilt dem Detektor als Glühen | `border` |
| Stückpreis („pro Stück“) landet als „ab“-Preis | beim Minimum `pro …` ausschließen |
| Dasselbe Foto zweimal auf einer Seite | nach jedem Tausch alle `src` vergleichen |
| Standbild aus einem Video als großes Foto | Kantenenergie messen (§ 4.2), sonst klein |
| 16:9-Film am Hochkantschirm zeigt einen Streifen | dort Standbilder mit eigenem Zuschnitt |
