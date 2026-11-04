// The practice player: uploaded video / song audio / drawn sample clip, speeds, tempo ladder, A-B loop, mirror, compare-with-my-video, class mode (big screen + remote), metronome, voice, keyboard shortcuts.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CLIP_ANGLE_LABELS } from "../../data/clips.js";
import { PLAYER_RATE_OPTIONS } from "../../data/playback.js";
import { playSound, setAudioKeepAlive, unlockAudio } from "../../lib/audio.js";
import {
  drawFeetFrontView,
  drawFeetSideView,
  drawStageView,
} from "../../lib/canvas.js";
import { useClassScreenRemote } from "../../lib/classRemote.js";
import { formatClockTenths, formatRate } from "../../lib/format.js";
import { clamp } from "../../lib/math.js";
import { buildStepVoiceCues } from "../../lib/musicTimeline.js";
import { rhythmBackingEvents } from "../../lib/playback.js";
import {
  buildSoundSchedule,
  generateBackingGroove,
} from "../../lib/schedule.js";
import {
  cancelSpeech,
  isSpeechSupported,
  speakText,
} from "../../lib/speech.js";
import {
  beatToSeconds,
  clipDurationSeconds,
  secondsToBeat,
} from "../../lib/time.js";
import { MusicCountBoard } from "./MusicCountBoard.jsx";
import { MusicPracticePanel } from "./MusicPracticePanel.jsx";
import { PlayerScrubber } from "./PlayerScrubber.jsx";
import { SoundScore } from "./SoundScore.jsx";
import { StageMoveOrder } from "./StageMoveOrder.jsx";
import { VideoCountHud } from "./VideoCountHud.jsx";
import { Icon } from "../ui/Icon.jsx";
import { isTypingTarget, useEscapeKey } from "../../lib/dom.js";
let lastHandledPlayRequest = 0;
export function PracticePlayer({
  clip,
  block,
  blockClips,
  prefs,
  setPrefs,
  me: myDancerId,
  mode,
  formations,
  playReq,
  onSeen,
  onPractice,
  vocab,
  song,
  sync,
  title,
}) {
  const isUpload = clip.type === "upload";
  const isMusic = clip.type === "music";
  const hasSong = isMusic && !!song;
  const mediaKind = isUpload ? "video" : hasSong ? "audio" : null;
  const canvasRef = useRef(null);
  const paneRef = useRef(null);
  const mediaRef = useRef(null);
  const [paneSize, setPaneSize] = useState({
    w: 640,
    h: 360,
  });
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [abLoop, setAbLoop] = useState({
    a: null,
    b: null,
    on: false,
  });
  const [mirrored, setMirrored] = useState(clip.angle === "frente");
  const [mediaDuration, setMediaDuration] = useState(0);
  const [fontsVersion, setFontsVersion] = useState(0);
  const [ladderOn, setLadderOn] = useState(false);
  const [myVideo, setMyVideo] = useState(null);
  const [myVideoMirrored, setMyVideoMirrored] = useState(false);
  const [myVideoOffset, setMyVideoOffset] = useState(0);
  const [classMode, setClassMode] = useState(false);
  const [stageView, setStageView] = useState(false);
  const myVideoRef = useRef(null);
  const panelRef = useRef(null);
  const ladderRef = useRef(false);
  ladderRef.current = ladderOn;
  const timing = useMemo(() => {
    if (isUpload)
      return {
        segStart: 0,
        segEnd: 1 / 0,
        beatAt: null,
        timeAt: null,
        bpm: null,
      };
    if (hasSong) {
      const songBeatSec = 60 / sync.bpm;
      const clipStartSec = sync.offset + (clip.eight - 1) * 8 * songBeatSec;
      const segStartSec = Math.max(0, clipStartSec - 4 * songBeatSec);
      const segEndSec = clipStartSec + clip.counts * songBeatSec;
      return {
        segStart: segStartSec,
        segEnd: segEndSec,
        beatAt: (sec) => (segStartSec + sec - clipStartSec) / songBeatSec,
        timeAt: (beatNo) => clipStartSec + beatNo * songBeatSec - segStartSec,
        bpm: sync.bpm,
      };
    }
    return {
      segStart: 0,
      segEnd: clipDurationSeconds(clip),
      beatAt: (sec) => secondsToBeat(clip, sec),
      timeAt: (beatNo) => beatToSeconds(clip, beatNo),
      bpm: clip.bpm,
    };
  }, [clip, hasSong, sync, isUpload]);
  let duration;
  if (isUpload) {
    duration = mediaDuration;
  } else if (hasSong) {
    duration = Math.max(
      0,
      (mediaDuration ? Math.min(timing.segEnd, mediaDuration) : timing.segEnd) -
        timing.segStart,
    );
  } else {
    duration = timing.segEnd;
  }
  const cues = useMemo(() => {
    if (isUpload) return [];
    const voiceCues = prefs.voice
      ? buildStepVoiceCues(clip, blockClips, vocab)
      : [];
    if (hasSong)
      return buildSoundSchedule(voiceCues, timing.timeAt, {
        metro: prefs.metro,
        countIn: prefs.metro,
        counts: clip.counts,
      });
    if (isMusic) {
      const segments = clip.full
        ? clip.segments
        : [
            {
              start: clip.eight,
              len: clip.counts / 8,
              acapella: clip.acapella || [],
              rhythm: clip.rhythm,
            },
          ];
      const segBacking = [];
      for (let seg of segments) {
        const segBeat = (seg.start - clip.eight) * 8;
        const segBeats = seg.len * 8;
        const isAcapella = (eightNo) => (seg.acapella || []).includes(eightNo);
        if (seg.rhythm) {
          segBacking.push(
            ...rhythmBackingEvents(seg.rhythm, segBeat, segBeats, isAcapella),
          );
        } else {
          segBacking.push(
            ...generateBackingGroove(segBeat, segBeats, clip.swing, isAcapella),
          );
        }
      }
      return buildSoundSchedule([...segBacking, ...voiceCues], timing.timeAt, {
        metro: prefs.metro,
        countIn: true,
        counts: clip.counts,
      });
    }
    return buildSoundSchedule([...clip.events, ...voiceCues], timing.timeAt, {
      metro: prefs.metro,
      countIn: true,
      counts: clip.counts,
    });
  }, [
    clip,
    timing,
    prefs.metro,
    prefs.voice,
    isUpload,
    hasSong,
    isMusic,
    blockClips,
    vocab,
  ]);
  const playheadRef = useRef(0);
  const loopRef = useRef(abLoop);
  const prefsRef = useRef(prefs);
  const durationRef = useRef(duration);
  const segStartRef = useRef(timing.segStart);
  const cuesRef = useRef(cues);
  loopRef.current = abLoop;
  prefsRef.current = prefs;
  durationRef.current = duration;
  segStartRef.current = timing.segStart;
  cuesRef.current = cues;
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane || typeof ResizeObserver == "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      setPaneSize({
        w: Math.max(1, rect.width),
        h: Math.max(1, rect.height),
      });
    });
    observer.observe(pane);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() =>
        setFontsVersion((version) => version + 1),
      );
    }
  }, []);
  useEffect(() => {
    playheadRef.current = 0;
    setPlayhead(0);
    setAbLoop({
      a: null,
      b: null,
      on: false,
    });
    setMediaDuration(0);
    const autoplay =
      !!playReq &&
      playReq.id === clip.id &&
      playReq.n !== lastHandledPlayRequest;
    if (autoplay) {
      lastHandledPlayRequest = playReq.n;
    }
    if (ladderRef.current) {
      setPrefs((prevPrefs) => ({
        ...prevPrefs,
        rate: 0.5,
      }));
    }
    if (autoplay && playReq.big) {
      enterClassMode();
    }
    setPlaying(autoplay);
  }, [clip.id, playReq, song ? song.src : null]);
  useEffect(() => {
    setMirrored(clip.angle === "frente");
  }, [clip.id, clip.angle]);
  useEffect(() => {
    const myVid = myVideoRef.current;
    if (myVid)
      if (((myVid.playbackRate = prefs.rate), playing)) {
        const playPromise = myVid.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {});
        }
      } else myVid.pause();
  }, [playing, myVideo, prefs.rate]);
  useEffect(() => {
    const myVid = myVideoRef.current;
    if (!myVid || !myVid.duration) return;
    const target = clamp(
      playhead + myVideoOffset,
      0,
      Math.max(0, myVid.duration - 0.05),
    );
    if (Math.abs(myVid.currentTime - target) > (playing ? 0.3 : 0.04)) {
      myVid.currentTime = target;
    }
  }, [playhead, myVideoOffset, myVideo]);
  useEffect(() => {
    setMyVideoOffset(0);
    setMyVideo((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.src);
      }
      return null;
    });
  }, [clip.id]);
  const loadMyVideo = (file) => {
    if (file) {
      setMyVideo((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev.src);
        }
        return {
          src: URL.createObjectURL(file),
          name: file.name,
        };
      });
      setMyVideoOffset(0);
      setMyVideoMirrored(false);
    }
  };
  function enterClassMode() {
    setClassMode(true);
    const panel = panelRef.current;
    // Leave the focus on the panel, not on the button that just turned into
    // "Salir de pantalla grande": otherwise Space exits instead of playing.
    if (panel) panel.focus({ preventScroll: true });
    try {
      if (panel && panel.requestFullscreen && !document.fullscreenElement) {
        const fsPromise = panel.requestFullscreen();
        if (fsPromise && fsPromise.catch) {
          fsPromise.catch(() => {});
        }
      }
    } catch {}
  }
  const exitClassMode = () => {
    setClassMode(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
  };
  useEscapeKey(() => exitClassMode(), classMode);
  const ladderStep = () => {
    if (ladderRef.current) {
      setPrefs((prevPrefs) =>
        prevPrefs.rate >= 1
          ? prevPrefs
          : {
              ...prevPrefs,
              rate: Math.min(1, Math.round((prevPrefs.rate + 0.1) * 10) / 10),
            },
      );
    }
  };
  const toggleLadder = () => {
    if (ladderRef.current) return setLadderOn(false);
    setLadderOn(true);
    setPrefs((prevPrefs) => ({
      ...prevPrefs,
      rate: 0.5,
    }));
  };
  const fireCues = (fromSec, toSec) => {
    if (!prefsRef.current.muted)
      for (let cue of cuesRef.current) {
        if (cue.time > fromSec && cue.time <= toSec) {
          if (cue.kind === "say") {
            speakText(cue.arg);
          } else {
            playSound(cue.kind, cue.arg);
          }
        }
      }
  };
  useEffect(() => {
    setAudioKeepAlive(playing);
    if (!playing) {
      cancelSpeech();
    }
  }, [playing]);
  useEffect(() => {
    if (!playing || !onPractice) return;
    const timer = setInterval(() => onPractice(5), 5e3);
    return () => clearInterval(timer);
  }, [playing, onPractice]);
  useEffect(() => () => setAudioKeepAlive(false), []);
  useEffect(() => {
    if (!playing) return;
    let frameId;
    let lastFrame = performance.now();
    let firstFrame = true;
    const tick = (frameTime) => {
      const delta = Math.min(0.1, (frameTime - lastFrame) / 1e3);
      lastFrame = frameTime;
      const media = mediaRef.current;
      let prevSec = playheadRef.current;
      if (firstFrame) {
        prevSec -= 1e-4;
        firstFrame = false;
      }
      let nextSec =
        mediaKind && media
          ? media.currentTime - segStartRef.current
          : playheadRef.current + delta * prefsRef.current.rate;
      const loopNow = loopRef.current;
      const dur = durationRef.current;
      if (
        loopNow.on &&
        loopNow.a != null &&
        loopNow.b != null &&
        nextSec >= loopNow.b
      ) {
        fireCues(prevSec, loopNow.b);
        prevSec = loopNow.a - 1e-4;
        nextSec = loopNow.a;
        if (mediaKind && media) {
          media.currentTime = segStartRef.current + loopNow.a;
        }
        ladderStep();
      } else if (dur > 0 && nextSec >= dur) {
        if ((fireCues(prevSec, dur), !ladderRef.current)) {
          playheadRef.current = dur;
          setPlayhead(dur);
          setPlaying(false);
          return;
        }
        const restartAt = loopNow.on && loopNow.a != null ? loopNow.a : 0;
        prevSec = restartAt - 1e-4;
        nextSec = restartAt;
        if (mediaKind && media) {
          media.currentTime = segStartRef.current + restartAt;
          if (media.paused) {
            media.play().catch(() => {});
          }
        }
        ladderStep();
      }
      if (nextSec < prevSec) {
        prevSec = nextSec - 1e-4;
      }
      fireCues(prevSec, nextSec);
      playheadRef.current = nextSec;
      setPlayhead(nextSec);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [playing, clip.id, mediaKind]);
  useEffect(() => {
    const media = mediaRef.current;
    if (!(!mediaKind || !media))
      if (playing) {
        const target = segStartRef.current + playheadRef.current;
        if (Math.abs(media.currentTime - target) > 0.25) {
          media.currentTime = target;
        }
        const playPromise = media.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => setPlaying(false));
        }
      } else media.pause();
  }, [playing, mediaKind, clip.id]);
  useEffect(() => {
    const media = mediaRef.current;
    if (media) {
      media.playbackRate = prefs.rate;
      media.preservesPitch = true;
      media.webkitPreservesPitch = true;
    }
  }, [prefs.rate, clip.id, mediaKind]);
  useEffect(() => {
    if (isUpload || isMusic) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(paneSize.w * dpr);
    const height = Math.round(paneSize.h * dpr);
    if (canvas.width !== width) {
      canvas.width = width;
    }
    if (canvas.height !== height) {
      canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    const drawBeat = timing.beatAt(playhead);
    const highlight = mode === "bailarina" ? myDancerId : null;
    if (clip.type === "stage") {
      drawStageView(
        ctx,
        width,
        height,
        clip,
        drawBeat,
        formations,
        highlight,
        mirrored,
      );
    } else if (clip.angle === "lado") {
      drawFeetSideView(ctx, width, height, clip, drawBeat, mirrored, vocab);
    } else {
      drawFeetFrontView(ctx, width, height, clip, drawBeat, mirrored, vocab);
    }
  }, [
    playhead,
    paneSize,
    clip,
    formations,
    myDancerId,
    mode,
    mirrored,
    vocab,
    fontsVersion,
    timing,
    isUpload,
    isMusic,
  ]);
  const seek = useCallback((toTime) => {
    const clamped = clamp(toTime, 0, durationRef.current || 0);
    playheadRef.current = clamped;
    setPlayhead(clamped);
    if (mediaRef.current) {
      mediaRef.current.currentTime = segStartRef.current + clamped;
    }
  }, []);
  const togglePlay = () => {
    if ((unlockAudio(), !playing)) {
      const loopNow = loopRef.current;
      const dur = durationRef.current;
      if (
        loopNow.on &&
        loopNow.a != null &&
        loopNow.b != null &&
        (playheadRef.current < loopNow.a ||
          playheadRef.current >= loopNow.b - 0.01)
      ) {
        seek(loopNow.a);
      } else if (dur > 0 && playheadRef.current >= dur - 0.02) {
        seek(loopNow.on && loopNow.a != null ? loopNow.a : 0);
      }
      onSeen(clip.id);
    }
    setPlaying((prev) => !prev);
  };
  const restart = () => seek(abLoop.on && abLoop.a != null ? abLoop.a : 0);
  // Start a block of the whole piece with a 4-beat lead-in (keyboard arrows and the class remote).
  const goToSegment = (seg) => {
    unlockAudio();
    setAbLoop({ a: null, b: null, on: false });
    seek(Math.max(0, timing.timeAt((seg.start - 1) * 8 - 4)));
    setPlaying(true);
  };
  // ← / →: previous / next block of the whole piece, or previous / next ocho in a clip. Going back
  // more than two beats into the current one restarts it, like a music player.
  const jump = (dir) => {
    if (!timing.timeAt || !timing.beatAt) return;
    const beat = timing.beatAt(playheadRef.current);
    if (clip.full && clip.segments?.length) {
      const segs = clip.segments;
      let cur = segs.findIndex((seg) => beat < (seg.start - 1 + seg.len) * 8);
      if (cur < 0) cur = segs.length - 1;
      const intoCurrent = beat - (segs[cur].start - 1) * 8;
      const target =
        dir < 0 && intoCurrent > 2 ? cur : clamp(cur + dir, 0, segs.length - 1);
      goToSegment(segs[target]);
    } else {
      const eightStart = Math.floor(beat / 8) * 8;
      const targetBeat =
        dir > 0
          ? eightStart + 8
          : beat - eightStart > 2
            ? eightStart
            : eightStart - 8;
      seek(Math.max(0, timing.timeAt(targetBeat)));
    }
  };
  const markA = () => {
    const atSec = playheadRef.current;
    setAbLoop((prev) => {
      const keepB = prev.b != null && prev.b > atSec + 0.1 ? prev.b : null;
      return {
        a: atSec,
        b: keepB,
        on: keepB != null && prev.on,
      };
    });
  };
  const markB = () => {
    const atSec = playheadRef.current;
    const loopStart = loopRef.current.a != null ? loopRef.current.a : 0;
    if (!(atSec <= loopStart + 0.1)) {
      setAbLoop({
        a: loopStart,
        b: atSec,
        on: true,
      });
      seek(loopStart);
    }
  };
  const toggleLoop = () =>
    setAbLoop((prev) =>
      prev.a != null && prev.b != null
        ? {
            ...prev,
            on: !prev.on,
          }
        : prev,
    );
  const clearLoop = () =>
    setAbLoop({
      a: null,
      b: null,
      on: false,
    });
  const loopBeats = (fromBeat, toBeat) => {
    if (!timing.timeAt) return;
    unlockAudio();
    const loopA = Math.max(0, timing.timeAt(fromBeat - 1));
    const loopB = Math.min(durationRef.current || 1 / 0, timing.timeAt(toBeat));
    setAbLoop({
      a: loopA,
      b: loopB,
      on: true,
    });
    seek(loopA);
    onSeen(clip.id);
    setPlaying(true);
  };
  const setRate = (rate) =>
    setPrefs((prevPrefs) => ({
      ...prevPrefs,
      rate,
    }));
  const toggleMirror = () => {
    if (!isMusic) {
      setMirrored((prev) => !prev);
    }
  };
  const shortcutsRef = useRef({});
  shortcutsRef.current = {
    togglePlay,
    jump,
    markA,
    markB,
    toggleLoop,
    setRate,
    toggleMirror,
  };
  const beatNow = timing.beatAt ? timing.beatAt(playhead) : 0;
  const currentSeg =
    clip.full && clip.segments
      ? clip.segments.find(
          (seg) =>
            beatNow >= (seg.start - 1) * 8 &&
            beatNow < (seg.start - 1 + seg.len) * 8,
        )
      : null;
  const loopedSegId =
    (clip.full &&
      abLoop.on &&
      timing.timeAt &&
      (
        clip.segments.find(
          (seg) =>
            Math.abs(
              abLoop.a - Math.max(0, timing.timeAt((seg.start - 1) * 8 - 1)),
            ) < 0.05,
        ) || {}
      ).id) ||
    null;
  const classScreenState = classMode
    ? {
        title: title || clip.title || "Modo clase",
        segs: clip.full
          ? clip.segments.map((seg) => ({
              id: seg.id,
              name: seg.name,
            }))
          : [],
        seg: currentSeg ? currentSeg.name : block ? block.name : "",
        playing,
        rate: prefs.rate,
        flip: stageView,
        loop: loopedSegId,
      }
    : null;
  const remote = useClassScreenRemote(
    classMode,
    classScreenState,
    (command) => {
      const findSeg = (segId) =>
        (clip.segments || []).find((candidate) => candidate.id === segId);
      if (command.cmd === "play" && !playing) togglePlay();
      else if (command.cmd === "pause" && playing) togglePlay();
      else if (command.cmd === "restart") {
        setAbLoop({
          a: null,
          b: null,
          on: false,
        });
        seek(0);
      } else if (command.cmd === "rate" && [0.5, 0.75, 1].includes(command.arg))
        setRate(command.arg);
      else if (command.cmd === "flip") setStageView((prev) => !prev);
      else if (command.cmd === "block" && timing.timeAt) {
        const blockSeg = findSeg(command.arg);
        if (blockSeg) goToSegment(blockSeg);
      } else if (command.cmd === "loop") {
        const loopSeg = findSeg(command.arg);
        if (!loopSeg) return;
        if (loopedSegId === loopSeg.id) {
          setAbLoop((prev) => ({
            ...prev,
            on: false,
          }));
        } else {
          loopBeats(
            (loopSeg.start - 1) * 8,
            (loopSeg.start - 1 + loopSeg.len) * 8,
          );
        }
      }
    },
  );
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const target = ev.target;
      const tag = target && target.tagName;
      if (isTypingTarget(target) || target?.closest?.("[data-no-shortcuts]"))
        return;
      const key = ev.key.toLowerCase();
      if (key === " ") {
        if (
          tag === "BUTTON" ||
          tag === "LABEL" ||
          tag === "SUMMARY" ||
          tag === "A"
        )
          return;
        ev.preventDefault();
        shortcutsRef.current.togglePlay();
      } else if (key === "arrowleft" || key === "arrowright") {
        // Only when nothing else on the page wants the arrows (e.g. a dancer dot on the map).
        const panel = panelRef.current;
        if (target !== document.body && !(panel && panel.contains(target)))
          return;
        ev.preventDefault();
        shortcutsRef.current.jump(key === "arrowleft" ? -1 : 1);
      } else {
        if (key === "m") {
          shortcutsRef.current.toggleMirror();
        } else if (key === "a") {
          shortcutsRef.current.markA();
        } else if (key === "b") {
          shortcutsRef.current.markB();
        } else if (key === "l") {
          shortcutsRef.current.toggleLoop();
        } else if (key === "1") {
          shortcutsRef.current.setRate(0.5);
        } else if (key === "2") {
          shortcutsRef.current.setRate(0.75);
        } else if (key === "3") {
          shortcutsRef.current.setRate(1);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const beat = timing.beatAt ? timing.beatAt(playhead) : null;
  const hasMarks = abLoop.a != null && abLoop.b != null;
  const shownBpm = timing.bpm ? Math.round(timing.bpm * 10) / 10 : null;
  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className={`panel overflow-hidden ${classMode ? "player-big" : ""}`}
    >
      <div className="pl-head flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-4 pb-3 pt-4">
        <div className="min-w-0">
          <p className="f-label">
            {"Reproductor de práctica · "}
            {clip.full ? "coreografía entera" : block ? block.name : ""}
          </p>
          <h2 className="mt-1 text-[17px] font-semibold leading-snug text-ink [text-wrap:balance]">
            {clip.title}
          </h2>
        </div>
        {shownBpm && (
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {String(shownBpm).replace(".", ",")}
            {" bpm"}
            {clip.swing && !hasSong ? " · swing" : ""}
            {clip.acapella === true ? " · a capella" : ""}
          </p>
        )}
      </div>
      <div
        className={`screen ${myVideo ? "is-split" : ""}`}
        onClick={togglePlay}
        role="presentation"
      >
        <div ref={paneRef} className="screen-pane">
          {isUpload && (
            <video
              key={clip.id}
              ref={mediaRef}
              src={clip.src}
              playsInline={true}
              muted={prefs.muted}
              className={mirrored ? "is-mirror" : ""}
              onLoadedMetadata={(ev) => {
                setMediaDuration(ev.currentTarget.duration || 0);
                ev.currentTarget.playbackRate = prefsRef.current.rate;
              }}
              onTimeUpdate={(ev) => {
                if (!playing) {
                  playheadRef.current = ev.currentTarget.currentTime;
                  setPlayhead(ev.currentTarget.currentTime);
                }
              }}
              onEnded={(ev) => {
                const loopNow = loopRef.current;
                if ((loopNow.on && loopNow.a != null) || ladderRef.current) {
                  ev.currentTarget.currentTime =
                    loopNow.on && loopNow.a != null ? loopNow.a : 0;
                  ladderStep();
                  ev.currentTarget.play().catch(() => setPlaying(false));
                } else {
                  setPlaying(false);
                }
              }}
            />
          )}
          {hasSong && (
            <audio
              key={`${clip.id}-${song.src}`}
              ref={mediaRef}
              src={song.src}
              preload="auto"
              muted={prefs.muted}
              onLoadedMetadata={(ev) => {
                const audio = ev.currentTarget;
                setMediaDuration(audio.duration || 0);
                audio.playbackRate = prefsRef.current.rate;
                audio.currentTime = segStartRef.current + playheadRef.current;
              }}
              onEnded={() => setPlaying(false)}
            />
          )}
          {isMusic ? (
            <MusicCountBoard
              clip={clip}
              beat={beat}
              block={block}
              blockClips={blockClips}
              vocab={vocab}
              song={song}
              formations={formations}
              highlight={mode === "bailarina" ? myDancerId : null}
              flip={classMode && stageView}
              showStage={clip.full || classMode}
            />
          ) : (
            !isUpload && (
              <canvas
                ref={canvasRef}
                className={mirrored ? "is-mirror" : ""}
                aria-label={`Vídeo de muestra: ${clip.title}`}
              />
            )
          )}
        </div>
        {myVideo && (
          <div className="screen-pane is-me">
            <video
              key={myVideo.src}
              ref={myVideoRef}
              src={myVideo.src}
              playsInline={true}
              muted={true}
              preload="auto"
              className={myVideoMirrored ? "is-mirror" : ""}
            />
            <span className="hud-chip pane-label">Tú</span>
          </div>
        )}
        {!isMusic && (
          <div className="hud-tl">
            <span className="hud-chip">
              {CLIP_ANGLE_LABELS[clip.angle] || "Vídeo"}
            </span>
            {clip.type === "feet" && (
              <span className="hud-chip hud-feet">
                <i
                  style={{
                    background: "var(--foot-r)",
                  }}
                />
                {"D "}
                <i
                  style={{
                    background: "var(--foot-l)",
                  }}
                />
                I
              </span>
            )}
          </div>
        )}
        <div className="hud-tr">
          {mirrored && !isMusic && (
            <span className="hud-chip is-on">Espejo</span>
          )}
          {(ladderOn || prefs.rate !== 1) && (
            <span className="hud-chip is-on">
              {ladderOn
                ? `Escalera · ${prefs.rate >= 1 ? "a tempo" : formatRate(prefs.rate)}`
                : formatRate(prefs.rate)}
            </span>
          )}
          {abLoop.on && <span className="hud-chip is-on">Bucle A–B</span>}
        </div>
        {!isMusic && <VideoCountHud clip={clip} beat={beat} vocab={vocab} />}
        {!playing && (
          <span
            className={`bigplay ${isMusic ? "is-corner" : ""}`}
            aria-hidden="true"
          >
            <Icon name="play" size={30} />
          </span>
        )}
      </div>
      <div className="pl-controls flex flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <PlayerScrubber
            t={playhead}
            duration={duration}
            loop={abLoop}
            preroll={timing.timeAt ? Math.max(0, timing.timeAt(0)) : 0}
            onSeek={seek}
          />
          <span className="shrink-0 font-mono text-[12px] tabular-nums text-muted">
            {formatClockTenths(playhead)}
            {" / "}
            {formatClockTenths(duration)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={togglePlay}
          >
            <Icon name={playing ? "pause" : "play"} />
            {playing ? "Pausa" : "Reproducir"}
          </button>
          <button
            type="button"
            className="btn btn-icon"
            onClick={restart}
            aria-label={abLoop.on ? "Volver a A" : "Volver al principio"}
            title={abLoop.on ? "Volver a A" : "Volver al principio"}
          >
            <Icon name="restart" />
          </button>
          <div className="seg" role="radiogroup" aria-label="Velocidad">
            {PLAYER_RATE_OPTIONS.map(([speed, speedLabel]) => (
              <button
                key={speed}
                type="button"
                role="radio"
                aria-checked={prefs.rate === speed}
                className="seg-btn tabular-nums"
                onClick={() => setRate(speed)}
              >
                {speedLabel}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn"
            aria-pressed={ladderOn}
            onClick={toggleLadder}
            title="Empieza a 0,5× y sube 0,1× en cada vuelta hasta 1×"
          >
            <Icon name="ladder" />
            Escalera
          </button>
          {!isMusic && (
            <button
              type="button"
              className="btn"
              aria-pressed={mirrored}
              onClick={toggleMirror}
            >
              <Icon name="mirror" />
              Espejo
            </button>
          )}
          <label
            className="btn btn-file pl-extra"
            title="Elige un vídeo tuyo bailando este paso para verlo al lado"
          >
            <Icon name="compare" />
            {myVideo ? "Cambiar mi vídeo" : "Compararme"}
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(ev) => {
                loadMyVideo(ev.target.files && ev.target.files[0]);
                ev.target.value = "";
              }}
            />
          </label>
          {classMode && clip.full && (
            <button
              type="button"
              className="btn"
              aria-pressed={stageView}
              onClick={() => setStageView((prev) => !prev)}
              title="Para cuando la pantalla está de cara a las bailarinas"
            >
              <Icon name="mirror" />
              Vista desde el escenario
            </button>
          )}
          {classMode && remote.available && (
            <span
              className={`pl-remote ${remote.remotes ? "is-on" : ""}`}
              title="Abre Contratiempo en tu móvil y pulsa «Mando»"
            >
              {remote.remotes ? "Mando conectado" : "Mando: ábrelo en tu móvil"}
            </span>
          )}
          {classMode ? (
            <button type="button" className="btn" onClick={exitClassMode}>
              <Icon name="x" />
              Salir de pantalla grande
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={enterClassMode}
              title="Para proyectar en clase o ver en la tele"
            >
              <Icon name="expand" />
              Pantalla grande
            </button>
          )}
        </div>
        {myVideo && (
          <div className="mine-bar">
            <span className="f-label">Tu vídeo</span>
            <button
              type="button"
              className="btn btn-xs"
              aria-pressed={myVideoMirrored}
              onClick={() => setMyVideoMirrored((prev) => !prev)}
            >
              <Icon name="mirror" size={13} />
              Espejo
            </button>
            <span className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn-xs"
                onClick={() =>
                  setMyVideoOffset(
                    (prev) => Math.round((prev - 0.25) * 100) / 100,
                  )
                }
                aria-label="Tu vídeo empieza antes"
              >
                −
              </button>
              <span className="font-mono text-[12px] tabular-nums text-ink">{`${myVideoOffset > 0 ? "+" : ""}${String(myVideoOffset).replace(".", ",")} s`}</span>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() =>
                  setMyVideoOffset(
                    (prev) => Math.round((prev + 0.25) * 100) / 100,
                  )
                }
                aria-label="Tu vídeo empieza después"
              >
                +
              </button>
            </span>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => {
                setMyVideo((prev) => {
                  if (prev) {
                    URL.revokeObjectURL(prev.src);
                  }
                  return null;
                });
              }}
            >
              Quitar
            </button>
            <span className="text-[12px] text-muted">
              Ajusta los segundos hasta que empecéis a la vez. Tu vídeo solo se
              ve en este móvil.
            </span>
          </div>
        )}
        {ladderOn && (
          <p className="text-[13px] text-ink">
            <b className="font-semibold">Escalera de tempo:</b>{" "}
            {prefs.rate >= 1
              ? "ya vas a tempo. Sigue repitiendo hasta que salga limpio."
              : `vas a ${formatRate(prefs.rate)}; al terminar cada vuelta vuelve a empezar un poco más rápido, hasta 1×.`}
            {!hasMarks &&
              " Repite el vídeo entero; marca A y B para subir solo un trozo."}
          </p>
        )}
        <div className="pl-extra flex flex-wrap items-center gap-2">
          <span className="f-label mr-1">Repetir paso</span>
          <button
            type="button"
            className="btn"
            onClick={markA}
            aria-label="Marcar inicio A en el punto actual"
          >
            <span className="ab">A</span>Marcar inicio
          </button>
          <button
            type="button"
            className="btn"
            onClick={markB}
            aria-label="Marcar final B en el punto actual"
          >
            <span className="ab">B</span>Marcar final
          </button>
          <button
            type="button"
            className="btn"
            aria-pressed={abLoop.on}
            onClick={toggleLoop}
            disabled={!hasMarks}
          >
            <Icon name="loop" />
            Bucle
          </button>
          {(abLoop.a != null || abLoop.b != null) && (
            <button
              type="button"
              className="btn btn-icon"
              onClick={clearLoop}
              aria-label="Quitar bucle"
              title="Quitar bucle"
            >
              <Icon name="x" />
            </button>
          )}
          <span className="font-mono text-[12px] tabular-nums text-muted">
            {abLoop.a != null
              ? `A ${formatClockTenths(abLoop.a)}`
              : "Sin marcas"}
            {abLoop.b != null ? ` → B ${formatClockTenths(abLoop.b)}` : ""}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isUpload && (
            <button
              type="button"
              className="btn"
              aria-pressed={prefs.metro}
              onClick={() =>
                setPrefs((prevPrefs) => ({
                  ...prevPrefs,
                  metro: !prevPrefs.metro,
                }))
              }
            >
              <Icon name="metro" />
              Metrónomo
            </button>
          )}
          <button
            type="button"
            className="btn"
            aria-pressed={!prefs.muted}
            onClick={() =>
              setPrefs((prevPrefs) => ({
                ...prevPrefs,
                muted: !prevPrefs.muted,
              }))
            }
          >
            <Icon name={prefs.muted ? "mute" : "sound"} />
            {prefs.muted ? "Sin sonido" : "Sonido"}
          </button>
          {isSpeechSupported() && !isUpload && (
            <button
              type="button"
              className="btn"
              aria-pressed={!!prefs.voice}
              title="Una voz dice los pasos de cada ocho un poco antes de que lleguen"
              onClick={() => {
                const voiceOn = !prefs.voice;
                setPrefs((prevPrefs) => ({
                  ...prevPrefs,
                  voice: voiceOn,
                }));
                if (voiceOn) {
                  speakText("Voz activada");
                } else {
                  cancelSpeech();
                }
              }}
            >
              <Icon name="voice" />
              Voz
            </button>
          )}
          <p className="text-[12px] text-muted md:hidden">
            ¿No se oye? Sube el volumen del móvil y vuelve a darle a Reproducir.
          </p>
          <p className="hidden text-[12px] text-muted md:block">
            {"Teclado: "}
            <kbd>espacio</kbd>
            {" reproducir · "}
            <kbd>M</kbd>
            {" espejo · "}
            <kbd>A</kbd> <kbd>B</kbd>
            {" bucle · "}
            <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>
            {" velocidad · "}
            <kbd>←</kbd> <kbd>→</kbd>
            {clip.full ? " bloque" : " ocho"}
          </p>
        </div>
      </div>
      <div className="pl-extra border-t border-line px-4 py-4">
        {isUpload ? (
          <p className="text-sm text-muted">
            Vídeo subido desde este dispositivo (
            {CLIP_ANGLE_LABELS[clip.angle]
              ? CLIP_ANGLE_LABELS[clip.angle].toLowerCase()
              : "sin ángulo"}
            ). En la demo solo se conserva mientras la pestaña esté abierta.
          </p>
        ) : isMusic ? (
          <MusicPracticePanel
            clip={clip}
            block={block}
            song={song}
            bpm={shownBpm}
            onLoopBeats={loopBeats}
            beat={beat}
          />
        ) : clip.type === "stage" ? (
          <StageMoveOrder clip={clip} me={myDancerId} mode={mode} />
        ) : (
          <SoundScore
            clip={clip}
            beat={beat}
            vocab={vocab}
            onSeekBeat={(beatNo) => seek(timing.timeAt(beatNo))}
            onLoopBeats={loopBeats}
          />
        )}
      </div>
    </div>
  );
}
