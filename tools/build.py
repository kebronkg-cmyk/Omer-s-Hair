#!/usr/bin/env python3
"""Erzeugt alle Seiten aus einer Datenquelle.

    python3 tools/build.py

Alle Angaben zu den Betrieben stehen nur hier (SALONS). Startseite, Fuß,
schema.org-Daten und Öffnungsstand werden daraus gebaut, damit nirgends
widersprüchliche Angaben entstehen. Die erzeugten HTML-Dateien sind statisch
und brauchen zur Laufzeit keinen Server.
"""
from __future__ import annotations

import html
import json
from pathlib import Path
from urllib.parse import quote_plus

WURZEL = Path(__file__).resolve().parent.parent

# Solange die Seite eine Vorschau ist: nicht in Suchmaschinen aufnehmen
# (die alten Seiten sind noch online). Zum Livegang auf False setzen.
VORSCHAU = True

INSTAGRAM = 'https://www.instagram.com/omers_hair_professional/'
INSTAGRAM_MIRA = 'https://www.instagram.com/omershair_professional_mira/'
MAIL = 'info@omers-hair-mira.de'
FIRMA = "Omer's Hair Professional GmbH"

# Öffnungszeiten: Wochentag (0 = Sonntag) → Liste von [von, bis] in Stunden
def mo_sa(von, bis):
    return {str(t): [[von, bis]] for t in range(1, 7)} | {'0': []}

SALONS = [
    dict(
        id='mira', name='Salon MIRA', kurz='Salon MIRA', lage='MIRA · Untergeschoss',
        strasse='Schleißheimer Str. 506', zusatz='Untergeschoss, MIRA Einkaufszentrum', plz='80933', ort='München',
        tel='089 54 80 56 06', tel_int='+498954805606',
        zeiten=mo_sa(9.5, 20), zeiten_text='Mo–Sa 9:30–20:00',
        buchen='https://www.planity.com/de-DE/friseur-omers-hair-80933-munchen',
        seite='mira/', bild='mira-spiegelreihe', bild_alt='Lange Reihe beleuchteter Spiegel im Salon MIRA',
        lat=48.2132741, lon=11.5632254, licht='mira',
    ),
    dict(
        id='barber-mira', name='Barber Shop MIRA', kurz='Barber Shop MIRA', lage='MIRA · Erdgeschoss',
        strasse='Schleißheimer Str. 506', zusatz='Erdgeschoss, MIRA Einkaufszentrum', plz='80933', ort='München',
        tel='089 54 80 56 05', tel_int='+498954805605',
        zeiten=mo_sa(9.5, 20), zeiten_text='Mo–Sa 9:30–20:00',
        buchen=None,
        seite='barber-mira/', bild='barber-stuehle', bild_alt='Barber-Stühle aus Leder vor Holztresen im Barber Shop MIRA',
        lat=48.2132741, lon=11.5632254, licht='barber',
    ),
    dict(
        id='isartor', name='Salon Isartor', kurz='Salon Isartor', lage='Altstadt · Isartor',
        strasse='Zweibrückenstr. 5–7', zusatz='Breiterhof-Passage', plz='80331', ort='München',
        tel='089 621 46 46 9', tel_int='+498962146469',
        zeiten=mo_sa(9, 19), zeiten_text='Mo–Sa 9:00–19:00',
        buchen='https://www.planity.com/de-DE/friseur-omers-hair-isartor-80331-munchen',
        seite='isartor/', bild='isartor-spiegel', bild_alt='Bogenspiegel mit Lichtkante und goldenen Stäben im Salon Isartor',
        lat=48.1335879, lon=11.5839159, licht='isartor',
    ),
    dict(
        id='bogenhausen', name='Salon Forum Bogenhausen', kurz='Forum Bogenhausen', lage='Bogenhausen · Forum',
        strasse='Richard-Strauss-Str. 80', zusatz='', plz='81679', ort='München',
        tel='089 999 19 014', tel_int='+498999919014',
        zeiten={'1': [[9, 19]], '2': [[9, 19]], '3': [[9, 19]], '4': [[9, 19]], '5': [[9, 19]], '6': [[9, 16]], '0': []},
        zeiten_text='Mo–Fr 9:00–19:00 · Sa 9:00–16:00',
        buchen=None, extern='https://omers-hair.de/friseur-muenchen-bogenhausen-im-forum/',
        seite=None, bild='bogenhausen', bild_alt='Bogenhausen: Stahlskulptur am Effnerplatz vor den Hochhäusern',
        lat=48.1480293, lon=11.6177788, licht='bogenhausen',
    ),
    dict(
        id='riem', name='Salon Riem Arcaden', kurz='Riem Arcaden', lage='Messestadt · Riem Arcaden',
        strasse='Willy-Brandt-Platz 5', zusatz='Riem Arcaden', plz='81829', ort='München',
        tel='089 46 13 87 87', tel_int='+498946138787',
        zeiten=mo_sa(10, 20), zeiten_text='Mo–Sa 10:00–20:00',
        buchen=None, extern='https://omers-hair.de/salon-riem-arcaden/',
        seite=None, bild='riem', bild_alt='Eingang der Riem Arcaden in der Messestadt',
        lat=48.1320182, lon=11.6916357, licht='riem',
    ),
]
S = {s['id']: s for s in SALONS}

BILDBREITEN = {  # verfügbare Breiten je Bild (480 + groß)
    'bogenhausen': (480, 782), 'riem': (480, 782),
}

TAGE = [('1', 'Montag'), ('2', 'Dienstag'), ('3', 'Mittwoch'), ('4', 'Donnerstag'), ('5', 'Freitag'), ('6', 'Samstag'), ('0', 'Sonntag')]

# ---------------------------------------------------------------- Bausteine

ICO = {
    'kalender': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    'telefon': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 3.5h3.1l1.6 4.3-2.2 1.5a11.5 11.5 0 0 0 7 7l1.5-2.2 4.3 1.6v3.1a2 2 0 0 1-2.1 2A16.6 16.6 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1Z"/></svg>',
    'route': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    'pfeil': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    'extern': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 16 16 8M9.5 8H16v6.5"/></svg>',
    'insta': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>',
    'stern': '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3.2 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.5l6.1-.7Z"/></svg>',
    'ort': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="7"/></svg>',
    'zu': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    'links': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    'rechts': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    'schere': '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="6.5" cy="17" r="2.8"/><circle cx="17.5" cy="17" r="2.8"/><path d="M8.5 15 17 3.5M15.5 15 7 3.5"/></svg>',
}

e = html.escape


