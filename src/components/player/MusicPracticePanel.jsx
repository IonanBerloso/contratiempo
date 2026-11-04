// Player extra panel for music clips: explains the song/generated rehearsal track/txalaparta rhythm and offers loop buttons per eight or per block.
import { Icon } from "../ui/Icon.jsx";
export function MusicPracticePanel({ clip, block, song, bpm, onLoopBeats }) {
  return clip.full ? (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="f-label">Coreografía entera</p>
        <p className="text-[12px] text-muted">
          {song
            ? `Con la canción sincronizada a ${String(bpm).replace(".", ",")} bpm.`
            : "Cada bloque suena con lo suyo: la pista de ensayo o su ritmo de txalaparta."}
        </p>
      </div>
      <p className="text-sm text-ink">
        De principio a fin, sin parar, como en el escenario. Arriba ves el
        bloque, la cuenta, el paso que toca y tu sitio, que se mueve cuando
        cambia la formación.
      </p>
      <div className="flex flex-wrap gap-2">
        {clip.segments.map((segment) => (
          <button
            key={segment.id}
            type="button"
            className="btn btn-xs"
            onClick={() =>
              onLoopBeats(
                (segment.start - 1) * 8,
                (segment.start - 1 + segment.len) * 8,
              )
            }
          >
            <Icon name="loop" size={13} />
            {"Repetir "}
            {segment.name}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="f-label">Bloque entero con música</p>
        <p className="text-[12px] text-muted">
          {song
            ? `Canción sincronizada a ${String(bpm).replace(".", ",")} bpm.`
            : clip.rhythm
              ? `Ritmo de txalaparta «${clip.rhythm.name}» del taller, a ${bpm} bpm, repetido durante todo el bloque.`
              : `Pista de ensayo generada a ${bpm} bpm, hasta que la coreógrafa suba la canción.`}
        </p>
      </div>
      <p className="text-sm text-ink">
        Arriba ves en qué ocho y en qué cuenta vas, y qué paso toca. A 0,75× la
        música va más lenta sin cambiar de tono.
      </p>
      <div className="flex flex-wrap gap-2">
        {Array.from(
          {
            length: block.len,
          },
          (o, eightIdx) => (
            <button
              key={eightIdx}
              type="button"
              className="btn btn-xs"
              onClick={() => onLoopBeats(eightIdx * 8, eightIdx * 8 + 8)}
            >
              <Icon name="loop" size={13} />
              {"Repetir ocho "}
              {clip.eight + eightIdx}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
