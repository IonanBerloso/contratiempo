# Informe de las rondas de mejora

## Informe final (cierre en la ronda 20)

Se cierra en la ronda 20 por decisión de quien encargó el trabajo (el plan era llegar a 50). Hay 20
rondas hechas: 16 de mejora y 4 de poda. Todas terminaron con la app funcionando, los tests en verde,
commit y push. Ninguna falló.

### Versión recomendada

**r20** (commit `ea0365c`, `dist/index.html`). Es la última y también la mejor. La ronda 20 fue de
poda y no cambió nada visible: sus capturas son idénticas a las de la ronda 19. El código ocupa
19.896 líneas, el 79 % del techo de 25.139.

### Las 5 mejoras más importantes, explicadas para la coreógrafa

1. **La alumna que falta repasa lo que se hizo de principio a fin sin perderse.** Desde «Faltaste el
   martes 3» abre el primer vídeo. Abajo le sale «Repaso de la clase · 2 de 8 · Siguiente: …» y va
   pasando con un botón, en el orden en que le conviene estudiarlo. Antes tenía que volver al inicio
   después de cada vídeo.
2. **Cada alumna ve su sitio en todos los bloques a la vez.** En el mapa del escenario, cada bloque
   lleva su marca: «Intro: 6 dcha · Estrofa: 1 dcha · Final: 0 centro». Los pasos que marca con «Me
   cuesta» le aparecen juntos en el inicio, en «Lo que te cuesta», para practicarlos directamente.
3. **Preparar un bloque nuevo es rápido y se puede corregir.** Al añadir un bloque se abre ya listo
   para escribirle el nombre. Se puede subir o bajar de sitio (un puente entre la estrofa y el
   estribillo) y quitar si sobra. Antes solo se podía poner al final y no se podía borrar.
4. **Cada clase se apunta con su fecha y empieza limpia.** En «Última clase» eliges el día. Las que
   faltaron leen ese día y el mensaje para WhatsApp también lo dice. Con un botón quitas las marcas de
   «Nuevo» de la clase anterior antes de marcar lo de hoy.
5. **La pantalla grande sirve para dar la clase desde el portátil.** La barra espaciadora pone y
   quita la música (antes te sacaba de la pantalla grande). Las flechas ← → saltan al bloque anterior
   o siguiente. Al ensayar un bloque se ve su formación al lado de las cuentas. Al parar, el botón ya
   no tapa los números.

También: todo se lee bien con el móvil en modo oscuro, las casillas del taller de txalaparta son lo
bastante grandes para el dedo, y fuera de claude.ai siguen funcionando la hoja de cuentas, la copia de
seguridad, el audio del taller y «Proponer una respuesta de herren».

### Ideas descartadas y por qué

- **Que los vídeos y la canción subidos no se borren al cerrar la pestaña.** Se podría guardar en el
  propio navegador, pero las reglas piden guardarlo todo en localStorage, que no admite vídeos, y son
  vídeos de menores en un móvil que puede ser compartido. Es una decisión para la coreógrafa, no para
  tomarla por ella (pregunta 1).
- **Hacer funcionar el mando del móvil fuera de claude.ai.** Para que dos aparatos se hablen hace falta
  un servidor, y está prohibido. En su lugar, las flechas del teclado (mejora 5).
- **Quitar botones del reproductor** (escalera, compararme, bucle A–B, voz…). Puede que sobren para
  una alumna de 14 años en el móvil, pero quitar algo sin saber qué usan sería adivinar (pregunta 2).
- **Esconder «Modo clase» a las bailarinas.** Puede que lo usen en casa con la tele (pregunta 5).
- **Partir el taller de txalaparta en piezas más pequeñas.** Es la parte más difícil de mantener, pero
  a la coreógrafa no le cambia nada. Queda para cuando haya que tocarlo.
- **Añadir más funciones** (estadísticas, retos, avisos…). Ninguna tenía respuesta clara a «quién la
  usa, cuándo y qué problema resuelve», así que no se hizo.

### Preguntas para la coreógrafa antes de la versión definitiva

1. ¿Quieres que los vídeos de pasos y la canción **se queden guardados** en el móvil o en el ordenador
   entre un día y otro? Hoy se pierden al cerrar la pestaña. Si es que sí, ¿también en móviles que
   comparten las chicas con su familia?
