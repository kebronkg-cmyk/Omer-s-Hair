/* Auftakt der Startseite: fließende Haarsträhnen aus Chrom, Spiegelungen in den Neonfarben des Salons.
   Quelle für assets/js/hero3d.js — gebündelt mit:  npx esbuild tools/hero3d.src.js --bundle --minify --format=esm --outfile=assets/js/hero3d.js */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BufferGeometry, BufferAttribute,
  MeshPhysicalMaterial, MeshBasicMaterial, PlaneGeometry, BoxGeometry, PMREMGenerator,
  CatmullRomCurve3, Vector3, Color, NeutralToneMapping, SRGBColorSpace, BackSide, MathUtils,
} from 'three';

const leinwand = document.querySelector('.auftakt-3d');
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const klein = matchMedia('(max-width: 52rem)').matches;

function webglMoeglich() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

if (leinwand && webglMoeglich()) start();

/* Umgebung zum Spiegeln: dunkler Raum mit Lichtleisten in Blau, Violett, Pink und Weiß */
function umgebung(renderer) {
  const raum = new Scene();
  raum.background = new Color('#050507');
  const huelle = new Mesh(new BoxGeometry(30, 30, 30), new MeshBasicMaterial({ color: '#07070b', side: BackSide }));
  raum.add(huelle);
  const leiste = (farbe, x, y, z, b, h, ry = 0, rx = 0, staerke = 1) => {
    const m = new Mesh(new PlaneGeometry(b, h), new MeshBasicMaterial({ color: new Color(farbe).multiplyScalar(staerke) }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); raum.add(m);
  };
  // Schmale, harte Lichtleisten: auf Glas entstehen so scharfe Kanten statt Flächen
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
  const uvs = new Float32Array((segmente + 1) * (rund + 1) * 2);
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
      const k = (i * (rund + 1) + j);
      pos[k * 3] = p.x + r * n.x; pos[k * 3 + 1] = p.y + r * n.y; pos[k * 3 + 2] = p.z + r * n.z;
      nor[k * 3] = n.x; nor[k * 3 + 1] = n.y; nor[k * 3 + 2] = n.z;
      uvs[k * 2] = t; uvs[k * 2 + 1] = j / rund;
    }
  }
  for (let i = 0; i < segmente; i++) for (let j = 0; j < rund; j++) {
    const a = i * (rund + 1) + j, b = (i + 1) * (rund + 1) + j;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('normal', new BufferAttribute(nor, 3));
  g.setAttribute('uv', new BufferAttribute(uvs, 2));
  g.setIndex(idx);
  return g;
}

