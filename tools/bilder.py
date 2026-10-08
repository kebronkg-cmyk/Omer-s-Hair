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
    'm10': 'mira_ytviyqj2mwfjbaotgqd5.jpg',   # Stuhl mit Logo, nah
    'm5': 'mira_ewuvpz6b8zooktomt7q7.jpg',    # Stuhlreihe mit Lichtsäulen
    'm8': 'mira_tgndctpjpe3siod9v0hx.jpg',    # Barber-Stühle
    'm7': 'mira_qrmmiwxgb8arx5kdcowt.jpg',    # Waschplätze frontal
    'm2': 'mira_bz7cjffc1y5ybl2z9trz.jpg',    # Werkzeug am Platz
    'm9': 'mira_xsnxoqot16zemvnd29uz.jpg',    # Glastische
    'm3': 'mira_cbv4rzizv94c29mfwnjm.jpg',    # Empfang
    'm6': 'mira_jhatbcnotwbbfv4vqwfl.jpg',    # Produktregal mit Lichtleiste
    'neon': 'isartor_lbuaorvpfuzkgf7mcrhx.jpg',  # Leuchtschild Isartor
    'i-raum': 'PHOTO-2024-09-11-11-04-31-900x600.jpg',
    'i-spiegel': 'PHOTO-2024-09-11-11-04-29-2-900x600.jpg',
    'i-empfang': 'PHOTO-2024-09-11-11-04-30-900x600.jpg',
    'b-stuehle': 'Barber-Shop-im-Mira-1.jpg',
    'b-raum': 'Barber-Shop-im-Mira-2.jpg',
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


def look(im: Image.Image, hell=1.0, kontrast=1.0) -> Image.Image:
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
    # 5. leichte Vignette
    hh, ww = a.shape[:2]
    y, x = np.ogrid[:hh, :ww]
    r = np.sqrt(((x - ww / 2) / (ww / 2)) ** 2 + ((y - hh / 2) / (hh / 2)) ** 2)
    a = a * (1 - 0.16 * np.clip(r - 0.55, 0, 1) ** 1.6)[..., None]
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


def main(quelle: Path):
    lade = lambda k: ImageOps.exif_transpose(Image.open(quelle / QUELLEN[k])).convert('RGB')

    # Karten im Ring (4:5)
    schreiben(look(auf_format(lade('m5'), 0.8, 0.42)), 'karte-mira', (640, 1200))
    schreiben(look(auf_format(lade('neon'), 0.8, 0.5, 0.3), hell=1.02), 'karte-isartor', (640, 1200))
    b = lade('b-stuehle').crop((0, 0, 900, 560))      # Wasserzeichen unten rechts weg
    schreiben(look(schwach_aufwerten(auf_format(b, 0.8, 0.3), 1000), kontrast=1.2), 'karte-barber', (640, 1000))

    # Spiegelbilder der Standortseiten (4:5)
    schreiben(look(auf_format(lade('m10'), 0.8, 0.78)), 'ort-mira', (700, 1400))
    schreiben(look(auf_format(lade('neon'), 0.8, 0.5, 0.18), hell=1.02), 'ort-isartor', (700, 1400))
    schreiben(look(schwach_aufwerten(auf_format(lade('b-stuehle').crop((0, 0, 900, 560)), 0.8, 0.12), 1000), kontrast=1.2), 'ort-barber', (640, 1000))

    # Galerie MIRA
    schreiben(look(lade('m5')), 'mira-reihe', (900, 1800))
    schreiben(look(lade('m8')), 'mira-herren', (900, 1800))
    schreiben(look(lade('m7')), 'mira-wasch', (900, 1800))
    schreiben(look(auf_format(lade('m2'), 0.8, 0.3)), 'mira-werkzeug', (700, 1400))
    schreiben(look(zuschnitt(lade('m9'), (0.42, 0.28, 1.0, 1.0))), 'mira-tische', (900, 1800))
    schreiben(look(zuschnitt(lade('m3'), (0.12, 0.08, 0.88, 1.0)), hell=0.98), 'mira-empfang', (900, 1800))
    schreiben(look(zuschnitt(lade('m6'), (0.0, 0.12, 1.0, 0.86))), 'mira-pflege', (900, 1800))

    # Galerie Isartor (ältere 900-px-Fotos, aufgewertet)
    schreiben(look(schwach_aufwerten(lade('i-raum'), 1500), kontrast=1.15), 'isartor-raum', (900, 1500))
    schreiben(look(schwach_aufwerten(zuschnitt(lade('i-spiegel'), (0.0, 0.0, 0.62, 1.0)), 1100), kontrast=1.15), 'isartor-spiegel', (700, 1100))
    schreiben(look(schwach_aufwerten(zuschnitt(lade('i-empfang'), (0.33, 0.47, 0.82, 0.97)), 1100), kontrast=1.2), 'isartor-tresen', (700, 1100))

    # Galerie Barber
    schreiben(look(schwach_aufwerten(lade('b-raum').crop((0, 0, 900, 540)), 1500), kontrast=1.2), 'barber-raum', (900, 1500))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    main(Path(sys.argv[1]))
