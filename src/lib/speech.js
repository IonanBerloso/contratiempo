import { audioMuted } from "./audio.js";
let cachedSpanishVoice = null;
export const isSpeechSupported = () =>
  typeof window != "undefined" && "speechSynthesis" in window;
export function speakText(text) {
  try {
    if (!isSpeechSupported() || audioMuted) return;
    const synth = window.speechSynthesis;
    if (!cachedSpanishVoice) {
      const voices = synth.getVoices();
      cachedSpanishVoice =
        voices.find((voice) => /^es[-_]ES/i.test(voice.lang)) ||
        voices.find((fallbackVoice) => /^es/i.test(fallbackVoice.lang)) ||
        null;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    if (cachedSpanishVoice) {
      utterance.voice = cachedSpanishVoice;
    }
    utterance.rate = 1.12;
    synth.speak(utterance);
  } catch {}
}
export function cancelSpeech() {
  try {
    if (isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
  } catch {}
}