function start() {
  const renderer = new WebGLRenderer({ canvas: leinwand, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, klein ? 1.5 : 1.75));
  renderer.toneMapping = NeutralToneMapping;   // hält Blau rein (ACES kippt gesättigtes Blau ins Violette)
  renderer.toneMappingExposure = 1.22;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.transmissionResolutionScale = klein ? 0.5 : 0.75;   // Glas-Durchsicht in halber Auflösung reicht, spart Leistung

  const szene = new Scene();
  szene.environment = umgebung(renderer);
  szene.background = new Color('#050507');   // Glas bricht dunklen Grund statt leeren Puffer
  const kamera = new PerspectiveCamera(32, 1, 0.1, 100);
  kamera.position.set(0, 0, 12);

  const zeit = { value: 0 };
  // Strähnen wogen: Verschiebung quer zur Laufrichtung, weich und langsam (gilt für alle Stoffe gleich)
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
  // Klares Glas mit blauer Tiefe, wie die gegossenen Buchstaben der Referenz
  const glas = () => wogen(new MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0, roughness: 0.035, transmission: 1, thickness: 1.1, ior: 1.52,
    attenuationColor: new Color('#5b95ff'), attenuationDistance: 3.2,
    clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, envMapIntensity: 1.8,
  }));
  const chrom = (farbe) => wogen(new MeshPhysicalMaterial({ color: farbe, metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.5 }));
  // Leuchtender Kern im Glas
  const kern = (farbe, staerke) => wogen(new MeshBasicMaterial({ color: new Color(farbe).multiplyScalar(staerke), toneMapped: false }));

  const gruppe = new Group();
  szene.add(gruppe);
  const ANZAHL = klein ? 6 : 8;
  const segmente = klein ? 240 : 360, rund = klein ? 20 : 28;
  for (let i = 0; i < ANZAHL; i++) {
    const f = i / (ANZAHL - 1) - 0.5;
    const spreiz = 1 - Math.abs(f) * 0.6;
    // Schwung wie im Logo: links unten herein, Bogen, rechts oben hinaus — die Enden fächern auf
    const pts = [
      new Vector3(-10, -3.8 + f * 5.4, -1.5 + f * 2.6),
      new Vector3(-5.4, -1.8 + f * 2.8, 0.6 + f * 1.4),
      new Vector3(-1.4, 0.0 + f * 1.8, 1.6 * spreiz),
      new Vector3(2.2, 0.8 + f * 2.0, 0.4 - f * 1.6),
      new Vector3(5.6, 2.0 + f * 3.2, -0.4 - f * 2.0),
      new Vector3(10, 3.6 + f * 5.6, -2.0 + f * 1.8),
    ];
    const kurve = new CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    const r = 0.21 + (1 - Math.abs(f) * 1.3) * 0.12 + (i % 3 === 0 ? 0.07 : 0);
    if (i % 3 === 1) {
      gruppe.add(new Mesh(straehne(kurve, r * 0.55, segmente, rund), chrom(i % 2 ? '#ffffff' : '#a8c6ff')));
    } else {
      gruppe.add(new Mesh(straehne(kurve, r * 0.8, segmente, rund), glas()));
      gruppe.add(new Mesh(straehne(kurve, r * 0.16, Math.round(segmente * 0.6), 8), kern(i % 2 ? '#ffffff' : '#3f82ff', i % 2 ? 1.3 : 2.0)));
    }
  }
  gruppe.rotation.set(0.12, -0.18, -0.08);
  let basisZ = -0.08;

  /* Größe */
  const groesse = () => {
    const b = leinwand.clientWidth, h = leinwand.clientHeight;
    if (!b || !h) return;
    renderer.setSize(b, h, false);
    kamera.aspect = b / h;
    // Am Handy weiter weg, damit der Schwung als Ganzes zu sehen ist
    kamera.position.z = kamera.aspect < 0.8 ? 21 : kamera.aspect < 1.2 ? 16 : 12;
    basisZ = kamera.aspect < 0.8 ? 0.62 : -0.08;   // am Handy steiler, damit der Schwung diagonal durchs Bild läuft
    kamera.updateProjectionMatrix();
  };
  groesse();
  new ResizeObserver(groesse).observe(leinwand);

  /* Zeiger und Scrollen */
  const ziel = { x: 0, y: 0, s: 0 }, ist = { x: 0, y: 0, s: 0 };
  addEventListener('pointermove', (e) => {
    ziel.x = (e.clientX / innerWidth - 0.5) * 2;
    ziel.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  addEventListener('scroll', () => { ziel.s = Math.min(1, scrollY / innerHeight); }, { passive: true });

  let sichtbar = true, lauf = 0, letzt = performance.now();
  const bild = (t) => {
    const dt = Math.min(0.05, (t - letzt) / 1000); letzt = t;
    if (!ruhig) zeit.value += dt;
    const k = 1 - Math.exp(-dt * 3);
    ist.x += (ziel.x - ist.x) * k; ist.y += (ziel.y - ist.y) * k; ist.s += (ziel.s - ist.s) * k;
    gruppe.rotation.y = -0.18 + ist.x * 0.22 + ist.s * 0.5;
    gruppe.rotation.x = 0.12 + ist.y * 0.14 - ist.s * 0.2;
    gruppe.rotation.z = basisZ;
    gruppe.position.y = ist.s * 1.6;
    renderer.render(szene, kamera);
    lauf = sichtbar && !ruhig ? requestAnimationFrame(bild) : 0;
  };
  // Erstes Bild: ohne Ruckeln einblenden
  renderer.compile(szene, kamera);
  requestAnimationFrame((t) => { letzt = t; bild(t); leinwand.classList.add('bereit'); });

  new IntersectionObserver(([e]) => {
    sichtbar = e.isIntersecting;
    if (sichtbar && !lauf && !ruhig) { letzt = performance.now(); lauf = requestAnimationFrame(bild); }
  }).observe(leinwand);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(lauf); lauf = 0; }
    else if (sichtbar && !ruhig && !lauf) { letzt = performance.now(); lauf = requestAnimationFrame(bild); }
  });
  if (ruhig) addEventListener('resize', () => requestAnimationFrame(bild));
}
