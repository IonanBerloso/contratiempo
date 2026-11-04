// Song panel: upload the choreography song and open the ocho sync tool.
import { useEffect, useRef, useState } from "react";
import { formatClockTenths } from "../lib/format.js";
import { clamp } from "../lib/math.js";
import { estimateTempoFromTaps } from "../lib/time.js";
import { Icon } from "./ui/Icon.jsx";
export function SongSyncPanel({ choreo, song, sync, onUpload, onSaveSync }) {
  const [syncOpen, setSyncOpen] = useState(false);
  return (
    <section className="panel flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">Canción</p>
          <p className="mt-1 text-[14px] text-ink">
            {song ? (
              <>
                <b className="font-semibold">{song.name}</b>
                {" · "}
                {String(sync.bpm).replace(".", ",")}
                {" bpm · el ocho 1 empieza en "}
                {formatClockTenths(sync.offset)}
              </>
            ) : (
              <>
                {
                  "Sin canción todavía: los bloques se practican con una pista de ensayo generada a "
                }
                {choreo.bpm}
                {" bpm."}
              </>
            )}
          </p>
          {song && !sync.synced && (
            <p className="mt-1 text-[13px] font-semibold text-[color:var(--warn)]">
              Falta sincronizar los ochos con la canción.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-file">
            <Icon name="upload" />
            {song ? "Cambiar canción" : "Subir la canción"}
            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(ev) => {
                const songFile = ev.target.files && ev.target.files[0];
                if (songFile) {
                  onUpload(songFile);
                  setSyncOpen(true);
                }
                ev.target.value = "";
              }}
            />
          </label>
          {song && (
            <button
              type="button"
              className="btn"
              aria-pressed={syncOpen}
              onClick={() => setSyncOpen((wasOpen) => !wasOpen)}
            >
              <Icon name="metro" />
              Sincronizar ochos
            </button>
          )}
        </div>
      </div>
      {song && syncOpen && (
        <TapTempoSync
          key={song.src}
          song={song}
          sync={sync}
          onSave={(newSync) => {
            onSaveSync(newSync);
            setSyncOpen(false);
          }}
        />
      )}
    </section>
  );
}
function TapTempoSync({ song, sync, onSave }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [taps, setTaps] = useState([]);
  const [bpm, setBpm] = useState(sync.bpm);
  const [offset, setOffset] = useState(sync.offset);
  const tapEstimate = estimateTempoFromTaps(taps);
  useEffect(() => {
    if (!playing) return;
    let rafId;
    const tick = () => {
      if (audioRef.current) {
        setPlayhead(audioRef.current.currentTime);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing]);
  useEffect(() => {
    if (tapEstimate) {
      setBpm(tapEstimate.bpm);
      setOffset(Math.round(tapEstimate.offset * 100) / 100);
    }
  }, [taps.length]);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio
          .play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      } else {
        audio.pause();
        setPlaying(false);
      }
    }
  };
  const recordTap = () => {
    const audioNode = audioRef.current;
    if (!(!audioNode || audioNode.paused)) {
      setTaps((prevTaps) => [...prevTaps, audioNode.currentTime]);
    }
  };
  return (
    <div className="sync" data-no-shortcuts={true}>
      <audio
        ref={audioRef}
        src={song.src}
        preload="auto"
        onEnded={() => setPlaying(false)}
      />
      <ol className="sync-steps">
        <li>Dale a reproducir la canción.</li>
        <li>
          Cuando llegue el 1 del primer ocho, toca «Tiempo» en cada tiempo. Con
          8 toques basta; con más, más preciso.
        </li>
        <li>
          Revisa el tempo y guarda. Si algo se desvía, puedes ajustar los
          números a mano.
        </li>
      </ol>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn" onClick={togglePlay}>
          <Icon name={playing ? "pause" : "play"} />
          {playing ? "Pausa" : "Reproducir"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
            }
            setPlayhead(0);
            setTaps([]);
          }}
        >
          <Icon name="restart" />
          Desde el principio
        </button>
        <span className="font-mono text-[12px] tabular-nums text-muted">
          {formatClockTenths(playhead)}
        </span>
      </div>
      <button
        type="button"
        className="tapbtn"
        disabled={!playing}
        onPointerDown={recordTap}
        onKeyDown={(ev) => {
          if (ev.key === " " || ev.key === "Enter") {
            ev.preventDefault();
            if (!ev.repeat) {
              recordTap();
            }
          }
        }}
      >
        <span className="f-display text-[2rem] uppercase leading-none">
          Tiempo
        </span>
        <span className="font-mono text-[12px]">
          {playing ? `${taps.length} toques` : "Primero dale a reproducir"}
        </span>
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <label
          className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
          htmlFor="sync-bpm"
        >
          Tempo (bpm)
          <input
            id="sync-bpm"
            type="number"
            step="0.1"
            min="40"
            max="240"
            className="field"
            value={bpm}
            onChange={(ev) => setBpm(Number(ev.target.value) || bpm)}
          />
        </label>
        <label
          className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
          htmlFor="sync-off"
        >
          El ocho 1 empieza en (segundos)
          <input
            id="sync-off"
            type="number"
            step="0.01"
            min="0"
            className="field"
            value={offset}
            onChange={(ev) =>
              setOffset(Math.max(0, Number(ev.target.value) || 0))
            }
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            onSave({
              bpm: clamp(bpm, 40, 240),
              offset,
              synced: true,
            })
          }
        >
          Guardar sincronización
        </button>
        {taps.length > 0 && (
          <button type="button" className="btn" onClick={() => setTaps([])}>
            Borrar toques
          </button>
        )}
        {taps.length === 1 && (
          <span className="text-[12px] text-muted">
            Sigue tocando en cada tiempo…
          </span>
        )}
      </div>
    </div>
  );
}
