# Rondas de mejora

Techo de tamaño: **25.139 líneas** de `src/` (v0 = 19.338 × 1,3). Rondas múltiplo de 5: poda.

| # | Tipo | Qué cambió | Para quién | Líneas `src/` | Tests | Fuentes |
|---|------|------------|------------|---------------|-------|---------|
| 0 | Rescate (fase 0) | Código fuente reconstruido a partir de `original/index.html`: Vite + React 18.3.1 + Tailwind 3.4.17 + `vite-plugin-singlefile`. 75 módulos con nombres claros (`src/components`, `src/components/player`, `src/components/txalaparta`, `src/components/ui`, `src/data`, `src/lib`). Tres funciones duplicadas unificadas (`easeInOutQuad`, `positiveMod`, `plankLabel`, más `deepClone`). Capturas idénticas píxel a píxel al original en 20/20 escenarios (390×844 y 1280×800; coreógrafa y bailarina; portada, coreografía, taller, calentamiento, ruleta). | Mantenimiento | 19.338 | `npm test` 64/64 · `compare` 20/20 | — |
