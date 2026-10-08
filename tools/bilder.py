#!/usr/bin/env python3
"""Bereitet die Salonfotos auf — einheitlicher Look für alle Seiten.

    python3 tools/bilder.py <ordner-mit-originalen>

Erwartet im Ordner die Originale (Planity-Uploads der Salons in 4032 px und die
älteren 900-px-Fotos der alten Website, Dateinamen siehe QUELLEN). Schreibt
WebP in assets/img. Läuft nur beim Bauen, nicht auf der Seite.

Look: kühles, neutrales Weiß, tiefe Schwarztöne, Lila und Magenta entsättigt
(Leitfarbe ist das Blau aus dem Leuchtschild), ein Hauch Blau in den Schatten,
feine Schärfe. Schwache Fotos (900 px) werden behutsam hochgerechnet,
nachgeschärft und mit feinem Korn versehen, damit sie neben den 4K-Fotos bestehen.
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ZIEL = Path(__file__).resolve().parent.parent / 'assets' / 'img'

QUELLEN = {
    # Planity-Uploads der Salons (4032 px)
    'm10': 'mira_ytviyqj2mwfjbaotgqd5.jpg', 'm5': 'mira_ewuvpz6b8zooktomt7q7.jpg', 'm8': 'mira_tgndctpjpe3siod9v0hx.jpg',
    'm2': 'mira_bz7cjffc1y5ybl2z9trz.jpg', 'neon': 'isartor_lbuaorvpfuzkgf7mcrhx.jpg',
    # Website omers-hair-mira.de (900 px, Wasserzeichen unten rechts bzw. Logo oben rechts)
    'mira-front': 'Omers-Hair-Mira-05.jpg', 'mira-lang': 'Omers-Hair-Mira-03.jpg', 'mira-reihe': 'Omers-Hair-Mira-04.jpg',
    'mira-wasch': 'Omers-Hair-Mira-01.jpg', 'mira-empfang': 'Omers-Hair-Mira-02.jpg',
    'b-front': 'Barber-Shop-im-Mira-3.jpg', 'b-stuehle': 'Barber-Shop-im-Mira-1.jpg', 'b-raum': 'Barber-Shop-im-Mira-2.jpg',
    'bo-front': 'Omers-Hair-Richard-Strauss-Str-D.jpg', 'ri-tresen': 'Omers-Hair-Riem-Arcaden-05.jpg',
    'ri-front': 'riem-front.png',   # Foto vom Kunden (Google), Ladenfront Riem Arcaden
    **{f'ri-{i}': f'Omers-Hair-Riem-Arcaden-0{i}.jpg' for i in range(1, 6)},
    # Website, 1600 px
    'i-raum': 'PHOTO-2024-09-11-11-04-29-2.jpg', 'i-boegen': 'PHOTO-2024-09-11-11-04-31-5.jpg', 'i-gang': 'PHOTO-2024-09-11-11-04-31.jpg',
}


def rgb_hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-6), 0)
    return h, s, mx


def hsv_rgb(h, s, v):
    c = v * s
    x = c * (1 - np.abs((h / 60) % 2 - 1))
    m = v - c
    z = np.zeros_like(h)
    i = (h // 60).astype(int) % 6
    r = np.choose(i, [c, x, z, z, x, c]); g = np.choose(i, [x, c, c, x, z, z]); b = np.choose(i, [z, z, x, c, c, x])
    return np.stack([r + m, g + m, b + m], -1)


def look(im: Image.Image, hell=1.0, kontrast=1.0, nacht=0.0) -> Image.Image:
    a = np.asarray(im).astype(np.float32) / 255
    # 1. Weißabgleich an den hellen, wenig gesättigten Flächen (Wände, Fliesen) → neutral bis leicht kühl
    h, s, v = rgb_hsv(a)
    maske = (v > 0.55) & (s < 0.22)
    if maske.mean() > 0.02:
        mittel = a[maske].mean(0)
        ziel = mittel.mean()
        a = a * (ziel / mittel) * np.array([0.985, 1.0, 1.02])
    a = np.clip(a * hell, 0, 1)
    # 2. Farbtöne: Lila/Magenta fast grau, Warmes gedämpft, Blau leicht kräftiger
    h, s, v = rgb_hsv(a)
    faktor = np.ones_like(h)
    faktor = np.where((h > 255) & (h < 345), 0.12, faktor)          # Lila, Magenta
    faktor = np.where((h >= 345) | (h < 20), 0.7, faktor)           # Rot
    faktor = np.where((h >= 20) & (h < 65), 0.72, faktor)           # Orange, Gelb, Holz
    faktor = np.where((h >= 190) & (h < 255), 1.15, faktor)         # Blau
    a = hsv_rgb(h, np.clip(s * faktor * 0.9, 0, 1), v)
    # 3. Tonkurve: sanftes S, tiefe Schwärzen, Lichter nicht ausfressen
    k = 0.18 * kontrast
    a = np.clip(a, 0, 1)
    a = a + k * (a - 0.5) * (1 - np.abs(2 * a - 1))
    a = 0.03 + a * 0.94
    # 4. Blau in den Schatten (Leuchtschild-Blau #5b8cff, sehr schwach)
    lum = (a @ np.array([0.299, 0.587, 0.114]))[..., None]
    schatten = np.clip(1 - lum * 2.2, 0, 1) ** 1.5
    a = a + schatten * np.array([-0.012, 0.004, 0.035])
    # 4b. Nacht: dunkler, kühler, Blau leuchtet (für Ladenfronten im Ring)
    if nacht:
        lum = (a @ np.array([0.299, 0.587, 0.114]))[..., None]
        h2, s2, v2 = rgb_hsv(a)
        blau = ((h2 > 200) & (h2 < 250) & (s2 > 0.35))[..., None]
        a = a * (1 - 0.32 * nacht) + (lum ** 1.6) * 0.18 * nacht           # Mitten dunkler, Lichter bleiben
        a = a + np.array([-0.02, 0.0, 0.05]) * nacht * (1 - lum)            # kühle Schatten
        a = np.where(blau, np.clip(a * np.array([0.9, 1.05, 1.25]), 0, 1), a)  # Leuchtschild kräftiger
    # 5. leichte Vignette
    hh, ww = a.shape[:2]
    y, x = np.ogrid[:hh, :ww]
    r = np.sqrt(((x - ww / 2) / (ww / 2)) ** 2 + ((y - hh / 2) / (hh / 2)) ** 2)
    a = a * (1 - (0.16 + 0.3 * nacht) * np.clip(r - 0.45, 0, 1) ** 1.6)[..., None]
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


def zuschnitt(im, box):
    """box in Anteilen des Bildes: (links, oben, rechts, unten)."""
    w, h = im.size
    return im.crop((round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h)))


def auf_format(im, ratio, fx=0.5, fy=0.5):
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio); x = round((w - nw) * fx); return im.crop((x, 0, x + nw, h))
    nh = round(w / ratio); y = round((h - nh) * fy); return im.crop((0, y, w, y + nh))


def schwach_aufwerten(im, breite):
    """900-px-Fotos: hochrechnen, Kanten nachziehen, feines Korn gegen den Plastiklook."""
    im = im.resize((breite, round(im.height * breite / im.width)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    a = np.asarray(im).astype(np.float32)
    rng = np.random.default_rng(7)
    korn = rng.normal(0, 3.2, a.shape[:2])[..., None]
    return Image.fromarray(np.clip(a + korn, 0, 255).astype(np.uint8))


def schreiben(im, name, breiten, q=82):
    for b in breiten:
        b = min(b, im.width)
        out = im.resize((b, round(im.height * b / im.width)), Image.LANCZOS)
        out = out.filter(ImageFilter.UnsharpMask(radius=0.8, percent=45, threshold=1))
        out.save(ZIEL / f'{name}-{b}.webp', quality=q, method=6)
        print(f'{name}-{b}.webp', out.size)


def ohne_zeichen(im):
    """Wasserzeichen der alten Website liegt im unteren Streifen: abschneiden."""
    return im.crop((0, 0, im.width, round(im.height * 0.875)))


def retusche(im, box, dx):
    """Wasserzeichen übermalen statt wegschneiden: Fläche daneben (um dx verschoben) weich einblenden."""
    im = im.copy()
    x1, y1, x2, y2 = box
    flick = im.crop((x1 - dx, y1, x2 - dx, y2))
    maske = Image.new('L', flick.size, 0)
    from PIL import ImageDraw
    ImageDraw.Draw(maske).rectangle((8, 8, flick.width - 8, flick.height - 8), fill=255)
    im.paste(flick, (x1, y1), maske.filter(ImageFilter.GaussianBlur(6)))
    return im


def front(im, ratio=4 / 3, fx=0.5, fy=0.5, breite=1600):
    """Ladenfront: ganzes Bild, nur auf 4:3 gebracht, natürliche Helligkeit, behutsam hochgerechnet."""
    im = auf_format(im, ratio, fx, fy)
    if im.width < breite:
        im = schwach_aufwerten(im, breite)
    return look(im, kontrast=1.08, nacht=0.22)


def main(quelle: Path):
    lade = lambda k: ImageOps.exif_transpose(Image.open(quelle / QUELLEN[k])).convert('RGB')
    klein = lambda im, b: schwach_aufwerten(im, b)

    # Ladenfronten (Ring und oberstes Bild der Salonseiten), 4:3, ganz sichtbar
    schreiben(front(retusche(lade('mira-front'), (700, 525, 900, 600), 230), fx=0.6), 'front-mira', (800, 1600))
    schreiben(front(retusche(lade('b-front'), (690, 520, 900, 600), 240), fx=0.5), 'front-barber', (800, 1600))
    schreiben(front(retusche(lade('bo-front'), (700, 525, 900, 600), 240), fx=0.75), 'front-bogenhausen', (800, 1600))
    schreiben(front(lade('ri-front'), fy=0.4), 'front-riem', (800, 1600))
    schreiben(front(lade('neon'), fy=0.28), 'front-isartor', (800, 1600))

    # Galerie MIRA: drei Fotos
    for k, n in (('mira-reihe', 'mira-reihe'), ('mira-wasch', 'mira-wasch')):
        schreiben(look(klein(auf_format(ohne_zeichen(lade(k)), 3 / 2), 1500), kontrast=1.12), n, (900, 1500))
    schreiben(look(auf_format(lade('m8'), 3 / 2)), 'mira-herren', (900, 1800))

    # Galerie Isartor
    schreiben(look(auf_format(lade('i-raum'), 3 / 2), kontrast=1.1), 'isartor-raum', (900, 1600))
    schreiben(look(auf_format(lade('i-gang'), 3 / 2), kontrast=1.1), 'isartor-gang', (900, 1600))
    schreiben(look(auf_format(lade('i-boegen'), 3 / 2, fy=0.45), kontrast=1.1), 'isartor-boegen', (900, 1200))

    # Galerie Barber: das bessere Foto
    schreiben(look(klein(auf_format(ohne_zeichen(lade('b-stuehle')), 3 / 2), 1500), kontrast=1.15), 'barber-stuehle', (900, 1500))

    # Riem: vorerst nur ein Bild für die Instagram-Kachel; die Seite folgt später (dann range(1, 6))
    for i in (3,):
        im = lade(f'ri-{i}')
        im = im.crop((0, round(im.height * 0.13), im.width, im.height))   # Logo-Streifen oben
        schreiben(look(klein(auf_format(im, 3 / 2), 1500), kontrast=1.1), f'riem-{i}', (900, 1500))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    main(Path(sys.argv[1]))
