// Copia de seguridad: export/import JSON {app:'contratiempo', v:4}.
import { useRef, useState } from "react";
import { exportRecordedSamples, importRecordedSamples } from "../lib/audio.js";
import { saveFile } from "../lib/claude.js";
import { localDateKey } from "../lib/time.js";
import { Icon } from "./ui/Icon.jsx";
export function BackupPanel({ getState, onImport }) {
  const [message, setMessage] = useState(null);
  const [pending, setPending] = useState(null);
  const fileInputRef = useRef(null);
  const downloadBackup = async () => {
    const backup = {
      app: "contratiempo",
      v: 4,
      saved: new Date().toISOString(),
      state: getState(),
      sonidos: exportRecordedSamples(),
    };
    setMessage(
      await saveFile(
        `contratiempo-copia-${localDateKey(new Date())}.json`,
        JSON.stringify(backup),
      ),
    );
  };
  const readBackupFile = async (file) => {
    if (file) {
      setMessage(null);
      try {
        const parsed = JSON.parse(await file.text());
        if (
          !parsed ||
          parsed.app !== "contratiempo" ||
          !parsed.state ||
          !Array.isArray(parsed.state.choreos)
        )
          throw new Error("bad");
        setPending({
          data: parsed,
          name: file.name,
        });
      } catch {
        setMessage("Ese archivo no es una copia de Contratiempo.");
      }
    }
  };
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Copia de seguridad"
    >
      <div>
        <p className="f-label">Para no perder nada</p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Copia de seguridad
        </h2>
        <p className="mt-1.5 max-w-[70ch] text-[13px] text-muted">
          La demo guarda todo solo en este navegador. Descarga una copia con
          coreografías, ritmos, sonidos grabados y ajustes, y cárgala en otro
          móvil u ordenador. Los vídeos y canciones subidos no van en la copia.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={downloadBackup}>
          <Icon name="save" />
          Descargar copia
        </button>
        <label className="btn btn-file">
          <Icon name="upload" />
          Cargar una copia
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(changeEvent) => {
              readBackupFile(
                changeEvent.target.files && changeEvent.target.files[0],
              );
              changeEvent.target.value = "";
            }}
          />
        </label>
      </div>
      {pending && (
        <div
          className="bk-confirm"
          role="alertdialog"
          aria-label="Confirmar copia"
        >
          <p className="text-[14px] text-ink">
            {"Vas a sustituir todo lo de este navegador por la copia "}
            <b className="font-semibold">{pending.name}</b>
            {pending.data.saved
              ? ` (del ${pending.data.saved.slice(0, 10)})`
              : ""}
            .
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-warn"
              onClick={() => {
                onImport(pending.data.state);
                if (pending.data.sonidos) {
                  importRecordedSamples(pending.data.sonidos);
                }
                setPending(null);
                setMessage("Copia cargada.");
              }}
            >
              Sustituir
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setPending(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {message && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