def route(s):
    ziel = f"{s['strasse']}, {s['plz']} {s['ort']}".replace('–', '-')
    return 'https://www.google.com/maps/dir/?api=1&destination=' + quote_plus(f"Omer's Hair, {ziel}")


def karte_embed(s):
    ziel = f"Omer's Hair, {s['strasse']}, {s['plz']} {s['ort']}".replace('–', '-')
    return 'https://www.google.com/maps?q=' + quote_plus(ziel) + '&output=embed'


def bild(name, alt, p, groessen='(max-width: 40rem) 90vw, 33vw', laden='lazy', klasse='', prio=False):
    k, g = BILDBREITEN.get(name, (480, 900))
    attr = f' class="{klasse}"' if klasse else ''
    fp = ' fetchpriority="high"' if prio else ''
    return (f'<img{attr} src="{p}assets/img/{name}-{g}.webp" srcset="{p}assets/img/{name}-{k}.webp {k}w, {p}assets/img/{name}-{g}.webp {g}w" '
            f'sizes="{groessen}" alt="{e(alt)}" loading="{laden}" decoding="async"{fp}>')


def zeiten_attr(s):
    return e(json.dumps(s['zeiten'], separators=(',', ':')))


def spiegel(s, p, href=None, laden='lazy', groessen='(max-width: 64rem) 72vw, 18vw', prio=False, extern=False):
    innen = (f'<span class="spiegel-glas">{bild(s["bild"], s["bild_alt"], p, groessen, laden, prio=prio)}'
             f'<span class="spiegel-licht"></span></span><span class="spiegel-led" aria-hidden="true"></span>')
    if href:
        zusatz = ' rel="noopener"' if extern else ''
        name = s['name'] + (' auf omers-hair.de' if extern else '')
        return f'<a class="spiegel" data-licht="{s["licht"]}" href="{href}"{zusatz} aria-label="{e(name)}" tabindex="-1">{innen}</a>'
    return f'<div class="spiegel" data-licht="{s["licht"]}">{innen}</div>'


# ---------------------------------------------------------------- Rahmen

def kopf(p, titel, beschreibung, *, ldjson=None, welt=None, theme='#0b0a09', bild_og='mira-spiegelreihe'):
    robots = '<meta name="robots" content="noindex, nofollow">\n' if VORSCHAU else ''
    ld = f'<script type="application/ld+json">{json.dumps(ldjson, ensure_ascii=False, separators=(",", ":"))}</script>\n' if ldjson else ''
    welt_attr = f' data-welt="{welt}"' if welt else ''
    return f'''<!doctype html>
<html lang="de" class="js-aus"{welt_attr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(titel)}</title>
<meta name="description" content="{e(beschreibung)}">
{robots}<meta name="theme-color" content="{theme}">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="Omer's Hair Professional">
<meta property="og:title" content="{e(titel)}">
<meta property="og:description" content="{e(beschreibung)}">
<meta property="og:image" content="{p}assets/img/{bild_og}-900.webp">
<link rel="icon" href="{p}assets/img/icon-32.png" sizes="32x32">
<link rel="icon" href="{p}assets/img/icon-512.png" sizes="512x512">
<link rel="apple-touch-icon" href="{p}assets/img/icon-180.png">
<link rel="preload" href="{p}assets/fonts/jost-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{p}assets/css/site.css">
<script src="{p}assets/js/site.js" defer></script>
{ld}</head>
'''


def leiste(p, aktiv=None, termin=None, kapitel=False):
    navi = [('Salons', f'{p}index.html#salons', 'start'), ('Salon MIRA', f'{p}mira/', 'mira'),
            ('Barber Shop', f'{p}barber-mira/', 'barber-mira'), ('Isartor', f'{p}isartor/', 'isartor')]
    li = ''.join(f'<li><a href="{h}"{" aria-current=\"page\"" if k == aktiv else ""}>{t}</a></li>' for t, h, k in navi)
    if termin is None:
        termin = (f'{p}index.html#salons', 'Termin buchen', False)
    href, text, extern = termin
    ext = ' rel="noopener"' if extern else ''
    kap = '<span class="leiste-kapitel" aria-hidden="true"></span>' if kapitel else ''
    return f'''<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<header class="leiste">
  <div class="huelle leiste-innen">
    <a class="marke" href="{p}index.html" aria-label="Omer's Hair Professional – Startseite"><img src="{p}assets/img/logo-hell.webp" alt="Omer's Hair Professional" width="398" height="178"></a>
    <nav aria-label="Hauptnavigation"><ul class="navi">{li}</ul></nav>
    {kap}
    <a class="knopf knopf-klein" href="{href}"{ext}>{ICO["kalender"]}<span>{text}</span></a>
  </div>
</header>
'''


def fuss(p):
    orte = []
    for s in SALONS:
        if s['seite']:
            titel = f'<a href="{p}{s["seite"]}">{e(s["name"])}</a>'
        else:
            titel = f'<a href="{s["extern"]}" rel="noopener">{e(s["name"])} <span class="nur-vorleser">(omers-hair.de)</span></a>'
        zusatz = {'mira': 'MIRA, Untergeschoss<br>', 'barber-mira': 'MIRA, Erdgeschoss<br>'}.get(s['id'], '')
        orte.append(f'''<li><h3>{titel}</h3><address>{e(s["strasse"])}<br>{zusatz}{s["plz"]} {s["ort"]}</address>
<p><a class="tel" href="tel:{s["tel_int"]}">{s["tel"]}</a><br>{e(s["zeiten_text"])}</p></li>''')
    return f'''<footer class="fuss">
  <div class="huelle">
    <div class="fuss-kopf">
      <img src="{p}assets/img/logo-hell.webp" alt="Omer's Hair Professional" width="398" height="178" loading="lazy">
      <span class="hand">Schön, dass Sie da waren.</span>
    </div>
    <ul class="fuss-orte">{''.join(orte)}</ul>
    <div class="fuss-unten">
      <span>© <span data-jahr>2026</span> {e(FIRMA)}</span>
      <ul>
        <li><a href="{INSTAGRAM}" rel="noopener">Instagram</a></li>
        <li><a href="mailto:{MAIL}">{MAIL}</a></li>
        <li><a href="{p}impressum/">Impressum</a></li>
        <li><a href="{p}datenschutz/">Datenschutz</a></li>
      </ul>
    </div>
  </div>
</footer>
'''


def gross_dialog():
    return f'''<dialog class="gross" id="gross" aria-label="Bild groß">
  <figure style="margin:0"><figcaption></figcaption></figure>
  <button class="gross-zu" type="button" aria-label="Schließen">{ICO["zu"]}</button>
  <button class="gross-knopf gross-zurueck" type="button" aria-label="Vorheriges Bild">{ICO["links"]}</button>
  <button class="gross-knopf gross-vor" type="button" aria-label="Nächstes Bild">{ICO["rechts"]}</button>
</dialog>
'''


