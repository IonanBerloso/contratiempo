import { localDateKey } from "../lib/time.js";
export const DEFAULT_WARMUP = [
  {
    name: "Tobillos y rodillas",
    secs: 60,
    bpm: 0,
  },
  {
    name: "Talones alternos",
    secs: 45,
    bpm: 96,
  },
  {
    name: "Cepillados delante y atrás",
    secs: 45,
    bpm: 104,
  },
  {
    name: "Cepillado doble y cambio de peso",
    secs: 60,
    bpm: 112,
  },
  {
    name: "Paso básico de tiempo",
    secs: 60,
    bpm: 132,
  },
  {
    name: "Estiramientos",
    secs: 90,
    bpm: 0,
  },
];
export const DEFAULT_IMPROV_POOL = [
  "flap",
  "shuffle",
  "ballChange",
  "paddle",
  "cramp",
  "riff",
  "stamp",
];
export const buildDemoPracticeLog = () => {
  const today = new Date();
  const daysAgoKey = (daysBack) =>
    localDateKey(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - daysBack,
      ),
    );
  return {
    laura: {
      [daysAgoKey(1)]: 840,
      [daysAgoKey(3)]: 1260,
      [daysAgoKey(4)]: 480,
      [daysAgoKey(6)]: 300,
    },
  };
};
