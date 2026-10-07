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

  /* Weiche Nachführung ohne Überschwingen */
  function nachfuehren(anwenden, tau = 120) {
    let ist = null, ziel = 0, zuletzt = 0, bild = 0;
    const schritt = (t) => {
      const dt = zuletzt ? Math.min(64, t - zuletzt) : 16; zuletzt = t;
      ist += (ziel - ist) * (1 - Math.exp(-dt / tau));
      if (Math.abs(ziel - ist) < 0.0005) ist = ziel;
      anwenden(ist);
      bild = ist === ziel ? 0 : requestAnimationFrame(schritt);
      if (!bild) zuletzt = 0;
    };
    return (neu) => {
      ziel = neu;
      if (ist === null) { ist = neu; anwenden(ist); return; }
      if (!bild) bild = requestAnimationFrame(schritt);
    };
  }

  /* ---------- Leiste weicht aus ---------- */
  const leiste = document.querySelector('.leiste');
  const aktion = document.querySelector('.aktion');
  if (leiste) {
    let letzt = scrollY, weg = false;
    const pruefen = () => {
      const y = scrollY;
      leiste.classList.toggle('gerollt', y > 8);
      if (Math.abs(y - letzt) < 6) return;
      const runter = y > letzt; letzt = y;
      const neu = runter && y > 160 ? true : (!runter || y < 80) ? false : weg;
      if (neu !== weg) {
        weg = neu;
        leiste.classList.toggle('weg', weg);
        doc.classList.toggle('leiste-weg', weg);
      }
    };
    addEventListener('scroll', pruefen, { passive: true });
    pruefen();
  }

  /* Aktionsleiste am Handy: erst nach dem ersten Bildschirm, nicht über dem Fuß */
  if (aktion && 'IntersectionObserver' in window) {
    const auftakt = document.querySelector('.ort-auftakt');
    const fuss = document.querySelector('.fuss');
    let imAuftakt = true, imFuss = false;
    const setzen = () => aktion.classList.toggle('versteckt', imAuftakt || imFuss);
    const b = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === auftakt) imAuftakt = e.isIntersecting && e.intersectionRatio > 0.35;
        if (e.target === fuss) imFuss = e.isIntersecting;
      }
      setzen();
    }, { threshold: [0, 0.35, 0.6] });
    if (auftakt) b.observe(auftakt); else imAuftakt = false;
    if (fuss) b.observe(fuss);
    setzen();
  }

  /* ---------- Öffnungsstand nach Münchner Uhr ---------- */
  const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  function ladenzeit() {
    const t = Object.fromEntries(new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    const tag = { So: 0, Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6 }[t.weekday.replace('.', '')];
    return { tag, h: (+t.hour % 24) + t.minute / 60 };
  }
  const uhr = (h) => String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
  function stand(zeiten) {
    const { tag, h } = ladenzeit();
    const heute = zeiten[tag] || [];
    for (const [a, b] of heute) {
      if (h >= a && h < b) return { text: 'Jetzt geöffnet · bis ' + uhr(b) + ' Uhr', offen: true };
    }
    const spaeter = heute.find(([a]) => h < a);
    if (spaeter) return { text: 'Heute ab ' + uhr(spaeter[0]) + ' Uhr geöffnet', offen: false };
    for (let i = 1; i <= 7; i++) {
      const t = (tag + i) % 7;
      if ((zeiten[t] || []).length) {
        return { text: 'Geschlossen · ' + (i === 1 ? 'morgen' : TAGE[t]) + ' ab ' + uhr(zeiten[t][0][0]) + ' Uhr', offen: false };
      }
    }
    return null;
  }
  function staendeZeigen() {
    for (const el of document.querySelectorAll('[data-zeiten]')) {
      let zeiten; try { zeiten = JSON.parse(el.dataset.zeiten); } catch (e) { continue; }
      const s = stand(zeiten); if (!s) continue;
      el.textContent = s.text;
      el.classList.toggle('offen', s.offen);
    }
    const { tag } = ladenzeit();
    for (const tr of document.querySelectorAll('.zeiten tr[data-tag]')) {
      tr.classList.toggle('heute', +tr.dataset.tag === tag);
    }
  }
  staendeZeigen();
  setInterval(staendeZeigen, 60000);

  /* ---------- Spiegel: LED zieht sich, Glanz folgt dem Zeiger ---------- */
  const spiegel = [...document.querySelectorAll('.spiegel')];
  if (spiegel.length && 'IntersectionObserver' in window) {
    if (ruhig) spiegel.forEach((s) => s.classList.add('da'));
    else {
      spiegel.forEach((s) => s.classList.add('wartet'));
      let welle = 0, welleZeit = 0;
      const b = new IntersectionObserver((es) => {
        const neu = es.filter((e) => e.isIntersecting);
        const jetzt = performance.now();
        if (jetzt - welleZeit > 400) welle = 0;
        welleZeit = jetzt;
        neu.forEach((e) => {
          // höchstens drei zugleich, dann je 240 ms später
          const v = Math.floor(welle / 3) * 0.24 + (welle % 3) * 0.12; welle++;
          e.target.style.setProperty('--verz', v.toFixed(2) + 's');
          requestAnimationFrame(() => e.target.classList.add('da'));
          b.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      spiegel.forEach((s) => b.observe(s));
    }
  }

  if (!ruhig && spiegel.length) {
    const lichtSetzen = (s, x, y) => {
      s.style.setProperty('--lx', x.toFixed(1) + '%');
      s.style.setProperty('--ly', y.toFixed(1) + '%');
    };
    if (feinZeiger) {
      // Ein Licht im Raum: alle sichtbaren Spiegel reagieren auf denselben Zeiger
      let ziel = null, lauf = false;
      const zeichnen = () => {
        lauf = false;
        for (const s of spiegel) {
          const r = s.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) continue;
          const x = (ziel[0] - r.left) / r.width * 100, y = (ziel[1] - r.top) / r.height * 100;
          lichtSetzen(s, Math.max(-30, Math.min(130, x)), Math.max(-10, Math.min(95, y)));
        }
      };
      addEventListener('pointermove', (e) => {
        ziel = [e.clientX, e.clientY];
        if (!lauf) { lauf = true; requestAnimationFrame(zeichnen); }
      }, { passive: true });
    } else {
      // Am Handy wandert der Glanz beim Scrollen und Wischen
      for (const s of spiegel) {
        const setze = nachfuehren((p) => lichtSetzen(s, 10 + p * 90, 8 + p * 40), 140);
        const lesen = () => {
          const r = s.getBoundingClientRect();
          const py = 1 - (r.top + r.height) / (innerHeight + r.height);
          const px = (r.left + r.width / 2) / innerWidth;
          setze(Math.max(0, Math.min(1, py * 0.6 + (1 - px) * 0.4)));
        };
        addEventListener('scroll', lesen, { passive: true });
        s.closest('.reihe')?.addEventListener('scroll', lesen, { passive: true });
        lesen();
      }
    }
  }

  /* ---------- Spiegelreihe am Handy: Punkte ---------- */
  const reihe = document.querySelector('.reihe');
  const punkte = document.querySelector('.reihe-punkte');
  if (reihe && punkte) {
    const salons = [...reihe.children];
    salons.forEach((s, i) => {
      const k = document.createElement('button');
      k.type = 'button';
      k.setAttribute('aria-label', (s.querySelector('h2')?.textContent || 'Salon') + ' zeigen');
      k.addEventListener('click', () => s.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'nearest', inline: 'center' }));
      punkte.append(k);
    });
    const knoepfe = [...punkte.children];
    const markieren = () => {
      const mitte = reihe.scrollLeft + reihe.clientWidth / 2;
      let best = 0, abstand = Infinity;
      salons.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mitte);
        if (d < abstand) { abstand = d; best = i; }
      });
      knoepfe.forEach((k, i) => k.setAttribute('aria-current', String(i === best)));
    };
    reihe.addEventListener('scroll', () => requestAnimationFrame(markieren), { passive: true });
    markieren();
  }

  /* ---------- Welcher Salon liegt am nächsten? (nur im Browser) ---------- */
  const finder = document.getElementById('finder');
  if (finder && reihe) {
    const antwort = document.getElementById('finder-antwort');
    if (!('geolocation' in navigator)) finder.hidden = true;
    const km = (a, b) => {
      const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
      return 2 * 6371 * Math.asin(Math.sqrt(h));
    };
    finder.addEventListener('click', () => {
      finder.setAttribute('aria-busy', 'true');
      if (antwort) antwort.textContent = 'Einen Moment, Ihr Standort wird ermittelt …';
      navigator.geolocation.getCurrentPosition((p) => {
        finder.removeAttribute('aria-busy');
        const ich = { lat: p.coords.latitude, lon: p.coords.longitude };
        const liste = [...reihe.querySelectorAll('.salon[data-lat]')].map((s) => ({
          s, d: km(ich, { lat: +s.dataset.lat, lon: +s.dataset.lon }),
        })).sort((a, b) => a.d - b.d);
        if (!liste.length) return;
        reihe.querySelectorAll('.ist-naechster').forEach((s) => {
          s.classList.remove('ist-naechster');
          const l = s.querySelector('.salon-lage'); if (l?.dataset.text) l.textContent = l.dataset.text;
        });
        const { s, d } = liste[0];
        s.classList.add('ist-naechster');
        const name = s.querySelector('h2')?.textContent || '';
        const weg = d < 1 ? Math.round(d * 1000) + ' m' : d.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' km';
        const lage = s.querySelector('.salon-lage');
        if (lage) { lage.dataset.text = lage.textContent; lage.textContent = 'Am nächsten · ' + weg; }
        if (antwort) antwort.textContent = name + ' ist am nächsten – etwa ' + weg + ' Luftlinie.';
        s.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'center', inline: 'center' });
        s.querySelector('.spiegel')?.classList.add('streif');
        setTimeout(() => s.querySelector('.spiegel')?.classList.remove('streif'), 1200);
      }, () => {
        finder.removeAttribute('aria-busy');
        if (antwort) antwort.textContent = 'Standort nicht verfügbar – wählen Sie Ihren Salon einfach unten aus.';
      }, { timeout: 10000, maximumAge: 300000 });
    });
  }

  /* ---------- Kapitel in der Leiste + Lichtfuge ---------- */
  const anzeige = document.querySelector('.leiste-kapitel');
  const kapitel = [...document.querySelectorAll('section[data-kapitel]')];
  if (kapitel.length && 'IntersectionObserver' in window) {
    const fugen = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('kapitel-an'); fugen.unobserve(e.target); }
    }, { rootMargin: '0px 0px -20% 0px' });
    kapitel.forEach((k) => fugen.observe(k));
    if (anzeige) {
      const sichtbar = new Set();
      const b = new IntersectionObserver((es) => {
        for (const e of es) e.isIntersecting ? sichtbar.add(e.target) : sichtbar.delete(e.target);
        const text = kapitel.find((k) => sichtbar.has(k))?.dataset.kapitel || '';
        if (anzeige.textContent !== text) {
          anzeige.textContent = text;
          anzeige.classList.remove('neu'); void anzeige.offsetWidth; anzeige.classList.add('neu');
        }
      }, { rootMargin: '-30% 0px -60% 0px' });
      kapitel.forEach((k) => b.observe(k));
    }
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
      // nach dem Filtern an den Anfang der Liste, wenn er außer Sicht ist
      const start = preise.querySelector('.gruppen');
      const r = start.getBoundingClientRect();
      if (r.top < 0) start.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------- Fan Card: Löcher stanzen sich beim Hereinscrollen ---------- */
  const fan = document.querySelector('.karte-fan');
  if (fan && !ruhig && 'IntersectionObserver' in window && fan.getBoundingClientRect().top > innerHeight * 0.85) {
    [...fan.querySelectorAll('.loch')].forEach((l, i) => l.style.setProperty('--i', i));
    fan.classList.add('wartet');
    const b = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      b.disconnect();
      requestAnimationFrame(() => fan.classList.add('da'));
    }, { rootMargin: '0px 0px -22% 0px' });
    b.observe(fan);
  }

  /* ---------- Auftritt in Dreiergruppen ---------- */
  if (!ruhig && 'IntersectionObserver' in window) {
    const stuecke = [...document.querySelectorAll('.abschnitt-kopf, .stimme, .haus-liste li, .galerie button, .insta-kacheln a, .ruf, .gruppe-kopf, .etage, .bald')]
      .filter((el) => el.getBoundingClientRect().top > innerHeight);
    stuecke.forEach((el) => el.classList.add('auftritt'));
    const b = new IntersectionObserver((es) => {
      es.filter((e) => e.isIntersecting).forEach((e, i) => {
        setTimeout(() => e.target.classList.add('auftritt-da'), Math.floor(i / 3) * 90 + (i % 3) * 40);
        b.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
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
      const rahmen = knopf.closest('.karte-hier');
      const f = document.createElement('iframe');
      f.src = knopf.dataset.karte;
      f.title = knopf.dataset.titel || 'Karte';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      rahmen.replaceChildren(f);
    }, { once: true });
  }

  /* ---------- Jahreszahl im Fuß ---------- */
  for (const j of document.querySelectorAll('[data-jahr]')) j.textContent = new Date().getFullYear();
})();