def ende():
    return '</body>\n</html>\n'


def schema_salon(s, p_abs=''):
    oeff = []
    namen = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '0': 'Sunday'}
    for t, fenster in s['zeiten'].items():
        for a, b in fenster:
            f = lambda h: f'{int(h):02d}:{round((h % 1) * 60):02d}'
            oeff.append({'@type': 'OpeningHoursSpecification', 'dayOfWeek': namen[t], 'opens': f(a), 'closes': f(b)})
    d = {
        '@context': 'https://schema.org', '@type': 'HairSalon',
        'name': f"Omer's Hair Professional – {s['name']}",
        'image': f"assets/img/{s['bild']}-900.webp",
        'telephone': s['tel_int'], 'email': MAIL if s['id'] in ('mira', 'barber-mira', 'isartor') else None,
        'address': {'@type': 'PostalAddress', 'streetAddress': s['strasse'] + (f", {s['zusatz']}" if s['zusatz'] else ''),
                    'postalCode': s['plz'], 'addressLocality': s['ort'], 'addressCountry': 'DE'},
        'geo': {'@type': 'GeoCoordinates', 'latitude': s['lat'], 'longitude': s['lon']},
        'openingHoursSpecification': oeff,
        'sameAs': [INSTAGRAM_MIRA if s['id'] == 'mira' else INSTAGRAM],
        'parentOrganization': {'@type': 'Organization', 'name': FIRMA},
    }
    if s['buchen']:
        d['potentialAction'] = {'@type': 'ReserveAction', 'target': s['buchen']}
    return {k: v for k, v in d.items() if v is not None}


def schreiben(pfad, inhalt):
    ziel = WURZEL / pfad
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(inhalt, encoding='utf-8')
    print('geschrieben:', pfad, f'{len(inhalt.encode()) // 1024} KB')


# ---------------------------------------------------------------- Bewertungen (Planity, Salon MIRA)

STIMMEN = [
    ('Tolle Beratung, super Schnitt und Balayage-Färbung, sehr aufmerksam. Ich bin sehr zufrieden :-)', 'Balayage', 'Februar 2026', 5),
    ('Nada ist einfach nur zauberhaft – von der herzlichen Beratung über den Schnitt! Meine Haare sehen jetzt wieder so wunderschön gepflegt aus.', 'Schnitt & Föhnen', 'März 2025', 5),
    ('Donya und Nada nehmen sich viel Zeit für die Farbberatung! Fachlich top ausgeführt! Habe noch nie so feine Strähnchen bekommen wie dort.', 'Strähnen', 'September 2024', 4),
    ('Vom herzlichen Empfang über den gastfreundlichen Kaffee und natürlich erst recht meine schönen neuen Haare :)', 'Schnitt', 'November 2025', 5),
    ('Wie immer super Schnitt für mich und meinen Sohn! Sehr freundlich und super Friseure!', 'Kinder & Herren', 'August 2026', 5),
    ('Alle sind super nett, gehe gerne dahin. Mit Termin keine Wartezeit.', 'Schnitt', 'August 2026', 5),
    ('Ein kleiner Plausch beim Haarewaschen, saubere Arbeit und ein Lächeln auf den Lippen.', 'Schnitt', 'Januar 2024', 4),
    ('Sima macht ihre Arbeit einfach hervorragend! Alle sind sehr nett, man fühlt sich sehr wohl.', 'Gesicht & Augenbrauen', 'Dezember 2024', 4),
]


def stimmen_block(kopf_html):
    karten = ''.join(
        f'<li class="stimme"><blockquote>{e(t)}</blockquote><footer><span>{e(l)} · {d}</span>'
        f'<span class="stimme-sterne" aria-label="{n} von 5 Sternen">{"★" * n}</span></footer></li>'
        for t, l, d, n in STIMMEN)
    return f'''{kopf_html}
    <ul class="stimmen" aria-label="Bewertungen">{karten}</ul>'''


def wertung_block():
    return f'''<div class="wertung">
        <span class="wertung-zahl">4,7</span>
        <span><span class="wertung-sterne" aria-hidden="true">★★★★★</span><span class="wertung-quelle">aus 207 Bewertungen auf Planity</span></span>
      </div>'''


# ---------------------------------------------------------------- Startseite

