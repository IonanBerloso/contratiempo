# Contratiempo: 50 rondas de «hazla mejor», con cabeza

Vas a mejorar Contratiempo en rondas, sin preguntarme nada, hasta llegar a 50 rondas o hasta que se acabe la sesión. Lee todo esto antes de empezar.

Esto se inspira en un experimento en el que le pidieron a Claude «hazla mejor» 100 veces seguidas sobre una web. Sonnet hizo cambios pequeños y prudentes. Opus fue añadiendo funciones hasta llegar a 21.000 líneas y acabó rompiendo su propia web. Además, ninguno de los dos buscó nada en internet. Las reglas de abajo existen para que aquí no pase lo mismo.

## 1. Qué es Contratiempo

Es una demo web para una coreógrafa de claqué y su grupo de 6 bailarinas adolescentes. La coreógrafa prepara las coreografías, las divide en bloques de ochos, coloca a cada bailarina en el mapa del escenario y las comparte con el grupo.

**El problema principal que resuelve:** una bailarina que falta a clase o a un ensayo tiene que poder ver desde casa qué se hizo, dónde le toca estar en el escenario en cada bloque, y practicar con los vídeos de los pasos.

Ya tiene estas partes: repertorio, reproductor de práctica, mapa del escenario, desglose por bloques, seguimiento de las alumnas, banco de pasos, próxima función, hoja de cuentas imprimible, vídeo del ensayo con las cuentas encima, calentamiento con metrónomo y voz, ruleta de improvisación, «Tu práctica», mando del modo clase (el móvil maneja la pantalla de clase), taller de txalaparta y copia de seguridad. También tiene una vista de coreógrafa y otra de bailarina, con códigos de acceso. El taller de txalaparta existe porque el grupo prepara una coreografía con txalaparta para su escuela, y las bailarinas quieren crear el ritmo ellas mismas.

Quién la usa y cómo:
- La coreógrafa la usa en el móvil, en el ordenador y en una pantalla grande durante la clase.
- Las bailarinas la usan casi siempre en el móvil, en casa.
- La coreógrafa cuenta y nombra los pasos en castellano. Graba los vídeos casi siempre de frente o de lado. Las bailarinas practican con la canción real.

## 2. Reglas fijas

Lo primero de todo: copia estas reglas a `CLAUDE.md`, para que sigan ahí aunque se compacte el contexto.

- **Sigue siendo una demo.** Usa datos de ejemplo y guárdalo todo en el navegador (localStorage). Nada de backend, servidores, cuentas, bases de datos, analítica ni servicios externos nuevos.
- **Las bailarinas son menores.** No metas ningún dato real. Ningún vídeo sale del dispositivo y no se comparte nada fuera del grupo. Los nombres de ejemplo se quedan como ejemplo.
- **El entregable es un solo archivo HTML autocontenido** (`dist/index.html`), que se publica como artifact de claude.ai. Nada puede necesitar un servidor.
- **`window.claude.use("downloads")` y `window.claude.use("sample")` solo existen dentro de claude.ai.** El primero guarda archivos. El segundo es una IA rápida que propone los golpes de herren en el taller. Fuera de claude.ai devuelven `null`. Conserva ese hook tal cual y haz que todo funcione sin ellos. Fuera de claude.ai puedes añadir una descarga de respaldo con Blob y `<a download>`.
- **Compatibilidad.** Tienen que seguir cargando la clave `contratiempo-demo-v2` de localStorage, el estado `v:4` y el formato de la copia de seguridad (`app:"contratiempo"`, `v:4`). Si cambias el esquema, sube la versión y escribe la migración.
- **Idioma.** La interfaz va en castellano, y los términos de txalaparta (ttakun, herren) se quedan como están. El código, los nombres y los commits van en inglés.
- **Prohibido:** tocar `original/` y añadir dependencias pesadas.

## 3. Fase 0: rescatar el código fuente (antes de cualquier ronda)

`original/index.html` es la app ya compilada: React 18 y Tailwind, empaquetados con esbuild, unos 446 KB. No existe el código fuente, y mejorar código minificado no tiene sentido. Así que primero reconstruye el proyecto:

