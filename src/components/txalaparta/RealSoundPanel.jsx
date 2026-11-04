// 'Sonido real' panel: upload voice-memo recordings for each wood plank, stone and the 4 tap-shoe sounds (one file per sound or one file with all hits, auto-split by onset detection), preview, and revert to the synthetic sound.
import { useEffect, useState } from "react";
import { FOOT_STRIKES } from "../../data/txalaparta.js";
import {
  decodeAudioFileToMono,
  deleteRecordedSample,
  detectHitOnsets,
  extractHit,
  hasRecordedSample,
  isSampleStorageOk,
  playSound,
  previewRecordedSample,
  saveRecordedSample,
  subscribeToSamples,
  unlockAudio,
} from "../../lib/audio.js";
import { plankFrequency } from "../../lib/txalaparta.js";
import { Icon } from "../ui/Icon.jsx";
function useRecordedSoundsRefresh() {
  const [, setRefreshTick] = useState(0);
  useEffect(
    () => subscribeToSamples(() => setRefreshTick((tick) => tick + 1)),
    [],
  );
}
export function RealSoundPanel({ instruments, feetName }) {
  useRecordedSoundsRefresh();
  const [busyKey, setBusyKey] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const soundGroups = [
    {
      id: "w",
      name: "Madera",
      all: `Subir las ${instruments.wood} tablas en un audio`,
      items: Array.from(
        {
          length: instruments.wood,
        },
        (u, plankIdx) => ({
          key: `w${plankIdx}`,
          label: `Tabla ${plankIdx + 1}`,
          test: () =>
            playSound("tx", {
              f: plankFrequency(plankIdx, instruments.wood),
              stone: false,
              key: `w${plankIdx}`,
            }),
        }),
      ),
    },
    {
      id: "s",
      name: "Piedra",
      all: `Subir las ${instruments.stone} piedras en un audio`,
      items: Array.from(
        {
          length: instruments.stone,
        },
        (u, stoneIdx) => ({
          key: `s${stoneIdx}`,
          label: `Piedra ${stoneIdx + 1}`,
          test: () =>
            playSound("tx", {
              f: plankFrequency(stoneIdx, instruments.stone),
              stone: true,
              key: `s${stoneIdx}`,
            }),
        }),
      ),
    },
    {
      id: "f",
      name: "Pies: vuestros zapatos",
      all: "Subir los 4 sonidos en un audio",
      items: FOOT_STRIKES.map((footSound, footIdx) => ({
        key: `f${footIdx}`,
        label: feetName(footIdx),
        test: () =>
          playSound(footSound.key, {
            key: `f${footIdx}`,
          }),
      })),
    },
  ];
  const uploadSingleSound = async (soundItem, audioFile) => {
    if (audioFile) {
      setBusyKey(soundItem.key);
      setStatusMsg(null);
      try {
        const { data, rate } = await decodeAudioFileToMono(audioFile);
        const hits = detectHitOnsets(data, rate);
        if (hits.length) {
          saveRecordedSample(
            soundItem.key,
            extractHit(data, rate, hits[0], hits[1]),
            rate,
          );
          previewRecordedSample(soundItem.key);
          setStatusMsg(`${soundItem.label}: sonido real guardado.`);
        } else {
          setStatusMsg(
            "No he oído ningún golpe en ese audio. Prueba a grabar más cerca.",
          );
        }
      } catch {
        setStatusMsg(
          "No he podido leer ese archivo de audio. Prueba con otro formato (m4a, mp3, wav).",
        );
      }
      setBusyKey(null);
    }
  };
  const uploadGroupSounds = async (group, groupFile) => {
    if (groupFile) {
      setBusyKey(group.id);
      setStatusMsg(null);
      try {
        const { data, rate } = await decodeAudioFileToMono(groupFile);
        const groupHits = detectHitOnsets(data, rate);
        const assignCount = Math.min(groupHits.length, group.items.length);
        for (let hitIdx = 0; hitIdx < assignCount; hitIdx++)
          saveRecordedSample(
            group.items[hitIdx].key,
            extractHit(data, rate, groupHits[hitIdx], groupHits[hitIdx + 1]),
            rate,
          );
        if (groupHits.length) {
          if (groupHits.length === group.items.length) {
            setStatusMsg(
              `Listo: ${assignCount} golpes asignados, del primero al último.`,
            );
          } else {
            setStatusMsg(
              `He oído ${groupHits.length} golpes y esperaba ${group.items.length}; he asignado ${assignCount}. Si falta alguno, deja un segundo de silencio entre golpe y golpe.`,
            );
          }
        } else {
          setStatusMsg("No he oído ningún golpe en ese audio.");
        }
      } catch {
        setStatusMsg(
          "No he podido leer ese archivo de audio. Prueba con otro formato (m4a, mp3, wav).",
        );
      }
      setBusyKey(null);
    }
  };
  return (
    <section
      className="panel flex flex-col gap-3 p-4 o-4"
      aria-label="Sonido real"
    >
      <div>
        <p className="f-label">Que suene como vuestra txalaparta</p>
        <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
          Sonido real
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">
          Grabad con la app de notas de voz del móvil un golpe seco en cada
          tabla y piedra, con un segundo de silencio entre golpes, de la más
          grave a la más aguda. Podéis subir un audio por tabla o uno con todas
          seguidas: la app encuentra cada golpe. Lo mismo con vuestros zapatos
          de claqué.
        </p>
      </div>
      {soundGroups.map((soundGroup) => (
        <div key={soundGroup.id} className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-semibold text-ink">
              {soundGroup.name}
            </p>
            <label className="btn btn-xs btn-file">
              <Icon name="upload" size={13} />
              {busyKey === soundGroup.id
                ? "Buscando los golpes…"
                : soundGroup.all}
              <input
                type="file"
                accept="audio/*"
                className="sr-only"
                onChange={(groupFileEvent) => {
                  uploadGroupSounds(
                    soundGroup,
                    groupFileEvent.target.files &&
                      groupFileEvent.target.files[0],
                  );
                  groupFileEvent.target.value = "";
                }}
              />
            </label>
          </div>
          <ul className="snd-list">
            {soundGroup.items.map((soundEntry) => {
              const isRecorded = hasRecordedSample(soundEntry.key);
              return (
                <li key={soundEntry.key} className="snd-row">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                    {soundEntry.label}
                  </span>
                  <span className={`snd-state ${isRecorded ? "is-real" : ""}`}>
                    {isRecorded ? "Grabado" : "Sintético"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-xs btn-icon"
                    aria-label={`Escuchar ${soundEntry.label}`}
                    onClick={() => {
                      unlockAudio();
                      soundEntry.test();
                    }}
                  >
                    <Icon name="play" size={12} />
                  </button>
                  <label
                    className="btn btn-xs btn-file"
                    aria-label={`Subir el sonido de ${soundEntry.label}`}
                  >
                    <Icon name="upload" size={12} />
                    {busyKey === soundEntry.key
                      ? "…"
                      : isRecorded
                        ? "Cambiar"
                        : "Subir"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="sr-only"
                      onChange={(fileEvent) => {
                        uploadSingleSound(
                          soundEntry,
                          fileEvent.target.files && fileEvent.target.files[0],
                        );
                        fileEvent.target.value = "";
                      }}
                    />
                  </label>
                  {isRecorded && (
                    <button
                      type="button"
                      className="btn btn-xs btn-icon"
                      aria-label={`Volver al sonido sintético de ${soundEntry.label}`}
                      onClick={() => deleteRecordedSample(soundEntry.key)}
                    >
                      <Icon name="x" size={12} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {statusMsg && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {statusMsg}
        </p>
      )}
      {!isSampleStorageOk() && (
        <p className="text-[12px] text-[color:var(--warn)]">
          Este navegador no deja guardar más sonidos: los grabados durarán
          mientras la pestaña esté abierta.
        </p>
      )}
      <p className="text-[12px] text-muted">
        Los sonidos grabados también se usan en «Practicar con el ritmo» y, los
        de los zapatos, en los vídeos de pasos.
      </p>
    </section>
  );
}