def startseite():
    p = ''
    kacheln = []
    for s in SALONS:
        if s['seite']:
            href, extern = f'{p}{s["seite"]}', False
        else:
            href, extern = s['extern'], True
        if s['buchen']:
            haupt = f'<a class="knopf" href="{s["buchen"]}" rel="noopener">{ICO["kalender"]}<span>Termin buchen</span></a>'
        elif s['id'] == 'barber-mira':
            haupt = f'<a class="knopf" href="tel:{s["tel_int"]}">{ICO["telefon"]}<span>Anrufen</span></a>'
        else:
            haupt = f'<a class="knopf" href="{s["extern"]}" rel="noopener"><span>Zum Salon</span>{ICO["extern"]}</a>'
        info_link = f'<a href="{href}"{" rel=\"noopener\"" if extern else ""}>{e(s["kurz"])}</a>'
        zusatz = ''
        kacheln.append(f'''<li class="salon" id="ort-{s["id"]}" data-lat="{s["lat"]}" data-lon="{s["lon"]}" data-licht="{s["licht"]}">
        {spiegel(s, p, href, laden="eager" if s["id"] in ("mira", "barber-mira", "isartor") else "lazy", extern=extern)}
        <div class="salon-info">
          <p class="salon-lage">{e(s["lage"])}</p>
          <h2>{info_link}</h2>
          <address>{e(s["strasse"])}{zusatz}<br>{s["plz"]} {s["ort"]}</address>
          <p class="stand" data-zeiten="{zeiten_attr(s)}">{e(s["zeiten_text"])}</p>
          <div class="knoepfe">{haupt}</div>
        </div>
      </li>''')

    org = {
        '@context': 'https://schema.org', '@type': 'Organization', 'name': FIRMA,
        'logo': 'assets/img/logo-dunkel.webp', 'email': MAIL, 'sameAs': [INSTAGRAM, INSTAGRAM_MIRA],
        'subOrganization': [schema_salon(s) for s in SALONS],
    }
    kopf_stimmen = f'''<div class="stimmen-kopf">
      <div class="abschnitt-kopf" style="margin:0">
        <p class="schild" data-nr="03">Stimmen</p>
        <h2 class="titel-m">Was Gäste über uns sagen</h2>
        <p>Echte Bewertungen aus dem Salon MIRA, gesammelt nach jedem Termin auf Planity.</p>
      </div>
      {wertung_block()}
    </div>'''

    seite = kopf(p, "Omer's Hair Professional – Friseur in München · 5 Salons",
                 "Fünf Salons in München: MIRA, Barber Shop MIRA, Isartor, Forum Bogenhausen und Riem Arcaden. Schnitt, Farbe, Balayage und Barber – Termin online buchen.",
                 ldjson=org)
    seite += '<body>\n'
    seite += '''<!--
  THESE · Jeder Salon ist ein Spiegel mit Lichtkante – die Spiegelreihe aus dem MIRA wird zur Auswahl.
  EIGENE WELT · Schwarz der Marke, LED-Kante als einzige Lichtquelle, Gold nur als Faden.
  ERSTER BILDSCHIRM · Marke, eine Zeile, „Nächsten Salon finden“, darunter stehen die fünf Spiegel.
  FORM · Bogen aus den Spiegeln im Salon Isartor, Schwung aus dem Logo.
-->
'''
    seite += leiste(p, 'start')
    seite += f'''<main id="inhalt">
  <section class="auftakt" id="salons" aria-labelledby="auftakt-titel">
    <div class="huelle">
      <p class="schild mitte">Friseur in München</p>
      <h1 id="auftakt-titel">Fünf Salons.<span class="hand">eine Handschrift</span></h1>
      <p class="einleitung">Vom MIRA im Norden bis zu den Riem Arcaden: Wählen Sie Ihren Salon und buchen Sie Ihren Termin in wenigen Sekunden.</p>
      <div>
        <div class="knoepfe">
          <button class="knopf-still" type="button" id="finder">{ICO["ort"]}<span>Nächsten Salon finden</span></button>
        </div>
        <p class="finder-antwort" id="finder-antwort" aria-live="polite"></p>
      </div>
    </div>
    <div class="reihe-rahmen">
      <ul class="reihe" aria-label="Unsere Salons">
      {''.join(kacheln)}
      </ul>
      <div class="reihe-punkte" aria-label="Salon wählen"></div>
    </div>
  </section>

  <section class="abschnitt" data-kapitel="Handwerk" aria-labelledby="haus-titel">
    <span class="kapitel-fuge" aria-hidden="true"></span>
    <div class="huelle">
      <div class="abschnitt-kopf">
        <p class="schild" data-nr="02">Handwerk</p>
        <h2 class="titel-m" id="haus-titel">Ein Team aus Meisterhand – in jedem Salon.</h2>
        <p>Hinter Omer’s Hair steht Friseurmeister Omer Khalil Kotschali – und ein Anspruch, der überall gilt: ausführliche Beratung, saubere Arbeit und ein Ergebnis, das zu Ihnen passt.</p>
      </div>
      <ul class="haus-liste">
        <li><span class="nr">01</span><h3>Balayage &amp; Farbe</h3><p>Feine Strähnen, Balayage, Glossing und Coloration – mit Zeit für die Farbberatung.</p></li>
        <li><span class="nr">02</span><h3>Schnitt &amp; Styling</h3><p>Vom klassischen Schnitt bis zum Föhn-Styling, für Damen, Herren und Kinder.</p></li>
        <li><span class="nr">03</span><h3>Festfrisuren</h3><p>Hochsteckfrisuren und Styling für Hochzeit, Abschlussball und besondere Tage.</p></li>
        <li><span class="nr">04</span><h3>Barber &amp; Bart</h3><p>Maschinenschnitt, Bartmodell und Bartpflege – im eigenen Barber Shop im MIRA.</p></li>
      </ul>
    </div>
  </section>

  <section class="abschnitt" data-kapitel="Stimmen" aria-label="Bewertungen">
    <span class="kapitel-fuge" aria-hidden="true"></span>
    <div class="huelle">
    {stimmen_block(kopf_stimmen)}
    </div>
  </section>

  <section class="abschnitt" data-kapitel="Instagram" aria-labelledby="insta-titel">
    <span class="kapitel-fuge" aria-hidden="true"></span>
    <div class="huelle insta">
      <div>
        <p class="schild" data-nr="04">Einblicke</p>
        <h2 class="insta-griff" id="insta-titel" style="margin-top:1.2rem"><a href="{INSTAGRAM}" rel="noopener">@omers_hair_professional</a></h2>
        <p class="leise" style="margin-top:1rem;max-width:26rem">Neue Looks, Farben und Blicke hinter die Kulissen – auf Instagram. Der Salon MIRA hat zusätzlich einen eigenen Kanal.</p>
        <div class="knoepfe">
          <a class="knopf-still" href="{INSTAGRAM}" rel="noopener">{ICO["insta"]}<span>Folgen</span></a>
          <a class="knopf-still" href="{INSTAGRAM_MIRA}" rel="noopener">{ICO["insta"]}<span>MIRA-Kanal</span></a>
        </div>
      </div>
      <div class="insta-kacheln">
        <a href="{INSTAGRAM}" rel="noopener" aria-label="Instagram: Salon Isartor">{bild("isartor-raum", "Salon Isartor mit Bogenspiegeln", p, "(max-width: 48rem) 33vw, 20vw")}</a>
        <a href="{INSTAGRAM_MIRA}" rel="noopener" aria-label="Instagram: Salon MIRA">{bild("mira-waschplaetze", "Waschplätze mit schwarzen Massagesesseln im Salon MIRA", p, "(max-width: 48rem) 33vw, 20vw")}</a>
        <a href="{INSTAGRAM}" rel="noopener" aria-label="Instagram: Barber Shop MIRA">{bild("barber-raum", "Barber Shop MIRA", p, "(max-width: 48rem) 33vw, 20vw")}</a>
      </div>
    </div>
  </section>

  <section class="abschnitt" style="padding-top:0" aria-labelledby="ruf-titel">
    <div class="huelle">
      <div class="ruf">
        <div>
          <h2 id="ruf-titel">Wir suchen Verstärkung.</h2>
          <p>Friseurinnen, Friseure, Barber und Auszubildende: Wenn Sie Lust auf ein herzliches Team haben, schreiben Sie uns ein paar Zeilen – gern mit Fotos Ihrer Arbeit.</p>
        </div>
        <a class="knopf" href="mailto:{MAIL}?subject={quote_plus('Bewerbung bei Omer’s Hair').replace('+', '%20')}">{ICO["pfeil"]}<span>Jetzt bewerben</span></a>
      </div>
    </div>
  </section>
</main>
'''
    seite += fuss(p) + ende()
    schreiben('index.html', seite)


# ---------------------------------------------------------------- Bausteine Standortseite

