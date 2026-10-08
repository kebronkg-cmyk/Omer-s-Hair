// Wandelt die Wörter der Glas-Schrift in Umrisse um (Jost 700), damit die Seite keine Schriftdatei für 3D braucht.
//   node tools/glyphen.mjs <pfad-zu-jost-latin-700-normal.woff>
import fs from 'node:fs';
import opentype from 'opentype.js';
const WOERTER = ["OMER'S", 'HAIR', 'MIRA', 'BARBER', 'RIEM', 'ISARTOR'];
const font = opentype.parse(fs.readFileSync(process.argv[2]).buffer);
const aus = {};
for (const w of WOERTER) {
  const p = font.getPath(w, 0, 0, 100, { kerning: true, letterSpacing: -0.02 });
  const bb = p.getBoundingBox();
  const r = (v) => Math.round(v * 10) / 10;
  aus[w] = { b: r(bb.x2 - bb.x1), h: r(bb.y2 - bb.y1), c: p.commands.map((c) => [c.type, ...['x1', 'y1', 'x2', 'y2', 'x', 'y'].filter((k) => k in c).map((k) => r(k.startsWith('x') ? c[k] - bb.x1 : -(c[k] - bb.y2)))]) };
}
fs.writeFileSync(new URL('./glyphen.json', import.meta.url), JSON.stringify(aus));
console.log(Object.fromEntries(Object.entries(aus).map(([k, v]) => [k, v.b + 'x' + v.h + ' ' + v.c.length])));
