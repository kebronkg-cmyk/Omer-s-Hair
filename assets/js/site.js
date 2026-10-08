/* Omer's Hair Professional — Funktionen aller Seiten.
   Jede Funktion steigt still aus, wenn ihr Element fehlt. Ohne Skript steht die Seite vollständig da. */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.remove('js-aus');
  doc.classList.add('js');

  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const feinZeiger = matchMedia('(hover: hover) and (pointer: fine)').matches;
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
  menue?.addEventListener('click', (e) => { if (e.target.closest('a')) menue.hidePopover?.(); });

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
      W = schmal ? Math.min(vw * 0.74, 400) : klemmen(vw * 0.33, 340, 520);
      const H = Math.min(W * 1.25, innerHeight * (schmal ? 0.56 : 0.6));
      R = W * (schmal ? 1.45 : 1.7);
      const neuK = schmal ? 9 : 14;
      const theta = W / R, delta = theta / neuK;
      const sw = 2 * R * Math.tan(delta / 2);
      abstandPx = schmal ? 16 : 34;
      schritt = theta + abstandPx / R;
      // Bild wie object-fit: cover (Bilder sind 4:5)
      let bgw, bgh, ox = 0, oy = 0;
      if (W / H > 0.8) { bgw = W; bgh = W / 0.8; oy = (H - bgh) / 2; } else { bgh = H; bgw = H * 0.8; ox = (W - bgw) / 2; }
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
    let intro = !ruhig, introStart = 0;
    if (intro) { pos = -2.6; neigung = 16; neigungZiel = 16; welt.style.opacity = '0'; }
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

    let bild = 0, zuletzt = 0;
    const schrittBild = (t) => {
      const dt = zuletzt ? Math.min(64, t - zuletzt) : 16; zuletzt = t;
      if (intro) {
        const p = klemmen((t - introStart) / 2200, 0, 1);
        welt.style.opacity = String(klemmen(p * 2.4, 0, 1));
        if (p >= 1) { intro = false; tau = 140; }
      }
      const f = 1 - Math.exp(-dt / (ruhig ? 1 : tau));
      pos += (ziel - pos) * f;
      neigung += (neigungZiel - neigung) * (1 - Math.exp(-dt / 700));
      kipp.x += (kippZiel.x - kipp.x) * (1 - Math.exp(-dt / 260));
      kipp.y += (kippZiel.y - kipp.y) * (1 - Math.exp(-dt / 260));
      if (Math.abs(ziel - pos) < 0.0004) pos = ziel;
      zeichnen();
      const ruhe = pos === ziel && Math.abs(neigungZiel - neigung) < 0.01 && Math.abs(kippZiel.x - kipp.x) < 0.01 && Math.abs(kippZiel.y - kipp.y) < 0.01 && !intro;
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

    /* Hereindrehen, sobald der Ring ins Bild kommt */
    if (intro && 'IntersectionObserver' in window) {
      const b = new IntersectionObserver((es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        b.disconnect();
        introStart = performance.now(); tau = 520; ziel = 0; neigungZiel = 0; anstossen();
      }, { threshold: 0.25 });
      b.observe(liste);
    } else { intro = false; welt.style.opacity = '1'; }

    /* Ziehen und Wischen */
    let zug = null, gezogen = false;
    // Links nicht als Drag-and-Drop mitnehmen, sonst bricht der Browser das Ziehen ab
    liste.addEventListener('dragstart', (e) => e.preventDefault());
    karten.forEach((k) => k.querySelectorAll('a, img').forEach((x) => x.setAttribute('draggable', 'false')));
    liste.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
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
      zug = null; liste.classList.remove('zieht');
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
      ziel += e.deltaX / (W * 1.4); tau = 90; anstossen();
      clearTimeout(radRuhe); radRuhe = setTimeout(() => { ziel = Math.round(ziel); tau = 220; anstossen(); }, 140);
    }, { passive: false });
    ringBox.querySelector('[data-ring-zurueck]')?.addEventListener('click', () => { tau = 220; geheZu(index(ziel) - 1); });
    ringBox.querySelector('[data-ring-vor]')?.addEventListener('click', () => { tau = 220; geheZu(index(ziel) + 1); });

    return {
      karten, geheZu: (i) => { tau = ruhig ? 1 : 420; if (intro) { intro = false; welt.style.opacity = '1'; neigungZiel = 0; } geheZu(i); },
      neuZeigen: () => { aktiv = -1; zeichnen(); },
    };
  })();

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

  /* ---------- Preisliste: Wahl merken, per Adresse ansteuern ---------- */
  const preise = document.querySelector('.preise');
  if (preise) {
    const aus = new URLSearchParams(location.search).get('art') || (location.hash.startsWith('#art-') ? location.hash.slice(5) : null);
    const wahl = aus || holen('preis-art');
    if (wahl) preise.querySelector(`input[name="art"][value="${CSS.escape(wahl)}"]`)?.click();
    preise.addEventListener('change', (e) => {
      if (e.target.name !== 'art') return;
      merken('preis-art', e.target.value);
      const start = preise.querySelector('.gruppen');
      if (start.getBoundingClientRect().top < 0) start.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
    });
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