1. Monta Vite con React (JSX) y Tailwind, y usa `vite-plugin-singlefile` para que `npm run build` genere `dist/index.html` en un solo archivo.
2. Divide la app en componentes con nombres claros, uno por sección. Pon los datos de ejemplo en `src/data/` y el motor de audio, la voz y el almacenamiento en `src/lib/`. Tiene que hacer lo mismo, con los mismos textos y el mismo aspecto.
3. Comprueba con capturas de Playwright que el original y la reconstrucción coinciden, a 390×844 y a 1280×800, en las vistas de coreógrafa y de bailarina. Captura la portada, una coreografía abierta, el taller de txalaparta, el calentamiento y la ruleta. Corrige las diferencias hasta que coincidan.
4. Crea `npm test`: el build más una prueba de humo en Playwright. La prueba comprueba que la app carga sin errores de consola en las dos vistas, abre una coreografía y su reproductor, abre el taller, el calentamiento y la ruleta, y que en el móvil no hay scroll horizontal. Si el entorno no te deja instalar Chromium, usa el que haya o lo más parecido que puedas, y apúntalo.
5. Cuenta las líneas de `src/` y fija el **techo de tamaño en las líneas de v0 × 1,3**. Apúntalo en `CLAUDE.md`.
6. Haz commit, crea el tag `v0`, haz push y crea `RONDAS.md` con la fila 0.

## 4. Cada ronda

1. Mira en `RONDAS.md` qué ronda toca.
2. Usa la app en el navegador con Playwright, primero en móvil, desde tres papeles:
   - la coreógrafa, preparando el bloque nuevo de una coreografía;
   - una bailarina que faltó al último ensayo y lo repasa en casa;
   - la clase, con la pantalla grande y el mando.

   Busca **una sola** mejora: la que más le aporte a alguno de los tres.
3. Elige el tipo de ronda:
   - Las rondas múltiplo de 5 son de **poda**: no se añade nada. Se simplifica, se quita lo que sobra, se unifica lo repetido, se arreglan fallos y se mejoran el rendimiento, la accesibilidad y los textos. El tamaño baja o se queda igual.
   - Si `src/` pasa del techo, la ronda es de poda aunque no le toque.
   - En el resto de rondas, haz lo que más aporte: un arreglo, pulir algo, aclararlo o una función nueva.
4. Antes de añadir una función, apunta en `RONDAS.md` quién la usa, cuándo y qué problema de la sección 1 resuelve. Si no tienes una respuesta clara, no la hagas.
5. Si la mejora toca algo que no dominas, **busca en la web antes** y apunta las fuentes. Por ejemplo: cómo se enseña claqué, cómo comparten las coreografías otros profesores, la notación de pasos, los patrones de txalaparta, la accesibilidad o cómo usan el móvil las adolescentes.
6. Verifica: `npm test` tiene que pasar, y mira de verdad las capturas en móvil. Si algo se rompe y no lo arreglas dentro de la ronda, haz `git revert` y apunta la ronda como fallida.
7. Haz commit con el mensaje `round N: …` y push. Añade la fila a `RONDAS.md` con el número, el tipo, qué cambió, para quién, las líneas de `src/`, el resultado de los tests y las fuentes.
8. Pasa a la siguiente ronda sin preguntarme. Si dudas, decide lo más razonable y apúntalo.

La sesión puede cortarse en cualquier momento cuando se acabe el crédito. Por eso **cada ronda termina con la app funcionando, con commit y con push**. Nunca dejes nada a medias entre rondas.

## 5. Cada 10 rondas

- Ejecuta `npm run build`, haz commit de `dist/index.html` y crea el tag `r10`, `r20`, etc.
- Actualiza `INFORME.md` con:
  - lo que ha mejorado de verdad desde el último tag;
  - lo que sobra;
  - cómo han evolucionado las líneas de código;
  - qué versión recomiendas ahora, que no tiene por qué ser la última.

## 6. Al terminar

Cuando llegues a la ronda 50, haz el build final y deja el `INFORME.md` definitivo con:
- la versión recomendada;
- las 5 mejoras más importantes, explicadas para la coreógrafa y sin tecnicismos;
- las ideas descartadas y por qué;
- las preguntas que habría que hacerle a la coreógrafa antes de la versión definitiva.

Empieza por la fase 0. No te pares entre rondas para informarme.
