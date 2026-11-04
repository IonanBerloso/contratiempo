// Rehearsal video with the counts drawn on top: tap the first 1, set the bpm, export a copy with the overlay.
import { useEffect, useRef, useState } from "react";
import { saveFile, slugifyFilename } from "../lib/claude.js";
import {
  countOverlayAtTime,
  drawCountOverlay,
  medianOf,
  pickRecorderMimeType,
} from "../lib/rehearsalOverlay.js";
import { Icon } from "./ui/Icon.jsx";
export function RehearsalCountsVideo({ choreo, derived, vocab }) {
  const [videoFile, setVideoFile] = useState(null);
  const [sync, setSync] = useState({
    offset: null,
    bpm: choreo.bpm,
  });
  const [taps, setTaps] = useState([]);
  const [exportProgress, setExportProgress] = useState(null);
  const [statusText, setStatusText] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cancelExportRef = useRef(false);
  const syncRef = useRef(sync);
  syncRef.current = sync;
  useEffect(
    () => () => videoFile && URL.revokeObjectURL(videoFile.src),
    [videoFile],
  );
  const overlayAt = (videoTime) =>
    countOverlayAtTime(
      videoTime,
      syncRef.current,
      choreo,
      derived.ranges,
      derived.clips,
      vocab,
    );
  useEffect(() => {
    if (!videoFile) return;
    let frameId = 0;
    const drawFrame = () => {
      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      if (videoEl && canvasEl) {
        const box = videoEl.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const srcW = videoEl.videoWidth || 16;
        const srcH = videoEl.videoHeight || 9;
        const fitScale = Math.min(box.width / srcW, box.height / srcH);
        const drawW = Math.max(1, Math.round(srcW * fitScale));
        const drawH = Math.max(1, Math.round(srcH * fitScale));
        if (
          canvasEl.width !== Math.round(drawW * dpr) ||
          canvasEl.height !== Math.round(drawH * dpr)
        ) {
          canvasEl.width = Math.round(drawW * dpr);
          canvasEl.height = Math.round(drawH * dpr);
          canvasEl.style.width = `${drawW}px`;
          canvasEl.style.height = `${drawH}px`;
        }
        const liveCtx = canvasEl.getContext("2d");
        liveCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        drawCountOverlay(
          liveCtx,
          canvasEl.width,
          canvasEl.height,
          overlayAt(videoEl.currentTime),
        );
      }
      frameId = requestAnimationFrame(drawFrame);
    };
    frameId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(frameId);
  }, [videoFile, choreo, derived, vocab]);
  const handleTap = () => {
    const player = videoRef.current;
    if (!player) return;
    if (player.paused) {
      player.play().catch(() => {});
      return;
    }
    const tapTime = player.currentTime;
    setTaps((prevTaps) => {
      const nextTaps =
        prevTaps.length && tapTime - prevTaps[prevTaps.length - 1] > 2
          ? [tapTime]
          : [...prevTaps, tapTime];
      const nextSync = {
        ...syncRef.current,
        offset: nextTaps[0],
      };
      if (nextTaps.length >= 4) {
        const tapInterval = medianOf(
          nextTaps.slice(1).map((tapAt, tapIdx) => tapAt - nextTaps[tapIdx]),
        );
        if (tapInterval > 0.2 && tapInterval < 1.5) {
          nextSync.bpm = Math.round((60 / tapInterval) * 2) / 2;
        }
      }
      setSync(nextSync);
      return nextTaps;
    });
  };
  const exportVideo = async () => {
    if (!videoFile) return;
    const mimeType = pickRecorderMimeType();
    if (mimeType === null) {
      setStatusText(
        "Este navegador no puede grabar vídeo. Prueba con Chrome o Safari actualizados.",
      );
      return;
    }
    setStatusText(null);
    cancelExportRef.current = false;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    const exportEl = document.createElement("video");
    exportEl.src = videoFile.src;
    exportEl.playsInline = true;
    exportEl.preload = "auto";
    let audioCtx = null;
    const cleanup = () => {
      try {
        exportEl.pause();
        exportEl.removeAttribute("src");
        exportEl.load();
      } catch {}
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtor();
      const mediaSource = audioCtx.createMediaElementSource(exportEl);
      const audioDest = audioCtx.createMediaStreamDestination();
      mediaSource.connect(audioDest);
      setExportProgress({
        pct: 0,
      });
      await exportEl.play();
      exportEl.pause();
      exportEl.currentTime = 0;
      await new Promise((resolveSeek) => {
        exportEl.onseeked = resolveSeek;
        setTimeout(resolveSeek, 800);
      });
      const srcWidth = exportEl.videoWidth || 1280;
      const srcHeight = exportEl.videoHeight || 720;
      const downscale = Math.min(1, 1280 / Math.max(srcWidth, srcHeight));
      const outW = Math.round((srcWidth * downscale) / 2) * 2;
      const outH = Math.round((srcHeight * downscale) / 2) * 2;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = outW;
      exportCanvas.height = outH;
      const exportCtx = exportCanvas.getContext("2d");
      const canvasStream = exportCanvas.captureStream(30);
      audioDest.stream
        .getAudioTracks()
        .forEach((audioTrack) => canvasStream.addTrack(audioTrack));
      const recorder = new MediaRecorder(
        canvasStream,
        mimeType
          ? {
              mimeType,
              videoBitsPerSecond: 35e5,
            }
          : undefined,
      );
      const chunks = [];
      recorder.ondataavailable = (dataEvent) =>
        dataEvent.data && dataEvent.data.size && chunks.push(dataEvent.data);
      const recorderStopped = new Promise(
        (resolveStop) => (recorder.onstop = resolveStop),
      );
      if (
        (exportCtx.drawImage(exportEl, 0, 0, outW, outH),
        drawCountOverlay(exportCtx, outW, outH, overlayAt(0)),
        recorder.start(500),
        await audioCtx.resume(),
        await exportEl.play(),
        await new Promise((resolveDone) => {
          const pumpFrame = () => {
            if (cancelExportRef.current || exportEl.ended) return resolveDone();
            exportCtx.drawImage(exportEl, 0, 0, outW, outH);
            drawCountOverlay(
              exportCtx,
              outW,
              outH,
              overlayAt(exportEl.currentTime),
            );
            setExportProgress({
              pct: exportEl.duration
                ? Math.round((exportEl.currentTime / exportEl.duration) * 100)
                : 0,
            });
            requestAnimationFrame(pumpFrame);
          };
          exportEl.onended = resolveDone;
          requestAnimationFrame(pumpFrame);
        }),
        recorder.stop(),
        await recorderStopped,
        cleanup(),
        cancelExportRef.current)
      ) {
        setExportProgress(null);
        return;
      }
      const recordedMime = recorder.mimeType || mimeType || "video/webm";
      const fileExt = /mp4/.test(recordedMime) ? "mp4" : "webm";
      const videoBlob = new Blob(chunks, {
        type: recordedMime.split(";")[0],
      });
      setExportProgress(null);
      setStatusText(
        await saveFile(
          `ensayo-con-cuentas-${slugifyFilename(choreo.title)}.${fileExt}`,
          videoBlob,
        ),
      );
    } catch {
      cleanup();
      setExportProgress(null);
      setStatusText("No se ha podido preparar el vídeo en este navegador.");
    }
  };
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Vídeo del ensayo con cuentas"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">Grabación de clase</p>
          <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
            Vídeo del ensayo con cuentas
          </h2>
        </div>
        <label className="btn btn-file">
          <Icon name="upload" />
          {videoFile ? "Cambiar vídeo" : "Subir vídeo del ensayo"}
          <input
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(videoPick) => {
              const pickedFile =
                videoPick.target.files && videoPick.target.files[0];
              videoPick.target.value = "";
              if (pickedFile) {
                setVideoFile({
                  src: URL.createObjectURL(pickedFile),
                  name: pickedFile.name.replace(/\.[^.]+$/, ""),
                });
                setSync({
                  offset: null,
                  bpm: choreo.bpm,
                });
                setTaps([]);
                setStatusText(null);
              }
            }}
          />
        </label>
      </div>
      {videoFile ? (
        <>
          <div
            className="rh-screen"
            style={{
              aspectRatio: String(aspectRatio),
            }}
          >
            <video
              ref={videoRef}
              src={videoFile.src}
              controls={true}
              playsInline={true}
              preload="metadata"
              className="rh-video"
              onLoadedMetadata={(metaEvent) =>
                metaEvent.target.videoWidth &&
                setAspectRatio(
                  metaEvent.target.videoWidth / metaEvent.target.videoHeight,
                )
              }
            />
            <canvas ref={canvasRef} className="rh-canvas" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-primary rh-tap"
              onClick={handleTap}
            >
              <Icon name="flag" />
              {sync.offset == null
                ? "Toca en cada cuenta desde el primer 1"
                : `Toca al ritmo (${taps.length} ${taps.length === 1 ? "toque" : "toques"})`}
            </button>
            {sync.offset != null && (
              <>
                <span className="font-mono text-[12px] tabular-nums text-ink">
                  {"1 en "}
                  {sync.offset.toFixed(2)}
                  {" s"}
                </span>
                <button
                  type="button"
                  className="btn btn-xs"
                  aria-label="Adelantar las cuentas"
                  onClick={() =>
                    setSync((prevSync) => ({
                      ...prevSync,
                      offset: prevSync.offset - 0.05,
                    }))
                  }
                >
                  −0,05 s
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  aria-label="Retrasar las cuentas"
                  onClick={() =>
                    setSync((prevSync) => ({
                      ...prevSync,
                      offset: prevSync.offset + 0.05,
                    }))
                  }
                >
                  +0,05 s
                </button>
                <span className="font-mono text-[12px] tabular-nums text-ink">
                  {sync.bpm}
                  {" bpm"}
                </span>
                <button
                  type="button"
                  className="btn btn-xs"
                  aria-label="Bajar el tempo"
                  onClick={() =>
                    setSync((prevSync) => ({
                      ...prevSync,
                      bpm: Math.round((prevSync.bpm - 0.5) * 2) / 2,
                    }))
                  }
                >
                  −
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  aria-label="Subir el tempo"
                  onClick={() =>
                    setSync((prevSync) => ({
                      ...prevSync,
                      bpm: Math.round((prevSync.bpm + 0.5) * 2) / 2,
                    }))
                  }
                >
                  +
                </button>
              </>
            )}
          </div>
          <p className="text-[12px] text-muted">
            Dale al play y toca el botón en el 1, 2, 3, 4… de la primera cuenta:
            con cuatro toques ya calcula el tempo real del ensayo. Si las
            cuentas van un pelín adelantadas o atrasadas, ajústalas.
          </p>
          {sync.offset != null && (
            <div className="flex flex-wrap items-center gap-2">
              {exportProgress ? (
                <>
                  <div className="progress rh-progress" aria-hidden="true">
                    <span
                      style={{
                        width: `${exportProgress.pct}%`,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[12px] tabular-nums text-ink"
                    role="status"
                  >
                    {"Preparando… "}
                    {exportProgress.pct}%
                  </span>
                  <button
                    type="button"
                    className="btn btn-xs"
                    onClick={() => (cancelExportRef.current = true)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="button" className="btn" onClick={exportVideo}>
                  <Icon name="download" />
                  Descargar con las cuentas
                </button>
              )}
              {!exportProgress && (
                <span className="text-[12px] text-muted">
                  Tarda lo mismo que dura el vídeo. Compártelo solo en el grupo
                  de clase.
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="max-w-[70ch] text-[13px] text-muted">
          Sube el vídeo de un pase entero. Marcas dónde cae el primer 1 tocando
          al ritmo y la app pone encima las cuentas, el bloque y el paso. Luego
          puedes descargarlo así para mandarlo al grupo. El vídeo no sale de
          este dispositivo.
        </p>
      )}
      {statusText && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {statusText}
        </p>
      )}
    </section>
  );
}