def zeiten_tabelle(s):
    zeilen = []
    for t, name in TAGE:
        fenster = s['zeiten'].get(t, [])
        f = lambda h: f'{int(h)}:{round((h % 1) * 60):02d}'
        wert = ' · '.join(f'{f(a)}–{f(b)} Uhr' for a, b in fenster) or 'geschlossen'
        zeilen.append(f'<tr data-tag="{t}"><th scope="row">{name}</th><td>{wert}</td></tr>')
    return f'''<table class="zeiten"><caption class="nur-vorleser">Öffnungszeiten {e(s["name"])}</caption><tbody>{''.join(zeilen)}</tbody></table>
        <p class="zeiten-hinweis">An Feiertagen können die Zeiten abweichen.</p>'''


def ort_auftakt(s, p, h1, einleitung, zeichen, wertung=True):
    knoepfe = []
    if s['buchen']:
        knoepfe.append(f'<a class="knopf" href="{s["buchen"]}" rel="noopener">{ICO["kalender"]}<span>Termin buchen</span></a>')
        knoepfe.append(f'<a class="knopf-still" href="tel:{s["tel_int"]}">{ICO["telefon"]}<span>Anrufen</span></a>')
    else:
        knoepfe.append(f'<a class="knopf" href="tel:{s["tel_int"]}">{ICO["telefon"]}<span>Jetzt anrufen</span></a>')
    knoepfe.append(f'<a class="knopf-still" href="{route(s)}" rel="noopener">{ICO["route"]}<span>Route</span></a>')
    w = (f'<a class="ort-wertung" href="#stimmen">{ICO["stern"]}<span><b>4,7</b> · 207 Bewertungen</span></a>' if wertung else '')
    return f'''<section class="ort-auftakt" aria-labelledby="ort-titel">
    <div class="huelle ort-raster">
      <div class="ort-text">
        <p class="schild">{e(s["name"])}<span class="hand">{e(s["zusatz"] or s["ort"])}</span></p>
        <h1 id="ort-titel">{h1}</h1>
        <p class="einleitung">{einleitung}</p>
        <div class="ort-fakten">
          <p class="stand" data-zeiten="{zeiten_attr(s)}">{e(s["zeiten_text"])}</p>
          {w}
        </div>
        <div class="knoepfe">{''.join(knoepfe)}</div>
        <p class="ort-telefon">Telefon <a href="tel:{s["tel_int"]}">{s["tel"]}</a></p>
      </div>
      <div class="ort-bild">
        {spiegel(s, p, None, laden="eager", groessen="(max-width: 52rem) 78vw, 26rem", prio=True)}
        <p class="ort-bild-zeichen">{zeichen}</p>
      </div>
    </div>
  </section>
'''


def aktionsleiste(s):
    teile = []
    if s['buchen']:
        teile.append(f'<a class="haupt" href="{s["buchen"]}" rel="noopener">{ICO["kalender"]}<span>Buchen</span></a>')
        teile.append(f'<a href="tel:{s["tel_int"]}">{ICO["telefon"]}<span>Anrufen</span></a>')
    else:
        teile.append(f'<a class="haupt" href="tel:{s["tel_int"]}">{ICO["telefon"]}<span>Anrufen</span></a>')
    teile.append(f'<a href="{route(s)}" rel="noopener">{ICO["route"]}<span>Route</span></a>')
    return f'<nav class="aktion versteckt" style="--n:{len(teile)}" aria-label="Schnellzugriff">{"".join(teile)}</nav>\n'


def etage_block(hier):
    ug = 'hier' if hier == 'UG' else ''
    eg = 'hier' if hier == 'EG' else ''
    if hier == 'UG':
        text = (f'<p><b>Salon MIRA</b> – Untergeschoss</p>'
                f'<p>Direkt darüber, im Erdgeschoss: unser <a href="../barber-mira/">Barber Shop MIRA</a>.</p>')
    else:
        text = (f'<p><b>Barber Shop MIRA</b> – Erdgeschoss</p>'
                f'<p>Eine Etage tiefer, im Untergeschoss: unser <a href="../mira/">Salon MIRA</a> für Damen, Herren und Kinder.</p>')
    return f'''<div class="etage">
          <div class="etage-anzeige" aria-hidden="true"><span class="{eg}">EG</span><span class="{ug}">UG</span></div>
          <div class="etage-text">{text}</div>
        </div>'''


def anfahrt(s, p, hinweise, etage=None):
    et = etage_block(etage) if etage else ''
    h = ''.join(f'<span>{x}</span>' for x in hinweise)
    knoepfe = f'<a class="knopf" href="{route(s)}" rel="noopener">{ICO["route"]}<span>Route planen</span></a>'
    knoepfe += f'<a class="knopf-still" href="tel:{s["tel_int"]}">{ICO["telefon"]}<span>{s["tel"]}</span></a>'
    return f'''<section class="abschnitt" id="anfahrt" data-kapitel="Anfahrt" aria-labelledby="anfahrt-titel">
    <span class="kapitel-fuge" aria-hidden="true"></span>
    <div class="huelle anfahrt">
      <div class="anfahrt-text">
        <p class="schild">Anfahrt &amp; Zeiten</p>
        <h2 class="titel-m" id="anfahrt-titel" style="margin-top:1.2rem">So finden Sie uns.</h2>
        <address>{e(s["strasse"])}<br>{e(s["zusatz"]) + "<br>" if s["zusatz"] else ""}{s["plz"]} {s["ort"]}</address>
        <p class="anfahrt-hinweis">{h}</p>
        <div class="knoepfe">{knoepfe}</div>
        {zeiten_tabelle(s)}
        {et}
      </div>
      <div class="karte-hier">
        <span class="karte-raster" aria-hidden="true"></span>
        <div class="karte-hier-innen">
          <span class="karte-nadel" aria-hidden="true"></span>
          <button class="knopf-still" type="button" data-karte="{e(karte_embed(s))}" data-titel="Karte: {e(s['name'])}">Karte anzeigen</button>
          <p>Beim Anzeigen lädt Google Maps und erhält dabei Daten wie Ihre IP-Adresse. Mehr in der <a href="{p}datenschutz/">Datenschutzerklärung</a>.</p>
        </div>
      </div>
    </div>
  </section>
'''


def galerie(bilder, p, klasse=''):
    k = ''.join(
        f'<button type="button" data-gross="{p}assets/img/{n}-900.webp" aria-label="{e(a)} – groß anzeigen">{bild(n, a, p, "(max-width: 40rem) 50vw, 40vw")}</button>'
        for n, a in bilder)
    return f'<div class="galerie {klasse}">{k}</div>'


# ---------------------------------------------------------------- Salon MIRA

