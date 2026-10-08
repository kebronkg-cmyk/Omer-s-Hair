/* Glas-Auftakt: Namen als gegossene Glasbuchstaben (wie in der Referenz), dazu Glas-Strähnen und
   auf den Salonseiten die Ladenfront, die sich im Glas bricht.
   Quelle für assets/js/glas3d.js, bündeln mit:
   npx esbuild tools/glas3d.src.js --bundle --minify --format=esm --outfile=assets/js/glas3d.js
   Steuerung über das <canvas class="glas-3d">:
     data-woerter="OMER'S|HAIR"   Wörter, | = neue Zeile (Umrisse aus tools/glyphen.json)
     data-foto="…webp"            optional: Bild hinter den Buchstaben
     data-straehnen="8"           Anzahl Glas-Strähnen */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BufferGeometry, BufferAttribute,
  MeshPhysicalMaterial, MeshBasicMaterial, PlaneGeometry, BoxGeometry, PMREMGenerator, ShapePath,
  ExtrudeGeometry, TextureLoader, CatmullRomCurve3, Vector3, Color, NeutralToneMapping, SRGBColorSpace, BackSide,
} from 'three';
import GLYPHEN from './glyphen.json';

const leinwand = document.querySelector('.glas-3d');
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const klein = matchMedia('(max-width: 52rem)').matches;

function webglMoeglich() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}
if (leinwand && webglMoeglich()) start();

