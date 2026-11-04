# CLAUDE.md — Contratiempo

Demo web para una coreógrafa de claqué y su grupo de 6 bailarinas adolescentes. La tarea en curso
son las rondas de mejora de `PROMPT.md` (50 rondas de «hazla mejor», con cabeza). El registro de
rondas está en `RONDAS.md` y el informe en `INFORME.md`.

## Reglas fijas (copiadas de PROMPT.md §2, no se negocian)

- **Sigue siendo una demo.** Usa datos de ejemplo y guárdalo todo en el navegador (localStorage).
  Nada de backend, servidores, cuentas, bases de datos, analítica ni servicios externos nuevos.
- **Las bailarinas son menores.** No metas ningún dato real. Ningún vídeo sale del dispositivo y no
  se comparte nada fuera del grupo. Los nombres de ejemplo se quedan como ejemplo.
- **El entregable es un solo archivo HTML autocontenido** (`dist/index.html`), que se publica como
  artifact de claude.ai. Nada puede necesitar un servidor.
- **`window.claude.use("downloads")` y `window.claude.use("sample")` solo existen dentro de
  claude.ai.** El primero guarda archivos. El segundo es una IA rápida que propone los golpes de
  herren en el taller. Fuera de claude.ai devuelven `null`. Conserva ese hook tal cual y haz que todo
  funcione sin ellos. Fuera de claude.ai puedes añadir una descarga de respaldo con Blob y
  `<a download>`.
- **Compatibilidad.** Tienen que seguir cargando la clave `contratiempo-demo-v2` de localStorage, el
  estado `v:4` y el formato de la copia de seguridad (`app:"contratiempo"`, `v:4`). Si cambias el
  esquema, sube la versión y escribe la migración.
- **Idioma.** La interfaz va en castellano, y los términos de txalaparta (ttakun, herren) se quedan
  como están. El código, los nombres y los commits van en inglés.
- **Prohibido:** tocar `original/` y añadir dependencias pesadas.

## Cómo son las rondas (resumen de PROMPT.md §4–§6)

- Una sola mejora por ronda, la que más aporte a uno de los tres papeles: la coreógrafa preparando
  el bloque nuevo; una bailarina que faltó y repasa en casa (móvil); la clase con pantalla grande y
  mando.
- **Rondas múltiplo de 5 = poda**: no se añade nada; se simplifica, se unifica, se arreglan fallos,
  rendimiento, accesibilidad, textos. El tamaño baja o se queda igual. Si `src/` pasa del techo, la
  ronda es de poda aunque no toque.
- Antes de añadir una función: apuntar en `RONDAS.md` quién la usa, cuándo y qué problema resuelve.
  Sin respuesta clara, no se hace.
- Si la mejora toca algo que no domino, buscar en la web antes y apuntar las fuentes.
- Verificar: `npm test` en verde y mirar de verdad las capturas en móvil. Si algo se rompe y no se
  arregla dentro de la ronda: `git revert` y ronda fallida.
- Commit `round N: …` + push + fila en `RONDAS.md` (número, tipo, qué cambió, para quién, líneas de
  `src/`, tests, fuentes). **Cada ronda termina con la app funcionando, commit y push.**
- Cada 10 rondas: `npm run build`, commit de `dist/index.html`, tag `r10`, `r20`…, y actualizar
  `INFORME.md`.
- En las rondas normales no se hace commit de `dist/` (`git add -A ':!dist'`); solo en v0 y en los
  tags de cada 10. Después de cada commit de ronda, `git checkout -- dist/index.html` para dejar el
  árbol limpio (el build de los tests lo modifica).
- El proxy de git rechaza subir tags (403): se crean en local y su commit se apunta en RONDAS.md.

## Techo de tamaño

- Líneas de `src/` en v0: **19.338** (JS, JSX y CSS; contadas con `npm run lines`).
- **Techo = 19.338 × 1,3 = 25.139 líneas.** Si `src/` lo pasa, la ronda es de poda aunque no le
  toque.

## Proyecto

- Vite 5 + React 18.3.1 (JSX) + Tailwind 3.4.17 + `vite-plugin-singlefile`. `npm run build` genera
  `dist/index.html` en un solo archivo.
- `original/index.html` es la app compilada de partida. **No se toca.** El código de `src/` se
  reconstruyó a partir de ella (fase 0) y se comprobó píxel a píxel con capturas.
- `src/App.jsx` — raíz: cabecera, vistas coreógrafa/bailarina, navegación y acciones de estado.
- `src/components/` — una sección por fichero; `src/components/ui/` — piezas compartidas.
- `src/data/` — datos de ejemplo. `src/lib/` — audio, voz, almacenamiento y lógica sin interfaz.
- `src/styles/app.css` — CSS propio (sin capa, entre `base` y `utilities` de Tailwind);
  `src/styles/theme.css` — variables de color claro/oscuro.
- Las fuentes vienen de Google Fonts (como en el original); sin red se usan las de reserva.

## Publicar

- `npm run artifact` genera `dist/artifact.html`: el mismo build sin `doctype`/`head`/`body`, porque
  claude.ai añade ese esqueleto. Es lo que se publica en el artifact
  https://claude.ai/artifact/8YEehhc11sY4BxHMiR5Qfa con las capacidades `downloads`, `sample`,
  `room` (tema `duo.hit` abierto a `interact`; `clase.cmd` solo la coreógrafa) y `assets`.

## Pruebas

- `npm test` = build + `tests/smoke.mjs` (Playwright, Chromium del sistema): carga sin errores de
  consola en las dos vistas, abre una coreografía y su reproductor, el taller, el calentamiento y la
  ruleta, y sin scroll horizontal en móvil (390×844). También a 1280×800.
- `node tests/compare.mjs <base.html> <nuevo.html> <carpeta>` compara capturas píxel a píxel
  (portada, coreografía, taller, calentamiento, ruleta × coreógrafa/bailarina × móvil/escritorio).
  Útil en rondas de poda para demostrar que no cambia nada visible.
- Playwright: se usa el global del contenedor (`require('playwright')`); no instalar otra versión.
  Los tests fijan reloj y `Math.random`, y bloquean la red (fuentes) para que sean deterministas.
