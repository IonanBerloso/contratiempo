// Full-screen two-player txalaparta duo (ttakun/herren halves, one or two phones via the room channel), records strikes into new rhythm layers.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DUO_ROLE_COLORS,
  TXALAPARTA_ROLE_NAMES,
  TXALAPARTA_SNAP_BEATS,
} from "../../data/txalaparta.js";
import {
  audioNow,
  playSound,
  setAudioKeepAlive,
  unlockAudio,
} from "../../lib/audio.js";
import { useClaudeHook } from "../../lib/claude.js";
import { positiveMod } from "../../lib/math.js";
import {
  plankLabel,
  rhythmPlanks,
  strikeToSound,
} from "../../lib/txalaparta.js";
import { Icon } from "../ui/Icon.jsx";
export function TxalapartaDuo({
  rhythm,
  instruments,
  onAddLayers,
  onClose,
  onPractice,
}) {
  const room = useClaudeHook("room");
  const duoPads = useMemo(
    () => rhythmPlanks(rhythm, instruments),
    [rhythm, instruments],
  );
  const [linked, setLinked] = useState(false);
  const [myRole, setMyRole] = useState("tk");
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [recording, setRecording] = useState(null);
  const [peerCount, setPeerCount] = useState(0);
  const [notice, setNotice] = useState(null);
  const hitLogRef = useRef([]);
  const padElsRef = useRef(new Map());
  const stripRef = useRef(null);
  const takeRef = useRef(null);
  const totalBeats = rhythm.eights * 8;
  const beatSec = 60 / rhythm.bpm;
  const soundStrike = (role, pad) => {
    const sound = strikeToSound(
      {
        p: role,
        plank: pad.i,
        m: pad.m,
      },
      rhythm,
      instruments,
    );
    playSound(sound.s, sound.arg);
  };
  const flashPad = (role, padKey) => {
    hitLogRef.current.push({
      t: audioNow(),
      p: role,
    });
    if (hitLogRef.current.length > 80) {
      hitLogRef.current.shift();
    }
    const padEl = padElsRef.current.get(`${role}:${padKey}`);
    if (padEl) {
      padEl.classList.remove("is-lit");
      padEl.offsetWidth;
      padEl.classList.add("is-lit");
    }
  };
  const strike = (role, pad) => {
    unlockAudio();
    soundStrike(role, pad);
    flashPad(role, pad.key);
    const take = takeRef.current;
    if (take && take.phase === "rec") {
      const beat = (audioNow() - take.start) / beatSec;
      if (beat >= -0.25 && beat < totalBeats) {
        take.strikes.push({
          b: beat,
          p: role,
          plank: pad.i,
          m: pad.m,
        });
      }
    }
    if (linked && room) {
      room
        .emit("duo.hit", {
          p: role,
          m: pad.m,
          i: pad.i,
        })
        .catch((err) =>
          setNotice(
            err && err.code === "not_permitted"
              ? "Este móvil no puede enviar golpes: hace falta permiso de edición en la demo."
              : "Se ha perdido la conexión con el otro móvil.",
          ),
        );
    }
  };
  useEffect(() => {
    if (!linked || !room) return;
    const offHit = room.on(
      "duo.hit",
      (msg) => {
        if (msg.sameTab || !msg.data) return;
        const { p: hitRole, m: hitMaterial, i: hitIndex } = msg.data;
        if (
          (hitRole !== "tk" && hitRole !== "hr") ||
          (hitMaterial !== "w" && hitMaterial !== "s") ||
          !Number.isInteger(hitIndex)
        )
          return;
        const pad =
          duoPads.find(
            (candidate) =>
              candidate.m === hitMaterial && candidate.i === hitIndex,
          ) || duoPads[Math.min(hitIndex, duoPads.length - 1)];
        if (pad) {
          soundStrike(hitRole, pad);
          flashPad(hitRole, pad.key);
        }
      },
      () => setNotice("Se ha perdido la conexión con el otro móvil."),
    );
    room
      .presence({
        duo: {
          role: myRole,
        },
      })
      .catch(() => {});
    const offPeers = room.onPeers((peersInfo) =>
      setPeerCount(
        peersInfo.peers.filter(
          (peer) => !peer.sameTab && peer.presence && peer.presence.duo,
        ).length,
      ),
    );
    return () => {
      offHit();
      offPeers();
      room
        .presence({
          duo: null,
        })
        .catch(() => {});
    };
  }, [linked, room, duoPads, myRole]);
  useEffect(() => {
    if (!metronomeOn && !recording) return;
    unlockAudio();
    setAudioKeepAlive(true);
    const take = takeRef.current;
    const gridStart = take ? take.start - 4 * beatSec : audioNow() + 0.1;
    let tickNo = 0;
    const timer = setInterval(() => {
      const horizon = audioNow() + 0.12;
      for (; gridStart + tickNo * beatSec < horizon;) {
        const tickAt = gridStart + tickNo * beatSec;
        const tickBeat = tickNo - (take ? 4 : 0);
        if (tickAt >= audioNow() - 0.02) {
          playSound(
            positiveMod(tickBeat, 8) === 0 ? "clickHi" : "click",
            null,
            tickAt,
          );
        }
        tickNo += 1;
      }
      if (take) {
        const elapsed = (audioNow() - take.start) / beatSec;
        if (elapsed >= totalBeats) {
          finishTake();
          return;
        }
        const phase = elapsed < 0 ? "count" : "rec";
        if (phase !== take.phase || Math.floor(elapsed) !== take.shown) {
          take.phase = phase;
          take.shown = Math.floor(elapsed);
          setRecording({
            phase,
            beat: elapsed,
          });
        }
      }
    }, 25);
    return () => {
      clearInterval(timer);
      setAudioKeepAlive(false);
    };
  }, [metronomeOn, recording ? recording.id : null]);
  useEffect(() => {
    if (!onPractice) return;
    const timer = setInterval(() => {
      const lastHit = hitLogRef.current[hitLogRef.current.length - 1];
      if (lastHit && audioNow() - lastHit.t < 5) {
        onPractice(5);
      }
    }, 5e3);
    return () => clearInterval(timer);
  }, []);
  const startTake = () => {
    unlockAudio();
    const takeId = Date.now();
    takeRef.current = {
      id: takeId,
      start: audioNow() + 0.15 + 4 * beatSec,
      strikes: [],
      phase: "count",
      shown: -5,
    };
    setRecording({
      id: takeId,
      phase: "count",
      beat: -4,
    });
  };
  const finishTake = () => {
    const take = takeRef.current;
    if (((takeRef.current = null), setRecording(null), !take)) return;
    const snapStep = TXALAPARTA_SNAP_BEATS[rhythm.snap];
    const byRole = {
      tk: [],
      hr: [],
    };
    for (let hit of take.strikes) {
      let snapped = snapStep
        ? Math.round(hit.b / snapStep) * snapStep
        : Math.round(hit.b * 100) / 100;
      snapped = positiveMod(snapped, totalBeats);
      const roleHits = byRole[hit.p];
      if (
        !roleHits.some(
          (existing) =>
            Math.abs(existing.b - snapped) < 1e-6 &&
            existing.plank === hit.plank &&
            existing.m === hit.m,
        )
      ) {
        roleHits.push({
          b: snapped,
          p: hit.p,
          plank: hit.plank,
          m: hit.m,
        });
      }
    }
    const newLayers = ["tk", "hr"]
      .filter((layerRole) => byRole[layerRole].length)
      .map((layerRole) => ({
        id: `l${Date.now().toString(36)}${layerRole}`,
        label: `Dúo · ${TXALAPARTA_ROLE_NAMES[layerRole].toLowerCase()}`,
        muted: false,
        strikes: byRole[layerRole].sort((pe, ke) => pe.b - ke.b),
      }));
    if (newLayers.length) {
      onAddLayers(newLayers);
    }
    setNotice(
      newLayers.length
        ? `Añadidas ${newLayers.length === 2 ? "dos capas" : "una capa"} al ritmo «${rhythm.name}».`
        : "No se ha grabado ningún golpe.",
    );
  };
  const cancelTake = () => {
    takeRef.current = null;
    setRecording(null);
  };
  useEffect(() => {
    let frameId = 0;
    const drawStrip = () => {
      const canvas = stripRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const width = Math.round(rect.width * dpr);
        const height = Math.round(rect.height * dpr);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        const nowSec = audioNow();
        const windowSec = 3;
        for (let hit of hitLogRef.current) {
          const age = nowSec - hit.t;
          if (age > windowSec) continue;
          const dotX = width - (age / windowSec) * width;
          ctx.fillStyle = DUO_ROLE_COLORS[hit.p];
          ctx.globalAlpha = 1 - (age / windowSec) * 0.6;
          const dotY = hit.p === "tk" ? height * 0.3 : height * 0.7;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      frameId = requestAnimationFrame(drawStrip);
    };
    frameId = requestAnimationFrame(drawStrip);
    return () => cancelAnimationFrame(frameId);
  }, []);
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const renderHalf = (role, flipped) => (
    <div
      className={`duo-half ${flipped ? "is-flip" : ""}`}
      style={{
        "--c": DUO_ROLE_COLORS[role],
      }}
    >
      <p className="duo-role f-display">{TXALAPARTA_ROLE_NAMES[role]}</p>
      <div
        className="duo-pads"
        style={{
          gridTemplateColumns: `repeat(${duoPads.length}, minmax(0, 1fr))`,
        }}
      >
        {duoPads.map((pad) => (
          <button
            key={pad.key}
            type="button"
            ref={(ee) =>
              ee
                ? padElsRef.current.set(`${role}:${pad.key}`, ee)
                : padElsRef.current.delete(`${role}:${pad.key}`)
            }
            className={`duo-pad ${pad.m === "s" ? "is-stone" : ""}`}
            onPointerDown={(ev) => {
              ev.preventDefault();
              strike(role, pad);
            }}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                strike(role, pad);
              }
            }}
            aria-label={`${TXALAPARTA_ROLE_NAMES[role]}: ${plankLabel(pad)}`}
          >
            <span>{plankLabel(pad)}</span>
          </button>
        ))}
      </div>
    </div>
  );
  const recordLabel = recording
    ? recording.phase === "count"
      ? `Preparadas… ${Math.max(1, Math.ceil(-recording.beat))}`
      : `Grabando · ocho ${Math.floor(recording.beat / 8) + 1} de ${rhythm.eights}`
    : null;
  return (
    <div
      className="duo"
      role="dialog"
      aria-modal="true"
      aria-label="Txalaparta a dúo"
    >
      {linked ? null : renderHalf("tk", true)}
      <div className="duo-mid">
        <canvas ref={stripRef} className="duo-strip" aria-hidden="true" />
        <div className="duo-bar">
          <button type="button" className="btn btn-xs" onClick={onClose}>
            <Icon name="x" size={13} />
            Salir
          </button>
          <button
            type="button"
            className="btn btn-xs"
            aria-pressed={metronomeOn}
            onClick={() => setMetronomeOn((prev) => !prev)}
            disabled={!!recording}
          >
            <Icon name="metro" size={13} />
            {rhythm.bpm}
            {" bpm"}
          </button>
          {!linked &&
            (recording ? (
              <button
                type="button"
                className="btn btn-xs btn-warn"
                onClick={cancelTake}
              >
                <Icon name="stop" size={13} />
                {recordLabel}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-xs"
                onClick={startTake}
                title={`Graba ${rhythm.eights === 1 ? "un ocho" : `${rhythm.eights} ochos`} y lo añade como capas al ritmo`}
              >
                <Icon name="record" size={13} />
                Grabar en «{rhythm.name}»
              </button>
            ))}
          {room && (
            <button
              type="button"
              className="btn btn-xs"
              aria-pressed={linked}
              onClick={() => setLinked((prev) => !prev)}
              disabled={!!recording}
            >
              <Icon name="compare" size={13} />
              {linked ? "Cada una en su móvil" : "Un móvil para las dos"}
            </button>
          )}
          {linked && (
            <div
              className="seg seg-sm"
              role="radiogroup"
              aria-label="Qué tocas tú"
            >
              {["tk", "hr"].map((roleKey) => (
                <button
                  key={roleKey}
                  type="button"
                  role="radio"
                  aria-checked={myRole === roleKey}
                  className="seg-btn"
                  onClick={() => setMyRole(roleKey)}
                >
                  {TXALAPARTA_ROLE_NAMES[roleKey]}
                </button>
              ))}
            </div>
          )}
          {linked && (
            <span className="duo-note">
              {peerCount
                ? `${peerCount === 1 ? "Hay otro móvil" : `Hay ${peerCount} móviles`} conectado${peerCount === 1 ? "" : "s"}`
                : "Abre el dúo en el otro móvil"}
            </span>
          )}
        </div>
        {notice && (
          <p className="duo-note" role="status">
            {notice}
          </p>
        )}
        {linked && (
          <p className="duo-note">
            Entre dos móviles hay un pequeño retraso: va mejor por turnos, como
            pregunta y respuesta.
          </p>
        )}
      </div>
      {renderHalf(linked ? myRole : "hr", false)}
    </div>
  );
}