/* Umgebung zum Spiegeln: dunkler Raum mit schmalen Lichtleisten in Blau und Weiß */
function umgebung(renderer) {
  const raum = new Scene();
  raum.background = new Color('#050507');
  raum.add(new Mesh(new BoxGeometry(30, 30, 30), new MeshBasicMaterial({ color: '#07070b', side: BackSide })));
  const leiste = (farbe, x, y, z, b, h, ry = 0, rx = 0, staerke = 1) => {
    const m = new Mesh(new PlaneGeometry(b, h), new MeshBasicMaterial({ color: new Color(farbe).multiplyScalar(staerke) }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); raum.add(m);
  };
  leiste('#3f82ff', -9, 2, -6, 1.1, 18, 0.6, 0, 9.0);
  leiste('#2a6bff', 9, -1, -5, 1.2, 16, -0.6, 0, 8.0);
  leiste('#3f82ff', 0, -9, 4, 20, 0.9, 0, -1.2, 6.0);
  leiste('#ffffff', 0, 11, 0, 16, 1.0, 0, 1.5, 7.0);
  leiste('#ffffff', -12, 0, 6, 0.5, 18, 1.4, 0, 5.0);
  leiste('#8fbaff', 12, 4, 8, 0.4, 14, -1.6, 0, 5.0);
  leiste('#ffffff', 4, -3, 13, 0.6, 10, Math.PI, 0, 4.0);
  leiste('#d9e7ff', 0, 2, 14, 22, 0.25, Math.PI, 0, 4.0);
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(raum, 0.03).texture;
  pmrem.dispose();
  return env;
}

/* Strähne: Röhre entlang einer Kurve, zu den Enden hin schmaler */
function straehne(kurve, radius, segmente, rund) {
  const rahmen = kurve.computeFrenetFrames(segmente, false);
  const pos = new Float32Array((segmente + 1) * (rund + 1) * 3);
  const nor = new Float32Array(pos.length);
  const idx = [];
  const p = new Vector3(), n = new Vector3();
  for (let i = 0; i <= segmente; i++) {
    const t = i / segmente;
    kurve.getPointAt(t, p);
    const N = rahmen.normals[i], B = rahmen.binormals[i];
    const r = radius * (0.18 + 0.82 * Math.pow(Math.sin(Math.PI * t), 0.55));
    for (let j = 0; j <= rund; j++) {
      const w = (j / rund) * Math.PI * 2;
      const s = Math.sin(w), c = -Math.cos(w);
      n.set(c * N.x + s * B.x, c * N.y + s * B.y, c * N.z + s * B.z).normalize();
      const k = i * (rund + 1) + j;
      pos[k * 3] = p.x + r * n.x; pos[k * 3 + 1] = p.y + r * n.y; pos[k * 3 + 2] = p.z + r * n.z;
      nor[k * 3] = n.x; nor[k * 3 + 1] = n.y; nor[k * 3 + 2] = n.z;
    }
  }
  for (let i = 0; i < segmente; i++) for (let j = 0; j < rund; j++) {
    const a = i * (rund + 1) + j, b = (i + 1) * (rund + 1) + j;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('normal', new BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

/* Wort aus den gespeicherten Umrissen (Einheiten: Schriftgröße 100) */
function wortFormen(wort) {
  const d = GLYPHEN[wort];
  const sp = new ShapePath();
  for (const [typ, ...z] of d.c) {
    if (typ === 'M') sp.moveTo(z[0], z[1]);
    else if (typ === 'L') sp.lineTo(z[0], z[1]);
    else if (typ === 'Q') sp.quadraticCurveTo(z[0], z[1], z[2], z[3]);
    else if (typ === 'C') sp.bezierCurveTo(z[0], z[1], z[2], z[3], z[4], z[5]);
  }
  return { formen: sp.toShapes(true), b: d.b, h: d.h };
}

function start() {
  const renderer = new WebGLRenderer({ canvas: leinwand, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, klein ? 1.5 : 1.75));
  renderer.toneMapping = NeutralToneMapping;   // hält Blau rein (ACES kippt gesättigtes Blau ins Violette)
  renderer.toneMappingExposure = 1.22;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.transmissionResolutionScale = klein ? 0.5 : 0.75;

  const szene = new Scene();
  szene.environment = umgebung(renderer);
  szene.background = new Color('#050507');
  const kamera = new PerspectiveCamera(32, 1, 0.1, 100);
  kamera.position.set(0, 0, 12);

  const zeit = { value: 0 };
  const wogen = (m) => {
    m.onBeforeCompile = (s) => {
      s.uniforms.uZeit = zeit;
      s.vertexShader = 'uniform float uZeit;\n' + s.vertexShader.replace('#include <begin_vertex>', `
        vec3 transformed = vec3(position);
        float lauf = clamp((position.x + 10.0) / 20.0, 0.0, 1.0);
        float welle = sin(position.x * 0.55 + uZeit * 0.55) * 0.32 + sin(position.x * 1.3 - uZeit * 0.8 + position.z) * 0.08;
        transformed.y += welle * smoothstep(0.0, 0.25, lauf) * smoothstep(1.0, 0.75, lauf);
        transformed.z += cos(position.x * 0.4 + uZeit * 0.45) * 0.25;`);
    };
    return m;
  };
  const glasStoff = (dicke, tiefe) => new MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0, roughness: 0.03, transmission: 1, thickness: dicke, ior: 1.52,
    attenuationColor: new Color('#5b95ff'), attenuationDistance: tiefe,
    clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, envMapIntensity: 1.9,
  });
  const chrom = (farbe) => wogen(new MeshPhysicalMaterial({ color: farbe, metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.5 }));
  const leuchten = (farbe, staerke) => new MeshBasicMaterial({ color: new Color(farbe).multiplyScalar(staerke), toneMapped: false });

  /* Strähnen */
  const strang = new Group();
  szene.add(strang);
  const ANZAHL = Math.round((+leinwand.dataset.straehnen || 0) * (klein ? 0.75 : 1));
  const segmente = klein ? 200 : 320, rund = klein ? 18 : 26;
  for (let i = 0; i < ANZAHL; i++) {
    const f = ANZAHL > 1 ? i / (ANZAHL - 1) - 0.5 : 0;
    const spreiz = 1 - Math.abs(f) * 0.6;
    const kurve = new CatmullRomCurve3([
      new Vector3(-10, -3.8 + f * 5.4, -1.5 + f * 2.6), new Vector3(-5.4, -1.8 + f * 2.8, 0.6 + f * 1.4),
      new Vector3(-1.4, 0.0 + f * 1.8, 1.6 * spreiz), new Vector3(2.2, 0.8 + f * 2.0, 0.4 - f * 1.6),
      new Vector3(5.6, 2.0 + f * 3.2, -0.4 - f * 2.0), new Vector3(10, 3.6 + f * 5.6, -2.0 + f * 1.8),
    ], false, 'catmullrom', 0.5);
    const r = 0.21 + (1 - Math.abs(f) * 1.3) * 0.12 + (i % 3 === 0 ? 0.07 : 0);
    if (i % 3 === 1) strang.add(new Mesh(straehne(kurve, r * 0.55, segmente, rund), chrom(i % 2 ? '#ffffff' : '#a8c6ff')));
    else {
      strang.add(new Mesh(straehne(kurve, r * 0.8, segmente, rund), wogen(glasStoff(1.1, 3.2))));
      strang.add(new Mesh(straehne(kurve, r * 0.16, Math.round(segmente * 0.6), 8), wogen(leuchten(i % 2 ? '#ffffff' : '#3f82ff', i % 2 ? 1.3 : 2.0))));
    }
  }
  strang.rotation.set(0.12, -0.18, -0.08);
  if (leinwand.dataset.foto) { strang.position.z = -6; strang.scale.setScalar(1.5); }   // Strähnen hinter der Ladenfront

  /* Glasbuchstaben: gegossenes Glas mit Fase, innen ein leuchtender blauer Kern */
  const zeilen = (leinwand.dataset.woerter || '').split('|').filter((w) => GLYPHEN[w]);
  const wort = new Group();
  const SK = 0.01;   // Schrifteinheiten → Welt
  let wortB = 0, wortH = 0;
  const glasBuchstaben = glasStoff(1.6, leinwand.dataset.foto ? 2.4 : 3.5);
  const kanteBuchstaben = new MeshPhysicalMaterial({
    color: '#9cc2ff', emissive: new Color('#2f74ff'), emissiveIntensity: 0.55, metalness: 0.1, roughness: 0.05,
    transmission: 0.55, thickness: 1, ior: 1.5, clearcoat: 1, envMapIntensity: 2.4,
  });
  glasBuchstaben.envMapIntensity = 2.6;
  // dunkelblauer Kern: das Glas bleibt klar, Kanten und Spiegelungen tragen die Form
  const kernBuchstaben = leuchten('#2f74ff', 0.9);
  zeilen.forEach((w, zi) => {
    const { formen, b, h } = wortFormen(w);
    const tiefe = 26;
    const glas = new ExtrudeGeometry(formen, { depth: tiefe, bevelEnabled: true, bevelThickness: 5, bevelSize: 2.4, bevelSegments: klein ? 3 : 5, curveSegments: klein ? 6 : 10 });
    const kern = new ExtrudeGeometry(formen, { depth: 2, bevelEnabled: false, curveSegments: klein ? 6 : 10 });
    const zeile = new Group();
    // Gruppe 0 = Vorder- und Rückseite (klares Glas), Gruppe 1 = Seiten und Fase (leuchtende Kante)
    const g = new Mesh(glas, [glasBuchstaben, kanteBuchstaben]);
    const k = new Mesh(kern, kernBuchstaben);
    k.position.z = tiefe * 0.35;
    k.scale.set(1, 1, 1);
    // auf dunklem Grund (Startseite) trägt ein blauer Kern die Form, vor dem Foto bleibt das Glas klar
    if (!leinwand.dataset.foto) zeile.add(k);
    zeile.add(g);
    zeile.scale.setScalar(SK);
    zeile.position.set(-b * SK / 2, -(zi * 108 + h) * SK, 0);
    wort.add(zeile);
    wortB = Math.max(wortB, b * SK);
    wortH = (zi * 108 + h) * SK;
  });
  const wortHalter = new Group();
  wortHalter.add(wort);
  wort.position.y = wortH / 2;
  szene.add(wortHalter);

  /* Foto hinter den Buchstaben (Ladenfront) */
  let foto = null, fotoSeite = 1.5;
  if (leinwand.dataset.foto) {
    const tex = new TextureLoader().load(leinwand.dataset.foto, (t) => { fotoSeite = t.image.width / t.image.height; groesse(); einmal(); });
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    foto = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: tex, toneMapped: false }));
    szene.add(foto);
  }

  /* Größe und Aufbau je nach Format */
  let basisZ = -0.08, hochkant = false;
  const sichtHoehe = (z) => 2 * Math.tan((kamera.fov * Math.PI) / 360) * (kamera.position.z - z);
  function groesse() {
    const b = leinwand.clientWidth, h = leinwand.clientHeight;
    if (!b || !h) return;
    renderer.setSize(b, h, false);
    kamera.aspect = b / h;
    hochkant = kamera.aspect < 0.9;
    kamera.position.z = kamera.aspect < 0.8 ? 21 : kamera.aspect < 1.2 ? 16 : 12;
    basisZ = kamera.aspect < 0.8 ? 0.62 : -0.08;
    kamera.updateProjectionMatrix();
    const zW = 1.2, vh = sichtHoehe(zW), vw = vh * kamera.aspect;
    if (wortB) {
      // Wort füllt die Breite; mit Foto sitzt es im unteren Drittel und überlappt das Bild
      const s = Math.min((vw * (foto ? 0.9 : 0.92)) / wortB, (vh * (foto ? (hochkant ? 0.24 : 0.36) : (hochkant ? 0.4 : 0.5))) / wortH);
      wortHalter.scale.setScalar(s);
      wortHalter.position.set(0, foto ? -vh * (hochkant ? 0.24 : 0.15) : vh * (hochkant ? 0.2 : 0.12), zW);
    }
    if (foto) {
      const zF = -2.2, fh = sichtHoehe(zF), fw = fh * kamera.aspect;
      let w = fw * (hochkant ? 0.96 : 0.66), hh = w / fotoSeite;
      if (hh > fh * (hochkant ? 0.6 : 0.78)) { hh = fh * (hochkant ? 0.6 : 0.78); w = hh * fotoSeite; }
      foto.scale.set(w, hh, 1);
      foto.position.set(0, fh * (hochkant ? 0.13 : 0.08), zF);
    }
  }
  groesse();
  new ResizeObserver(groesse).observe(leinwand);

  /* Zeiger und Scrollen */
  const ziel = { x: 0, y: 0, s: 0 }, ist = { x: 0, y: 0, s: 0 };
  addEventListener('pointermove', (e) => { ziel.x = (e.clientX / innerWidth - 0.5) * 2; ziel.y = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  addEventListener('scroll', () => { ziel.s = Math.min(1, scrollY / innerHeight); }, { passive: true });

  let sichtbar = true, lauf = 0, letzt = performance.now(), t0 = performance.now();
  const zeichnen = (t) => {
    const dt = Math.min(0.05, (t - letzt) / 1000); letzt = t;
    if (!ruhig) zeit.value += dt;
    const k = 1 - Math.exp(-dt * 3);
    ist.x += (ziel.x - ist.x) * k; ist.y += (ziel.y - ist.y) * k; ist.s += (ziel.s - ist.s) * k;
    const sek = (t - t0) / 1000;
    strang.rotation.y = -0.18 + ist.x * 0.22 + ist.s * 0.5;
    strang.rotation.x = 0.12 + ist.y * 0.14 - ist.s * 0.2;
    strang.rotation.z = basisZ;
    strang.position.y = ist.s * 1.6 + (leinwand.dataset.foto ? 1.5 : 0);
    // Buchstaben liegen schräg im Raum wie in der Referenz und schweben ganz leicht
    const welle = ruhig ? 0 : Math.sin(sek * 0.45) * 0.035;
    wortHalter.rotation.set(-0.42 + ist.y * 0.06 + welle * 0.5, (hochkant ? 0.1 : 0.22) + ist.x * 0.12 + welle, hochkant ? 0.05 : 0.07);
    if (foto) { foto.rotation.set(ist.y * 0.02, -0.03 + ist.x * 0.05, 0); }
    renderer.render(szene, kamera);
    lauf = sichtbar && !ruhig && !document.hidden ? requestAnimationFrame(zeichnen) : 0;
  };
  const einmal = () => { if (!lauf) requestAnimationFrame(zeichnen); };
  renderer.compile(szene, kamera);
  requestAnimationFrame((t) => {
    letzt = t; zeichnen(t);
    leinwand.classList.add('bereit');
    leinwand.closest('[data-glas]')?.classList.add('glas-an');
  });
  new IntersectionObserver(([e]) => {
    sichtbar = e.isIntersecting;
    if (sichtbar && !lauf && !ruhig) { letzt = performance.now(); lauf = requestAnimationFrame(zeichnen); }
  }).observe(leinwand);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && sichtbar && !ruhig && !lauf) { letzt = performance.now(); lauf = requestAnimationFrame(zeichnen); }
  });
  if (ruhig) addEventListener('resize', () => requestAnimationFrame(zeichnen));
}