PREISE_MIRA = [
    ('damen', 'Damen', [
        ('Waschen, Schneiden, selbst föhnen', '', '34 €'),
        ('Schüler & Studenten', 'Waschen, Schneiden, selbst föhnen', '29 €'),
        ('Waschen, Schneiden, Föhnen/Styling', 'je nach Haarlänge', '49–55 €'),
        ('Waschen & Föhnen', 'je nach Haarlänge', '29–33 €'),
        ('Keratinbehandlung', '', None),
    ]),
    ('farbe', 'Farbe', [
        ('Strähnen artistic', '', 'ab 99 €'),
        ('Balayage', 'inklusive Schnitt & Styling', '239–259 €'),
        ('Coloration / Tönung', '', '37–42 €'),
        ('Glossing', '', '37–42 €'),
        ('Dauerwelle', '', None),
    ]),
    ('herren', 'Herren', [
        ('Schneiden', '', '21 €'),
        ('Waschen, Schneiden, Stylen', '', '24 €'),
        ('Maschinenschnitt', '', '16 €'),
        ('Bartmodell', '', 'ab 13 €'),
        ('Bartpflege', '', '9 €'),
    ]),
    ('kinder', 'Kinder bis 12', [
        ('Jungen', '', '17 €'),
        ('Mädchen', '', '22 €'),
        ('Mädchen: Schneiden & Föhnen', '', '33 €'),
    ]),
    ('extras', 'Extras & Gesicht', [
        ('Pflege', 'zu jeder Behandlung', '6 €'),
        ('Strukturaufbau', '', '22 €'),
        ('Wimpern färben', '', '14 €'),
        ('Augenbrauen', '', '11 €'),
        ('Ganzes Gesicht', 'Zupfen', '24 €'),
    ]),
]


def ab_preis(zeilen):
    werte = []
    for _, _, preis in zeilen:
        if not preis:
            continue
        zahl = preis.replace('ab ', '').split('–')[0].replace(' €', '')
        werte.append(int(zahl))
    return f'ab {min(werte)} €' if werte else ''


def preisliste(gruppen, buchen):
    wahl = [('alle', 'Alle')] + [(k, t.split(' ')[0] if k != 'extras' else 'Extras') for k, t, _ in gruppen]
    radios = ''.join(
        f'<label><input type="radio" name="art" value="{k}" id="f-{k}"{" checked" if k == "alle" else ""}><span>{t}</span></label>'
        for k, t in wahl)
    bloecke = []
    for k, titel, zeilen in gruppen:
        z = ''.join(
            f'<li class="zeile"><p class="zeile-name">{e(n)}{f"<small>{e(x)}</small>" if x else ""}</p>'
            + (f'<p class="zeile-preis">{e(pr)}</p>' if pr else '<p class="zeile-preis anfrage">auf Anfrage</p>') + '</li>'
            for n, x, pr in zeilen)
        bloecke.append(f'''<article class="gruppe" id="art-{k}" data-art="{k}">
            <div class="gruppe-kopf"><h3>{e(titel)}</h3><span class="gruppe-ab">{ab_preis(zeilen)}</span></div>
            <ul class="zeilen">{z}</ul>
            <p class="gruppe-fuss"><a href="{buchen}" rel="noopener">{e(titel.split(" ")[0])}: Termin wählen {ICO["pfeil"]}</a></p>
          </article>''')
    return f'''<div class="preise preise-raster">
        <div class="preise-seite">
          <fieldset class="wahl">
            <legend>Ich suche</legend>
            <div class="wahl-reihe">{radios}</div>
          </fieldset>
          <p class="klein">Alle Preise inklusive Mehrwertsteuer. Stand: Oktober 2026. Der genaue Preis richtet sich nach Haarlänge und Aufwand – wir beraten Sie gern vorab.</p>
        </div>
        <div class="gruppen">{''.join(bloecke)}</div>
      </div>'''


def fan_card(p):
    loecher = ''.join(f'<li class="loch">{i}</li>' for i in range(1, 8)) + '<li class="loch"><b>15 €</b></li>'
    return f'''<div class="karte-fan" role="img" aria-label="Fan Card mit acht Feldern; das achte Feld ist ein Gutschein über 15 Euro">
          <div class="karte-kopf"><img src="{p}assets/img/logo-hell.webp" alt="" width="398" height="178" loading="lazy"><span>Fan Card</span></div>
          <ul class="loecher" aria-hidden="true">{loecher}</ul>
          <div class="karte-fuss"><span>8. Besuch</span><b>danke!</b></div>
        </div>'''


