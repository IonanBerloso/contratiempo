const spreadEvenly = (count, from, to) =>
  Array.from(
    {
      length: count,
    },
    (a, idx) => from + ((to - from) * idx) / Math.max(1, count - 1),
  );
export const FORMATION_PRESETS = [
  {
    id: "fila",
    name: "Fila",
    slots: (count) => spreadEvenly(count, 15, 85).map((x) => [x, 55]),
  },
  {
    id: "dosfilas",
    name: "Dos filas",
    slots: (count) => {
      const frontCount = Math.ceil(count / 2);
      return [
        ...spreadEvenly(frontCount, 22, 78).map((frontX) => [frontX, 72]),
        ...spreadEvenly(count - frontCount, 30, 70).map((backX) => [backX, 40]),
      ];
    },
  },
  {
    id: "cuna",
    name: "Cuña",
    slots: () => [
      [50, 78],
      [38, 62],
      [62, 62],
      [26, 46],
      [50, 46],
      [74, 46],
    ],
  },
  {
    id: "diagonal",
    name: "Diagonal",
    slots: (count) =>
      spreadEvenly(count, 0, 1).map((progress) => [
        18 + 65 * progress,
        22 + 60 * progress,
      ]),
  },
  {
    id: "semicirculo",
    name: "Semicírculo",
    slots: (count) =>
      spreadEvenly(count, Math.PI, 2 * Math.PI).map((angle) => [
        50 + 36 * Math.cos(angle),
        66 + 34 * Math.sin(angle),
      ]),
  },
  {
    id: "circulo",
    name: "Círculo",
    slots: (count) =>
      spreadEvenly(count + 1, -Math.PI / 2, 1.5 * Math.PI)
        .slice(0, count)
        .map((theta) => [50 + 28 * Math.cos(theta), 52 + 24 * Math.sin(theta)]),
  },
];
