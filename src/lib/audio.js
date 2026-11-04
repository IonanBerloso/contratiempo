let sharedAudioContext = null;
let masterGain = null;
let sharedNoiseBuffer = null;
export let audioMuted = false;
let keepAliveAudioEl = null;
let keepAliveWanted = false;
let keepAlivePauseTimer = null;
let scheduledSoundTime = null;
const soundStartTime = () =>
  scheduledSoundTime != null
    ? Math.max(sharedAudioContext.currentTime, scheduledSoundTime)
    : sharedAudioContext.currentTime;
export const audioNow = () =>
  sharedAudioContext ? sharedAudioContext.currentTime : 0;
export const audioOutputLatency = () =>
  sharedAudioContext
    ? (sharedAudioContext.outputLatency || 0) +
      (sharedAudioContext.baseLatency || 0)
    : 0;
const resumeAudioContext = () => {
  if (!(
    !sharedAudioContext ||
    sharedAudioContext.state === "running" ||
    sharedAudioContext.state === "closed"
  ))
    try {
      const resumePromise = sharedAudioContext.resume();
      if (resumePromise && resumePromise.catch) {
        resumePromise.catch(() => {});
      }
    } catch {}
};
function isAppleMobileDevice() {
  try {
    const userAgent = navigator.userAgent || "";
    return (
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  } catch {
    return false;
  }
}
function createSilentWavUrl() {
  const wavBuffer = new ArrayBuffer(4044);
  const view = new DataView(wavBuffer);
  const writeAscii = (offset, text) => {
    for (let s = 0; s < text.length; s++)
      view.setUint8(offset + s, text.charCodeAt(s));
  };
  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + 2e3 * 2, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8e3, true);
  view.setUint32(28, 8e3 * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(36, "data");
  view.setUint32(40, 2e3 * 2, true);
  return URL.createObjectURL(
    new Blob([wavBuffer], {
      type: "audio/wav",
    }),
  );
}
function playKeepAliveLoop() {
  if (!(!keepAliveAudioEl || !keepAliveAudioEl.paused))
    try {
      const playPromise = keepAliveAudioEl.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {});
      }
    } catch {}
}
function ensureKeepAliveLoop() {
  if (isAppleMobileDevice())
    try {
      if (!keepAliveAudioEl) {
        keepAliveAudioEl = document.createElement("audio");
        keepAliveAudioEl.src = createSilentWavUrl();
        keepAliveAudioEl.loop = true;
        keepAliveAudioEl.preload = "auto";
        keepAliveAudioEl.setAttribute("playsinline", "");
        keepAliveAudioEl.setAttribute("webkit-playsinline", "");
        keepAliveAudioEl.setAttribute("x-webkit-airplay", "deny");
        keepAliveAudioEl.disableRemotePlayback = true;
      }
      playKeepAliveLoop();
    } catch {}
}
function createNoiseBuffer(ctx) {
  const frameCount = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) channelData[i] = Math.random() * 2 - 1;
  return buffer;
}
export function unlockAudio() {
  keepAliveWanted = true;
  clearTimeout(keepAlivePauseTimer);
  try {
    if (navigator.audioSession && navigator.audioSession.type !== "playback") {
      navigator.audioSession.type = "playback";
    }
  } catch {}
  ensureKeepAliveLoop();
  try {
    if (!sharedAudioContext) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      sharedAudioContext = new AudioContextClass();
      masterGain = sharedAudioContext.createGain();
      masterGain.gain.value = audioMuted ? 0 : 0.9;
      masterGain.connect(sharedAudioContext.destination);
      sharedNoiseBuffer = createNoiseBuffer(sharedAudioContext);
    }
    resumeAudioContext();
    const silentSource = sharedAudioContext.createBufferSource();
    silentSource.buffer = sharedAudioContext.createBuffer(
      1,
      1,
      sharedAudioContext.sampleRate,
    );
    silentSource.connect(sharedAudioContext.destination);
    silentSource.start(0);
  } catch {
    return null;
  }
  return sharedAudioContext;
}
export function setAudioKeepAlive(active) {
  keepAliveWanted = active;
  clearTimeout(keepAlivePauseTimer);
  if (keepAliveAudioEl) {
    if (active) {
      playKeepAliveLoop();
    } else {
      keepAlivePauseTimer = setTimeout(() => {
        if (!keepAliveWanted && keepAliveAudioEl && !keepAliveAudioEl.paused) {
          keepAliveAudioEl.pause();
        }
      }, 600);
    }
  }
}
if (typeof window != "undefined") {
  const onUserGesture = () => {
    resumeAudioContext();
    if (keepAliveWanted) {
      playKeepAliveLoop();
    }
  };
  ["touchend", "click", "keydown"].forEach((eventType) =>
    window.addEventListener(eventType, onUserGesture, true),
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (keepAliveAudioEl && !keepAliveAudioEl.paused) {
        keepAliveAudioEl.pause();
      }
    } else if (keepAliveWanted) {
      resumeAudioContext();
    }
  });
}
export function setAudioMuted(muted) {
  audioMuted = muted;
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : 0.9;
  }
}
function playNoiseBurst({
  freq,
  q = 2,
  dur = 0.05,
  gain = 0.8,
  type = "bandpass",
  attack = 0.001,
}) {
  const startTime = soundStartTime();
  const source = sharedAudioContext.createBufferSource();
  source.buffer = sharedNoiseBuffer;
  const filter = sharedAudioContext.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const envelope = sharedAudioContext.createGain();
  envelope.gain.setValueAtTime(1e-4, startTime);
  envelope.gain.exponentialRampToValueAtTime(gain, startTime + attack);
  envelope.gain.exponentialRampToValueAtTime(1e-4, startTime + attack + dur);
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(masterGain);
  source.start(startTime, Math.random() * 0.2);
  source.stop(startTime + attack + dur + 0.03);
}
function playTone(
  frequency,
  duration = 0.04,
  peakGain = 0.25,
  waveType = "triangle",
) {
  const startTime = soundStartTime();
  const oscillator = sharedAudioContext.createOscillator();
  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  const envelope = sharedAudioContext.createGain();
  envelope.gain.setValueAtTime(1e-4, startTime);
  envelope.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.001);
  envelope.gain.exponentialRampToValueAtTime(1e-4, startTime + duration);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}
