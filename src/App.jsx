// Root component: header, coreógrafa/bailarina views, navigation and every state action. State is saved to localStorage.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DANCERS } from "./data/dancers.js";
import {
  loadRecordedSamples,
  setAudioMuted,
  unlockAudio,
} from "./lib/audio.js";
import {
  buildChoreoMedia,
  buildStepBankIndex,
  missedClassGroups,
} from "./lib/choreography.js";
import { findDancerById } from "./lib/dancers.js";
import {
  isComfortablyInView,
  prefersReducedMotion,
  useMediaQuery,
} from "./lib/dom.js";
import { isSpeechSupported } from "./lib/speech.js";
import { createDefaultState, deepClone, migrateState } from "./lib/state.js";
import { loadSavedState, persistState } from "./lib/storage.js";
import { localDateKey } from "./lib/time.js";
import { BackupPanel } from "./components/BackupPanel.jsx";
import { ChoreographyPage } from "./components/ChoreographyPage.jsx";
import { ClassModeRemote } from "./components/ClassModeRemote.jsx";
import { DancerCodesPanel } from "./components/DancerCodesPanel.jsx";
import { DancerFollowUp } from "./components/DancerFollowUp.jsx";
import { DancerLogin } from "./components/DancerLogin.jsx";
import { ImprovRoulettePanel } from "./components/ImprovRoulettePanel.jsx";
import { ImprovRouletteRunner } from "./components/ImprovRouletteRunner.jsx";
import { LastClassLog } from "./components/LastClassLog.jsx";
import { MissedClassSummary } from "./components/MissedClassSummary.jsx";
import { PracticeStatsPanel } from "./components/PracticeStatsPanel.jsx";
import { ReviewBar } from "./components/ReviewBar.jsx";
import { HardStepsPanel } from "./components/HardStepsPanel.jsx";
import { ConfirmButton } from "./components/ui/ConfirmButton.jsx";
import { RepertoireGrid } from "./components/RepertoireGrid.jsx";
import { StepBankPanel } from "./components/StepBankPanel.jsx";
import { StepDictionary } from "./components/StepDictionary.jsx";
import { TxalapartaHomeCard } from "./components/txalaparta/TxalapartaHomeCard.jsx";
import { TxalapartaWorkshop } from "./components/txalaparta/TxalapartaWorkshop.jsx";
import { Icon } from "./components/ui/Icon.jsx";
import { UpcomingShowCard } from "./components/UpcomingShowCard.jsx";
import { WarmupPanel } from "./components/WarmupPanel.jsx";
import { WarmupRunner } from "./components/WarmupRunner.jsx";
export function App() {
  const wideHeader = useMediaQuery("(min-width: 640px)");
  const initialState = useMemo(() => migrateState(loadSavedState()), []);
  const [mode, setMode] = useState(initialState.mode);
  const [dancerId, setDancerId] = useState(initialState.me);
  const [choreoId, setChoreoId] = useState(initialState.choreoId);
  const [view, setView] = useState(initialState.view);
  const [prefs, setPrefs] = useState(initialState.prefs);
  const [choreos, setChoreos] = useState(initialState.choreos);
  const [clipMeta, setClipMeta] = useState(initialState.clipMeta);
  const [lastClass, setLastClass] = useState(initialState.lastClass);
  const [seen, setSeen] = useState(initialState.seen);
  const [codes, setCodes] = useState(initialState.codes);
  const [vocab, setVocab] = useState(initialState.vocab);
  const [sync, setSync] = useState(initialState.sync);
  const [selections, setSelections] = useState(initialState.sel);
  const [rhythms, setRhythms] = useState(initialState.rhythms);
  const [tallerId, setTallerId] = useState(initialState.tallerId);
  const [instruments, setInstruments] = useState(initialState.instruments);
  const [hard, setHard] = useState(initialState.hard);
  const [warmup, setWarmup] = useState(initialState.warmup);
  const [practice, setPractice] = useState(initialState.practice);
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [improvSettings, setImprovSettings] = useState(null);
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [songs, setSongs] = useState({});
  const [playRequest, setPlayRequest] = useState({
    id: null,
    n: 0,
  });
  const playerRef = useRef(null);
  const mapRef = useRef(null);
  useEffect(() => {
    persistState({
      v: 4,
      mode,
      me: dancerId,
      choreoId,
      view,
      prefs,
      choreos,
      clipMeta,
      lastClass,
      seen,
      codes,
      vocab,
      sync,
      sel: selections,
      rhythms,
      tallerId,
      instruments,
      hard,
      warmup,
      practice,
    });
  }, [
    mode,
    dancerId,
    choreoId,
    view,
    prefs,
    choreos,
    clipMeta,
    lastClass,
    seen,
    codes,
    vocab,
    sync,
    selections,
    rhythms,
    tallerId,
    instruments,
    hard,
    warmup,
    practice,
  ]);
  useEffect(() => setAudioMuted(prefs.muted), [prefs.muted]);
  useEffect(() => {
    loadRecordedSamples();
  }, []);
  const derivedById = useMemo(() => {
    const derivedMap = {};
    for (let choreoForDerived of choreos)
      derivedMap[choreoForDerived.id] = buildChoreoMedia(
        choreoForDerived,
        uploads,
        clipMeta,
        rhythms,
        instruments,
      );
    return derivedMap;
  }, [choreos, uploads, clipMeta, rhythms, instruments]);
  const stepBank = useMemo(
    () => buildStepBankIndex(choreos, uploads),
    [choreos, uploads],
  );
  const clipsByChoreo = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(derivedById).map(([derivedKey, derivedValue]) => [
          derivedKey,
          derivedValue.clips,
        ]),
      ),
    [derivedById],
  );
  const activeChoreo = choreoId
    ? choreos.find((choreoMatch) => choreoMatch.id === choreoId)
    : null;
  const hasAccess = mode === "coreo" || !!dancerId;
  useEffect(() => {
    if (
      mode === "bailarina" &&
      activeChoreo &&
      activeChoreo.status === "Borrador"
    ) {
      setChoreoId(null);
    }
  }, [mode, activeChoreo]);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const dancerRef = useRef(dancerId);
  dancerRef.current = dancerId;
  const logPractice = useCallback((addedSecs) => {
    if (modeRef.current !== "bailarina" || !dancerRef.current) return;
    const loggingDancer = dancerRef.current;
    const todayKey = localDateKey(new Date());
    setPractice((prevPractice) => {
      const dancerLog = prevPractice[loggingDancer] || {};
      return {
        ...prevPractice,
        [loggingDancer]: {
          ...dancerLog,
          [todayKey]: (dancerLog[todayKey] || 0) + addedSecs,
        },
      };
    });
  }, []);
  const markSeen = useCallback((seenClipId) => {
    if (modeRef.current !== "bailarina" || !dancerRef.current) return;
    const viewerId = dancerRef.current;
    setSeen((prevSeen) =>
      (prevSeen[viewerId] || []).includes(seenClipId)
        ? prevSeen
        : {
            ...prevSeen,
            [viewerId]: [...(prevSeen[viewerId] || []), seenClipId],
          },
    );
  }, []);
  const scrollToRef = (targetRef, forceScroll) => {
    requestAnimationFrame(() => {
      const targetEl = targetRef.current;
      if (targetEl && (forceScroll || !isComfortablyInView(targetEl))) {
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  };
  const goHome = () => {
    setChoreoId(null);
    setTallerId(null);
    setReviewPos(null);
    window.scrollTo(0, 0);
  };
  const workshopRhythm =
    (tallerId && rhythms.find((rhythmMatch) => rhythmMatch.id === tallerId)) ||
    null;
  const openWorkshop = (requestedRhythmId) => {
    const workshopTargetId =
      requestedRhythmId &&
      rhythms.find((rhythmProbe) => rhythmProbe.id === requestedRhythmId)
        ? requestedRhythmId
        : rhythms[0]
          ? rhythms[0].id
          : null;
    if (!workshopTargetId) return addNewRhythm();
    setTallerId(workshopTargetId);
    setChoreoId(null);
    window.scrollTo(0, 0);
  };
  const updateRhythm = useCallback(
    (updRhythmId, rhythmUpdater) =>
      setRhythms((prevRhythmsUpd) =>
        prevRhythmsUpd.map((rhythmRow) =>
          rhythmRow.id === updRhythmId ? rhythmUpdater(rhythmRow) : rhythmRow,
        ),
      ),
    [],
  );
  const addNewRhythm = () => {
    const newRhythmId = `rx${Date.now().toString(36)}`;
    const newMaterial =
      (
        rhythms.find(
          (currentWorkshopRhythm) => currentWorkshopRhythm.id === tallerId,
        ) || {}
      ).material || "madera";
    setRhythms((prevRhythmsNew) => [
      ...prevRhythmsNew,
      {
        id: newRhythmId,
        name: `Ritmo ${prevRhythmsNew.length + 1}`,
        bpm: 100,
        eights: 1,
        material: newMaterial,
        feet: false,
        snap: "8",
        author: mode === "coreo" ? "profe" : dancerId,
        layers: [],
        moves: [],
      },
    ]);
    setTallerId(newRhythmId);
    setChoreoId(null);
    window.scrollTo(0, 0);
  };
  const duplicateRhythm = (sourceRhythmId) => {
    const sourceRhythm = rhythms.find(
      (sourceProbe) => sourceProbe.id === sourceRhythmId,
    );
    if (!sourceRhythm) return;
    const copyRhythmId = `rx${Date.now().toString(36)}`;
    const rhythmCopy = {
      ...deepClone(sourceRhythm),
      id: copyRhythmId,
      name: `${sourceRhythm.name} (copia)`,
      author: mode === "coreo" ? "profe" : dancerId,
    };
    rhythmCopy.layers = rhythmCopy.layers.map((copiedLayer) => ({
      ...copiedLayer,
      runId: undefined,
      fromBeat: undefined,
    }));
    setRhythms((prevRhythmsDup) => [...prevRhythmsDup, rhythmCopy]);
    setTallerId(copyRhythmId);
  };
  const deleteRhythm = (deletedRhythmId) => {
    const remainingRhythms = rhythms.filter(
      (rhythmKept) => rhythmKept.id !== deletedRhythmId,
    );
    setRhythms(remainingRhythms);
    setChoreos((prevChoreosDel) =>
      prevChoreosDel.map((choreoClean) => ({
        ...choreoClean,
        blocks: choreoClean.blocks.map((blockClean) =>
          blockClean.rhythmId === deletedRhythmId
            ? {
                ...blockClean,
                rhythmId: undefined,
              }
            : blockClean,
        ),
      })),
    );
    setTallerId(remainingRhythms[0] ? remainingRhythms[0].id : null);
  };
  const assignRhythm = (assignRhythmId, assignChoreoId, assignBlockId) =>
    setChoreos((prevChoreosAssign) =>
      prevChoreosAssign.map((choreoAssign) =>
        choreoAssign.id !== assignChoreoId
          ? choreoAssign
          : {
              ...choreoAssign,
              blocks: choreoAssign.blocks.map((blockAssign) =>
                blockAssign.id === assignBlockId
                  ? {
                      ...blockAssign,
                      rhythmId: assignRhythmId,
                    }
                  : blockAssign,
              ),
            },
      ),
    );
  const unassignRhythm = (unassignChoreoId, unassignBlockId) =>
    setChoreos((prevChoreosUnassign) =>
      prevChoreosUnassign.map((choreoUnassign) =>
        choreoUnassign.id !== unassignChoreoId
          ? choreoUnassign
          : {
              ...choreoUnassign,
              blocks: choreoUnassign.blocks.map((blockUnassign) =>
                blockUnassign.id === unassignBlockId
                  ? {
                      ...blockUnassign,
                      rhythmId: undefined,
                    }
                  : blockUnassign,
              ),
            },
      ),
    );
  const openChoreo = (openChoreoId, openOptions = {}) => {
    setTallerId(null);
    const choreoToOpen = choreos.find(
      (choreoProbe) => choreoProbe.id === openChoreoId,
    );
    if (!choreoToOpen) return;
    const savedSel = selections[openChoreoId] || {};
    const startBlockId =
      openOptions.blockId || savedSel.blockId || choreoToOpen.blocks[0].id;
    const openDerived = derivedById[openChoreoId];
    const startClipId =
      openOptions.clipId ||
      savedSel.clipId ||
      (
        openDerived.clips.find(
          (clipProbe) => clipProbe.block === startBlockId,
        ) ||
        openDerived.music.find(
          (musicProbe) => musicProbe.block === startBlockId,
        )
      ).id;
    setSelections((prevSelOpen) => ({
      ...prevSelOpen,
      [openChoreoId]: {
        blockId: startBlockId,
        clipId: startClipId,
      },
    }));
    setChoreoId(openChoreoId);
    if (openOptions.play) {
      unlockAudio();
      setPlayRequest((prevPlayReq) => ({
        id: startClipId,
        n: prevPlayReq.n + 1,
      }));
      markSeen(startClipId);
    }
    if (openOptions.focus === "map") {
      scrollToRef(mapRef, true);
    } else if (openOptions.focus === "player" || openOptions.play) {
      scrollToRef(playerRef, true);
    } else {
      window.scrollTo(0, 0);
    }
  };
  // Going through the "Faltaste…" list in order (dancer view): position in the flat list.
  const [reviewPos, setReviewPos] = useState(null);
  const reviewItems = useMemo(
    () =>
      dancerId
        ? missedClassGroups(
            choreos,
            clipsByChoreo,
            lastClass,
            dancerId,
          ).flatMap((group) =>
            group.items.map((item) => ({ choreoId: group.choreo.id, item })),
          )
        : [],
    [choreos, clipsByChoreo, lastClass, dancerId],
  );
  const openReviewItem = (index) => {
    const entry = reviewItems[index];
    if (!entry) return;
    setReviewPos(index);
    const { choreoId: itemChoreoId, item } = entry;
    if (item.kind === "clip") {
      openChoreo(itemChoreoId, {
        blockId: item.clip.block,
        clipId: item.clip.id,
        play: true,
      });
    } else {
      markSeen(item.id);
      openChoreo(itemChoreoId, { blockId: item.block.id, focus: "map" });
    }
  };
  const updateChoreo = useCallback(
    (updChoreoId, choreoUpdater) =>
      setChoreos((prevChoreosUpd) =>
        prevChoreosUpd.map((choreoRow) =>
          choreoRow.id === updChoreoId ? choreoUpdater(choreoRow) : choreoRow,
        ),
      ),
    [],
  );
  const selectBlock = (nextBlockId) =>
    setSelections((prevSelBlock) => ({
      ...prevSelBlock,
      [choreoId]: {
        ...(prevSelBlock[choreoId] || {}),
        blockId: nextBlockId,
      },
    }));
  const playClip = (playClipId, playOptions = {}) => {
    unlockAudio();
    const playDerived = derivedById[choreoId];
    const clipToPlay = [
      ...playDerived.clips,
      ...playDerived.music,
      playDerived.full,
    ].find((playProbe) => playProbe.id === playClipId);
    if (clipToPlay) {
      setSelections((prevSelPlay) => ({
        ...prevSelPlay,
        [choreoId]: {
          blockId: clipToPlay.block,
          clipId: playClipId,
        },
      }));
      setPlayRequest((prevReqPlay) => ({
        id: playClipId,
        n: prevReqPlay.n + 1,
        big: !!playOptions.big,
      }));
      markSeen(playClipId);
      scrollToRef(playerRef);
    }
  };
  const focusBlock = (focusBlockId) => {
    selectBlock(focusBlockId);
    requestAnimationFrame(() => {
      const mapEl = mapRef.current;
      if (!mapEl) return;
      const mapRect = mapEl.getBoundingClientRect();
      if (mapRect.bottom < 90 || mapRect.top > window.innerHeight - 120) {
        mapEl.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  };
  const setDancerPos = (posBlockId, posDancerId, position) =>
    updateChoreo(choreoId, (choreoPos) => ({
      ...choreoPos,
      formations: {
        ...choreoPos.formations,
        [posBlockId]: {
          ...choreoPos.formations[posBlockId],
          [posDancerId]: position,
        },
      },
    }));
  const copyPrevFormation = (copyBlockId) =>
    updateChoreo(choreoId, (choreoCopy) => {
      const blockIndex = choreoCopy.blocks.findIndex(
        (blockProbe) => blockProbe.id === copyBlockId,
      );
      return blockIndex <= 0
        ? choreoCopy
        : {
            ...choreoCopy,
            formations: {
              ...choreoCopy.formations,
              [copyBlockId]: deepClone(
                choreoCopy.formations[choreoCopy.blocks[blockIndex - 1].id],
              ),
            },
          };
    });
  const updateBlock = (updBlockId, blockPatch) =>
    updateChoreo(choreoId, (choreoUpdBlock) => ({
      ...choreoUpdBlock,
      blocks: choreoUpdBlock.blocks.map((blockUpd) =>
        blockUpd.id === updBlockId
          ? {
              ...blockUpd,
              ...blockPatch,
            }
          : blockUpd,
      ),
    }));
  // Removes a block with its formation and linked bank videos; its own clips just stop showing
  // (clips are filtered by existing blocks), so "Restaurar datos de ejemplo" brings samples back.
  const removeBlock = (removedId) => {
    const blocks = choreos.find((c) => c.id === choreoId).blocks;
    const idx = blocks.findIndex((b) => b.id === removedId);
    if (blocks.length < 2 || idx < 0) return;
    const neighborId = blocks[idx > 0 ? idx - 1 : 1].id;
    updateChoreo(choreoId, (choreo) => {
      const formations = { ...choreo.formations };
      delete formations[removedId];
      return {
        ...choreo,
        blocks: choreo.blocks.filter((b) => b.id !== removedId),
        formations,
        links: (choreo.links || []).filter((link) => link.block !== removedId),
      };
    });
    setSelections((prev) => ({
      ...prev,
      [choreoId]: { blockId: neighborId, clipId: `m-${neighborId}` },
    }));
  };
  // Moves a block one place earlier (-1) or later (+1); counts and timings follow the new order.
  const moveBlock = (movedId, step) =>
    updateChoreo(choreoId, (choreo) => {
      const blocks = [...choreo.blocks];
      const from = blocks.findIndex((b) => b.id === movedId);
      const to = from + step;
      if (from < 0 || to < 0 || to >= blocks.length) return choreo;
      [blocks[from], blocks[to]] = [blocks[to], blocks[from]];
      return { ...choreo, blocks };
    });
  const addBlock = () => {
    const newBlockId = `${choreoId}-${Date.now().toString(36)}`;
    updateChoreo(choreoId, (choreoAdd) => {
      const lastBlock = choreoAdd.blocks[choreoAdd.blocks.length - 1];
      const newBlock = {
        id: newBlockId,
        name: `Bloque ${choreoAdd.blocks.length + 1}`,
        len: 2,
        formation: lastBlock ? lastBlock.formation : "Fila",
        isNew: false,
        notes: "",
        personal: {},
      };
      return {
        ...choreoAdd,
        blocks: [...choreoAdd.blocks, newBlock],
        formations: {
          ...choreoAdd.formations,
          [newBlockId]: deepClone(
            lastBlock ? choreoAdd.formations[lastBlock.id] : {},
          ),
        },
      };
    });
    setSelections((prevSelAdd) => ({
      ...prevSelAdd,
      [choreoId]: {
        ...(prevSelAdd[choreoId] || {}),
        blockId: newBlockId,
        clipId: `m-${newBlockId}`,
      },
    }));
    return newBlockId;
  };
  const addNewChoreo = (newTitle, newBpm) => {
    const newChoreoId = `k${Date.now().toString(36)}`;
    const firstBlockId = `${newChoreoId}-1`;
    const startPositions = Object.fromEntries(
      DANCERS.map((dancerEntry, dancerIdx) => [
        dancerEntry.id,
        [15 + dancerIdx * 14, 60],
      ]),
    );
    const newChoreo = {
      id: newChoreoId,
      title: newTitle,
      bpm: newBpm,
      swing: false,
      status: "Borrador",
      blocks: [
        {
          id: firstBlockId,
          name: "Bloque 1",
          len: 2,
          formation: "Fila",
          isNew: false,
          notes: "",
          personal: {},
        },
      ],
      formations: {
        [firstBlockId]: startPositions,
      },
    };
    setChoreos((prevChoreosNew) => [...prevChoreosNew, newChoreo]);
    setSelections((prevSelNew) => ({
      ...prevSelNew,
      [newChoreoId]: {
        blockId: firstBlockId,
        clipId: `m-${firstBlockId}`,
      },
    }));
    setChoreoId(newChoreoId);
    window.scrollTo(0, 0);
  };
  const toggleNew = (toggleClipId) => {
    const toggledClip = (clipsByChoreo[choreoId] || []).find(
      (clipProbeNew) => clipProbeNew.id === toggleClipId,
    );
    setClipMeta((prevMetaNew) => ({
      ...prevMetaNew,
      [toggleClipId]: {
        ...(prevMetaNew[toggleClipId] || {}),
        isNew: !(toggledClip && toggledClip.isNew),
      },
    }));
  };
  // Before recording a new class: nothing from the previous one stays marked «Nuevo».
  const clearNewMarks = () => {
    setChoreos((prev) =>
      prev.map((choreo) =>
        choreo.blocks.some((b) => b.isNew)
          ? {
              ...choreo,
              blocks: choreo.blocks.map((b) =>
                b.isNew ? { ...b, isNew: false } : b,
              ),
            }
          : choreo,
      ),
    );
    setClipMeta((prev) => {
      const next = { ...prev };
      for (const clips of Object.values(clipsByChoreo))
        for (const clip of clips)
          if (clip.isNew)
            next[clip.id] = { ...(next[clip.id] || {}), isNew: false };
      return next;
    });
  };
  const setClipAngle = (angleClipId, angle) =>
    setClipMeta((prevMetaAngle) => ({
      ...prevMetaAngle,
      [angleClipId]: {
        ...(prevMetaAngle[angleClipId] || {}),
        angle,
      },
    }));
  const uploadClip = (uploadBlockId, uploadFile) => {
    const uploadId = `u${Date.now().toString(36)}`;
    const uploadTitle =
      uploadFile.name
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]+/g, " ")
        .trim() || "Vídeo sin título";
    const objectUrl = URL.createObjectURL(uploadFile);
    setUploads((prevUploads) => [
      ...prevUploads,
      {
        id: uploadId,
        block: uploadBlockId,
        rel: 1,
        title: uploadTitle,
        type: "upload",
        angle: "frente",
        src: objectUrl,
        isNew: true,
      },
    ]);
    setSelections((prevSelUpload) => ({
      ...prevSelUpload,
      [choreoId]: {
        blockId: uploadBlockId,
        clipId: uploadId,
      },
    }));
  };
  const removeUpload = (removeClipId) => {
    setUploads((prevUploadsRm) => {
      const removedClip = prevUploadsRm.find(
        (uploadProbe) => uploadProbe.id === removeClipId,
      );
      if (removedClip) {
        URL.revokeObjectURL(removedClip.src);
      }
      return prevUploadsRm.filter((ye) => ye.id !== removeClipId);
    });
    const curSel = selections[choreoId];
    if (curSel && curSel.clipId === removeClipId) {
      setSelections((prevSelRm) => ({
        ...prevSelRm,
        [choreoId]: {
          ...curSel,
          clipId: `m-${curSel.blockId}`,
        },
      }));
    }
  };
  const uploadSong = (songFile) => {
    const oldSong = songs[choreoId];
    if (oldSong) {
      URL.revokeObjectURL(oldSong.src);
    }
    setSongs((prevSongs) => ({
      ...prevSongs,
      [choreoId]: {
        src: URL.createObjectURL(songFile),
        name: songFile.name.replace(/\.[^.]+$/, ""),
      },
    }));
    setSync((prevSync) =>
      prevSync[choreoId]
        ? prevSync
        : {
            ...prevSync,
            [choreoId]: {
              bpm: activeChoreo.bpm,
              offset: 0,
              synced: false,
            },
          },
    );
  };
  const applyState = (nextState) => {
    setMode(nextState.mode);
    setDancerId(nextState.me);
    setChoreoId(nextState.choreoId);
    setView(nextState.view);
    setPrefs(nextState.prefs);
    setChoreos(nextState.choreos);
    setClipMeta(nextState.clipMeta);
    setLastClass(nextState.lastClass);
    setSeen(nextState.seen);
    setHard(nextState.hard);
    setCodes(nextState.codes);
    setVocab(nextState.vocab);
    setSync(nextState.sync);
    setSelections(nextState.sel);
    setRhythms(nextState.rhythms);
    setTallerId(null);
    setInstruments(nextState.instruments);
    setWarmup(nextState.warmup);
    setPractice(nextState.practice);
    setUploads([]);
    setSongs({});
  };
  const snapshotState = () => ({
    v: 4,
    mode,
    me: dancerId,
    choreoId: null,
    view,
    prefs,
    choreos,
    clipMeta,
    lastClass,
    seen,
    codes,
    vocab,
    sync,
    sel: selections,
    rhythms,
    tallerId: null,
    instruments,
    hard,
    warmup,
    practice,
  });
  const importBackup = (importedState) => {
    uploads.forEach((uploadToRevoke) =>
      URL.revokeObjectURL(uploadToRevoke.src),
    );
    Object.values(songs).forEach((songToRevoke) =>
      URL.revokeObjectURL(songToRevoke.src),
    );
    applyState({
      ...migrateState(importedState),
      mode: "coreo",
    });
    window.scrollTo(0, 0);
  };
  const resetDemo = () => {
    uploads.forEach((uploadRevoke) => URL.revokeObjectURL(uploadRevoke.src));
    Object.values(songs).forEach((songRevoke) =>
      URL.revokeObjectURL(songRevoke.src),
    );
    applyState(createDefaultState());
    window.scrollTo(0, 0);
  };
  const isCoreo = mode === "coreo";
  const voiceAvailable = isSpeechSupported();
  // The coreógrafa/bailarina switch only exists in the demo. On phones it lives in a bar that
  // scrolls away, so the sticky header fits in one row and leaves room for the player and map.
  const warmupPanel = (
    <WarmupPanel
      warmup={warmup}
      setWarmup={setWarmup}
      mode={mode}
      onStart={() => setWarmupOpen(true)}
    />
  );
  const viewSwitch = (
    <div
      className="seg seg-mode"
      role="radiogroup"
      aria-label="Vista de la demo"
    >
      {[
        ["coreo", "Coreógrafa"],
        ["bailarina", "Bailarina"],
      ].map(([modeValue, modeLabel]) => (
        <button
          key={modeValue}
          type="button"
          role="radio"
          aria-checked={mode === modeValue}
          className="seg-btn"
          onClick={() => setMode(modeValue)}
        >
          {modeLabel}
        </button>
      ))}
    </div>
  );
  return (
    <div className={`app mode-${mode}`}>
      {!wideHeader && (
        <div className="demo-bar">
          <div className="wrap">
            <span className="f-label">Demo · ver como</span>
            {viewSwitch}
          </div>
        </div>
      )}
      <header className="hdr">
        <div className="wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:gap-x-5">
          <div className="flex min-w-0 items-baseline gap-3">
            <button
              type="button"
              className="f-display text-[1.6rem] uppercase leading-none text-ink sm:text-[2rem]"
              onClick={goHome}
              aria-label="Contratiempo: volver al repertorio"
            >
              Contratiempo
            </button>
            {(activeChoreo || workshopRhythm) && (
              <span className="hidden truncate font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:inline">
                {"/ "}
                {workshopRhythm ? "Taller de txalaparta" : activeChoreo.title}
              </span>
            )}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {!isCoreo && dancerId && (
              <span className="who">
                <span
                  className="tape-dot"
                  style={{
                    background: findDancerById(dancerId).tape,
                  }}
                />
                {findDancerById(dancerId).name}
                <button
                  type="button"
                  className="who-out"
                  onClick={() => {
                    setDancerId(null);
                    setChoreoId(null);
                  }}
                >
                  Salir
                </button>
              </span>
            )}
            {hasAccess && (
              <button
                type="button"
                className="btn"
                aria-pressed={!!workshopRhythm}
                aria-label="Taller de txalaparta"
                onClick={() => (workshopRhythm ? goHome() : openWorkshop(null))}
              >
                <Icon name="txala" />
                <span className="hidden sm:inline">Txalaparta</span>
              </button>
            )}
            {isCoreo && (
              <button
                type="button"
                className="btn"
                aria-label="Mando del modo clase"
                title="Maneja desde el móvil la pantalla en modo clase"
                onClick={() => setRemoteOpen(true)}
              >
                <Icon name="remote" />
                <span className="hidden sm:inline">Mando</span>
              </button>
            )}
            {wideHeader && viewSwitch}
          </div>
        </div>
      </header>
      <main className="wrap flex flex-col gap-5 pb-10 pt-5 sm:pt-6">
        {hasAccess ? (
          workshopRhythm ? (
            <TxalapartaWorkshop
              key={workshopRhythm.id}
              rhythm={workshopRhythm}
              rhythms={rhythms}
              choreos={
                isCoreo
                  ? choreos
                  : choreos.filter(
                      (visibleChoreo) => visibleChoreo.status !== "Borrador",
                    )
              }
              mode={mode}
              instruments={instruments}
              setInstruments={setInstruments}
              vocab={vocab}
              onPractice={logPractice}
              updateRhythm={updateRhythm}
              onOpen={(workshopOpenId) => setTallerId(workshopOpenId)}
              onCreate={addNewRhythm}
              onDuplicate={duplicateRhythm}
              onDelete={deleteRhythm}
              onAssign={assignRhythm}
              onUnassign={unassignRhythm}
              onOpenBlock={(blockChoreoId, blockToOpenId) =>
                openChoreo(blockChoreoId, {
                  blockId: blockToOpenId,
                  clipId: `m-${blockToOpenId}`,
                  focus: "map",
                })
              }
              onBack={goHome}
            />
          ) : activeChoreo ? (
            <ChoreographyPage
              choreo={activeChoreo}
              derived={derivedById[activeChoreo.id]}
              sel={selections[activeChoreo.id] || {}}
              mode={mode}
              me={dancerId}
              view={view}
              setView={setView}
              prefs={prefs}
              setPrefs={setPrefs}
              vocab={vocab}
              seen={seen[dancerId] || []}
              song={songs[activeChoreo.id] || null}
              sync={
                sync[activeChoreo.id] || {
                  bpm: activeChoreo.bpm,
                  offset: 0,
                  synced: false,
                }
              }
              playReq={playRequest}
              playerRef={playerRef}
              mapRef={mapRef}
              onBack={goHome}
              rhythms={rhythms}
              onOpenRhythm={openWorkshop}
              bank={stepBank}
              hard={hard}
              onPractice={logPractice}
              actions={{
                toggleHard: (hardClipId) =>
                  setHard((prevHard) => {
                    const myHardList = prevHard[dancerId] || [];
                    return {
                      ...prevHard,
                      [dancerId]: myHardList.includes(hardClipId)
                        ? myHardList.filter(
                            (hardItem) => hardItem !== hardClipId,
                          )
                        : [...myHardList, hardClipId],
                    };
                  }),
                setShow: (showInfo, showWeek) =>
                  updateChoreo(activeChoreo.id, (choreoShow) => ({
                    ...choreoShow,
                    show: showInfo,
                    week: showWeek,
                  })),
                setLogistics: (logisticsInfo) =>
                  updateChoreo(activeChoreo.id, (choreoLogistics) => ({
                    ...choreoLogistics,
                    logistics: logisticsInfo,
                  })),
                setFormation: (formBlockId, formPositions, formName) =>
                  updateChoreo(activeChoreo.id, (choreoForm) => ({
                    ...choreoForm,
                    formations: {
                      ...choreoForm.formations,
                      [formBlockId]: formPositions,
                    },
                    blocks: choreoForm.blocks.map((blockForm) =>
                      blockForm.id === formBlockId && formName
                        ? {
                            ...blockForm,
                            formation: formName,
                          }
                        : blockForm,
                    ),
                  })),
                addLink: (linkBlockId, linkSrcId) =>
                  updateChoreo(activeChoreo.id, (choreoLink) => ({
                    ...choreoLink,
                    links: [
                      ...(choreoLink.links || []),
                      {
                        id: `k${Date.now().toString(36)}`,
                        src: linkSrcId,
                        block: linkBlockId,
                        rel: 1,
                      },
                    ],
                  })),
                removeLink: (linkId) =>
                  updateChoreo(activeChoreo.id, (choreoUnlink) => ({
                    ...choreoUnlink,
                    links: (choreoUnlink.links || []).filter(
                      (linkItem) => linkItem.id !== linkId,
                    ),
                  })),
                markSeen,
                playClip,
                focusBlock,
                setBlockId: selectBlock,
                setPos: setDancerPos,
                copyPrev: copyPrevFormation,
                updateBlock,
                removeBlock,
                moveBlock,
                addBlock,
                toggleNew,
                setAngle: setClipAngle,
                onUpload: uploadClip,
                removeUpload,
                onSongUpload: uploadSong,
                saveSync: (syncData) =>
                  setSync((prevSyncSave) => ({
                    ...prevSyncSave,
                    [activeChoreo.id]: syncData,
                  })),
                setStatus: (newStatus) =>
                  updateChoreo(activeChoreo.id, (choreoStatus) => ({
                    ...choreoStatus,
                    status: newStatus,
                  })),
              }}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="f-label">
                    {isCoreo
                      ? "Tu grupo de claqué · 6 bailarinas"
                      : "Estudio en casa"}
                  </p>
                  <h1 className="f-display mt-1 text-[2.6rem] uppercase leading-[0.9] [text-wrap:balance] sm:text-[3.2rem]">
                    {isCoreo
                      ? "Hola, profe"
                      : `Hola, ${findDancerById(dancerId).name}`}
                  </h1>
                </div>
              </div>
              {isCoreo ? (
                <>
                  <RepertoireGrid
                    choreos={choreos}
                    clipsById={clipsByChoreo}
                    mode={mode}
                    me={dancerId}
                    onOpen={(repChoreoId) => openChoreo(repChoreoId)}
                    onCreate={addNewChoreo}
                  />
                  <TxalapartaHomeCard
                    rhythms={rhythms}
                    instruments={instruments}
                    onOpen={openWorkshop}
                  />
                  <div className="home-grid">
                    <LastClassLog
                      choreos={choreos}
                      clipsById={clipsByChoreo}
                      lastClass={lastClass}
                      setLastClass={setLastClass}
                      onClearNew={clearNewMarks}
                    />
                    <DancerCodesPanel codes={codes} setCodes={setCodes} />
                  </div>
                  <DancerFollowUp
                    choreos={choreos}
                    clipsById={clipsByChoreo}
                    lastClass={lastClass}
                    seen={seen}
                    hard={hard}
                    onOpenClip={(clipChoreoId, clipToOpen) =>
                      openChoreo(clipChoreoId, {
                        blockId: clipToOpen.block,
                        clipId: clipToOpen.id,
                        focus: "player",
                      })
                    }
                  />
                  <StepBankPanel
                    bank={stepBank}
                    onOpenUse={(useChoreoId, useBlockId) =>
                      openChoreo(useChoreoId, {
                        blockId: useBlockId,
                        focus: "map",
                      })
                    }
                  />
                  <div className="home-grid">
                    {warmupPanel}
                    <ImprovRoulettePanel
                      vocab={vocab}
                      onStart={setImprovSettings}
                    />
                  </div>
                  <StepDictionary vocab={vocab} setVocab={setVocab} />
                  <BackupPanel
                    getState={snapshotState}
                    onImport={importBackup}
                  />
                </>
              ) : (
                <>
                  <MissedClassSummary
                    me={dancerId}
                    choreos={choreos}
                    clipsById={clipsByChoreo}
                    lastClass={lastClass}
                    seen={seen}
                    onOpenItem={openReviewItem}
                  />
                  <UpcomingShowCard
                    choreos={choreos}
                    onFull={(fullChoreoId) =>
                      openChoreo(fullChoreoId, {
                        clipId: `full-${fullChoreoId}`,
                        play: true,
                      })
                    }
                  />
                  <HardStepsPanel
                    choreos={choreos}
                    clipsById={clipsByChoreo}
                    hardIds={(hard || {})[dancerId] || []}
                    onOpenClip={(clipChoreoId, clipToOpen) =>
                      openChoreo(clipChoreoId, {
                        blockId: clipToOpen.block,
                        clipId: clipToOpen.id,
                        play: true,
                      })
                    }
                  />
                  <div className="home-grid">
                    {warmupPanel}
                    <PracticeStatsPanel log={practice[dancerId]} />
                  </div>
                  <RepertoireGrid
                    choreos={choreos}
                    clipsById={clipsByChoreo}
                    mode={mode}
                    me={dancerId}
                    onOpen={(dancerRepChoreoId) =>
                      openChoreo(dancerRepChoreoId)
                    }
                    onCreate={addNewChoreo}
                  />
                  <TxalapartaHomeCard
                    rhythms={rhythms}
                    instruments={instruments}
                    onOpen={openWorkshop}
                  />
                  <ImprovRoulettePanel
                    vocab={vocab}
                    onStart={setImprovSettings}
                  />
                </>
              )}
            </>
          )
        ) : (
          <DancerLogin
            codes={codes}
            onLogin={(loginId) => {
              setDancerId(loginId);
              setChoreoId(null);
            }}
          />
        )}
        {remoteOpen && <ClassModeRemote onClose={() => setRemoteOpen(false)} />}
        {improvSettings && (
          <ImprovRouletteRunner
            settings={improvSettings}
            vocab={vocab}
            voice={voiceAvailable}
            onPractice={logPractice}
            onClose={() => setImprovSettings(null)}
          />
        )}
        {warmupOpen && (
          <WarmupRunner
            warmup={warmup}
            voice={voiceAvailable}
            onPractice={logPractice}
            onClose={() => setWarmupOpen(false)}
          />
        )}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-[13px] text-muted">
          <p className="max-w-[65ch]">
            Demo con datos de ejemplo. Los cambios se guardan solo en este
            navegador; los vídeos y canciones subidos, solo mientras la pestaña
            esté abierta.
          </p>
          <ConfirmButton
            label="Restaurar datos de ejemplo"
            confirmLabel="Pulsa otra vez para restaurar"
            onConfirm={resetDemo}
          />
        </footer>
        {!isCoreo && dancerId && choreoId && reviewPos != null && (
          <div className="review-bar-space" aria-hidden="true" />
        )}
      </main>
      {!isCoreo && dancerId && choreoId && (
        <ReviewBar
          items={reviewItems}
          pos={reviewPos}
          onGo={openReviewItem}
          onClose={goHome}
        />
      )}
    </div>
  );
}