2. ¿Qué botones del reproductor **usan de verdad** las chicas en casa: velocidad, espejo, escalera,
   compararme, repetir un trozo, metrónomo, voz?
3. Cuando ensayan en casa, ¿piensan el escenario **desde el público o desde el escenario**? ¿Cuál
   debería salir primero en el mapa?
4. ¿Cómo comparte hoy las cosas con el grupo? ¿Le vale el **resumen para WhatsApp** tal como sale?
5. En clase, ¿proyecta **desde un portátil o desde una tele**? ¿Usaría el móvil como mando? ¿Las
   bailarinas usan «Modo clase» en casa?
6. En el taller de txalaparta, ¿crean el ritmo **juntas en un móvil o cada una en el suyo**? ¿Hace
   falta el modo de dos móviles?
7. ¿Las familias están de acuerdo con que las alumnas usen **«Compararme»** con un vídeo suyo? El vídeo
   no sale del móvil, pero conviene que lo sepan.
8. ¿Cómo y cada cuánto se dan y se cambian los **códigos de acceso**? ¿Puede una alumna tener el
   código de otra?

## Corte r20 (rondas 11–20)

### Lo que ha mejorado de verdad desde r10

- **La coreógrafa ya puede ordenar la coreografía** (rondas 9 y 11): quitar un bloque y moverlo
  antes o después. Antes, un bloque nuevo solo podía ir al final y no se podía borrar.
- **La clase de verdad tiene fecha** (rondas 13 y 19): «¿Qué día fue?» en «Última clase». La bailarina
  que faltó lee «Faltaste el martes 3» y el mensaje de WhatsApp dice el día correcto. Antes era
  siempre «el jueves 22». Y un botón quita las marcas «Nuevo» de la clase anterior para apuntar la
  siguiente.
- **La bailarina va directa a lo que le cuesta** (ronda 14): los pasos que marca con «Me cuesta»
  aparecen en su portada, «Lo que te cuesta», y se abren reproduciéndose.
- **La pantalla grande sirve para dar clase** (rondas 12, 16 y 18): ← / → saltan de bloque (o de
  ocho) desde el teclado del portátil, sin mando; al ensayar un bloque se ve su formación junto a las
  cuentas; y al pausar el ▶ ya no tapa las cuentas.
- **Se lee bien en cualquier móvil** (rondas 15 y 17): todo el texto pasa de 4,5:1 de contraste en
  modo claro y oscuro (había 7 fallos, uno en el propio punto «TÚ» del mapa en modo oscuro), y la
  partitura del taller de txalaparta tiene casillas de 31 px para el dedo en vez de 15 px.
- Revisado sin cambios (ronda 19): 600 pulsaciones aleatorias en el móvil sin errores ni scroll
  horizontal; la app carga y responde bien con la CPU 4 veces más lenta.

### Lo que sobra

- Lo mismo que en r10: el **mando** y el **dúo en dos móviles** solo funcionan dentro de claude.ai, y
  el **taller de txalaparta** sigue siendo un componente enorme (≈2.300 líneas).
- **Demasiados botones en el reproductor** para una bailarina en el móvil. Sigue sin tocarse porque
  quitar algo sin hablar con la coreógrafa sería adivinar (ver preguntas al final).
- El botón «Modo clase» del panel de la función también lo ven las bailarinas, que normalmente no
  proyectan nada.

### Líneas de código (`src/`)

| versión | líneas | nota |
|---|---|---|
| v0 | 19.338 | techo 25.139 |
| r10 | 19.620 | +1,5 % |
| r20 | 19.896 | +2,9 % sobre v0, 79 % del techo |

En 10 rondas, 6 funciones o arreglos con interfaz nueva y +276 líneas; las podas (15 y 20) unificaron
listas, selecciones y búsquedas repetidas.

### Versión recomendada ahora

**r20.** Cubre los tres papeles mejor que r10 (coreógrafa ordenando bloques y fechando la clase,
bailarina con «Lo que te cuesta», clase con teclado y formación en pantalla grande), con capturas
idénticas en la poda y 97 comprobaciones automáticas en verde.

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
