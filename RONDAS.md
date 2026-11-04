# Rondas de mejora

Techo de tamaño: **25.139 líneas** de `src/` (v0 = 19.338 × 1,3). Rondas múltiplo de 5: poda.

| # | Tipo | Qué cambió | Para quién | Líneas `src/` | Tests | Fuentes |
|---|------|------------|------------|---------------|-------|---------|
| 0 | Rescate (fase 0) | Código fuente reconstruido a partir de `original/index.html`: Vite + React 18.3.1 + Tailwind 3.4.17 + `vite-plugin-singlefile`. 75 módulos con nombres claros (`src/components`, `src/components/player`, `src/components/txalaparta`, `src/components/ui`, `src/data`, `src/lib`). Tres funciones duplicadas unificadas (`easeInOutQuad`, `positiveMod`, `plankLabel`, más `deepClone`). Capturas idénticas píxel a píxel al original en 20/20 escenarios (390×844 y 1280×800; coreógrafa y bailarina; portada, coreografía, taller, calentamiento, ruleta). | Mantenimiento | 19.338 | `npm test` 64/64 · `compare` 20/20 | — |
| 1 | Normal (pulido) | En el móvil la cabecera fija pasa de dos filas (~100 px) a una (~58 px): el selector «Coreógrafa / Bailarina», que solo existe en la demo, se mueve a una barra «Demo · ver como» arriba que se va al hacer scroll; el título se reduce en pantallas estrechas. En escritorio no cambia nada. | Bailarina en casa con el móvil (y coreógrafa en el móvil): ~40 px más de vídeo, mapa y controles en cada pantalla mientras practica. | 19.378 | `npm test` 64/64 | — |
| 2 | Normal (arreglo) | En «Pantalla grande» la tecla Espacio (el atajo que la propia pantalla anuncia: «espacio reproducir») sacaba de la pantalla grande en vez de reproducir. porque el foco se quedaba en el botón que pasa a ser «Salir de pantalla grande». Ahora el foco pasa al reproductor al entrar: Espacio reproduce/pausa y Escape sale. Nueva comprobación en la prueba de humo (falla con el original). | La clase: la coreógrafa con el portátil conectado a la pantalla grande. | 19.385 | `npm test` 70/70 | — |
| 3 | Normal (función nueva) | **Antes de hacerla:** la usa la bailarina que faltó, en casa con el móvil, cuando repasa la lista «Faltaste…». Resuelve el problema principal (ver desde casa qué se hizo, en orden): hasta ahora, tras cada vídeo tenía que volver a la portada y buscar el siguiente de 8. **Hecho:** al abrir un elemento de la lista aparece abajo una barra «Repaso de la clase · 2 de 8 · Siguiente: …» con «Siguiente» (abre y reproduce el siguiente vídeo, o lleva al mapa si es una nota) y «Terminar» en el último. La lista sale de una sola función (`missedClassGroups`) que comparten la portada y la barra. | Bailarina que faltó | 19.460 | `npm test` 73/73 | — |
| 4 | Normal (pulido) | «Añadir bloque» ahora abre el bloque nuevo directamente en edición, con el nombre seleccionado (se escribe encima) y la página llevada hasta él. Antes el bloque aparecía cerrado al final y había que buscar «Editar bloque y notas». | Coreógrafa preparando el bloque nuevo (sobre todo en el móvil). | 19.474 | `npm test` 73/73 | — |
| 5 | Poda | Sin funciones nuevas. Lo repetido, unificado: un solo hook `useEscapeKey` para los cuatro sitios que cierran con Escape (calentamiento, ruleta, dúo de txalaparta, pantalla grande) y `isTypingTarget` para los dos atajos de teclado; un solo `footHitsAround` para las dos vistas de pies del lienzo; la subida de sonidos reales (uno o un grupo) comparte la lectura y el mensaje de error; el botón «Descargar hoja de cuentas» y el panel de calentamiento ya no se escriben dos veces; los colores de ttakun/herren del dúo usan la tabla del taller. Módulos de 1–2 líneas (`utils.js`, `vocab.js`) integrados en `state.js` y `footwork.js`. Accesibilidad: «← Repertorio» / «← Inicio» pasan de 18 px a 30 px de zona táctil sin mover nada. Capturas idénticas a la ronda 4 (20/20). | Mantenimiento; bailarinas en el móvil (zona táctil) | 19.472 (antes 19.474) | `npm test` 73/73 · `compare` 20/20 | — |

## Tags

El proxy de git de esta sesión rechaza subir tags (HTTP 403; solo deja empujar la rama
`claude/affectionate-mayer-xz0cz7`). Los tags se crean en local y aquí queda el commit de cada uno:

| Tag | Commit |
|-----|--------|
| v0 | 40e2eb8 |
