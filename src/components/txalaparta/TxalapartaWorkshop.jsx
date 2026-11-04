// The txalaparta workshop: pads, waterfall canvas, loop recorder, practice mode, score grid, moves per count, layers, rhythms list.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FOOT_STRIKES,
  TXALAPARTA_MATERIAL_OPTIONS,
} from "../../data/txalaparta.js";
import {
  audioNow,
  audioOutputLatency,
  playSound,
  renderSoundsToAudioFile,
  setAudioKeepAlive,
  unlockAudio,
} from "../../lib/audio.js";
import { saveFile, slugifyFilename, useClaudeHook } from "../../lib/claude.js";
import { positiveMod } from "../../lib/math.js";
import {
  TXALAPARTA_COUNT_IN_BEATS,
  TXALAPARTA_FEET_COLUMN_SHARE,
  TXALAPARTA_HIT_WINDOW_SEC,
  TXALAPARTA_LABEL_COLUMN_PX,
  TXALAPARTA_LOOKAHEAD_SEC,
  TXALAPARTA_PLANK_ROLES,
  TXALAPARTA_ROLE_COLORS,
  TXALAPARTA_ROLE_KEYS,
  TXALAPARTA_ROLE_LABELS,
  TXALAPARTA_SNAP_STEPS,
  beatToEightCount,
  countUnplayableStrikes,
  isStrikePlayable,
  layerRoles,
  plankLabel,
  plankPitchLabel,
  rhythmAuthorLabel,
  rhythmPlanks,
  scoreStars,
  strikeTargetKey,
  strikeToSound,
  txalapartaMaterialLabel,
  withRhythmMaterial,
  proposeHerrenResponse,
} from "../../lib/txalaparta.js";
import { RealSoundPanel } from "./RealSoundPanel.jsx";
import { RhythmBlockAssignPanel } from "./RhythmBlockAssignPanel.jsx";
import { TxalapartaRhythmGrid } from "./RhythmGrid.jsx";
import { TxalapartaDuo } from "./TxalapartaDuo.jsx";
import { ConfirmButton } from "../ui/ConfirmButton.jsx";
import { Icon } from "../ui/Icon.jsx";
import { isTypingTarget } from "../../lib/dom.js";
export function TxalapartaWorkshop({
  rhythm,
  rhythms,
  choreos,
  mode,
  instruments,
  setInstruments,
  vocab,
  onPractice,
  updateRhythm,
  onOpen,
  onCreate,
  onDuplicate,
  onDelete,
  onAssign,
  onUnassign,
  onOpenBlock,
  onBack,
}) {
  const loopBeats = rhythm.eights * 8;
  const columns = useMemo(
    () => rhythmPlanks(rhythm, instruments),
    [rhythm.material, instruments.wood, instruments.stone],
  );
  const hasFeet = !!rhythm.feet;
  const editRhythm = (updater) => updateRhythm(rhythm.id, updater);
  const [playMode, setPlayMode] = useState("stop");
  const [playhead, setPlayhead] = useState({
    phase: "stop",
    idx: null,
    slot: null,
    cin: null,
    count: null,
    eight: null,
  });
  const [metronomeOn, setMetronomeOn] = useState(true);
  const [tempoRamp, setTempoRamp] = useState(null);
  const [practiceRole, setPracticeRole] = useState(null);
  const [exportProgress, setExportProgress] = useState(null);
  const [exportMessage, setExportMessage] = useState(null);
  const sampler = useClaudeHook("sample");
  const [suggestStatus, setSuggestStatus] = useState(null);
  const [duetOpen, setDuetOpen] = useState(false);
  const feetSoundName = (soundIdx) =>
    vocab && vocab.sounds[FOOT_STRIKES[soundIdx].key]
      ? vocab.sounds[FOOT_STRIKES[soundIdx].key].name
      : FOOT_STRIKES[soundIdx].name;
  const canvasRef = useRef(null);
  const screenRef = useRef(null);
  const padRefs = useRef({});
  const engineRef = useRef({
    mode: "stop",
    start: 0,
    spb: 60 / rhythm.bpm,
    L: loopBeats,
    lastBeat: 0,
    recStart: 0,
    recEnd: 0,
    recLayerId: null,
    rid: rhythm.id,
    runId: 0,
    flashes: {},
    lastTap: 0,
    bpm: rhythm.bpm,
    factor: 1,
    expect: new Map(),
    passes: new Map(),
    lastPass: -1,
  });
  const rhythmRef = useRef(rhythm);
  const columnsRef = useRef(columns);
  const instrumentsRef = useRef(instruments);
  const tempoRampRef = useRef(null);
  const practiceRoleRef = useRef(null);
  const metronomeOnRef = useRef(metronomeOn);
  const updateRhythmRef = useRef(updateRhythm);
  const schedulerTimerRef = useRef(null);
  const rafRef = useRef(null);
  const audioReleaseTimerRef = useRef(null);
  const canvasSizeRef = useRef({
    w: 600,
    h: 240,
  });
  const playheadKeyRef = useRef("");
  rhythmRef.current = rhythm;
  columnsRef.current = columns;
  instrumentsRef.current = instruments;
  tempoRampRef.current = tempoRamp;
  practiceRoleRef.current = practiceRole;
  metronomeOnRef.current = metronomeOn;
  updateRhythmRef.current = updateRhythm;
  engineRef.current.L = loopBeats;
  engineRef.current.bpm = rhythm.bpm;
  const currentBeat = () => {
    const engine = engineRef.current;
    return (audioNow() - audioOutputLatency() - engine.start) / engine.spb;
  };
  const addFlash = (flashKey, flashTime) => {
    const flashes = engineRef.current.flashes;
    if (!flashes[flashKey]) {
      flashes[flashKey] = [];
    }
    flashes[flashKey].push(flashTime);
  };
  const canPlayStrike = (strike) =>
    isStrikePlayable(
      strike,
      rhythmRef.current,
      columnsRef.current,
      engineRef.current.L,
    );
  const scheduleRange = (rangeStart, rangeEnd) => {
    const engine = engineRef.current;
    const rhythmNow = rhythmRef.current;
    for (
      let clickBeat = Math.ceil(rangeStart - 1e-9);
      clickBeat < rangeEnd;
      clickBeat++
    )
      if (
        clickBeat < 0 ||
        (engine.mode === "rec" &&
          clickBeat >= engine.recStart - TXALAPARTA_COUNT_IN_BEATS &&
          clickBeat < engine.recStart) ||
        metronomeOnRef.current
      ) {
        const accent =
          clickBeat === -TXALAPARTA_COUNT_IN_BEATS ||
          (engine.mode === "rec" &&
            clickBeat === engine.recStart - TXALAPARTA_COUNT_IN_BEATS) ||
          (clickBeat >= 0 && positiveMod(clickBeat, 8) === 0);
        playSound(
          accent ? "clickHi" : "click",
          null,
          engine.start + clickBeat * engine.spb,
        );
      }
    const ownRole = practiceRoleRef.current;
    for (let layer of rhythmNow.layers) {
      if (layer.muted) continue;
      const layerStart =
        layer.runId === engine.runId && layer.fromBeat != null
          ? layer.fromBeat
          : 0;
      const firstBeat = Math.max(rangeStart, layerStart, 0);
      for (let strike of layer.strikes) {
        if (!canPlayStrike(strike)) continue;
        const columnId = strikeTargetKey(strike, rhythmNow);
        for (
          let hitBeat =
            strike.b +
            Math.ceil((firstBeat - strike.b) / engine.L - 1e-9) * engine.L;
          hitBeat < rangeEnd;
          hitBeat += engine.L
        ) {
          if (hitBeat < firstBeat - 1e-9) continue;
          if (ownRole && strike.p === ownRole) {
            const expectKey = `${strike.p}:${columnId}:${Math.round(hitBeat * 100)}`;
            if (!engine.expect.has(expectKey)) {
              const passIdx = Math.floor(hitBeat / engine.L);
              engine.expect.set(expectKey, {
                x: hitBeat,
                ck: columnId,
                hit: false,
                pass: passIdx,
                time: engine.start + hitBeat * engine.spb,
              });
              const passScore = engine.passes.get(passIdx) || {
                total: 0,
                hits: 0,
                extra: 0,
              };
              passScore.total += 1;
              engine.passes.set(passIdx, passScore);
            }
            continue;
          }
          const hitTime = engine.start + hitBeat * engine.spb;
          const sound = strikeToSound(
            strike,
            rhythmNow,
            instrumentsRef.current,
          );
          playSound(sound.s, sound.arg, hitTime);
          addFlash(`${strike.p}:${columnId}`, hitTime);
        }
      }
    }
  };
  const schedulerTick = () => {
    const engine = engineRef.current;
    if (engine.mode === "stop") return;
    let scheduledUntil = engine.lastBeat;
    let horizon =
      (audioNow() + TXALAPARTA_LOOKAHEAD_SEC - engine.start) / engine.spb;
    if (horizon <= scheduledUntil) return;
    const ramp = tempoRampRef.current;
    const maxFactor = ramp === "accel" ? 1.6 : 1;
    if (ramp && engine.factor < maxFactor) {
      const nextLoopBeat =
        (Math.floor(scheduledUntil / engine.L + 1e-9) + 1) * engine.L;
      if (nextLoopBeat > 0 && horizon >= nextLoopBeat) {
        scheduleRange(scheduledUntil, nextLoopBeat);
        const nextLoopTime = engine.start + nextLoopBeat * engine.spb;
        engine.factor = Math.min(
          maxFactor,
          Math.round((engine.factor + (ramp === "accel" ? 0.08 : 0.1)) * 100) /
            100,
        );
        engine.spb = 60 / (engine.bpm * engine.factor);
        engine.start = nextLoopTime - nextLoopBeat * engine.spb;
        scheduledUntil = nextLoopBeat;
        horizon =
          (audioNow() + TXALAPARTA_LOOKAHEAD_SEC - engine.start) / engine.spb;
      }
    }
    scheduleRange(scheduledUntil, horizon);
    engine.lastBeat = horizon;
  };
  const closeRecLayer = () => {
    const engine = engineRef.current;
    const layerId = engine.recLayerId;
    engine.recLayerId = null;
    if (layerId) {
      updateRhythmRef.current(engine.rid, (draft) => ({
        ...draft,
        layers: draft.layers.filter(
          (layer) => layer.id !== layerId || layer.strikes.length > 0,
        ),
      }));
    }
  };
  const stopTransport = () => {
    const engine = engineRef.current;
    if (engine.mode === "rec") {
      closeRecLayer();
    }
    engine.mode = "stop";
    clearInterval(schedulerTimerRef.current);
    schedulerTimerRef.current = null;
    setPlayMode("stop");
    setAudioKeepAlive(false);
    startRenderLoop();
  };
  const startScheduler = () => {
    clearInterval(schedulerTimerRef.current);
    schedulerTimerRef.current = setInterval(schedulerTick, 25);
    schedulerTick();
    startRenderLoop();
  };
  const addRecLayer = (startBeat) => {
    const engine = engineRef.current;
    const layerId = `l${Date.now().toString(36)}`;
    engine.recLayerId = layerId;
    updateRhythmRef.current(engine.rid, (draft) => ({
      ...draft,
      layers: [
        ...draft.layers,
        {
          id: layerId,
          label: `Capa ${draft.layers.length + 1}`,
          muted: false,
          strikes: [],
          runId: engine.runId,
          fromBeat: startBeat,
        },
      ],
    }));
  };
  const startTransport = (withRecording) => {
    unlockAudio();
    const engine = engineRef.current;
    const nowTime = audioNow();
    engine.bpm = rhythm.bpm;
    engine.factor = tempoRampRef.current === "up" ? 0.5 : 1;
    engine.spb = 60 / (rhythm.bpm * engine.factor);
    engine.rid = rhythm.id;
    engine.runId += 1;
    engine.flashes = {};
    engine.expect = new Map();
    engine.passes = new Map();
    engine.lastPass = -1;
    if (withRecording) {
      engine.start = nowTime + 0.1 + TXALAPARTA_COUNT_IN_BEATS * engine.spb;
      engine.lastBeat = -TXALAPARTA_COUNT_IN_BEATS - 1e-6;
      engine.recStart = 0;
      engine.recEnd = loopBeats;
      engine.mode = "rec";
      addRecLayer(loopBeats);
    } else {
      engine.start = nowTime + 0.06;
      engine.lastBeat = -1e-6;
      engine.mode = "play";
    }
    setPlayMode(engine.mode);
    setAudioKeepAlive(true);
    startScheduler();
  };
  const togglePlay = () => {
    if (engineRef.current.mode === "stop") {
      startTransport(false);
    } else {
      stopTransport();
    }
  };
  const toggleRecord = () => {
    const engine = engineRef.current;
    if (!practiceRoleRef.current) {
      if (engine.mode === "stop") return startTransport(true);
      if ((unlockAudio(), engine.mode === "play")) {
        const beatNow = currentBeat();
        engine.recStart = Math.ceil((beatNow + 1) / loopBeats) * loopBeats;
        engine.recEnd = engine.recStart + loopBeats;
        engine.mode = "rec";
        addRecLayer(engine.recEnd);
        setPlayMode("rec");
      } else {
        closeRecLayer();
        engine.mode = "play";
        setPlayMode("play");
      }
    }
  };
  const hitPad = (pad) => {
    const rhythmNow = rhythmRef.current;
    const { p, plank } = pad;
    if (p === "pi" && !rhythmNow.feet) return;
    const soundSpec =
      p === "pi"
        ? {
            p,
            plank,
          }
        : {
            p,
            plank,
            m: pad.m,
          };
    const columnId = p === "pi" ? `f${plank}` : `${pad.m}${plank}`;
    if (p !== "pi" && !columnsRef.current.some((col) => col.key === columnId))
      return;
    unlockAudio();
    const sound = strikeToSound(soundSpec, rhythmNow, instrumentsRef.current);
    playSound(sound.s, sound.arg);
    const engine = engineRef.current;
    const nowTime = audioNow();
    if (
      (addFlash(`${p}:${columnId}`, nowTime),
      (engine.lastTap = nowTime),
      startRenderLoop(),
      practiceRoleRef.current && engine.mode !== "stop")
    ) {
      if (p !== practiceRoleRef.current) return;
      const tapTime = nowTime - audioOutputLatency();
      let match = null;
      for (let expected of engine.expect.values()) {
        if (expected.hit || expected.ck !== columnId) continue;
        const delta = Math.abs(expected.time - tapTime);
        if (
          delta <= TXALAPARTA_HIT_WINDOW_SEC &&
          (!match || delta < Math.abs(match.time - tapTime))
        ) {
          match = expected;
        }
      }
      const tapPassIdx = Math.floor(
        Math.max(0, (tapTime - engine.start) / engine.spb) / engine.L,
      );
      const passScore = engine.passes.get(match ? match.pass : tapPassIdx) || {
        total: 0,
        hits: 0,
        extra: 0,
      };
      if (match) {
        match.hit = true;
        passScore.hits += 1;
      } else {
        passScore.extra += 1;
      }
      engine.passes.set(match ? match.pass : tapPassIdx, passScore);
      return;
    }
    if (engine.mode === "stop") {
      clearTimeout(audioReleaseTimerRef.current);
      audioReleaseTimerRef.current = setTimeout(() => {
        if (engineRef.current.mode === "stop") {
          setAudioKeepAlive(false);
        }
      }, 4e3);
      return;
    }
    if (engine.mode !== "rec" || !engine.recLayerId) return;
    const loopPos =
      (nowTime - audioOutputLatency() - engine.start) / engine.spb -
      engine.recStart;
    if (loopPos < -0.3 || loopPos >= engine.L + 0.3) return;
    const snapStep = TXALAPARTA_SNAP_STEPS[rhythmNow.snap];
    let snappedBeat = snapStep
      ? Math.round(loopPos / snapStep) * snapStep
      : Math.round(loopPos * 100) / 100;
    snappedBeat = positiveMod(snappedBeat, engine.L);
    if (snappedBeat > engine.L - 1e-6) {
      snappedBeat = 0;
    }
    const layerId = engine.recLayerId;
    const newStrike =
      p === "pi" || rhythmNow.material !== "ambas"
        ? {
            b: snappedBeat,
            plank,
            p,
          }
        : {
            b: snappedBeat,
            plank,
            p,
            m: pad.m,
          };
    updateRhythmRef.current(engine.rid, (draft) => ({
      ...draft,
      layers: draft.layers.map((layer) =>
        layer.id !== layerId ||
        layer.strikes.some(
          (existing) =>
            existing.p === p &&
            strikeTargetKey(existing, draft) === columnId &&
            Math.abs(existing.b - snappedBeat) < 0.01,
        )
          ? layer
          : {
              ...layer,
              strikes: [...layer.strikes, newStrike],
            },
      ),
    }));
  };
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = engineRef.current;
    const rhythmNow = rhythmRef.current;
    const cols = columnsRef.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvasW = Math.round(canvasSizeRef.current.w * dpr);
    const canvasH = Math.round(canvasSizeRef.current.h * dpr);
    if (canvas.width !== canvasW) {
      canvas.width = canvasW;
    }
    if (canvas.height !== canvasH) {
      canvas.height = canvasH;
    }
    const ctx = canvas.getContext("2d");
    const running = engine.mode !== "stop";
    const nowBeat = running ? currentBeat() : -0.35;
    const gutter = TXALAPARTA_LABEL_COLUMN_PX * dpr;
    const laneWidth = canvasW - gutter;
    const feetWidth = rhythmNow.feet
      ? laneWidth * TXALAPARTA_FEET_COLUMN_SHARE
      : 0;
    const colWidth = (laneWidth - feetWidth) / Math.max(1, cols.length);
    const laneOf = (laneKey) => {
      if (laneKey[0] === "f")
        return {
          x: gutter + laneWidth - feetWidth,
          w: feetWidth,
        };
      const laneIdx = cols.findIndex((candidate) => candidate.key === laneKey);
      return {
        x: gutter + laneIdx * colWidth,
        w: colWidth,
      };
    };
    const hitLineY = canvasH - 8 * dpr;
    const visibleBeats = 3;
    const pxPerBeat = hitLineY / visibleBeats;
    ctx.fillStyle = "#0D0F14";
    ctx.fillRect(0, 0, canvasW, canvasH);
    cols.forEach((bgCol, bgIdx) => {
      const isStone = bgCol.m === "s";
      ctx.fillStyle = isStone
        ? bgIdx % 2
          ? "rgba(170,180,195,0.09)"
          : "rgba(170,180,195,0.05)"
        : bgIdx % 2
          ? "rgba(214,170,110,0.07)"
          : "rgba(214,170,110,0.035)";
      ctx.fillRect(gutter + bgIdx * colWidth, 0, colWidth, canvasH);
      const startsGroup = bgIdx > 0 && cols[bgIdx - 1].m !== bgCol.m;
      ctx.fillStyle = startsGroup
        ? "rgba(255,255,255,0.35)"
        : "rgba(255,255,255,0.07)";
      ctx.fillRect(
        gutter + bgIdx * colWidth,
        0,
        Math.max(1, startsGroup ? 2 * dpr : dpr),
        canvasH,
      );
    });
    if (feetWidth) {
      ctx.fillStyle = "rgba(183,148,246,0.08)";
      ctx.fillRect(gutter + laneWidth - feetWidth, 0, feetWidth, canvasH);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(gutter + laneWidth - feetWidth, 0, 2 * dpr, canvasH);
    }
    ctx.font = `600 ${10 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    cols.forEach((labelCol, labelIdx) => {
      if (labelIdx === 0 || cols[labelIdx - 1].m !== labelCol.m) {
        ctx.fillText(
          labelCol.m === "s" ? "PIEDRA" : "MADERA",
          gutter + labelIdx * colWidth + 6 * dpr,
          6 * dpr,
        );
      }
    });
    if (feetWidth) {
      ctx.fillText("PIES", gutter + laneWidth - feetWidth + 6 * dpr, 6 * dpr);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${12 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
    for (
      let halfStep = Math.floor((nowBeat - 1) * 2);
      halfStep <= Math.ceil((nowBeat + visibleBeats) * 2);
      halfStep++
    ) {
      const markBeat = halfStep / 2;
      const markY = hitLineY - (markBeat - nowBeat) * pxPerBeat;
      if (markY < -10 || markY > canvasH + 10) continue;
      const isWholeBeat = halfStep % 2 === 0;
      const isEightStart = markBeat >= 0 && positiveMod(markBeat, 8) === 0;
      if (
        ((ctx.fillStyle = isEightStart
          ? "rgba(255,255,255,0.32)"
          : isWholeBeat
            ? "rgba(255,255,255,0.14)"
            : "rgba(255,255,255,0.05)"),
        ctx.fillRect(
          gutter,
          markY,
          canvasW - gutter,
          isEightStart ? 2 * dpr : Math.max(1, dpr),
        ),
        isWholeBeat)
      ) {
        const inCountIn =
          markBeat < 0 ||
          (engine.mode === "rec" &&
            markBeat < engine.recStart &&
            markBeat >= engine.recStart - TXALAPARTA_COUNT_IN_BEATS);
        const markNumber =
          markBeat < 0
            ? markBeat + TXALAPARTA_COUNT_IN_BEATS + 5
            : inCountIn
              ? markBeat - engine.recStart + TXALAPARTA_COUNT_IN_BEATS + 5
              : beatToEightCount(positiveMod(markBeat, engine.L));
        ctx.fillStyle = inCountIn ? "#E4EE32" : "rgba(255,255,255,0.7)";
        ctx.fillText(String(markNumber), gutter - 6 * dpr, markY);
      }
    }
    const tileHeight = Math.max(9 * dpr, pxPerBeat * 0.15);
    const tiles = [];
    const sharedSlots = new Set();
    const slotRoles = new Map();
    for (let layer of rhythmNow.layers)
      if (!layer.muted)
        for (let strike of layer.strikes) {
          if (!isStrikePlayable(strike, rhythmNow, cols, engine.L)) continue;
          const tileCol = strikeTargetKey(strike, rhythmNow);
          const firstLoop = Math.floor((nowBeat - 1 - strike.b) / engine.L);
          const lastLoop = Math.ceil(
            (nowBeat + visibleBeats - strike.b) / engine.L,
          );
          for (let loopIdx = firstLoop; loopIdx <= lastLoop; loopIdx++) {
            const tileBeat = strike.b + loopIdx * engine.L;
            if (tileBeat < 0) continue;
            const slotKey = `${strike.p === "pi" ? "f" : tileCol}:${Math.round(tileBeat * 100)}`;
            const slotRole = slotRoles.get(slotKey);
            if (slotRole && slotRole !== strike.p) {
              sharedSlots.add(slotKey);
            }
            slotRoles.set(slotKey, strike.p);
            tiles.push({
              x: tileBeat,
              ck: tileCol,
              p: strike.p,
              key: slotKey,
              plank: strike.plank,
            });
          }
        }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${10 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
    for (let tile of tiles) {
      const tileY = hitLineY - (tile.x - nowBeat) * pxPerBeat;
      if (tileY < -tileHeight || tileY > canvasH + tileHeight) continue;
      const alpha =
        tile.x < nowBeat ? Math.max(0, 1 - (nowBeat - tile.x) / 0.45) : 1;
      if (alpha <= 0) continue;
      const lane = laneOf(tile.ck);
      const isShared = sharedSlots.has(tile.key);
      const inset = 4 * dpr;
      const tileSpan = lane.w - 2 * inset;
      const tileWidth = isShared ? tileSpan / 2 - dpr : tileSpan;
      const tileX =
        lane.x + inset + (isShared && tile.p === "hr" ? tileSpan / 2 + dpr : 0);
      if (
        ((ctx.globalAlpha = alpha),
        ctx.beginPath(),
        ctx.roundRect
          ? ctx.roundRect(
              tileX,
              tileY - tileHeight,
              tileWidth,
              tileHeight,
              4 * dpr,
            )
          : ctx.rect(tileX, tileY - tileHeight, tileWidth, tileHeight),
        running && practiceRoleRef.current === tile.p)
      ) {
        const expectedHit = engine.expect.get(
          `${tile.p}:${tile.ck}:${Math.round(tile.x * 100)}`,
        );
        const missed =
          expectedHit &&
          !expectedHit.hit &&
          tile.x < nowBeat - TXALAPARTA_HIT_WINDOW_SEC / engine.spb;
        if (expectedHit && expectedHit.hit) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#E4EE32";
          ctx.fill();
        } else {
          ctx.globalAlpha = Math.max(alpha, 0.6);
          ctx.fillStyle = missed
            ? "rgba(255,80,80,0.25)"
            : "rgba(255,255,255,0.08)";
          ctx.fill();
          ctx.lineWidth = 2 * dpr;
          ctx.strokeStyle = missed ? "#FF6B6B" : TXALAPARTA_ROLE_COLORS[tile.p];
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = TXALAPARTA_ROLE_COLORS[tile.p];
        ctx.fill();
      }
      if (tile.p === "pi") {
        ctx.fillStyle = "#1B1030";
        ctx.fillText(
          FOOT_STRIKES[tile.plank].short,
          tileX + tileWidth / 2,
          tileY - tileHeight / 2,
        );
      }
      ctx.globalAlpha = 1;
    }
    const frameTime = audioNow();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(gutter, hitLineY, canvasW - gutter, 2 * dpr);
    const activeFlash = (flashKey) => {
      const queue = engine.flashes[flashKey];
      if (!queue) return null;
      for (; queue.length > 1 && queue[1] <= frameTime;) queue.shift();
      return queue.length &&
        queue[0] <= frameTime &&
        frameTime - queue[0] < 0.14
        ? queue[0]
        : null;
    };
    const drawGlow = (glowX, glowW, flashTime) => {
      const fade = 1 - (frameTime - flashTime) / 0.14;
      const gradient = ctx.createLinearGradient(
        0,
        hitLineY - 60 * dpr,
        0,
        hitLineY,
      );
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(1, `rgba(255,248,225,${0.55 * fade})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(glowX, hitLineY - 60 * dpr, glowW, 60 * dpr);
    };
    for (let padCol of cols) {
      let latestFlash = null;
      for (let padRole of TXALAPARTA_PLANK_ROLES) {
        const flashAt = activeFlash(`${padRole}:${padCol.key}`);
        const padEl = padRefs.current[`${padRole}:${padCol.key}`];
        if (padEl) {
          padEl.classList.toggle("is-hit", flashAt != null);
        }
        if (flashAt != null && (latestFlash == null || flashAt > latestFlash)) {
          latestFlash = flashAt;
        }
      }
      if (latestFlash != null) {
        const glowLane = laneOf(padCol.key);
        drawGlow(glowLane.x, glowLane.w, latestFlash);
      }
    }
    if (rhythmNow.feet) {
      let latestFeetFlash = null;
      FOOT_STRIKES.forEach((feetSound, feetIdx) => {
        const feetFlashAt = activeFlash(`pi:f${feetIdx}`);
        const feetPadEl = padRefs.current[`pi:f${feetIdx}`];
        if (feetPadEl) {
          feetPadEl.classList.toggle("is-hit", feetFlashAt != null);
        }
        if (
          feetFlashAt != null &&
          (latestFeetFlash == null || feetFlashAt > latestFeetFlash)
        ) {
          latestFeetFlash = feetFlashAt;
        }
      });
      if (latestFeetFlash != null) {
        drawGlow(gutter + laneWidth - feetWidth, feetWidth, latestFeetFlash);
      }
    }
    let phase = engine.mode;
    let countIn = null;
    let beatIdx = null;
    let slot = null;
    if (
      running &&
      (nowBeat < 0
        ? ((phase = "countin"),
          (countIn = Math.floor(nowBeat) + TXALAPARTA_COUNT_IN_BEATS + 5))
        : engine.mode === "rec" &&
          nowBeat < engine.recStart &&
          ((phase =
            nowBeat >= engine.recStart - TXALAPARTA_COUNT_IN_BEATS
              ? "countin"
              : "armed"),
          phase === "countin" &&
            (countIn =
              Math.floor(nowBeat - engine.recStart) +
              TXALAPARTA_COUNT_IN_BEATS +
              5)),
      nowBeat >= 0)
    ) {
      const loopPos = positiveMod(nowBeat, engine.L);
      beatIdx = Math.floor(loopPos);
      slot = Math.floor(loopPos * 4 + 1e-6) / 4;
    }
    let score = null;
    if (running && practiceRoleRef.current && nowBeat >= 0) {
      const passIdx = Math.floor(nowBeat / engine.L);
      const passScore = engine.passes.get(passIdx) || {
        total: 0,
        hits: 0,
        extra: 0,
      };
      const prevPass = (passIdx > 0 && engine.passes.get(passIdx - 1)) || null;
      score = {
        pass: passIdx + 1,
        hits: passScore.hits,
        total: passScore.total,
        extra: passScore.extra,
        prev: prevPass,
      };
      for (let [expectKey, expectEntry] of engine.expect) {
        if (expectEntry.x < nowBeat - 2 * engine.L) {
          engine.expect.delete(expectKey);
        }
      }
      if (
        passIdx > 0 &&
        engine.lastPass !== passIdx - 1 &&
        prevPass &&
        prevPass.total > 0
      ) {
        engine.lastPass = passIdx - 1;
        const scoredRole = practiceRoleRef.current;
        const passRatio = prevPass.hits / prevPass.total;
        updateRhythmRef.current(engine.rid, (draft) => {
          const prevBest = (draft.best || {})[scoredRole];
          return prevBest &&
            prevBest.total &&
            prevBest.hits / prevBest.total >= passRatio
            ? draft
            : {
                ...draft,
                best: {
                  ...(draft.best || {}),
                  [scoredRole]: {
                    hits: prevPass.hits,
                    total: prevPass.total,
                  },
                },
              };
        });
      }
    }
    const liveFactor = running ? engine.factor : null;
    const stateKey = `${phase}|${countIn}|${beatIdx}|${slot}|${liveFactor}|${score ? `${score.pass}:${score.hits}/${score.total}/${score.extra}:${score.prev ? `${score.prev.hits}/${score.prev.total}` : ""}` : ""}`;
    if (stateKey !== playheadKeyRef.current) {
      playheadKeyRef.current = stateKey;
      setPlayhead({
        phase,
        cin: countIn,
        idx: beatIdx,
        slot,
        factor: liveFactor,
        score,
        count: beatIdx != null ? (beatIdx % 8) + 1 : null,
        eight: beatIdx != null ? Math.floor(beatIdx / 8) + 1 : null,
      });
    }
    if (
      engine.mode === "rec" &&
      engine.recLayerId &&
      nowBeat >= engine.recEnd + 0.3
    ) {
      closeRecLayer();
      engine.mode = "play";
      setPlayMode("play");
    }
  };
  const startRenderLoop = () => {
    if (rafRef.current) return;
    const frame = () => {
      drawCanvas();
      const engine = engineRef.current;
      const nowTime = audioNow();
      const flashing =
        nowTime - engine.lastTap < 0.6 ||
        Object.values(engine.flashes).some(
          (times) => times.length && nowTime - times[times.length - 1] < 0.6,
        );
      if (engine.mode !== "stop" || flashing) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rafRef.current = null;
        drawCanvas();
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  };
  useEffect(() => {
    const screenEl = screenRef.current;
    if (!screenEl || typeof ResizeObserver == "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      canvasSizeRef.current = {
        w: Math.max(1, entry.contentRect.width),
        h: Math.max(1, entry.contentRect.height),
      };
      drawCanvas();
    });
    observer.observe(screenEl);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!rafRef.current) {
      drawCanvas();
    }
  });
  useEffect(() => {
    const engine = engineRef.current;
    engine.bpm = rhythm.bpm;
    const newSpb =
      60 / (rhythm.bpm * (engine.mode !== "stop" ? engine.factor : 1));
    if (engine.mode !== "stop") {
      const nowTime = audioNow();
      const beatNow = (nowTime - engine.start) / engine.spb;
      engine.start = nowTime - beatNow * newSpb;
    }
    engine.spb = newSpb;
  }, [rhythm.bpm]);
  useEffect(
    () => () => {
      if (engineRef.current.mode !== "stop") {
        stopTransport();
      }
    },
    [rhythm.id],
  );
  useEffect(
    () => () => {
      clearInterval(schedulerTimerRef.current);
      clearTimeout(audioReleaseTimerRef.current);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      engineRef.current.mode = "stop";
      setAudioKeepAlive(false);
    },
    [],
  );
  useEffect(() => {
    if (playMode === "stop" || !onPractice) return;
    const practiceTimer = setInterval(() => onPractice(5), 5e3);
    return () => clearInterval(practiceTimer);
  }, [playMode, onPractice]);
  const handlersRef = useRef({});
  handlersRef.current = {
    hit: hitPad,
    togglePlay,
    record: toggleRecord,
  };
  useEffect(() => {
    const onKeyDown = (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.repeat) return;
      const tag = ev.target?.tagName;
      if (isTypingTarget(ev.target)) return;
      const key = ev.key.toLowerCase();
      if (key.length === 1) {
        const feetIdx = TXALAPARTA_ROLE_KEYS.pi.indexOf(key);
        if (feetIdx >= 0) {
          ev.preventDefault();
          handlersRef.current.hit({
            p: "pi",
            plank: feetIdx,
          });
          return;
        }
        for (let role of TXALAPARTA_PLANK_ROLES) {
          const keyIdx = TXALAPARTA_ROLE_KEYS[role].indexOf(key);
          const col = columnsRef.current[keyIdx];
          if (keyIdx >= 0 && col) {
            ev.preventDefault();
            handlersRef.current.hit({
              p: role,
              plank: col.i,
              m: col.m,
            });
            return;
          }
        }
      }
      if (key === " ") {
        if (tag === "BUTTON" || tag === "A" || tag === "SUMMARY") return;
        ev.preventDefault();
        handlersRef.current.togglePlay();
      } else {
        if (key === "r") {
          ev.preventDefault();
          handlersRef.current.record();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const setTempoFactor = (factor) => {
    const engine = engineRef.current;
    if (engine.mode !== "stop") {
      const nowTime = audioNow();
      const beatNow = (nowTime - engine.start) / engine.spb;
      engine.spb = 60 / (engine.bpm * factor);
      engine.start = nowTime - beatNow * engine.spb;
    }
    engine.factor = factor;
  };
  const toggleTempoRamp = (ramp) => {
    const nextRamp = tempoRampRef.current === ramp ? null : ramp;
    setTempoRamp(nextRamp);
    tempoRampRef.current = nextRamp;
    setTempoFactor(nextRamp === "up" ? 0.5 : 1);
  };
  const choosePracticeRole = (role) => {
    const engine = engineRef.current;
    if (role && engine.mode === "rec") {
      closeRecLayer();
      engine.mode = "play";
      setPlayMode("play");
    }
    engine.expect = new Map();
    engine.passes = new Map();
    engine.lastPass = -1;
    setPracticeRole(role);
  };
  const setRhythmFields = (fields) =>
    editRhythm((draft) => ({
      ...draft,
      ...fields,
    }));
  const pickMaterial = (material) =>
    editRhythm((draft) => withRhythmMaterial(draft, material));
  const toggleFeet = () => {
    if (rhythm.feet && practiceRole === "pi") {
      choosePracticeRole(null);
    }
    setRhythmFields({
      feet: !rhythm.feet,
    });
  };
  const gridStep = rhythm.snap === "16" ? 0.25 : 0.5;
  const toggleGridStrike = (beat, cell) => {
    editRhythm((draft) => {
      const columnId =
        cell.p === "pi" ? `f${cell.plank}` : `${cell.m}${cell.plank}`;
      const isSameStrike = (strike) =>
        strike.p === cell.p &&
        strikeTargetKey(strike, draft) === columnId &&
        Math.abs(Math.round(strike.b / gridStep) * gridStep - beat) < 1e-6;
      if (draft.layers.some((layer) => layer.strikes.some(isSameStrike)))
        return {
          ...draft,
          layers: draft.layers.map((layer) => ({
            ...layer,
            strikes: layer.strikes.filter(
              (existing) => !isSameStrike(existing),
            ),
          })),
        };
      const newStrike =
        cell.p === "pi" || draft.material !== "ambas"
          ? {
              b: beat,
              plank: cell.plank,
              p: cell.p,
            }
          : {
              b: beat,
              plank: cell.plank,
              p: cell.p,
              m: cell.m,
            };
      const nextLayers = draft.layers.find((layer) => layer.id === "manual")
        ? draft.layers.map((layer) =>
            layer.id === "manual"
              ? {
                  ...layer,
                  muted: false,
                  strikes: [...layer.strikes, newStrike],
                }
              : layer,
          )
        : [
            ...draft.layers,
            {
              id: "manual",
              label: "Editado a mano",
              muted: false,
              strikes: [newStrike],
            },
          ];
      return {
        ...draft,
        layers: nextLayers,
      };
    });
  };
  const cycleFeetSound = (beat) => {
    editRhythm((draft) => {
      const isFeetAtBeat = (strike) =>
        strike.p === "pi" &&
        Math.abs(Math.round(strike.b / gridStep) * gridStep - beat) < 1e-6;
      let lastSound = -1;
      for (let layer of draft.layers)
        for (let feetStrike of layer.strikes) {
          if (isFeetAtBeat(feetStrike)) {
            lastSound = Math.max(lastSound, feetStrike.plank);
          }
        }
      const nextSound = lastSound + 1;
      const clearedLayers = draft.layers.map((layer) => ({
        ...layer,
        strikes: layer.strikes.filter(
          (feetStrike) => !isFeetAtBeat(feetStrike),
        ),
      }));
      if (nextSound >= FOOT_STRIKES.length)
        return {
          ...draft,
          layers: clearedLayers,
        };
      const newStrike = {
        b: beat,
        plank: nextSound,
        p: "pi",
      };
      const manualLayer = clearedLayers.find((layer) => layer.id === "manual");
      return {
        ...draft,
        layers: manualLayer
          ? clearedLayers.map((layer) =>
              layer.id === "manual"
                ? {
                    ...layer,
                    muted: false,
                    strikes: [...layer.strikes, newStrike],
                  }
                : layer,
            )
          : [
              ...clearedLayers,
              {
                id: "manual",
                label: "Editado a mano",
                muted: false,
                strikes: [newStrike],
              },
            ],
      };
    });
  };
  const undoLayer = () => {
    const lastLayer = rhythm.layers[rhythm.layers.length - 1];
    if (lastLayer) {
      if (lastLayer.id === engineRef.current.recLayerId) {
        engineRef.current.recLayerId = null;
        if (engineRef.current.mode === "rec") {
          engineRef.current.mode = "play";
        }
        setPlayMode(engineRef.current.mode);
      }
      editRhythm((draft) => ({
        ...draft,
        layers: draft.layers.slice(0, -1),
      }));
    }
  };
  const setMove = (countIdx, text) =>
    editRhythm((draft) => {
      const moves = [...(draft.moves || [])];
      for (; moves.length <= countIdx;) moves.push("");
      moves[countIdx] = text;
      return {
        ...draft,
        moves,
      };
    });
  const setInstrumentCount = (kind, count) =>
    setInstruments((prev) => ({
      ...prev,
      [kind]: Math.max(1, Math.min(8, count)),
    }));
  const exportAudio = async () => {
    if (exportProgress != null) return;
    const rhythmNow = rhythmRef.current;
    const secPerBeat = 60 / rhythmNow.bpm;
    const loops = 2;
    const leadIn = 0.15;
    const duration = leadIn + loops * loopBeats * secPerBeat + 1.2;
    setExportMessage(null);
    setExportProgress(0);
    try {
      const { blob, ext } = await renderSoundsToAudioFile(
        duration,
        (schedule) => {
          for (let layer of rhythmNow.layers)
            if (!layer.muted)
              for (let strike of layer.strikes) {
                if (
                  !isStrikePlayable(
                    strike,
                    rhythmNow,
                    columnsRef.current,
                    loopBeats,
                  )
                )
                  continue;
                const sound = strikeToSound(
                  strike,
                  rhythmNow,
                  instrumentsRef.current,
                );
                for (let loop = 0; loop < loops; loop++)
                  schedule(
                    sound.s,
                    sound.arg,
                    leadIn + (loop * loopBeats + strike.b) * secPerBeat,
                  );
              }
        },
        (progress) => setExportProgress(progress),
      );
      setExportProgress(null);
      const saveMessage = await saveFile(
        `${slugifyFilename(rhythmNow.name)}.${ext}`,
        blob,
      );
      setExportMessage(saveMessage);
    } catch {
      setExportProgress(null);
      setExportMessage(
        "Este navegador no puede preparar el audio. Prueba desde otro navegador o desde el ordenador.",
      );
    }
  };
  const addBasicTtakun = () => {
    editRhythm((draft) => {
      const cols = rhythmPlanks(draft, instruments);
      const firstCol = cols[0];
      const secondCol = cols[1] || cols[0];
      const offbeat = draft.snap === "16" ? 0.25 : 0.5;
      const strikes = [];
      for (let beat = 0; beat < draft.eights * 8; beat++)
        for (let [col, offset] of [
          [firstCol, 0],
          [secondCol, offbeat],
        ]) {
          const strike = {
            b: beat + offset,
            plank: col.i,
            p: "tk",
          };
          if (draft.material === "ambas") {
            strike.m = col.m;
          }
          strikes.push(strike);
        }
      return {
        ...draft,
        layers: [
          ...draft.layers,
          {
            id: `l${Date.now().toString(36)}`,
            label: "Ttakun básico",
            muted: false,
            strikes,
          },
        ],
      };
    });
  };
  const suggestHerren = async () => {
    if (suggestStatus === "thinking") return;
    const rhythmNow = rhythmRef.current;
    const cols = columnsRef.current;
    const ttakunHits = [];
    for (let layer of rhythmNow.layers)
      if (!layer.muted)
        for (let strike of layer.strikes) {
          if (!(
            strike.p !== "tk" ||
            !isStrikePlayable(strike, rhythmNow, cols, loopBeats)
          )) {
            ttakunHits.push({
              b: strike.b,
              col: cols.findIndex(
                (column) => column.key === strikeTargetKey(strike, rhythmNow),
              ),
            });
          }
        }
    if (!ttakunHits.length) {
      setSuggestStatus(
        "Primero grabad o poned algo de ttakun: la propuesta responde a lo que ya suena.",
      );
      return;
    }
    ttakunHits.sort((left, right) => left.b - right.b);
    const columnList = cols
      .map(
        (col, colIdx) =>
          `${colIdx} = ${plankLabel(col)}${plankPitchLabel(col) ? ` (${plankPitchLabel(col)})` : ""}`,
      )
      .join("; ");
    const promptText = `Eres txalapartari. En la txalaparta hay dos papeles: ttakun lleva el pulso con golpes regulares y herren responde en los huecos, variando y "cojeando" a propósito; al final suelen coincidir en un golpe fuerte.
Este bucle dura ${loopBeats} tiempos (cuentas), del 0 al ${loopBeats}. Columnas disponibles (tablas o piedras): ${columnList}.
Golpes de ttakun ya grabados (b = tiempo dentro del bucle; col = columna):
${JSON.stringify(ttakunHits)}
Propón los golpes de herren: entre ${loopBeats} y ${Math.round(loopBeats * 1.8)} golpes, con b múltiplo de 0.25 entre 0 y ${loopBeats - 0.25}, y col entre 0 y ${cols.length - 1}. Responde en los huecos del ttakun, no coincidas exactamente con él salvo en el último tiempo, y usa más de una columna.
Responde solo con un array JSON de objetos {"b": número, "col": número}. Ejemplo: [{"b":0.5,"col":2},{"b":1.75,"col":3}]`;
    // Inside claude.ai the "sample" AI answers; anywhere else, a rule-based proposal.
    if (sampler) setSuggestStatus("thinking");
    try {
      const reply = sampler
        ? await sampler.json(promptText, { modelTier: "quick", cache: false })
        : proposeHerrenResponse(ttakunHits, loopBeats, cols.length);
      const seen = new Set();
      const herrenStrikes = [];
      for (let item of Array.isArray(reply) ? reply : []) {
        const beat = Math.round(Number(item && item.b) * 4) / 4;
        const colNum = Math.round(Number(item && item.col));
        if (
          !isFinite(beat) ||
          beat < 0 ||
          beat >= loopBeats ||
          !(colNum >= 0 && colNum < cols.length)
        )
          continue;
        const dedupeKey = `${beat}:${colNum}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        const targetCol = cols[colNum];
        const herrenStrike = {
          b: beat,
          plank: targetCol.i,
          p: "hr",
        };
        if (rhythmNow.material === "ambas") {
          herrenStrike.m = targetCol.m;
        }
        herrenStrikes.push(herrenStrike);
      }
      if (!herrenStrikes.length) {
        setSuggestStatus("La propuesta no ha servido. Prueba otra vez.");
        return;
      }
      editRhythm((draft) => ({
        ...draft,
        layers: [
          ...draft.layers,
          {
            id: `l${Date.now().toString(36)}`,
            label: "Propuesta de herren",
            muted: false,
            strikes: herrenStrikes,
          },
        ],
      }));
      setSuggestStatus(
        `Añadida una capa con ${herrenStrikes.length} golpes de herren. Escuchadla; si no os convence, «Deshacer capa».`,
      );
    } catch (err) {
      const code = err && err.code;
      setSuggestStatus(
        code === "not_granted" ||
          code === "sampling_disabled" ||
          code === "capability_disabled" ||
          code === "capability_removed" ||
          code === "not_declared"
          ? "Las propuestas no están disponibles aquí."
          : code === "rate_limited"
            ? "Demasiadas peticiones seguidas. Prueba dentro de un rato."
            : code === "cancelled"
              ? null
              : "No ha salido bien esta vez. Prueba otra vez.",
      );
    }
  };
  const rhythmUsage = [];
  for (let choreo of choreos)
    for (let block of choreo.blocks) {
      if (block.rhythmId === rhythm.id) {
        rhythmUsage.push({
          c: choreo,
          b: block,
        });
      }
    }
  const recLayer = rhythm.layers.find(
    (layer) => layer.id === engineRef.current.recLayerId,
  );
  const unseenStrikeCount = countUnplayableStrikes(rhythm, instruments);
  const bestScore =
    practiceRole && rhythm.best ? rhythm.best[practiceRole] : null;
  const tempoSuffix =
    playhead.factor != null && playhead.factor !== 1
      ? ` · ${Math.round(playhead.factor * 100)} %`
      : "";
  const phaseLabel = {
    stop: "Parado",
    play: practiceRole
      ? `Practicando ${TXALAPARTA_ROLE_LABELS[practiceRole].toLowerCase()}${tempoSuffix}`
      : `Sonando en bucle${tempoSuffix}`,
    rec: `Grabando ${recLayer ? recLayer.label.toLowerCase() : ""}`,
    countin: "Cuenta de entrada",
    armed: "Grabarás en el próximo 1",
  }[playhead.phase];
  const isRecording =
    playhead.phase === "rec" ||
    (playMode === "rec" && playhead.phase === "countin");
  const feetColTrack = hasFeet
    ? `${((TXALAPARTA_FEET_COLUMN_SHARE * Math.max(1, columns.length)) / (1 - TXALAPARTA_FEET_COLUMN_SHARE)).toFixed(3)}fr`
    : "";
  const padGridStyle = {
    gridTemplateColumns: `${TXALAPARTA_LABEL_COLUMN_PX}px repeat(${columns.length}, minmax(0, 1fr))${hasFeet ? ` ${feetColTrack}` : ""}`,
  };
  const modeOptions = [
    [null, "Crear el ritmo"],
    ["hr", "Practicar herren"],
    ["tk", "Practicar ttakun"],
    ...(hasFeet ? [["pi", "Practicar pies"]] : []),
  ];
  const appPartName =
    practiceRole === "hr"
      ? "ttakun"
      : practiceRole === "tk"
        ? "herren"
        : "la txalaparta";
  return (
    <>
      {duetOpen && (
        <TxalapartaDuo
          rhythm={rhythm}
          instruments={instruments}
          onPractice={onPractice}
          onAddLayers={(newLayers) =>
            editRhythm((draft) => ({
              ...draft,
              layers: [...draft.layers, ...newLayers],
            }))
          }
          onClose={() => setDuetOpen(false)}
        />
      )}
      <div className="flex flex-col gap-2">
        <button type="button" className="back" onClick={onBack}>
          <span aria-hidden="true">←</span>
          {" Inicio"}
        </button>
        <div className="min-w-0">
          <p className="f-label">
            {"Taller de txalaparta · "}
            {txalapartaMaterialLabel(rhythm.material)}
            {hasFeet ? " y pies" : ""}
            {" · creado por "}
            {rhythmAuthorLabel(rhythm.author)}
          </p>
          <label htmlFor="tx-name" className="sr-only">
            Nombre del ritmo
          </label>
          <input
            id="tx-name"
            className="tx-title f-display"
            value={rhythm.name}
            onChange={(ev) =>
              setRhythmFields({
                name: ev.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="tx-layout">
        <div className="tx-col">
          <section className="panel tx-inst o-1" aria-label="Txalaparta">
            <div className="tx-top">
              <span
                className={`tx-state is-${isRecording ? "rec" : playhead.phase}`}
              >
                {isRecording && <i className="tx-dot" aria-hidden="true" />}
                {phaseLabel}
              </span>
              <div className="tx-count">
                {playhead.cin != null ? (
                  <span className="f-display tx-cin">{playhead.cin}</span>
                ) : playhead.count != null ? (
                  <>
                    <span className="f-display">{playhead.count}</span>
                    <span className="font-mono text-[12px] text-muted">
                      {"ocho "}
                      {playhead.eight}
                      {" de "}
                      {rhythm.eights}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-[12px] text-muted">
                    {rhythm.bpm}
                    {" bpm · "}
                    {columns.length}{" "}
                    {rhythm.material === "piedra"
                      ? "piedras"
                      : rhythm.material === "ambas"
                        ? "columnas"
                        : "tablas"}
                  </span>
                )}
              </div>
            </div>
            <div className="tx-mode">
              <div
                className="seg seg-sm tx-roles"
                role="radiogroup"
                aria-label="Modo del taller"
              >
                {modeOptions.map(([modeRole, modeLabel]) => (
                  <button
                    key={modeLabel}
                    type="button"
                    role="radio"
                    aria-checked={practiceRole === modeRole}
                    className="seg-btn"
                    onClick={() => choosePracticeRole(modeRole)}
                  >
                    {modeLabel}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-xs"
                title="Dos bailarinas, una frente a otra: el móvil o la tablet en medio, o cada una en su móvil"
                onClick={() => {
                  stopTransport();
                  unlockAudio();
                  setDuetOpen(true);
                }}
              >
                <Icon name="compare" size={13} />
                Tocar a dúo
              </button>
            </div>
            {practiceRole ? (
              <div className="tx-practice">
                <p className="text-[13px] text-ink">
                  {"La app toca "}
                  {practiceRole === "pi" ? "la txalaparta" : appPartName}
                  {"; tú tocas "}
                  <b className="font-semibold">
                    {TXALAPARTA_ROLE_LABELS[practiceRole].toLowerCase()}
                  </b>
                  . Tus fichas bajan con borde: tócalas cuando lleguen a la
                  línea. Se ponen amarillas si aciertas.
                </p>
                <div className="tx-score" aria-live="polite">
                  {playhead.score ? (
                    <>
                      <span>
                        {"Vuelta "}
                        {playhead.score.pass}
                        {": "}
                        <b>{playhead.score.hits}</b>
                        {" de "}
                        {playhead.score.total}
                        {playhead.score.extra
                          ? ` · ${playhead.score.extra} de más`
                          : ""}
                      </span>
                      {playhead.score.prev && playhead.score.prev.total > 0 && (
                        <span className="text-muted">
                          {"Anterior: "}
                          {playhead.score.prev.hits}
                          {" de "}
                          {playhead.score.prev.total}{" "}
                          {scoreStars(
                            playhead.score.prev.hits,
                            playhead.score.prev.total,
                          )}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted">
                      Dale a Reproducir y entra en tu papel.
                    </span>
                  )}
                  {bestScore && bestScore.total > 0 && (
                    <span className="tx-best">
                      {"Récord: "}
                      {bestScore.hits}
                      {" de "}
                      {bestScore.total}{" "}
                      <span aria-hidden="true">
                        {scoreStars(bestScore.hits, bestScore.total)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="tx-legend">
                <span className="is-hr">
                  <i aria-hidden="true" />
                  Herren · responde
                </span>
                <span className="is-tk">
                  <i aria-hidden="true" />
                  Ttakun · lleva el pulso
                </span>
                {hasFeet && (
                  <span className="is-pi">
                    <i aria-hidden="true" />
                    Pies de claqué
                  </span>
                )}
              </div>
            )}
            <div ref={screenRef} className="tx-screen">
              <canvas
                ref={canvasRef}
                aria-label="Cascada de golpes: las fichas bajan hasta la línea cuando les toca sonar"
              />
            </div>
            <div className="tx-pads">
              {TXALAPARTA_PLANK_ROLES.map((rowRole) => (
                <div key={rowRole} className="tx-pad-row" style={padGridStyle}>
                  <span
                    className={`tx-row-label is-${rowRole}`}
                    title={TXALAPARTA_ROLE_LABELS[rowRole]}
                  >
                    {TXALAPARTA_ROLE_LABELS[rowRole][0]}
                  </span>
                  {columns.map((col, colIdx) => (
                    <button
                      key={col.key}
                      type="button"
                      ref={(node) => {
                        padRefs.current[`${rowRole}:${col.key}`] = node;
                      }}
                      className={`tx-pad is-${rowRole} ${col.m === "s" ? "is-stone" : ""} ${colIdx > 0 && columns[colIdx - 1].m !== col.m ? "is-group" : ""} ${practiceRole && practiceRole !== rowRole ? "is-off" : ""}`}
                      aria-label={`${TXALAPARTA_ROLE_LABELS[rowRole]}, ${plankLabel(col).toLowerCase()}${plankPitchLabel(col) ? ` (${plankPitchLabel(col)})` : ""}`}
                      onPointerDown={(ev) => {
                        ev.preventDefault();
                        hitPad({
                          p: rowRole,
                          plank: col.i,
                          m: col.m,
                        });
                      }}
                      onClick={(ev) => {
                        if (ev.detail === 0) {
                          hitPad({
                            p: rowRole,
                            plank: col.i,
                            m: col.m,
                          });
                        }
                      }}
                    >
                      <span className="tx-pad-n f-display">{col.i + 1}</span>
                      {TXALAPARTA_ROLE_KEYS[rowRole][colIdx] && (
                        <kbd className="tx-key">
                          {TXALAPARTA_ROLE_KEYS[rowRole][colIdx].toUpperCase()}
                        </kbd>
                      )}
                    </button>
                  ))}
                  {hasFeet && <span aria-hidden="true" />}
                </div>
              ))}
              {hasFeet && (
                <div
                  className="tx-pad-row"
                  style={{
                    gridTemplateColumns: `${TXALAPARTA_LABEL_COLUMN_PX}px repeat(4, minmax(0, 1fr))`,
                  }}
                >
                  <span className="tx-row-label is-pi" title="Pies">
                    P
                  </span>
                  {FOOT_STRIKES.map((feetSound, feetIdx) => (
                    <button
                      key={feetSound.key}
                      type="button"
                      ref={(node) => {
                        padRefs.current[`pi:f${feetIdx}`] = node;
                      }}
                      className={`tx-pad is-pi ${practiceRole && practiceRole !== "pi" ? "is-off" : ""}`}
                      aria-label={`Pies: ${feetSoundName(feetIdx)}`}
                      onPointerDown={(ev) => {
                        ev.preventDefault();
                        hitPad({
                          p: "pi",
                          plank: feetIdx,
                        });
                      }}
                      onClick={(ev) => {
                        if (ev.detail === 0) {
                          hitPad({
                            p: "pi",
                            plank: feetIdx,
                          });
                        }
                      }}
                    >
                      <span className="tx-pad-word">
                        {feetSoundName(feetIdx)}
                      </span>
                      <kbd className="tx-key">
                        {TXALAPARTA_ROLE_KEYS.pi[feetIdx]}
                      </kbd>
                    </button>
                  ))}
                </div>
              )}
              <div
                className="tx-pad-row tx-tones"
                style={padGridStyle}
                aria-hidden="true"
              >
                <span />
                {columns.map((col, colIdx) => {
                  const isFirstOfSet =
                    colIdx === 0 || columns[colIdx - 1].m !== col.m;
                  const isLastOfSet =
                    colIdx === columns.length - 1 ||
                    columns[colIdx + 1].m !== col.m;
                  const toneLabel = isFirstOfSet
                    ? `${col.m === "s" ? "piedra" : "madera"}${columns.length <= 4 ? " grave" : ""}`
                    : isLastOfSet && columns.length <= 4
                      ? "aguda"
                      : "";
                  return (
                    <span
                      key={col.key}
                      className={isFirstOfSet ? "is-start" : ""}
                    >
                      {toneLabel}
                    </span>
                  );
                })}
                {hasFeet && <span />}
              </div>
            </div>
            <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={togglePlay}
                >
                  <Icon name={playMode === "stop" ? "play" : "stop"} />
                  {playMode === "stop" ? "Reproducir" : "Parar"}
                </button>
                <button
                  type="button"
                  className={`btn btn-rec ${playMode === "rec" ? "is-on" : ""}`}
                  onClick={toggleRecord}
                  disabled={!!practiceRole}
                  title={
                    practiceRole
                      ? "Para grabar, vuelve a «Crear el ritmo»"
                      : undefined
                  }
                >
                  <Icon name="record" />
                  {playMode === "rec"
                    ? "Terminar de grabar"
                    : "Grabar una vuelta"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={undoLayer}
                  disabled={!rhythm.layers.length}
                >
                  <Icon name="undo" />
                  Deshacer capa
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={metronomeOn}
                  onClick={() => setMetronomeOn((prev) => !prev)}
                >
                  <Icon name="metro" />
                  Metrónomo
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={tempoRamp === "up"}
                  onClick={() => toggleTempoRamp("up")}
                  title="Empieza al 50 % del tempo y sube un 10 % en cada vuelta"
                >
                  <Icon name="ladder" />
                  Escalera de tempo
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={tempoRamp === "accel"}
                  onClick={() => toggleTempoRamp("accel")}
                  title="Como el final de una txalaparta: cada vuelta un poco más rápida, hasta un 60 % más"
                >
                  <Icon name="ladder" />
                  Acelerando final
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="f-label mr-1">Txalaparta</span>
                  <div
                    className="seg seg-sm"
                    role="radiogroup"
                    aria-label="Qué txalaparta usa este ritmo"
                  >
                    {TXALAPARTA_MATERIAL_OPTIONS.map(
                      ([materialId, materialTitle]) => (
                        <button
                          key={materialId}
                          type="button"
                          role="radio"
                          aria-checked={
                            (rhythm.material || "madera") === materialId
                          }
                          className="seg-btn"
                          onClick={() => pickMaterial(materialId)}
                        >
                          {materialTitle}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={hasFeet}
                  onClick={toggleFeet}
                >
                  <Icon name="feet" />
                  Pies de claqué
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="f-label mr-1">Tempo</span>
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label="Más lento"
                    onClick={() =>
                      setRhythmFields({
                        bpm: Math.max(50, rhythm.bpm - 4),
                      })
                    }
                  >
                    −
                  </button>
                  <label htmlFor="tx-bpm" className="sr-only">
                    Tempo en bpm
                  </label>
                  <input
                    id="tx-bpm"
                    type="number"
                    min="50"
                    max="200"
                    className="field tx-bpm"
                    value={rhythm.bpm}
                    onChange={(ev) => {
                      const nextBpm = Number(ev.target.value);
                      if (nextBpm >= 50 && nextBpm <= 200) {
                        setRhythmFields({
                          bpm: nextBpm,
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label="Más rápido"
                    onClick={() =>
                      setRhythmFields({
                        bpm: Math.min(200, rhythm.bpm + 4),
                      })
                    }
                  >
                    +
                  </button>
                  <span className="font-mono text-[12px] text-muted">bpm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="f-label mr-1">Largo</span>
                  <div
                    className="seg seg-sm"
                    role="radiogroup"
                    aria-label="Largo del bucle"
                  >
                    {[1, 2, 4].map((eightCount) => (
                      <button
                        key={eightCount}
                        type="button"
                        role="radio"
                        aria-checked={rhythm.eights === eightCount}
                        className="seg-btn"
                        onClick={() =>
                          setRhythmFields({
                            eights: eightCount,
                          })
                        }
                      >
                        {eightCount} {eightCount === 1 ? "ocho" : "ochos"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="f-label mr-1">Ajustar al pulso</span>
                  <div
                    className="seg seg-sm"
                    role="radiogroup"
                    aria-label="Ajustar los golpes al pulso"
                  >
                    {[
                      ["8", "Corchea"],
                      ["16", "Semicorchea"],
                      ["free", "Libre"],
                    ].map(([snapId, snapLabel]) => (
                      <button
                        key={snapId}
                        type="button"
                        role="radio"
                        aria-checked={rhythm.snap === snapId}
                        className="seg-btn"
                        onClick={() =>
                          setRhythmFields({
                            snap: snapId,
                          })
                        }
                      >
                        {snapLabel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {unseenStrikeCount > 0 && (
                <p className="text-[12px] font-semibold text-[color:var(--warn)]">
                  {"Hay "}
                  {unseenStrikeCount}{" "}
                  {unseenStrikeCount === 1 ? "golpe" : "golpes"}
                  {
                    " en tablas, piedras o pies que ahora no se ven. Cambia la txalaparta o el número de tablas para recuperarlos."
                  }
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={exportAudio}
                  disabled={exportProgress != null || !rhythm.layers.length}
                >
                  <Icon name="download" />
                  {exportProgress != null
                    ? `Preparando audio… ${Math.round(exportProgress * 100)} %`
                    : "Guardar audio para el grupo"}
                </button>
                <span className="text-[12px] text-muted">
                  Dos vueltas del ritmo, sin metrónomo, para mandar por
                  WhatsApp.
                </span>
              </div>
              {exportMessage && (
                <p className="text-[13px] font-semibold text-ink" role="status">
                  {exportMessage}
                </p>
              )}
              <p className="text-[12px] text-muted">
                <span className="hidden md:inline">
                  {"Teclado: herren "}
                  <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>
                  {"… · ttakun "}
                  <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd>
                  {"… · pies "}
                  <kbd>1</kbd>–<kbd>4</kbd>
                  {" · "}
                  <kbd>espacio</kbd>
                  {" reproducir · "}
                  <kbd>R</kbd>
                  {" grabar."}{" "}
                </span>
                Al grabar suena «5, 6, 7, 8» y se graba una vuelta entera;
                después se queda repitiendo y podéis grabar otra capa encima. En
                móvil, mejor sin auriculares bluetooth: llevan retraso.
              </p>
            </div>
          </section>
          <section
            className="panel flex flex-col gap-3 p-4 o-3"
            aria-label="Partitura del ritmo"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="f-label">Partitura del ritmo</p>
                <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
                  Golpe a golpe
                </h2>
              </div>
              <p className="max-w-[44ch] text-[12px] text-muted">
                Cada tabla tiene dos mitades: arriba herren, abajo ttakun. Toca
                una mitad para poner o quitar un golpe.
                {hasFeet
                  ? " En la fila de pies, cada toque cambia el sonido."
                  : ""}
              </p>
            </div>
            <TxalapartaRhythmGrid
              rhythm={rhythm}
              cols={columns}
              L={loopBeats}
              q={gridStep}
              slot={playhead.slot}
              onToggle={toggleGridStrike}
              onCycleFeet={cycleFeetSound}
              feetName={feetSoundName}
            />
          </section>
        </div>
        <div className="tx-col">
          <section
            className="panel flex flex-col gap-3 p-4 o-2"
            aria-label="Pasos de la coreografía"
          >
            <div>
              <p className="f-label">A la vez que el ritmo</p>
              <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
                Pasos por cuenta
              </h2>
              <p className="mt-1.5 text-[13px] text-muted">
                Apuntad qué hacéis en cada cuenta. Mientras suena el bucle se
                ilumina la cuenta en la que vais.
              </p>
            </div>
            {Array.from(
              {
                length: rhythm.eights,
              },
              (x, eightIdx) => (
                <div key={eightIdx} className="flex flex-col gap-1.5">
                  {rhythm.eights > 1 && (
                    <p className="f-label">
                      {"Ocho "}
                      {eightIdx + 1}
                    </p>
                  )}
                  <div className="tx-move-grid">
                    {Array.from(
                      {
                        length: 8,
                      },
                      (I, K) => {
                        const moveIdx = eightIdx * 8 + K;
                        return (
                          <label
                            key={moveIdx}
                            className={`tx-move ${playhead.idx === moveIdx ? "is-now" : ""}`}
                            htmlFor={`mv-${rhythm.id}-${moveIdx}`}
                          >
                            <span className="tx-move-n f-display">{K + 1}</span>
                            <input
                              id={`mv-${rhythm.id}-${moveIdx}`}
                              className="tx-move-input"
                              value={(rhythm.moves || [])[moveIdx] || ""}
                              placeholder="—"
                              onChange={(ev) =>
                                setMove(moveIdx, ev.target.value)
                              }
                            />
                          </label>
                        );
                      },
                    )}
                  </div>
                </div>
              ),
            )}
          </section>
          <section
            className="panel flex flex-col gap-3 p-4 o-4"
            aria-label="Vuestras txalapartas"
          >
            <div>
              <p className="f-label">Vale para todos los ritmos</p>
              <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
                Vuestras txalapartas
              </h2>
              <p className="mt-1.5 text-[13px] text-muted">
                Contad las tablas y las piedras de la escuela y ponedlo aquí: el
                taller se ajusta a vuestros instrumentos.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["wood", "Madera", "tablas"],
                ["stone", "Piedra", "piedras"],
              ].map(([kind, kindLabel, unitLabel]) => (
                <div
                  key={kind}
                  className={`tx-inst-row ${kind === "stone" ? "is-stone" : ""}`}
                >
                  <span className="min-w-0 flex-1 text-[14px] font-semibold text-ink">
                    {kindLabel}
                  </span>
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label={`Una ${unitLabel === "tablas" ? "tabla" : "piedra"} menos`}
                    onClick={() =>
                      setInstrumentCount(kind, instruments[kind] - 1)
                    }
                    disabled={instruments[kind] <= 1}
                  >
                    −
                  </button>
                  <span className="tx-inst-n f-display" aria-live="polite">
                    {instruments[kind]}
                  </span>
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label={`Una ${unitLabel === "tablas" ? "tabla" : "piedra"} más`}
                    onClick={() =>
                      setInstrumentCount(kind, instruments[kind] + 1)
                    }
                    disabled={instruments[kind] >= 8}
                  >
                    +
                  </button>
                  <span className="font-mono text-[12px] text-muted">
                    {unitLabel}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <RealSoundPanel instruments={instruments} feetName={feetSoundName} />
          <section
            className="panel flex flex-col gap-2 p-4 o-5"
            aria-label="Capas"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="f-label">Capas grabadas</p>
              <span className="font-mono text-[12px] text-muted">
                {rhythm.layers.reduce(
                  (sum, layer) => sum + layer.strikes.length,
                  0,
                )}
                {" golpes en total"}
              </span>
            </div>
            {rhythm.layers.length === 0 && (
              <p className="text-[13px] text-muted">
                Todavía no hay nada. Dale a «Grabar una vuelta» y tocad, o
                empezad con un ttakun básico.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-xs"
                onClick={addBasicTtakun}
              >
                <span aria-hidden="true">+</span>
                {" Ttakun básico"}
              </button>
              <button
                type="button"
                className="btn btn-xs"
                onClick={suggestHerren}
                disabled={suggestStatus === "thinking"}
              >
                <Icon name="spark" size={13} />
                {suggestStatus === "thinking"
                  ? "Pensando una respuesta…"
                  : "Proponer una respuesta de herren"}
              </button>
            </div>
            {suggestStatus && suggestStatus !== "thinking" && (
              <p className="text-[12px] text-ink" role="status">
                {suggestStatus}
              </p>
            )}
            <ul className="flex flex-col">
              {rhythm.layers.map((layer) => {
                const roles = layerRoles(layer);
                const isRecLayer = layer.id === engineRef.current.recLayerId;
                const rolesText = [
                  roles.tk && "ttakun",
                  roles.hr && "herren",
                  roles.pi && "pies",
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <li
                    key={layer.id}
                    className={`tx-layer ${layer.muted ? "is-muted" : ""}`}
                  >
                    <span className="tx-layer-dots" aria-hidden="true">
                      {roles.tk && <i className="is-tk" />}
                      {roles.hr && <i className="is-hr" />}
                      {roles.pi && <i className="is-pi" />}
                      {!roles.tk && !roles.hr && !roles.pi && <i />}
                    </span>
                    <span className="min-w-0 flex-1 text-[14px]">
                      <b className="font-semibold text-ink">{layer.label}</b>{" "}
                      <span className="text-[12px] text-muted">
                        {isRecLayer
                          ? "grabando…"
                          : `${layer.strikes.length} golpes${rolesText ? ` · ${rolesText}` : ""}`}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-xs"
                      aria-pressed={!layer.muted}
                      onClick={() =>
                        editRhythm((draft) => ({
                          ...draft,
                          layers: draft.layers.map((other) =>
                            other.id === layer.id
                              ? {
                                  ...other,
                                  muted: !other.muted,
                                }
                              : other,
                          ),
                        }))
                      }
                    >
                      {layer.muted ? "Silenciada" : "Suena"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs"
                      onClick={() =>
                        editRhythm((draft) => ({
                          ...draft,
                          layers: draft.layers.filter(
                            (other) => other.id !== layer.id,
                          ),
                        }))
                      }
                      aria-label={`Borrar ${layer.label}`}
                    >
                      <Icon name="x" size={13} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
          <RhythmBlockAssignPanel
            rhythm={rhythm}
            choreos={choreos}
            usage={rhythmUsage}
            onAssign={onAssign}
            onUnassign={onUnassign}
            onOpenBlock={onOpenBlock}
          />
          <section
            className="panel flex flex-col gap-2 p-4 o-7"
            aria-label="Ritmos del grupo"
          >
            <p className="f-label">Ritmos del grupo</p>
            <ul className="flex flex-col gap-1.5">
              {rhythms.map((otherRhythm) => (
                <li key={otherRhythm.id}>
                  <button
                    type="button"
                    className={`tx-rrow ${otherRhythm.id === rhythm.id ? "is-current" : ""}`}
                    onClick={() => onOpen(otherRhythm.id)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">
                        {otherRhythm.name}
                      </span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
                        {otherRhythm.bpm}
                        {" bpm · "}
                        {otherRhythm.eights}{" "}
                        {otherRhythm.eights === 1 ? "ocho" : "ochos"}
                        {" · "}
                        {txalapartaMaterialLabel(otherRhythm.material)}
                        {otherRhythm.feet ? " y pies" : ""}
                        {" · de "}
                        {rhythmAuthorLabel(otherRhythm.author)}
                      </span>
                    </span>
                    {otherRhythm.id === rhythm.id && (
                      <span className="font-mono text-[11px] uppercase text-muted">
                        Abierto
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-1">
              <button type="button" className="btn" onClick={onCreate}>
                <span aria-hidden="true">+</span>
                {" Nuevo ritmo"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onDuplicate(rhythm.id)}
              >
                <Icon name="copy" />
                Duplicar
              </button>
              <ConfirmButton
                label="Borrar este ritmo"
                confirmLabel="Pulsa otra vez para borrarlo"
                onConfirm={() => onDelete(rhythm.id)}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
