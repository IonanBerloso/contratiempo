# Informe de las rondas de mejora

## Corte r10 (rondas 1–10)

### Lo que ha mejorado de verdad desde v0

- **La bailarina que faltó recorre lo nuevo sin perderse** (ronda 3). Al abrir el primer vídeo de
  «Faltaste…» aparece abajo una barra «Repaso de la clase · 2 de 8 · Siguiente: …». Antes tenía que
  volver a la portada después de cada uno de los 8 vídeos.
- **Ve su marca en todos los bloques a la vez** (ronda 8): cada pestaña del mapa lleva «6 dcha»,
  «1 dcha», «0 centro». Es justo «dónde le toca estar en cada bloque».
- **En el móvil hay más sitio para practicar** (ronda 1): la cabecera fija pasa de dos filas a una;
  el selector de la demo («Coreógrafa / Bailarina») se va al hacer scroll.
- **La pantalla grande de clase funciona con el teclado** (ronda 2): Espacio sacaba de la pantalla
  grande en vez de reproducir. Era un fallo del original.
- **La coreógrafa prepara un bloque nuevo más rápido** (rondas 4 y 9): «Añadir bloque» abre el
  bloque en edición con el nombre seleccionado, y ahora también se puede **quitar** un bloque (antes
  era imposible).
- **Todo funciona fuera de claude.ai** (rondas 6 y 7), como piden las reglas: hoja de cuentas, copia
  de seguridad, audio del taller y vídeo del ensayo se descargan con Blob cuando no existe
  `window.claude.use("downloads")`; y «Proponer una respuesta de herren» tiene una propuesta por
  reglas (los huecos tras cada par de golpes del ttakun) cuando no existe `sample`.
- **Poda** (rondas 5 y 10): código repetido unificado (Escape, atajos de teclado, golpes de los pies
  en el lienzo, subida de sonidos, botones de confirmación en dos pasos), módulos de 1–2 líneas
  integrados, zonas táctiles de «← Repertorio» de 18 px a 30 px, botones rojos que perdían el color
  al pasar el ratón.

### Lo que sobra (o sobra fuera de claude.ai)

- **El mando del modo clase y el dúo «cada una en su móvil»** dependen de `window.claude.use("room")`;
  fuera de claude.ai solo muestran un aviso. No se pueden arreglar sin un servidor (prohibido), así que
  quedan como están. En una versión definitiva habría que decidir si se mantienen.
- **El taller de txalaparta** es casi la quinta parte del código (≈2.300 líneas en un solo
  componente). Funciona, pero es lo más caro de mantener; conviene partirlo en piezas en una ronda de
  poda antes de añadirle nada.
- Hay muchos botones en el reproductor (velocidades, escalera, espejo, compararme, pantalla grande,
  bucle A–B, metrónomo, sonido, voz). Para una bailarina de 14 años en el móvil es mucho; no he
  quitado nada sin poder preguntar, pero es candidato a simplificar.

### Líneas de código (`src/`, JS + JSX + CSS)

| versión | líneas | nota |
|---|---|---|
| v0 | 19.338 | rescate del original (techo: 25.139) |
| r5 (poda) | 19.472 | |
| r10 (poda) | 19.620 | +1,5 % sobre v0 en 10 rondas |

El tamaño crece despacio: las funciones nuevas fueron pequeñas y las dos podas devolvieron casi todo
lo que añadió el reformateo.

### Versión recomendada ahora

**r10.** Todo lo de v0 sigue igual (capturas idénticas en las podas), con los fallos de la pantalla
grande y de las descargas arreglados y el repaso de la bailarina mucho más directo.

> Tags: el proxy de git de esta sesión no deja subir tags, así que están en local; el commit de cada
> uno está en `RONDAS.md`.
