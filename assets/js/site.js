/* Omer's Hair Professional — Funktionen aller Seiten.
   Jede Funktion steigt still aus, wenn ihr Element fehlt. Ohne Skript steht die Seite vollständig da. */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.remove('js-aus');
  doc.classList.add('js');

  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const feinZeiger = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Ladevorhang: zählt echten Fortschritt (Schrift, erstes Bild, 3D), dann heben sich die Spalten ---------- */
  if (doc.dataset.vorhang === 'zu') {
    const kurz = doc.dataset.vorhangArt === 'kurz';
    const zahl = document.querySelector('.vorhang-zahl');
    const beginn = performance.now();
    const MIN = kurz ? 200 : 1400, MAX = kurz ? 1200 : 3000;
    const fertig = { schrift: false, bild: false, glas: false };
    const hat3d = !!document.querySelector('canvas.glas-3d, canvas.auftakt-3d');
    let webgl = false;
    try { const c = document.createElement('canvas'); webgl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { /* keins */ }
    if (!hat3d || !webgl || doc.dataset.glas === 'bereit') fertig.glas = true;
    else document.addEventListener('glas-bereit', () => { fertig.glas = true; }, { once: true });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fertig.schrift = true; });
    const erstes = document.querySelector('.auftakt-poster, .glas-poster img');
    if (!erstes || (erstes.complete && erstes.naturalWidth)) fertig.bild = true;
    else { const da = () => { fertig.bild = true; }; erstes.addEventListener('load', da, { once: true }); erstes.addEventListener('error', da, { once: true }); }
    let ist = 0, offen = false;
    const oeffnen = () => {
      if (offen) return; offen = true;
      doc.dataset.vorhangAuf = String(performance.now());
      doc.dataset.vorhang = 'auf';
      document.dispatchEvent(new Event('vorhang-auf'));
      setTimeout(() => { doc.dataset.vorhang = 'weg'; }, 1500);
    };
    const tick = (t) => {
      const zeit = t - beginn;
      const soll = (fertig.schrift ? 0.2 : 0.05) + (fertig.bild ? 0.3 : 0) + (fertig.glas ? 0.5 : 0);
      // nie schneller als die Mindestdauer, nie länger als die Höchstdauer
      const ziel = zeit >= MAX ? 1 : Math.min(soll, zeit / MIN);
      ist += (ziel - ist) * 0.16;
      if (zahl) { zahl.textContent = String(Math.round(ist * 100)).padStart(3, '0'); zahl.style.setProperty('--fortschritt', ist.toFixed(3)); }
      if (ist > 0.985 || (kurz && ziel >= 1)) { if (zahl) zahl.textContent = '100'; setTimeout(oeffnen, kurz ? 0 : 180); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Große Markenschrift genau auf die Rasterbreite einpassen ---------- */
  for (const el of document.querySelectorAll('.riesen.passend')) {
    const passen = () => {
      el.style.fontSize = '100px';
      const woerter = [...el.querySelectorAll('.w')];
      const block = woerter[0] && getComputedStyle(woerter[0]).display === 'block';
      let breite = 0;
      if (block) breite = Math.max(...woerter.map((w) => w.getBoundingClientRect().width));
      else { const b = el.querySelectorAll('.b'); breite = b[b.length - 1].getBoundingClientRect().right - b[0].getBoundingClientRect().left; }
      const platz = el.clientWidth;
      if (breite && platz) el.style.fontSize = (100 * platz / breite * 0.995).toFixed(2) + 'px';
    };
    passen();
    let letzteBreite = 0;
    new ResizeObserver(([e]) => { const w = Math.round(e.contentRect.width); if (w !== letzteBreite) { letzteBreite = w; passen(); } }).observe(el.parentElement);
    document.fonts?.ready.then(passen);
  }
  const merken = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* privat */ } };
  const holen = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const klemmen = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ---------- Kopf weicht beim Runterscrollen aus ---------- */
  const kopf = document.querySelector('.kopf');
  if (kopf) {
    let letzt = scrollY, weg = false;
    addEventListener('scroll', () => {
      const y = scrollY;
      if (Math.abs(y - letzt) < 6) return;
      const runter = y > letzt; letzt = y;
      const neu = runter && y > 220 ? true : (!runter || y < 80) ? false : weg;
      if (neu !== weg) { weg = neu; kopf.classList.toggle('weg', weg); doc.classList.toggle('kopf-weg', weg); }
    }, { passive: true });
  }

  /* Menü: nach Klick auf einen Link schließen (Sprungmarken auf derselben Seite) */
  const menue = document.getElementById('menue');
  menue?.addEventListener('click', (e) => { if (e.target.closest('a')) { menue.hidePopover?.(); menue.classList.remove('offen'); } });
  // Ältere Browser ohne Popover: Knöpfe schalten eine Klasse
  if (menue && !('showPopover' in HTMLElement.prototype)) {
    document.querySelectorAll('[popovertarget="menue"]').forEach((k) => k.addEventListener('click', () => {
      const auf = k.getAttribute('popovertargetaction') === 'hide' ? false : !menue.classList.contains('offen');
      menue.classList.toggle('offen', auf);
    }));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') menue.classList.remove('offen'); });
  }

  /* ---------- Aktionsleiste am Handy: erst nach dem ersten Bildschirm ---------- */
  const aktion = document.querySelector('.aktion');
  if (aktion && 'IntersectionObserver' in window) {
    const auftakt = document.querySelector('.ort-auftakt'), fuss = document.querySelector('.fuss');
    let imAuftakt = !!auftakt, imFuss = false;
    const b = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === auftakt) imAuftakt = e.isIntersecting && e.intersectionRatio > 0.4;
        if (e.target === fuss) imFuss = e.isIntersecting;
      }
      aktion.classList.toggle('versteckt', imAuftakt || imFuss);
    }, { threshold: [0, 0.4, 0.7] });
    if (auftakt) b.observe(auftakt);
    if (fuss) b.observe(fuss);
  }

  /* ---------- Öffnungsstand nach Münchner Uhr ---------- */
  const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  function ladenzeit() {
    const t = Object.fromEntries(new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    return { tag: { So: 0, Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6 }[t.weekday.replace('.', '')], h: (+t.hour % 24) + t.minute / 60 };
  }
  const uhr = (h) => String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
  function stand(zeiten) {
    const { tag, h } = ladenzeit();
    const heute = zeiten[tag] || [];
    for (const [a, b] of heute) if (h >= a && h < b) return { text: 'Jetzt geöffnet · bis ' + uhr(b) + ' Uhr', offen: true };
    const spaeter = heute.find(([a]) => h < a);
    if (spaeter) return { text: 'Heute ab ' + uhr(spaeter[0]) + ' Uhr geöffnet', offen: false };
    for (let i = 1; i <= 7; i++) {
      const t = (tag + i) % 7;
      if ((zeiten[t] || []).length) return { text: 'Geschlossen · ' + (i === 1 ? 'morgen' : TAGE[t]) + ' ab ' + uhr(zeiten[t][0][0]) + ' Uhr', offen: false };
    }
    return null;
  }
  const zeitenVon = (el) => { try { return JSON.parse(el.dataset.zeiten); } catch (e) { return null; } };
  function staendeZeigen() {
    for (const el of document.querySelectorAll('[data-zeiten]')) {
      const z = zeitenVon(el); if (!z) continue;
      const s = stand(z); if (!s) continue;
      el.textContent = s.text; el.classList.toggle('offen', s.offen);
    }
    // „3 von 5 Salons jetzt geöffnet“
    const zaehler = document.querySelector('[data-offen-zaehler]');
    if (zaehler) {
      const alle = [...document.querySelectorAll('.ring-karte .stand[data-zeiten]')];
      const offen = alle.filter((el) => stand(zeitenVon(el))?.offen).length;
      zaehler.querySelector('b').textContent = offen + '/' + alle.length;
      zaehler.querySelector('span').textContent = offen === 1 ? 'Salon jetzt geöffnet' : 'Salons jetzt geöffnet';
    }
    const { tag } = ladenzeit();
    for (const tr of document.querySelectorAll('.zeiten tr[data-tag]')) tr.classList.toggle('heute', +tr.dataset.tag === tag);
  }
  staendeZeigen();
  setInterval(staendeZeigen, 60000);

  /* ---------- Salon-Ring: gebogene Karten auf einem Zylinder ---------- */
  const ringBox = document.querySelector('[data-ring]');
  const ring = (() => {
    if (!ringBox || !CSS.supports('transform-style', 'preserve-3d')) return null;
    const liste = ringBox.querySelector('.ring');
    const karten = [...liste.querySelectorAll('.ring-karte')];
    const n = karten.length;
    const panel = ringBox.querySelector('.ring-panel-info');
    const zaehler = ringBox.querySelector('.zaehler');
    if (!n || !panel) return null;

    ringBox.classList.add('ring-3d');
    const welt = document.createElement('div');
    welt.className = 'ring-welt';
    karten.forEach((k) => welt.append(k));
    liste.append(welt);
    liste.setAttribute('tabindex', '0');
    liste.setAttribute('aria-roledescription', 'Karussell');

    let K = 0, R = 0, W = 0, schritt = 1, abstandPx = 0;
    const bilder = karten.map((k) => k.querySelector('img'));
    bilder.forEach((img) => { if (img) img.loading = 'eager'; });   // versteckte Bilder laden sonst nie

    const masse = () => {
      const vw = liste.clientWidth || innerWidth;
      const schmal = vw < 760;
      // Karten im Format der Ladenfronten (4:3), damit nichts angeschnitten wird
      const SEITE = 4 / 3;
      W = schmal ? Math.min(vw * 0.84, 460) : klemmen(vw * 0.4, 380, 640);
      const H = Math.min(W / SEITE, innerHeight * (schmal ? 0.5 : 0.6));
      R = W * (schmal ? 1.3 : 1.55);
      const neuK = schmal ? 9 : 14;
      const theta = W / R, delta = theta / neuK;
      const sw = 2 * R * Math.tan(delta / 2);
      abstandPx = schmal ? 16 : 34;
      schritt = theta + abstandPx / R;
      // Bild wie object-fit: cover (Bilder sind 4:5)
      let bgw, bgh, ox = 0, oy = 0;
      if (W / H > SEITE) { bgw = W; bgh = W / SEITE; oy = (H - bgh) / 2; } else { bgh = H; bgw = H * SEITE; ox = (W - bgw) / 2; }
      const s = liste.style;
      s.setProperty('--kh', H.toFixed(1) + 'px');
      s.setProperty('--r', R.toFixed(1) + 'px');
      s.setProperty('--sw', (sw + 0.9).toFixed(2) + 'px');
      s.setProperty('--schritt', sw.toFixed(3) + 'px');
      s.setProperty('--bgw', bgw.toFixed(1) + 'px'); s.setProperty('--bgh', bgh.toFixed(1) + 'px');
      s.setProperty('--ox', ox.toFixed(1) + 'px'); s.setProperty('--oy', oy.toFixed(1) + 'px');
      s.setProperty('--p', (R * 2.4).toFixed(0) + 'px');
      if (neuK !== K) {
        K = neuK;
        karten.forEach((k, i) => {
          const halter = k.querySelector('.ring-bild');
          halter.querySelectorAll('.streifen').forEach((x) => x.remove());
          for (let j = 0; j < K; j++) {
            const st = document.createElement('span');
            st.className = 'streifen' + (j === 0 ? ' erster' : '') + (j === K - 1 ? ' letzter' : '');
            st.style.setProperty('--j', j);
            st.style.setProperty('--a', (-(j - (K - 1) / 2) * delta).toFixed(5) + 'rad');
            halter.append(st);
          }
          bildSetzen(i);
        });
      } else {
        karten.forEach((k) => k.querySelectorAll('.streifen').forEach((st, j) => st.style.setProperty('--a', (-(j - (K - 1) / 2) * delta).toFixed(5) + 'rad')));
      }
    };
    const bildSetzen = (i) => {
      const img = bilder[i]; if (!img) return;
      const setzen = () => karten[i].querySelector('.ring-bild').style.setProperty('--bild', `url("${img.currentSrc || img.src}")`);
      img.complete && img.naturalWidth ? setzen() : img.addEventListener('load', setzen, { once: true });
    };

    let pos = 0, ziel = 0, tau = 140, aktiv = -1;
    let neigung = 0, neigungZiel = 0, kipp = { x: 0, y: 0 }, kippZiel = { x: 0, y: 0 };
    // Kein Hereindrehen: der Ring läuft von Anfang an ruhig und gleichmäßig
    const versatz = (i) => { let o = i - pos; o -= Math.round(o / n) * n; return o; };
    const index = (p) => ((Math.round(p) % n) + n) % n;

    const zeichnen = () => {
      for (let i = 0; i < n; i++) {
        const o = versatz(i), a = -o * schritt, b = Math.abs(o);
        const k = karten[i];
        const sichtbar = Math.abs(a) < 1.3;
        k.style.visibility = sichtbar ? 'visible' : 'hidden';
        if (!sichtbar) continue;
        k.style.transform = `translateZ(${R.toFixed(1)}px) rotateY(${a.toFixed(4)}rad)`;
        k.style.setProperty('--dunkel', Math.min(0.74, b * 0.5).toFixed(3));
        k.style.setProperty('--glanz', Math.max(0, 1 - b).toFixed(3));
      }
      welt.style.transform = `rotateX(${(neigung + kipp.y).toFixed(3)}deg) rotateY(${kipp.x.toFixed(3)}deg)`;
      const neu = index(pos);
      if (neu !== aktiv) { aktiv = neu; aktivZeigen(); }
    };

    const aktivZeigen = () => {
      karten.forEach((k, i) => {
        k.classList.toggle('aktiv', i === aktiv);
        k.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', i === aktiv ? '0' : '-1'));
      });
      const info = karten[aktiv].querySelector('.ring-info').cloneNode(true);
      info.classList.add('neu');
      panel.replaceChildren(info);
      if (zaehler) zaehler.textContent = String(aktiv + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    };

    /* Selbstlauf: dreht langsam von allein; jede Berührung pausiert, danach geht es weiter */
    // Läuft ständig; nur echtes Antippen oder Ziehen hält ihn kurz an
    const SEKUNDEN_JE_KARTE = 5.6;
    let autoAn = !ruhig, pauseBis = 0, ringSichtbar = false, driftet = false;
    const autoLaeuft = (jetzt) => autoAn && ringSichtbar && !zug && jetzt > pauseBis && !document.hidden;
    const pausieren = (ms = 5000) => { pauseBis = performance.now() + ms; if (driftet) { driftet = false; ziel = Math.round(pos); tau = 260; } anstossen(); };

    let bild = 0, zuletzt = 0;
    const schrittBild = (t) => {
      const dt = zuletzt ? Math.min(64, t - zuletzt) : 16; zuletzt = t;
      if (autoLaeuft(t)) {
        if (!driftet) { driftet = true; ziel = pos; }
        ziel += dt / (SEKUNDEN_JE_KARTE * 1000); tau = 120;
      } else if (driftet) { driftet = false; ziel = Math.round(pos); tau = 300; }
      const f = 1 - Math.exp(-dt / (ruhig ? 1 : tau));
      pos += (ziel - pos) * f;
      neigung += (neigungZiel - neigung) * (1 - Math.exp(-dt / 700));
      kipp.x += (kippZiel.x - kipp.x) * (1 - Math.exp(-dt / 260));
      kipp.y += (kippZiel.y - kipp.y) * (1 - Math.exp(-dt / 260));
      if (Math.abs(ziel - pos) < 0.0004) pos = ziel;
      zeichnen();
      const ruhe = pos === ziel && Math.abs(neigungZiel - neigung) < 0.01 && Math.abs(kippZiel.x - kipp.x) < 0.01 && Math.abs(kippZiel.y - kipp.y) < 0.01 && !autoLaeuft(t);
      // pausiert: nach Ablauf der Pause wieder anlaufen
      if (ruhe && autoAn && ringSichtbar && performance.now() <= pauseBis) setTimeout(anstossen, pauseBis - performance.now() + 20);
      bild = ruhe ? 0 : requestAnimationFrame(schrittBild);
      if (!bild) zuletzt = 0;
    };
    const anstossen = () => { if (!bild) bild = requestAnimationFrame(schrittBild); };
    const geheZu = (i) => {
      // kürzester Weg rund um den Ring
      let d = i - index(ziel); d -= Math.round(d / n) * n;
      ziel = Math.round(ziel) + d; anstossen();
    };

    masse();
    zeichnen();
    new ResizeObserver(() => { masse(); zeichnen(); }).observe(liste);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { ringSichtbar = e.isIntersecting; if (ringSichtbar) anstossen(); }, { threshold: 0.15 }).observe(liste);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { zuletzt = 0; anstossen(); } });
    liste.addEventListener('keydown', () => pausieren(8000));

    /* Ziehen und Wischen */
    let zug = null, gezogen = false;
    ringBox.querySelector('[data-ring-zurueck]')?.addEventListener('pointerdown', () => pausieren(5000));
    // Links nicht als Drag-and-Drop mitnehmen, sonst bricht der Browser das Ziehen ab
    liste.addEventListener('dragstart', (e) => e.preventDefault());
    karten.forEach((k) => k.querySelectorAll('a, img').forEach((x) => x.setAttribute('draggable', 'false')));
    liste.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      pausieren(5000);
      zug = { x: e.clientX, y: e.clientY, p: ziel, t: performance.now(), vx: 0, lx: e.clientX, lt: performance.now(), fest: false };
      gezogen = false;
    });
    addEventListener('pointermove', (e) => {
      if (feinZeiger && !zug) {
        const r = liste.getBoundingClientRect();
        if (e.clientY > r.top - 100 && e.clientY < r.bottom + 100) {
          kippZiel.x = ((e.clientX / innerWidth) - 0.5) * 5;
          kippZiel.y = -(((e.clientY - r.top) / r.height) - 0.5) * 4;
          anstossen();
        }
      }
      if (!zug) return;
      const dx = e.clientX - zug.x, dy = e.clientY - zug.y;
      if (!zug.fest) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { zug = null; return; }   // senkrecht: Seite scrollen
        if (Math.abs(dx) < 6) return;
        zug.fest = true; gezogen = true; liste.classList.add('zieht');
        try { liste.setPointerCapture(e.pointerId); } catch (x) { /* egal */ }
      }
      const jetzt = performance.now();
      zug.vx = (e.clientX - zug.lx) / Math.max(1, jetzt - zug.lt); zug.lx = e.clientX; zug.lt = jetzt;
      ziel = zug.p - dx / (W + abstandPx); tau = 50; anstossen();
    });
    const loslassen = () => {
      if (!zug) return;
      if (zug.fest) {
        const wurf = -zug.vx * 260 / (W + abstandPx);
        ziel = Math.round(ziel + klemmen(wurf, -2, 2)); tau = 200; anstossen();
      }
      zug = null; liste.classList.remove('zieht'); pausieren(4000);
    };
    addEventListener('pointerup', loslassen);
    addEventListener('pointercancel', loslassen);
    liste.addEventListener('click', (e) => {
      if (gezogen) { e.preventDefault(); e.stopPropagation(); gezogen = false; return; }
      const k = e.target.closest('.ring-karte'); if (!k) return;
      const i = karten.indexOf(k);
      if (i !== aktiv) { e.preventDefault(); tau = 260; geheZu(i); }
    }, true);
    liste.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); tau = 200; geheZu(index(ziel) + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tau = 200; geheZu(index(ziel) - 1); }
    });
    let radRuhe = 0;
    liste.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pausieren(6000); ziel += e.deltaX / (W * 1.4); tau = 90; anstossen();
      clearTimeout(radRuhe); radRuhe = setTimeout(() => { ziel = Math.round(ziel); tau = 220; anstossen(); }, 140);
    }, { passive: false });
    ringBox.querySelector('[data-ring-zurueck]')?.addEventListener('click', () => { pausieren(8000); tau = 220; geheZu(index(ziel) - 1); });
    ringBox.querySelector('[data-ring-vor]')?.addEventListener('click', () => { pausieren(8000); tau = 220; geheZu(index(ziel) + 1); });

    return {
      karten, geheZu: (i) => { pausieren(12000); tau = ruhig ? 1 : 420; geheZu(i); },
      neuZeigen: () => { aktiv = -1; zeichnen(); },
    };
  })();

  /* ---------- Kapitelleiste der Standortseiten ---------- */
  const kapLeiste = document.querySelector('.kapitel');
  if (kapLeiste && 'IntersectionObserver' in window) {
    const links = [...kapLeiste.querySelectorAll('a[href^="#"]')];
    const ziele = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const sichtbar = new Set();
    const b = new IntersectionObserver((es) => {
      for (const e of es) e.isIntersecting ? sichtbar.add(e.target) : sichtbar.delete(e.target);
      const aktiv = ziele.find((z) => sichtbar.has(z));
      links.forEach((a) => {
        const an = aktiv && a.getAttribute('href') === '#' + aktiv.id;
        a.classList.toggle('an', !!an);
        if (an && kapLeiste.scrollWidth > kapLeiste.clientWidth) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: ruhig ? 'auto' : 'smooth' });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ziele.forEach((z) => b.observe(z));
  }

  /* ---------- Welcher Salon liegt am nächsten? (nur im Browser) ---------- */
  const finderKnoepfe = document.querySelectorAll('[data-finder]');
  if (finderKnoepfe.length) {
    const antworten = document.querySelectorAll('.finder-antwort');
    const sagen = (html) => antworten.forEach((a) => { a.innerHTML = html; });
    if (!('geolocation' in navigator)) finderKnoepfe.forEach((k) => { k.hidden = true; });
    const km = (a, b) => {
      const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
      return 2 * 6371 * Math.asin(Math.sqrt(h));
    };
    const suchen = () => {
      sagen('Einen Moment, Ihr Standort wird ermittelt …');
      finderKnoepfe.forEach((k) => k.setAttribute('aria-busy', 'true'));
      navigator.geolocation.getCurrentPosition((p) => {
        finderKnoepfe.forEach((k) => k.removeAttribute('aria-busy'));
        const ich = { lat: p.coords.latitude, lon: p.coords.longitude };
        const karten = [...document.querySelectorAll('.ring-karte[data-lat]')];
        const liste = karten.map((k, i) => ({ k, i, d: km(ich, { lat: +k.dataset.lat, lon: +k.dataset.lon }) })).sort((a, b) => a.d - b.d);
        if (!liste.length) return;
        const { k, i, d } = liste[0];
        const weg = d < 1 ? Math.round(d * 1000) + ' m' : d.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' km';
        karten.forEach((x) => {
          const l = x.querySelector('.ring-lage');
          if (l?.dataset.text) { l.textContent = l.dataset.text; l.classList.remove('naechster'); }
        });
        const lage = k.querySelector('.ring-lage');
        if (lage) { lage.dataset.text = lage.textContent; lage.textContent = 'Am nächsten · ' + weg + ' Luftlinie'; lage.classList.add('naechster'); }
        const name = k.querySelector('h2')?.textContent || '';
        sagen(`<b>${name}</b> ist am nächsten – etwa ${weg}.`);
        const ziel = document.getElementById('salons');
        if (ziel && ziel.getBoundingClientRect().top > innerHeight * 0.4) ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' });
        if (ring) { ring.neuZeigen(); setTimeout(() => ring.geheZu(i), ruhig ? 0 : 450); }
        else k.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
      }, () => {
        finderKnoepfe.forEach((k) => k.removeAttribute('aria-busy'));
        sagen('Standort nicht verfügbar – wählen Sie Ihren Salon einfach im Ring.');
      }, { timeout: 10000, maximumAge: 300000 });
    };
    finderKnoepfe.forEach((k) => k.addEventListener('click', suchen));
  }

  /* ---------- Neonlinien zeichnen sich beim Hereinscrollen ---------- */
  if ('IntersectionObserver' in window) {
    const b = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('an'); b.unobserve(e.target); }
    }, { rootMargin: '0px 0px -15% 0px' });
    document.querySelectorAll('.trenner').forEach((t) => b.observe(t));
  }

  /* ---------- Preis-Studio: Reiter, Auswahl, Summe ---------- */
  const studio = document.querySelector('.preis-studio');
  if (studio) {
    studio.classList.add('ps-an');
    const reiter = [...studio.querySelectorAll('[data-reiter]')];
    const tafeln = [...studio.querySelectorAll('.ps-tafel')];
    const licht = studio.querySelector('.ps-licht');
    const leiste = studio.querySelector('.ps-reiter-leiste');
    const lichtSetzen = (r) => {
      if (!licht || !r) return;
      licht.style.setProperty('--x', r.offsetLeft + 'px');
      licht.style.setProperty('--b', r.offsetWidth + 'px');
    };
    const zeigen = (k, merk = true) => {
      reiter.forEach((r) => { const an = r.dataset.reiter === k; r.setAttribute('aria-selected', String(an)); r.tabIndex = an ? 0 : -1; if (an) lichtSetzen(r); });
      tafeln.forEach((tf) => { tf.hidden = tf.id !== 'art-' + k; });
      if (merk) merken('preis-art', k);
      const aktiv = reiter.find((r) => r.dataset.reiter === k);
      if (aktiv && leiste.scrollWidth > leiste.clientWidth) leiste.scrollTo({ left: aktiv.offsetLeft - 16, behavior: ruhig ? 'auto' : 'smooth' });
    };
    reiter.forEach((r, i) => {
      r.addEventListener('click', (e) => { e.preventDefault(); zeigen(r.dataset.reiter); });
      r.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); const n = reiter[(i + d + reiter.length) % reiter.length]; n.focus(); zeigen(n.dataset.reiter);
      });
    });
    const start = (location.hash.startsWith('#art-') && location.hash.slice(5)) || new URLSearchParams(location.search).get('art') || holen('preis-art') || reiter[0]?.dataset.reiter;
    zeigen(reiter.some((r) => r.dataset.reiter === start) ? start : reiter[0].dataset.reiter, false);
    new ResizeObserver(() => lichtSetzen(reiter.find((r) => r.getAttribute('aria-selected') === 'true'))).observe(leiste);

    // Auswahl und Summe
    const summe = studio.querySelector('[data-summe]');
    const auswahl = studio.querySelector('[data-auswahl]');
    const leeren = studio.querySelector('[data-leeren]');
    const box = studio.querySelector('.ps-summe');
    const rechnen = () => {
      const gew = [...studio.querySelectorAll('.ps-leistung[aria-pressed="true"]')];
      let min = 0, max = 0, offen = false, anfrage = false;
      for (const g of gew) {
        const a = g.dataset.min, b = g.dataset.max;
        if (!a) { anfrage = true; continue; }
        min += +a; if (b) max += +b; else { max += +a; offen = true; }
      }
      box.classList.toggle('voll', gew.length > 0);
      leeren.hidden = !gew.length;
      if (!gew.length) { summe.textContent = 'Tippen Sie Leistungen an'; auswahl.textContent = ''; return; }
      const preis = min === max ? (offen ? 'ab ' : '') + min + ' €' : (offen ? 'ab ' + min + ' €' : min + ' bis ' + max + ' €');
      summe.innerHTML = '<b>' + (min ? preis : 'Preis auf Anfrage') + '</b>' + (anfrage && min ? ' <small>plus Leistung auf Anfrage</small>' : '');
      auswahl.textContent = gew.length + (gew.length === 1 ? ' Leistung: ' : ' Leistungen: ') + gew.map((g) => g.dataset.name).join(', ');
      if (!ruhig) { summe.classList.remove('puls'); void summe.offsetWidth; summe.classList.add('puls'); }
    };
    studio.addEventListener('click', (e) => {
      const l = e.target.closest('.ps-leistung'); if (!l) return;
      l.setAttribute('aria-pressed', String(l.getAttribute('aria-pressed') !== 'true')); rechnen();
    });
    leeren.addEventListener('click', () => { studio.querySelectorAll('.ps-leistung[aria-pressed="true"]').forEach((l) => l.setAttribute('aria-pressed', 'false')); rechnen(); });
    rechnen();
  }

  /* ---------- Fan Card: stanzt sich selbst, Hologramm folgt dem Finger ---------- */
  const fan = document.querySelector('.karte-fan');
  if (fan) {
    if (!ruhig && 'IntersectionObserver' in window && fan.getBoundingClientRect().top > innerHeight * 0.85) {
      [...fan.querySelectorAll('.loch')].forEach((l, i) => l.style.setProperty('--i', i));
      fan.classList.add('wartet');
      const b = new IntersectionObserver((es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        b.disconnect(); requestAnimationFrame(() => fan.classList.add('da'));
      }, { rootMargin: '0px 0px -22% 0px' });
      b.observe(fan);
    }
    if (!ruhig) {
      const buehne = fan.parentElement;
      const bewegen = (x, y) => {
        const r = fan.getBoundingClientRect();
        const px = klemmen((x - r.left) / r.width, 0, 1), py = klemmen((y - r.top) / r.height, 0, 1);
        fan.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        fan.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        fan.style.setProperty('--ry', ((px - 0.5) * 18).toFixed(2) + 'deg');
        fan.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
      };
      buehne.addEventListener('pointermove', (e) => bewegen(e.clientX, e.clientY));
      buehne.addEventListener('pointerleave', () => { fan.style.setProperty('--rx', '0deg'); fan.style.setProperty('--ry', '0deg'); });
      if (!feinZeiger) {
        // Am Handy wandert das Hologramm beim Scrollen über die Karte
        addEventListener('scroll', () => {
          const r = fan.getBoundingClientRect();
          const p = klemmen(1 - (r.top + r.height) / (innerHeight + r.height), 0, 1);
          fan.style.setProperty('--mx', (p * 100).toFixed(1) + '%');
          fan.style.setProperty('--my', (30 + p * 40).toFixed(1) + '%');
        }, { passive: true });
      }
    }
  }

  /* ---------- Auftritt in Dreiergruppen ---------- */
  if (!ruhig && 'IntersectionObserver' in window) {
    const stuecke = [...document.querySelectorAll('.abschnitt-kopf, .haus-liste li, .galerie button, .insta-kacheln a, .ruf, .gruppe-kopf, .etage, .bald, .ring-kopf, .fuss-orte li')]
      .filter((el) => el.getBoundingClientRect().top > innerHeight);
    stuecke.forEach((el) => el.classList.add('auftritt'));
    const b = new IntersectionObserver((es) => {
      es.filter((e) => e.isIntersecting).forEach((e, i) => {
        setTimeout(() => e.target.classList.add('auftritt-da'), Math.floor(i / 3) * 90 + (i % 3) * 50);
        b.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -3% 0px' });
    stuecke.forEach((el) => b.observe(el));
  }

  /* ---------- Großes Bild mit Blättern und Rückkehr an dieselbe Stelle ---------- */
  const dialog = document.getElementById('gross');
  if (dialog && typeof dialog.showModal === 'function') {
    const fig = dialog.querySelector('figure');
    const img = document.createElement('img');
    img.decoding = 'async';
    fig.prepend(img);
    const unter = fig.querySelector('figcaption');
    let liste = [], pos = 0, zurueck = null;
    const zeigen = async (i) => {
      pos = (i + liste.length) % liste.length;
      const k = liste[pos];
      const neu = new Image(); neu.src = k.dataset.gross;
      try { await neu.decode(); } catch (e) { /* zeigt trotzdem */ }
      img.src = neu.src; img.alt = k.querySelector('img')?.alt || '';
      unter.textContent = img.alt + '  ·  ' + (pos + 1) + ' / ' + liste.length;
    };
    document.addEventListener('click', (e) => {
      const k = e.target.closest('[data-gross]'); if (!k) return;
      liste = [...k.parentElement.querySelectorAll('[data-gross]')];
      zurueck = k; zeigen(liste.indexOf(k)); dialog.showModal();
    });
    dialog.querySelector('.gross-vor')?.addEventListener('click', () => zeigen(pos + 1));
    dialog.querySelector('.gross-zurueck')?.addEventListener('click', () => zeigen(pos - 1));
    dialog.querySelector('.gross-zu')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') zeigen(pos + 1);
      if (e.key === 'ArrowLeft') zeigen(pos - 1);
    });
    let x0 = null;
    dialog.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    dialog.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) zeigen(pos + (dx < 0 ? 1 : -1));
    });
    dialog.addEventListener('close', () => zurueck?.focus({ preventScroll: true }));
  }

  /* ---------- Karte erst nach Klick laden (Datenschutz) ---------- */
  for (const knopf of document.querySelectorAll('[data-karte]')) {
    knopf.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = knopf.dataset.karte; f.title = knopf.dataset.titel || 'Karte';
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      knopf.closest('.karte-hier').replaceChildren(f);
    }, { once: true });
  }

  for (const j of document.querySelectorAll('[data-jahr]')) j.textContent = new Date().getFullYear();
})();
