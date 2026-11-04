// Screenshot comparison between two builds (by default original/ vs dist/).
// Usage: node tests/compare.mjs [baseline.html] [candidate.html] [outDir]
// Writes PNGs and a diff summary; exits 1 if any scenario differs.
import fs from 'fs';
import path from 'path';
import { launch, openPage, fileUrl, VIEWPORTS, setView, settle, root } from './harness.mjs';

const [baseline = 'original/index.html', candidate = 'dist/index.html', outDir = 'tests/shots'] = process.argv.slice(2);
fs.mkdirSync(path.resolve(root, outDir), { recursive: true });

const SCENARIOS = {
  portada: async () => {},
  coreografia: async (page) => {
    await page.locator('.rep-card').first().click();
    await settle(page);
  },
  taller: async (page) => {
    await page.getByRole('button', { name: 'Taller de txalaparta' }).click();
    await settle(page);
  },
  calentamiento: async (page) => {
    await page.getByRole('region', { name: 'Calentamiento' }).getByRole('button', { name: 'Empezar' }).click();
    await settle(page, 1500);
  },
  ruleta: async (page) => {
    await page.getByRole('region', { name: 'Ruleta de improvisación' }).getByRole('button', { name: /Girar/ }).click();
    await settle(page, 1500);
  },
};
const FULL = new Set(['portada', 'coreografia', 'taller']);

async function shoot(browser, file, vp, view, name) {
  const { page, context, errors } = await openPage(browser, fileUrl(file), { viewport: VIEWPORTS[vp] });
  await setView(page, view);
  await SCENARIOS[name](page);
  await page.evaluate(() => document.activeElement?.blur?.());
  await settle(page, 200);
  const buf = await page.screenshot({ fullPage: FULL.has(name), animations: 'disabled', caret: 'hide' });
  await context.close();
  return { buf, errors };
}

async function diff(browser, a, b) {
  const page = await browser.newPage();
  const res = await page.evaluate(async ([a, b]) => {
    const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { sizeA: [ia.width, ia.height], sizeB: [ib.width, ib.height], diff: -1 };
    const px = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
    const da = px(ia), db = px(ib);
    let n = 0, firstY = -1;
    for (let i = 0; i < da.length; i += 4) {
      if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 24) {
        n++;
        if (firstY < 0) firstY = Math.floor(i / 4 / ia.width);
      }
    }
    return { diff: n, firstY, size: [ia.width, ia.height] };
  }, [`data:image/png;base64,${a.toString('base64')}`, `data:image/png;base64,${b.toString('base64')}`]);
  await page.close();
  return res;
}

const browser = await launch();
let failed = 0;
for (const vp of Object.keys(VIEWPORTS)) {
  for (const view of ['coreo', 'bailarina']) {
    for (const name of Object.keys(SCENARIOS)) {
      const id = `${vp}-${view}-${name}`;
      const A = await shoot(browser, baseline, vp, view, name);
      const B = await shoot(browser, candidate, vp, view, name);
      fs.writeFileSync(path.resolve(root, outDir, `${id}-a.png`), A.buf);
      fs.writeFileSync(path.resolve(root, outDir, `${id}-b.png`), B.buf);
      const d = await diff(browser, A.buf, B.buf);
      const ok = d.diff === 0 && !B.errors.length;
      if (!ok) failed++;
      console.log(`${ok ? 'ok  ' : 'DIFF'} ${id}`, JSON.stringify(d), B.errors.length ? B.errors : '');
    }
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