function playKickDrum() {
  const startTime = soundStartTime();
  const oscillator = sharedAudioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(130, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(48, startTime + 0.12);
  const envelope = sharedAudioContext.createGain();
  envelope.gain.setValueAtTime(1e-4, startTime);
  envelope.gain.exponentialRampToValueAtTime(0.32, startTime + 0.004);
  envelope.gain.exponentialRampToValueAtTime(1e-4, startTime + 0.22);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.25);
}
function playBassNote(frequency) {
  const startTime = soundStartTime();
  const oscillator = sharedAudioContext.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  const filter = sharedAudioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  const envelope = sharedAudioContext.createGain();
  envelope.gain.setValueAtTime(1e-4, startTime);
  envelope.gain.exponentialRampToValueAtTime(0.3, startTime + 0.01);
  envelope.gain.exponentialRampToValueAtTime(1e-4, startTime + 0.38);
  oscillator.connect(filter);
  filter.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.4);
}
function playTxalapartaHit(hit) {
  const isHerren = !!(hit && hit.hr);
  const isStone = !!(hit && hit.stone);
  const baseFreq =
    ((hit && hit.f) || 220) * (isHerren ? 1.015 : 1) * (isStone ? 1.9 : 1);
  const startTime = soundStartTime();
  const partials = isStone
    ? [
        [1, 0.4, 0.95],
        [2.76, 0.26, 0.55],
        [5.4, 0.15, 0.3],
        [8.93, 0.07, 0.16],
      ]
    : [
        [1, 0.5, 0.34],
        [2.76, 0.2, 0.15],
        [5.4, 0.09, 0.07],
      ];
  for (let [ratio, partialGain, decay] of partials) {
    const oscillator = sharedAudioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      baseFreq * ratio * (isStone ? 1.01 : 1.03),
      startTime,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      baseFreq * ratio,
      startTime + 0.025,
    );
    const envelope = sharedAudioContext.createGain();
    envelope.gain.setValueAtTime(1e-4, startTime);
    envelope.gain.exponentialRampToValueAtTime(partialGain, startTime + 0.002);
    envelope.gain.exponentialRampToValueAtTime(1e-4, startTime + decay);
    oscillator.connect(envelope);
    envelope.connect(masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + decay + 0.03);
  }
  playNoiseBurst(
    isStone
      ? {
          freq: 4600,
          q: 1.4,
          dur: 0.012,
          gain: 0.5,
        }
      : {
          freq: isHerren ? 2900 : 2300,
          q: 1.2,
          dur: 0.018,
          gain: 0.42,
        },
  );
}
export function playSound(sound, arg, when) {
  if (!(!sharedAudioContext || !masterGain || audioMuted)) {
    scheduledSoundTime = when != null ? when : null;
    try {
      const sampleKey =
        (arg && arg.key) || (arg == null ? FOOT_SAMPLE_KEYS[sound] : null);
      if (sampleKey && recordedSamples.has(sampleKey)) {
        playRecordedSample(sampleKey, arg && arg.hr ? 1.015 : 1);
        return;
      }
      switch (sound) {
        case "tx":
          playTxalapartaHit(arg);
          break;
        case "kick":
          playKickDrum();
          break;
        case "snare":
          playNoiseBurst({
            freq: 1900,
            q: 0.8,
            dur: 0.12,
            gain: 0.16,
            attack: 0.004,
          });
          break;
        case "ride":
          playNoiseBurst({
            freq: 7e3,
            q: 0.6,
            dur: 0.16,
            gain: 0.07,
            type: "highpass",
          });
          playTone(5300, 0.12, 0.025, "sine");
          break;
        case "rideSoft":
          playNoiseBurst({
            freq: 7e3,
            q: 0.6,
            dur: 0.08,
            gain: 0.04,
            type: "highpass",
          });
          break;
        case "bass":
          playBassNote(arg || 110);
          break;
        case "click":
          playTone(1e3, 0.03, 0.16, "sine");
          break;
        case "clickHi":
          playTone(1560, 0.035, 0.22, "sine");
          break;
        case "brush":
          playNoiseBurst({
            freq: 3600,
            q: 0.7,
            dur: 0.07,
            gain: 0.34,
            type: "highpass",
            attack: 0.006,
          });
          playTone(3100, 0.02, 0.07);
          break;
        case "spank":
          playNoiseBurst({
            freq: 3200,
            q: 0.7,
            dur: 0.06,
            gain: 0.32,
            type: "highpass",
            attack: 0.005,
          });
          playTone(2800, 0.02, 0.07);
          break;
        case "scuff":
          playNoiseBurst({
            freq: 1300,
            q: 1.5,
            dur: 0.06,
            gain: 0.5,
            attack: 0.003,
          });
          break;
        case "heel":
        case "dig":
          playNoiseBurst({
            freq: 1700,
            q: 3,
            dur: 0.05,
            gain: 0.9,
          });
          playTone(940, 0.05, 0.22);
          break;
        case "stamp":
          playNoiseBurst({
            freq: 2200,
            q: 1.5,
            dur: 0.07,
            gain: 1,
          });
          playTone(1800, 0.05, 0.24);
          playTone(110, 0.12, 0.5, "sine");
          break;
        case "hop":
          playNoiseBurst({
            freq: 2500,
            q: 3,
            dur: 0.045,
            gain: 0.75,
          });
          playTone(2e3, 0.04, 0.2);
          break;
        default:
          playNoiseBurst({
            freq: 3100,
            q: 4,
            dur: 0.04,
            gain: 0.8,
          });
          playTone(2350, 0.045, 0.22);
      }
    } catch {
    } finally {
      scheduledSoundTime = null;
    }
  }
}
export async function renderSoundsToAudioFile(duration, schedule, onProgress) {
  const OfflineContextClass =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineContextClass || typeof MediaRecorder == "undefined")
    throw new Error("unsupported");
  const liveCtx = unlockAudio();
  if (!liveCtx || !liveCtx.createMediaStreamDestination)
    throw new Error("unsupported");
  const sampleRate = 44100;
  const offlineCtx = new OfflineContextClass(
    1,
    Math.ceil(duration * sampleRate),
    sampleRate,
  );
  const savedAudioState = [
    sharedAudioContext,
    masterGain,
    sharedNoiseBuffer,
    audioMuted,
  ];
  sharedAudioContext = offlineCtx;
  masterGain = offlineCtx.createGain();
  masterGain.gain.value = 0.9;
  masterGain.connect(offlineCtx.destination);
  sharedNoiseBuffer = createNoiseBuffer(offlineCtx);
  audioMuted = false;
  try {
    schedule((soundId, soundArg, atTime) =>
      playSound(soundId, soundArg, atTime),
    );
  } finally {
    [sharedAudioContext, masterGain, sharedNoiseBuffer, audioMuted] =
      savedAudioState;
  }
  const rendered = await offlineCtx.startRendering();
  const streamDest = liveCtx.createMediaStreamDestination();
  const playback = liveCtx.createBufferSource();
  playback.buffer = rendered;
  playback.connect(streamDest);
  const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find(
    (candidateType) =>
      MediaRecorder.isTypeSupported &&
      MediaRecorder.isTypeSupported(candidateType),
  );
  const recorder = new MediaRecorder(
    streamDest.stream,
    mimeType
      ? {
          mimeType,
        }
      : undefined,
  );
  const chunks = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size) {
      chunks.push(ev.data);
    }
  };
  const stopped = new Promise((resolveStop) => {
    recorder.onstop = resolveStop;
  });
  const ended = new Promise((resolveEnd) => {
    playback.onended = resolveEnd;
  });
  recorder.start(250);
  const playStart = liveCtx.currentTime;
  playback.start();
  const progressTimer = setInterval(
    () =>
      onProgress &&
      onProgress(
        Math.min(1, (liveCtx.currentTime - playStart) / rendered.duration),
      ),
    200,
  );
  await ended;
  clearInterval(progressTimer);
  recorder.stop();
  await stopped;
  const finalType = recorder.mimeType || mimeType || "audio/webm";
  return {
    blob: new Blob(chunks, {
      type: finalType,
    }),
    ext: finalType.includes("mp4") ? "mp4" : "webm",
  };
}
const SAMPLES_STORAGE_KEY = "contratiempo-sonidos-v1";
const recordedSamples = new Map();
const sampleListeners = new Set();
const sampleBufferCache = new WeakMap();
const FOOT_SAMPLE_KEYS = {
  stamp: "f0",
  heel: "f1",
  toe: "f2",
  brush: "f3",
};
let sampleStorageOk = true;
export function subscribeToSamples(listener) {
  sampleListeners.add(listener);
  return () => sampleListeners.delete(listener);
}
const notifySampleListeners = () =>
  sampleListeners.forEach((notify) => notify());
