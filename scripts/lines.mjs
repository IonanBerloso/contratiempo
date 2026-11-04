// Counts lines in src/ (js, jsx, css). Used for the size ceiling in CLAUDE.md / RONDAS.md.
import fs from 'fs';
import path from 'path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : /\.(jsx?|css)$/.test(d.name) ? [p] : [];
  });
}
const files = walk('src');
const count = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l, i, a) => i < a.length - 1 || l !== '').length;
let total = 0;
const rows = files.map((f) => [f, count(f)]).sort((a, b) => b[1] - a[1]);
for (const [f, n] of rows) { total += n; if (process.argv.includes('-v')) console.log(String(n).padStart(6), f); }
console.log(total);