def seite_mira():
    s = S['mira']; p = '../'
    ld = schema_salon(s)
    ld['aggregateRating'] = {'@type': 'AggregateRating', 'ratingValue': '4.7', 'reviewCount': '207', 'bestRating': '5'}
    ld['image'] = '../' + ld['image']
    seite = kopf(p, "Salon MIRA – Friseur im MIRA München | Omer's Hair",
                 "Friseur im MIRA Einkaufszentrum, Schleißheimer Str. 506 (UG), 80933 München. Schnitt, Balayage, Farbe, Herren & Kinder. Mo–Sa 9:30–20:00 – jetzt online buchen.",
                 ldjson=ld, bild_og='mira-spiegelreihe')
    seite += '<body data-licht="mira">\n'
    seite += '''<!--
  THESE · Der Salon MIRA ist hell und weiß – die Preisliste liegt deshalb auf hellem Grund, wie im Laden.
  EIGENE IDEE · Die Fan Card stanzt sich beim Hereinscrollen selbst; die Etagenanzeige klärt UG/EG.
-->
'''
    seite += leiste(p, 'mira', (s['buchen'], 'Termin buchen', True), kapitel=True)
    seite += '<main id="inhalt">\n  '
    seite += ort_auftakt(
        s, p,
        'Ihr Friseur im Münchner Norden.',
        'Hell, herzlich und mitten im MIRA: Schnitt, Farbe und Balayage für Damen, Herren und Kinder – mit Termin ganz ohne Wartezeit.',
        '<b>Untergeschoss</b>U2 Dülferstraße, direkt am Center')
    seite += f'''
  <section class="abschnitt papier" id="preise" data-kapitel="Preise" aria-labelledby="preise-titel">
    <span class="kapitel-fuge" aria-hidden="true"></span>
    <div class="huelle">
      <div class="abschnitt-kopf">
        <p class="schild" data-nr="01">Leistungen &amp; Preise</p>
        <h2 class="titel-m" id="preise-titel">Klare Preise, ehrliche Beratung.</h2>
      </div>
      {preisliste(PREISE_MIRA, s["buchen"])}
    </div>
  </section>

  <section class="abschnitt" id="fan-card" data-kapitel="Fan Card" aria-labelledby="fan-titel">
    <span class="kapitel-fuge" aria-hidden="true"></span>
    <div class="huelle fan">
      <div class="fan-text">
        <p class="schild" data-nr="02">Fan Card</p>
        <h2 class="titel-m" id="fan-titel">Treue wird belohnt.</h2>
        <p>Bei jedem Besuch gibt es einen Stempel auf Ihre Fan Card. Nach dem achten Besuch schenken wir Ihnen einen Gutschein über 15 €.</p>
        <p>Fragen Sie beim nächsten Termin einfach am Empfang danach.</p>
      </div>
      {fan_card(p)}
    </div>
  </section>

  <section class="abschnitt" id="salon" data-kapitel="Salon" aria-labelledby="salon-titel" style="padding-top:0">
    <div class="huelle">
      <div class="abschnitt-kopf">
        <p class="schild" data-nr="03">Der Salon</p>
        <h2 class="titel-m" id="salon-titel">Licht, Platz und bequeme Sessel.</h2>
      </div>
      {galerie([("mira-eingang", "Eingang mit Empfang und Schriftzug Omer’s Hair"), ("mira-empfang", "Empfang mit Pflegeprodukten"), ("mira-waschplaetze", "Waschplätze mit Massagesesseln")], p, "drei")}
    </div>
  </section>

  <section class="abschnitt" id="stimmen" data-kapitel="Stimmen" aria-label="Bewertungen" style="padding-top:0">
    <div class="huelle">
    {stimmen_block(f"""<div class="stimmen-kopf">
      <div class="abschnitt-kopf" style="margin:0">
        <p class="schild" data-nr="04">Stimmen</p>
        <h2 class="titel-m">Nada, Valbona, Sima, Donya &amp; Team</h2>
        <p>Was Gäste nach ihrem Termin auf Planity schreiben.</p>
      </div>
      {wertung_block()}
    </div>""")}
    </div>
  </section>

  {anfahrt(s, p, ["U-Bahn U2 bis Dülferstraße, direkt am Center", "E-Mail <a href=\"mailto:" + MAIL + "\">" + MAIL + "</a>"], etage="UG")}

  <section class="abschnitt" style="padding-top:0" aria-labelledby="insta-mira">
    <div class="huelle">
      <div class="ruf">
        <div>
          <h2 id="insta-mira">Der MIRA-Salon auf Instagram</h2>
          <p>Aktuelle Looks direkt aus dem Salon – folgen Sie <a href="{INSTAGRAM_MIRA}" rel="noopener">@omershair_professional_mira</a>.</p>
        </div>
        <a class="knopf-still" href="{INSTAGRAM_MIRA}" rel="noopener">{ICO["insta"]}<span>Zu Instagram</span></a>
      </div>
    </div>
  </section>
</main>
'''
    seite += aktionsleiste(s) + gross_dialog() + fuss(p) + ende()
    schreiben('mira/index.html', seite)


# ---------------------------------------------------------------- Seitenhüllen

def seite_barber():
    s = S['barber-mira']; p = '../'
    ld = schema_salon(s); ld['image'] = '../' + ld['image']
    seite = kopf(p, "Barber Shop MIRA – Barber im MIRA München | Omer's Hair",
                 "Barber Shop im MIRA Einkaufszentrum, Schleißheimer Str. 506 (EG), 80933 München. Haarschnitt, Maschinenschnitt und Bart. Mo–Sa 9:30–20:00.",
                 ldjson=ld, welt='barber', theme='#0e0b0a', bild_og='barber-stuehle')
    seite += '<body data-licht="barber">\n'
    seite += leiste(p, 'barber-mira', (f'tel:{s["tel_int"]}', 'Anrufen', False), kapitel=True)
    seite += '<main id="inhalt">\n  '
    seite += ort_auftakt(
        s, p,
        'Schnitt, Fade &amp; Bart.',
        'Lederstühle, Holz und ein ruhiges Händchen: der Barber Shop im Erdgeschoss des MIRA. Rufen Sie kurz an – wir nehmen uns Zeit für Sie.',
        '<b>Erdgeschoss</b>Eine Etage über dem Salon MIRA', wertung=False)
    seite += f'''
  <section class="abschnitt" id="laden" data-kapitel="Laden" aria-labelledby="laden-titel" style="padding-top:0">
    <div class="huelle">
      <div class="abschnitt-kopf">
        <p class="schild" data-nr="01">Der Laden</p>
        <h2 class="titel-m" id="laden-titel">Holz, Leder, klare Linien.</h2>
      </div>
      {galerie([("barber-raum", "Blick durch den Barber Shop"), ("barber-eingang", "Eingang des Barber Shops im MIRA")], p, "zwei")}
      <div class="bald" style="margin-top:2.5rem">
        <span class="bald-zeichen" aria-hidden="true">{ICO["schere"]}</span>
        <div><h3>Preisliste folgt in Kürze</h3><p>Bis dahin beantworten wir Ihre Fragen gern am Telefon unter <a href="tel:{s["tel_int"]}">{s["tel"]}</a>.</p></div>
      </div>
    </div>
  </section>

  {anfahrt(s, p, ["U-Bahn U2 bis Dülferstraße, direkt am Center"], etage="EG")}
</main>
'''
    seite += aktionsleiste(s) + gross_dialog() + fuss(p) + ende()
    schreiben('barber-mira/index.html', seite)


