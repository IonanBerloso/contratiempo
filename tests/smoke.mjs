// Smoke test for the built single-file app (dist/index.html).
// Checks, in both demo views and at phone and desktop sizes: the app loads without console
// errors, a choreography opens and its player starts, and the txalaparta workshop, the warm-up
// and the roulette open. On the phone it also checks there is no horizontal scroll.
import { launch, openPage, fileUrl, VIEWPORTS, setView, settle, hasHorizontalScroll } from './harness.mjs';

const target = process.argv[2] || 'dist/index.html';
const browser = await launch();
const failures = [];
let checks = 0;

function check(ok, label) {
  checks++;
  if (!ok) failures.push(label);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
}

async function step(page, errors, vp, label, fn) {
  const before = errors.length;
  try {
    await fn();
    await settle(page, 600);
  } catch (e) {
    check(false, `${label}: ${String(e).split('\n')[0]}`);
    return;
  }
  check(errors.length === before, `${label}: no console errors${errors.length > before ? ' -> ' + errors.slice(before).join(' | ') : ''}`);
  if (vp === 'mobile') check(!(await hasHorizontalScroll(page)), `${label}: no horizontal scroll`);
}

for (const vp of Object.keys(VIEWPORTS)) {
  for (const view of ['coreo', 'bailarina']) {
    const tag = `[${vp} ${view}]`;
    const { page, context, errors } = await openPage(browser, fileUrl(target), { viewport: VIEWPORTS[vp], reducedMotion: 'no-preference' });
    await step(page, errors, vp, `${tag} load + switch view`, () => setView(page, view));
    check(await page.getByRole('region', { name: 'Repertorio' }).isVisible(), `${tag} repertoire visible`);

    if (view === 'bailarina') {
      await step(page, errors, vp, `${tag} review bar walks the "Faltaste" list`, async () => {
        await page.locator('.catch-item').first().click();
        const bar = page.getByRole('region', { name: 'Repaso de la última clase' });
        await bar.getByText(/1 de \d+/).waitFor({ timeout: 3000 });
        await bar.getByRole('button', { name: 'Siguiente' }).click();
        await bar.getByText(/2 de \d+/).waitFor({ timeout: 3000 });
        await bar.getByRole('button', { name: 'Cerrar el repaso' }).click();
        await page.getByRole('region', { name: 'Repertorio' }).waitFor();
      });
    }
    if (view === 'coreo' && vp === 'desktop') {
      await step(page, errors, vp, `${tag} backup downloads outside claude.ai`, async () => {
        const [dl] = await Promise.all([
          page.waitForEvent('download', { timeout: 5000 }),
          page.getByRole('button', { name: 'Descargar copia' }).click(),
        ]);
        if (!/^contratiempo-copia-.*\.json$/.test(dl.suggestedFilename())) throw new Error('unexpected file ' + dl.suggestedFilename());
      });
    }
    await step(page, errors, vp, `${tag} open choreography`, async () => {
      await page.locator('.rep-card').first().click();
      await page.getByRole('region', { name: 'Reproductor de práctica' }).waitFor();
    });
    await step(page, errors, vp, `${tag} count sheet downloads`, async () => {
      const [dl] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }),
        page.getByRole('button', { name: 'Descargar hoja de cuentas' }).first().click(),
      ]);
      if (!/^hoja-de-cuentas-.*\.html$/.test(dl.suggestedFilename())) throw new Error('unexpected file ' + dl.suggestedFilename());
    });
    await step(page, errors, vp, `${tag} play in practice player`, async () => {
      const player = page.getByRole('region', { name: 'Reproductor de práctica' });
      await player.getByRole('button', { name: /Reproducir/ }).first().click();
      await settle(page, 1200);
      await player.getByRole('button', { name: /Pausa/ }).first().waitFor({ timeout: 3000 });
      await player.getByRole('button', { name: /Pausa/ }).first().click();
    });
    await step(page, errors, vp, `${tag} big screen: Space plays without leaving it`, async () => {
      const player = page.getByRole('region', { name: 'Reproductor de práctica' });
      await player.getByRole('button', { name: 'Pantalla grande' }).click();
      await settle(page, 400);
      await page.keyboard.press('Space');
      await settle(page, 800);
      if (!(await page.locator('.player-big').count())) throw new Error('Space left big-screen mode');
      await player.getByRole('button', { name: /Pausa/ }).first().waitFor({ timeout: 3000 });
      await page.keyboard.press('Space');
      await page.keyboard.press('Escape');
      await settle(page, 400);
      if (await page.locator('.player-big').count()) throw new Error('Escape did not leave big-screen mode');
    });
    await step(page, errors, vp, `${tag} back to repertoire`, async () => {
      await page.getByRole('button', { name: 'Contratiempo: volver al repertorio' }).click();
      await page.getByRole('region', { name: 'Repertorio' }).waitFor();
    });

    await step(page, errors, vp, `${tag} open txalaparta workshop`, async () => {
      await page.getByRole('button', { name: 'Taller de txalaparta' }).click();
      await page.locator('.tx-card, [aria-label*="txalaparta" i]').first().waitFor();
    });
    await step(page, errors, vp, `${tag} leave workshop`, async () => {
      await page.getByRole('button', { name: 'Contratiempo: volver al repertorio' }).click();
      await page.getByRole('region', { name: 'Repertorio' }).waitFor();
    });

    await step(page, errors, vp, `${tag} open warm-up`, async () => {
      await page.getByRole('region', { name: 'Calentamiento' }).getByRole('button', { name: 'Empezar' }).click();
      await page.getByRole('dialog').first().waitFor();
      await settle(page, 1500);
    });
    await step(page, errors, vp, `${tag} close warm-up`, async () => {
      await page.getByRole('dialog').first().getByRole('button', { name: 'Salir' }).click();
    });

    await step(page, errors, vp, `${tag} open roulette`, async () => {
      await page.getByRole('region', { name: 'Ruleta de improvisación' }).getByRole('button', { name: /Girar/ }).click();
      await page.getByRole('dialog').first().waitFor();
      await settle(page, 1500);
    });
    await step(page, errors, vp, `${tag} close roulette`, async () => {
      await page.getByRole('dialog').first().getByRole('button', { name: 'Salir' }).click();
    });
    await context.close();
  }
}
await browser.close();
console.log(`\n${checks - failures.length}/${checks} checks passed`);
if (failures.length) {
  console.log('Failures:\n' + failures.map((f) => ' - ' + f).join('\n'));
  process.exit(1);
}