export const hasRecordedSample = (sampleKey) => recordedSamples.has(sampleKey);
export const isSampleStorageOk = () => sampleStorageOk;
function encodePcmBase64(samples) {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++)
    pcm[i] = Math.max(-1, Math.min(1, samples[i])) * 32767;
  const bytes = new Uint8Array(pcm.buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768)
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(offset, offset + 32768),
    );
  return btoa(binary);
}
function decodePcmBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const pcm = new Int16Array(bytes.buffer);
  const samples = new Float32Array(pcm.length);
  for (let j = 0; j < pcm.length; j++) samples[j] = pcm[j] / 32767;
  return samples;
}
export function exportRecordedSamples() {
  const serialized = {};
  for (let [sampleKey, sample] of recordedSamples)
    serialized[sampleKey] = {
      rate: sample.rate,
      b64: encodePcmBase64(sample.data),
    };
  return serialized;
}
function persistRecordedSamples() {
  try {
    localStorage.setItem(
      SAMPLES_STORAGE_KEY,
      JSON.stringify(exportRecordedSamples()),
    );
    sampleStorageOk = true;
  } catch {
    sampleStorageOk = false;
  }
}
export function importRecordedSamples(stored) {
  recordedSamples.clear();
  try {
    for (let sampleKey of Object.keys(stored || {}))
      recordedSamples.set(sampleKey, {
        rate: stored[sampleKey].rate,
        data: decodePcmBase64(stored[sampleKey].b64),
      });
  } catch {}
  persistRecordedSamples();
  notifySampleListeners();
}
export function loadRecordedSamples() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(SAMPLES_STORAGE_KEY) || "null",
    );
    if (!stored) return;
    for (let sampleKey of Object.keys(stored))
      recordedSamples.set(sampleKey, {
        rate: stored[sampleKey].rate,
        data: decodePcmBase64(stored[sampleKey].b64),
      });
    notifySampleListeners();
  } catch {}
}
export function saveRecordedSample(sampleKey, samples, sampleRate) {
  recordedSamples.set(sampleKey, {
    data: samples,
    rate: sampleRate,
  });
  persistRecordedSamples();
  notifySampleListeners();
}
export function deleteRecordedSample(sampleKey) {
  recordedSamples.delete(sampleKey);
  persistRecordedSamples();
  notifySampleListeners();
}
function getSampleBuffer(sampleKey) {
  const sample = recordedSamples.get(sampleKey);
  let ctxCache = sampleBufferCache.get(sharedAudioContext);
  if (!ctxCache) {
    ctxCache = new Map();
    sampleBufferCache.set(sharedAudioContext, ctxCache);
  }
  let cached = ctxCache.get(sampleKey);
  if (!cached || cached.src !== sample) {
    const buffer = sharedAudioContext.createBuffer(
      1,
      sample.data.length,
      sample.rate,
    );
    buffer.getChannelData(0).set(sample.data);
    cached = {
      src: sample,
      buf: buffer,
    };
    ctxCache.set(sampleKey, cached);
  }
  return cached.buf;
}
function playRecordedSample(sampleKey, playbackRate) {
  const startTime = soundStartTime();
  const source = sharedAudioContext.createBufferSource();
  source.buffer = getSampleBuffer(sampleKey);
  source.playbackRate.value = playbackRate;
  source.connect(masterGain);
  source.start(startTime);
}
export async function decodeAudioFileToMono(file) {
  const ctx = unlockAudio();
  if (!ctx) throw new Error("audio");
  const fileBytes = await file.arrayBuffer();
  const decoded = await new Promise((resolve, reject) => {
    const maybePromise = ctx.decodeAudioData(fileBytes, resolve, reject);
    if (maybePromise && maybePromise.then) {
      maybePromise.then(resolve, reject);
    }
  });
  const frameCount = decoded.length;
  const mono = new Float32Array(frameCount);
  for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
    const channelData = decoded.getChannelData(ch);
    for (let frame = 0; frame < frameCount; frame++)
      mono[frame] += channelData[frame] / decoded.numberOfChannels;
  }
  const targetRate = 22050;
  const OfflineContextClass =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineContextClass || decoded.sampleRate === targetRate)
    return {
      data: mono,
      rate: decoded.sampleRate,
    };
  const resampler = new OfflineContextClass(
    1,
    Math.ceil((frameCount * targetRate) / decoded.sampleRate),
    targetRate,
  );
  const srcBuffer = resampler.createBuffer(1, frameCount, decoded.sampleRate);
  srcBuffer.getChannelData(0).set(mono);
  const source = resampler.createBufferSource();
  source.buffer = srcBuffer;
  source.connect(resampler.destination);
  source.start();
  return {
    data: (await resampler.startRendering()).getChannelData(0).slice(),
    rate: targetRate,
  };
}
export function detectHitOnsets(samples, sampleRate) {
  const windowSize = Math.max(1, Math.floor(sampleRate * 0.005));
  const envelope = new Float32Array(Math.ceil(samples.length / windowSize));
  for (let win = 0; win < envelope.length; win++) {
    let peak = 0;
    const winEnd = Math.min(samples.length, (win + 1) * windowSize);
    for (let j = win * windowSize; j < winEnd; j++) {
      const amp = Math.abs(samples[j]);
      if (amp > peak) {
        peak = amp;
      }
    }
    envelope[win] = peak;
  }
  let maxPeak = 0;
  for (let level of envelope) {
    if (level > maxPeak) {
      maxPeak = level;
    }
  }
  if (maxPeak < 0.01) return [];
  const sorted = Array.from(envelope).sort((lo, h) => lo - h);
  const median = sorted[Math.floor(sorted.length * 0.5)];
  const threshold = Math.max(maxPeak * 0.22, median * 4, 0.015);
  const onsets = [];
  let armed = true;
  let lastOnset = -1e9;
  const minGap = Math.floor(0.2 / 0.005);
  for (let frame = 0; frame < envelope.length; frame++) {
    if (armed && envelope[frame] >= threshold && frame - lastOnset >= minGap) {
      onsets.push(frame * windowSize);
      lastOnset = frame;
      armed = false;
    } else if (envelope[frame] < threshold * 0.35) {
      armed = true;
    }
  }
  return onsets;
}
export function extractHit(samples, sampleRate, onset, nextOnset) {
  const preRoll = Math.floor(sampleRate * 0.004);
  const clipStart = Math.max(0, onset - preRoll);
  let clipEnd = Math.min(
    samples.length,
    clipStart + Math.floor(sampleRate * 0.9),
  );
  if (nextOnset != null) {
    clipEnd = Math.min(clipEnd, Math.max(clipStart + 1, nextOnset - preRoll));
  }
  const clip = samples.slice(clipStart, clipEnd);
  let peak = 0;
  for (let value of clip) {
    if (Math.abs(value) > peak) {
      peak = Math.abs(value);
    }
  }
  const gainScale = peak > 0 ? 0.9 / peak : 1;
  const fadeLen = Math.min(clip.length, Math.floor(sampleRate * 0.06));
  for (let idx = 0; idx < clip.length; idx++) {
    const remaining = clip.length - idx;
    clip[idx] =
      clip[idx] * gainScale * (remaining < fadeLen ? remaining / fadeLen : 1);
  }
  return clip;
}
export function previewRecordedSample(sampleKey) {
  unlockAudio();
  if (!(!sharedAudioContext || !recordedSamples.has(sampleKey))) {
    scheduledSoundTime = null;
    playRecordedSample(sampleKey, 1);
  }
}
