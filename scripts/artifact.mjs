// Turns dist/index.html into the page fragment claude.ai artifacts expect (the platform adds the
// doctype/head/body skeleton and the same small reset). Usage: node scripts/artifact.mjs [out.html]
import fs from 'fs';

const out = process.argv[2] || 'dist/artifact.html';
const html = fs.readFileSync('dist/index.html', 'utf8');
const pick = (re) => html.match(re)?.[0] || '';
const block = (tag, test) => [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].find((m) => test(m[1]))?.[1] || '';
const fragment = [
  pick(/<title>.*?<\/title>/),
  ...html.match(/<meta name="(?:claude:viewport-fit-sides|description)"[^>]*>/g),
  ...html.match(/<link [^>]*>/g),
  `<style>${block('style', (css) => css.includes('--tw-'))}</style>`,
  '<div id="root"></div>',
  `<script type="module">${block('script', (js) => js.length > 1000)}</script>`,
].join('\n');
fs.writeFileSync(out, fragment + '\n');
console.log(`${out}: ${fragment.length} bytes`);
