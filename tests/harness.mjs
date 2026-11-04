// Shared Playwright helpers for the smoke test and the screenshot comparison.
// The app is a single self-contained HTML file, so pages are opened with file://.
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  // The cloud container ships Playwright globally; fall back to its location.
  playwright = require('/opt/node-tools/node_modules/playwright');
}
export const { chromium } = playwright;

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const fileUrl = (rel) => 'file://' + path.join(root, rel);

export const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 800 },
};

// Fixed clock and seeded Math.random so two builds render the same pixels.
export const FIXED_NOW = new Date('2026-10-20T17:30:00');
const SEED_SCRIPT = `(() => {
  let s = 42;
  Math.random = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
})();`;

export async function launch() {
  const opts = { args: ['--autoplay-policy=no-user-gesture-required'] };
  try {
    return await chromium.launch(opts);
  } catch {
    return chromium.launch({ ...opts, executablePath: '/opt/pw-browsers/chromium' });
  }
}

export async function openPage(browser, url, { viewport, reducedMotion = 'reduce', fonts = false } = {}) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion,
    hasTouch: viewport.width < 600,
    isMobile: false,
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  });
  await context.addInitScript(SEED_SCRIPT);
  await context.clock.install({ time: FIXED_NOW });
  // No network in tests: external fonts would make screenshots flaky.
  if (!fonts) await context.route(/^https?:/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url);
  await page.waitForSelector('#root > *');
  await settle(page);
  return { context, page, errors };
}

export async function settle(page, ms = 400) {
  await page.clock.runFor(ms).catch(() => {});
  await page.waitForTimeout(80);
}

// Switch the demo view. "bailarina" logs in as the first demo dancer.
export async function setView(page, view) {
  await page.getByRole('radiogroup', { name: 'Vista de la demo' })
    .getByRole('radio', { name: view === 'coreo' ? 'Coreógrafa' : 'Bailarina' }).click();
  await settle(page);
  if (view === 'bailarina') {
    const chip = page.locator('.demo-hint .chip').first();
    if (await chip.count()) { await chip.click(); await settle(page); }
  }
}

export async function hasHorizontalScroll(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}