def seite_isartor():
    s = S['isartor']; p = '../'
    ld = schema_salon(s); ld['image'] = '../' + ld['image']
    seite = kopf(p, "Salon Isartor – Friseur in der Altstadt München | Omer's Hair",
                 "Friseur am Isartor: Zweibrückenstr. 5–7 (Breiterhof-Passage), 80331 München. Schnitt, Farbe und Styling. Mo–Sa 9:00–19:00 – online buchen.",
                 ldjson=ld, welt='isartor', bild_og='isartor-spiegel')
    seite += '<body data-licht="isartor">\n'
    seite += leiste(p, 'isartor', (s['buchen'], 'Termin buchen', True), kapitel=True)
    seite += '<main id="inhalt">\n  '
    seite += ort_auftakt(
        s, p,
        'Schwarz, Gold &amp; Licht – am Isartor.',
        'Bogenspiegel mit Lichtkante, goldene Details und viel Ruhe: unser Salon in der Breiterhof-Passage, wenige Schritte vom Isartor.',
        '<b>Breiterhof-Passage</b>Wenige Schritte vom Isartor', wertung=False)
    seite += f'''
  <section class="abschnitt" id="salon" data-kapitel="Salon" aria-labelledby="salon-titel" style="padding-top:0">
    <div class="huelle">
      <div class="abschnitt-kopf">
        <p class="schild" data-nr="01">Der Salon</p>
        <h2 class="titel-m" id="salon-titel">Ein Raum wie ein Schmuckkästchen.</h2>
      </div>
      {galerie([("isartor-raum", "Bogenspiegel und goldene Stäbe im Salon Isartor"), ("isartor-empfang", "Schwarzer Empfangstresen mit Goldornament"), ("isartor-tresen", "Empfang im Salon Isartor")], p, "drei")}
      <div class="bald" style="margin-top:2.5rem">
        <span class="bald-zeichen" aria-hidden="true">{ICO["schere"]}</span>
        <div><h3>Preisliste folgt in Kürze</h3><p>Alle Leistungen und freien Termine sehen Sie schon jetzt direkt bei <a href="{s["buchen"]}" rel="noopener">Planity</a>.</p></div>
      </div>
    </div>
  </section>

  {anfahrt(s, p, ["S-Bahn bis Isartor, dann wenige Schritte", "E-Mail <a href=\"mailto:" + MAIL + "\">" + MAIL + "</a>"])}
</main>
'''
    seite += aktionsleiste(s) + gross_dialog() + fuss(p) + ende()
    schreiben('isartor/index.html', seite)


# ---------------------------------------------------------------- Rechtstexte

OFFEN = '<span class="offen-markierung">wird ergänzt</span>'


def seite_recht(pfad, titel, beschreibung, inhalt):
    p = '../'
    seite = kopf(p, f"{titel} | Omer's Hair Professional", beschreibung)
    seite += '<body>\n' + leiste(p)
    seite += f'''<main id="inhalt" class="recht">
  <div class="huelle recht-innen">
    <p class="schild">Rechtliches</p>
    <h1>{titel}</h1>
    {inhalt}
  </div>
</main>
'''
    seite += fuss(p) + ende()
    schreiben(pfad, seite)


def rechtstexte():
    seite_recht('impressum/index.html', 'Impressum', "Impressum der Omer's Hair Professional GmbH, München.", f'''
    <h2>Angaben gemäß § 5 DDG</h2>
    <p>{e(FIRMA)}<br>Anschrift {OFFEN}<br>München</p>
    <h2>Vertreten durch</h2>
    <p>Geschäftsführung {OFFEN}</p>
    <h2>Kontakt</h2>
    <p>Telefon <a href="tel:{S["mira"]["tel_int"]}">{S["mira"]["tel"]}</a><br>E-Mail <a href="mailto:{MAIL}">{MAIL}</a></p>
    <h2>Registereintrag</h2>
    <p>Eintragung im Handelsregister<br>Registergericht: Amtsgericht München<br>Registernummer: HRB 243711</p>
    <h2>Umsatzsteuer-ID</h2>
    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: {OFFEN}</p>
    <h2>Berufsbezeichnung</h2>
    <p>Friseurmeister, verliehen in der Bundesrepublik Deutschland. Zuständige Kammer: Handwerkskammer für München und Oberbayern.</p>
    <h2>Verbraucherstreitbeilegung</h2>
    <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
''')
    seite_recht('datenschutz/index.html', 'Datenschutz', "Datenschutzerklärung der Omer's Hair Professional GmbH.", f'''
    <p>Diese Website ist bewusst sparsam gebaut: keine Cookies, keine Analyse-Werkzeuge, keine Werbung. Schriften und Bilder liegen auf unserem eigenen Server.</p>
    <h2>Verantwortlich</h2>
    <p>{e(FIRMA)}, München · E-Mail <a href="mailto:{MAIL}">{MAIL}</a> · Anschrift {OFFEN}</p>
    <h2>Server-Protokolle</h2>
    <p>Beim Aufruf der Seiten verarbeitet unser Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite), um die Website auszuliefern und abzusichern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Anbieter {OFFEN}</p>
    <h2>Standortsuche „Nächsten Salon finden“</h2>
    <p>Wenn Sie die Standortsuche nutzen, fragt Ihr Browser um Erlaubnis. Ihr Standort wird ausschließlich auf Ihrem Gerät mit unseren Salon-Adressen verglichen und verlässt Ihr Gerät nicht.</p>
    <h2>Gemerkte Auswahl</h2>
    <p>Wählen Sie in der Preisliste einen Bereich, merkt sich Ihr Browser diese Wahl lokal (Local Storage). Es werden keine Daten an uns übertragen. Sie können den Eintrag jederzeit in Ihren Browser-Einstellungen löschen.</p>
    <h2>Google Maps</h2>
    <p>Die Karte wird erst geladen, wenn Sie auf „Karte anzeigen“ klicken. Dann werden Daten wie Ihre IP-Adresse an Google Ireland Limited übertragen. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO). Mehr unter <a href="https://policies.google.com/privacy" rel="noopener">policies.google.com/privacy</a>.</p>
    <h2>Terminbuchung über Planity</h2>
    <p>Für Online-Termine leiten wir Sie zu Planity weiter. Dort gilt die Datenschutzerklärung von Planity.</p>
    <h2>Instagram</h2>
    <p>Wir verlinken auf unsere Instagram-Profile. Erst beim Klick auf einen Link werden Sie zu Instagram (Meta Platforms Ireland Ltd.) weitergeleitet.</p>
    <h2>Ihre Rechte</h2>
    <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde, in Bayern beim Bayerischen Landesamt für Datenschutzaufsicht.</p>
''')


def seite_404():
    # Ohne festen Pfad: Seite kann in jeder Tiefe ausgeliefert werden → absolute Pfade vermeiden,
    # deshalb nur Startseite verlinken und Assets über <base> nicht erzwingen.
    p = ''
    seite = kopf(p, "Seite nicht gefunden | Omer's Hair Professional", "Diese Seite gibt es nicht (mehr).")
    seite += '<body>\n' + leiste(p)
    seite += '''<main id="inhalt" class="recht">
  <div class="huelle recht-innen">
    <p class="schild">Fehler 404</p>
    <h1>Hier ist leider niemand.<span class="hand">aber gleich nebenan</span></h1>
    <p>Die Seite gibt es nicht oder nicht mehr. Unsere fünf Salons finden Sie auf der Startseite.</p>
    <p style="margin-top:2rem"><a class="knopf" href="index.html#salons">Zu den Salons</a></p>
  </div>
</main>
'''
    seite += fuss(p) + ende()
    schreiben('404.html', seite)


if __name__ == '__main__':
    startseite()
    seite_mira()
    seite_barber()
    seite_isartor()
    rechtstexte()
    seite_404()
