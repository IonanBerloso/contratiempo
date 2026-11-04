// Choreographer's after-class log: who was absent, which choreographies were worked, editable WhatsApp summary with copy/open.
import { useMemo, useRef, useState } from "react";
import { DANCERS } from "../data/dancers.js";
import {
  buildClassSummaryMessage,
  lastClassDate,
} from "../lib/choreography.js";
import { DEFAULT_CLASS_DATE } from "../data/lastClass.js";
import { Icon } from "./ui/Icon.jsx";
export function LastClassLog({ choreos, clipsById, lastClass, setLastClass }) {
  const generatedText = useMemo(
    () => buildClassSummaryMessage(choreos, clipsById, lastClass),
    [choreos, clipsById, lastClass],
  );
  const [editedText, setEditedText] = useState(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const messageText = editedText != null ? editedText : generatedText;
  const toggleAbsent = (dancerId) =>
    setLastClass((prevAbsentClass) => ({
      ...prevAbsentClass,
      absent: prevAbsentClass.absent.includes(dancerId)
        ? prevAbsentClass.absent.filter((absentId) => absentId !== dancerId)
        : [...prevAbsentClass.absent, dancerId],
    }));
  const toggleWorked = (choreoId) =>
    setLastClass((prevWorkedClass) => ({
      ...prevWorkedClass,
      worked: prevWorkedClass.worked.includes(choreoId)
        ? prevWorkedClass.worked.filter((workedId) => workedId !== choreoId)
        : [...prevWorkedClass.worked, choreoId],
    }));
  const copyMessage = () => {
    const onCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };
    const selectFallback = () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(messageText)
          .then(onCopied, selectFallback);
      } else {
        selectFallback();
      }
    } catch {
      selectFallback();
    }
  };
  return (
    <section className="panel flex flex-col gap-4 p-4">
      <div>
        <p className="f-label">
          {"Después de clase · "}
          {lastClassDate(lastClass).short}
        </p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Última clase
        </h2>
      </div>
      <label className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink">
        ¿Qué día fue?
        <input
          type="date"
          className="field w-auto"
          value={lastClass.date || DEFAULT_CLASS_DATE}
          onChange={(ev) =>
            ev.target.value &&
            setLastClass((prev) => ({ ...prev, date: ev.target.value }))
          }
        />
        <span className="font-normal text-muted">
          Las que faltaron verán «Faltaste {lastClassDate(lastClass).day}».
        </span>
      </label>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-ink">¿Quién faltó?</p>
        <div className="flex flex-wrap gap-2">
          {DANCERS.map((dancer) => {
            const isAbsent = lastClass.absent.includes(dancer.id);
            return (
              <button
                key={dancer.id}
                type="button"
                className={`chip chip-att ${isAbsent ? "is-out" : ""}`}
                aria-pressed={isAbsent}
                onClick={() => toggleAbsent(dancer.id)}
              >
                <span
                  className="tape-dot"
                  style={{
                    background: dancer.tape,
                  }}
                />
                {dancer.name}
                <span className="chip-state">
                  {isAbsent ? "Faltó" : "Vino"}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-muted">
          Quien faltó verá al entrar la lista de lo marcado como Nuevo y sus
          notas personales.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-ink">
          ¿Qué coreografías trabajasteis?
        </p>
        <div className="flex flex-wrap gap-2">
          {choreos.map((choreo) => (
            <button
              key={choreo.id}
              type="button"
              className="chip"
              aria-pressed={lastClass.worked.includes(choreo.id)}
              onClick={() => toggleWorked(choreo.id)}
            >
              {lastClass.worked.includes(choreo.id) && (
                <Icon name="check" size={14} />
              )}
              {choreo.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-ink" htmlFor="wa-text">
          Resumen para el grupo de WhatsApp
        </label>
        <textarea
          id="wa-text"
          ref={textareaRef}
          className="field wa-text"
          rows={10}
          value={messageText}
          onChange={(changeEvent) => setEditedText(changeEvent.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={copyMessage}
          >
            <Icon name={copied ? "check" : "copy"} />
            {copied ? "Copiado" : "Copiar el mensaje"}
          </button>
          <a
            className="btn"
            href={`https://wa.me/?text=${encodeURIComponent(messageText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en WhatsApp
          </a>
          {editedText != null && (
            <button
              type="button"
              className="btn"
              onClick={() => setEditedText(null)}
            >
              Volver a generarlo
            </button>
          )}
        </div>
        <p className="text-[12px] text-muted">
          El mensaje no nombra a quién faltó: cada una lo ve solo al entrar con
          su código.
        </p>
      </div>
    </section>
  );
}
