function buildDialogueRhythmLayers() {
  let ttakunStrikes = [],
    herrenStrikes = [];
  for (let beat = 0; beat < 7; beat++)
    ttakunStrikes.push(
      {
        b: beat,
        plank: 0,
        p: "tk",
      },
      {
        b: beat + 0.25,
        plank: 1,
        p: "tk",
      },
    );
  for (let herrenBeat of [0, 1, 3, 4, 5])
    herrenStrikes.push({
      b: herrenBeat + 0.5,
      plank: 3,
      p: "hr",
    });
  for (let flourishBeat of [2, 6])
    herrenStrikes.push(
      {
        b: flourishBeat + 0.5,
        plank: 2,
        p: "hr",
      },
      {
        b: flourishBeat + 0.75,
        plank: 3,
        p: "hr",
      },
    );
  return [
    {
      id: "l1",
      label: "Ttakun",
      muted: !1,
      strikes: ttakunStrikes,
    },
    {
      id: "l2",
      label: "Herren",
      muted: !1,
      strikes: herrenStrikes,
    },
    {
      id: "l3",
      label: "Golpe final, las dos",
      muted: !1,
      strikes: [
        {
          b: 7,
          plank: 0,
          p: "tk",
        },
        {
          b: 7,
          plank: 1,
          p: "tk",
        },
        {
          b: 7,
          plank: 2,
          p: "hr",
        },
        {
          b: 7,
          plank: 3,
          p: "hr",
        },
      ],
    },
  ];
}
export var SAMPLE_RHYTHMS = [
  {
    id: "rx1",
    name: "Di\xE1logo de ejemplo",
    bpm: 104,
    eights: 1,
    material: "madera",
    snap: "16",
    author: "profe",
    layers: buildDialogueRhythmLayers(),
    moves: [
      "Paso al frente",
      "",
      "Palmas",
      "",
      "Giro",
      "",
      "Talones",
      "Golpe y pose",
    ],
  },
  {
    id: "rx2",
    name: "Madera, piedra y pies",
    bpm: 100,
    eights: 1,
    material: "ambas",
    feet: !0,
    snap: "8",
    author: "profe",
    layers: buildMixedMaterialRhythmLayers(),
    moves: ["Entramos", "", "", "Golpe", "Giro", "", "", "Pose"],
  },
];
function buildMixedMaterialRhythmLayers() {
  let woodStrikes = [];
  for (let beat = 0; beat < 7; beat++)
    woodStrikes.push({
      b: beat,
      plank: beat % 2,
      p: "tk",
      m: "w",
    });
  let stoneStrikes = [0, 1, 2, 4, 5, 6].map((herrenBeat) => ({
    b: herrenBeat + 0.5,
    plank: herrenBeat % 3,
    p: "hr",
    m: "s",
  }));
  return [
    {
      id: "m1",
      label: "Ttakun en madera",
      muted: !1,
      strikes: woodStrikes,
    },
    {
      id: "m2",
      label: "Herren en piedra",
      muted: !1,
      strikes: stoneStrikes,
    },
    {
      id: "m3",
      label: "Pies",
      muted: !1,
      strikes: [
        {
          b: 3,
          plank: 0,
          p: "pi",
        },
        {
          b: 3.5,
          plank: 1,
          p: "pi",
        },
        {
          b: 6.5,
          plank: 3,
          p: "pi",
        },
        {
          b: 7,
          plank: 0,
          p: "pi",
        },
      ],
    },
    {
      id: "m4",
      label: "Golpe final",
      muted: !1,
      strikes: [
        {
          b: 7,
          plank: 0,
          p: "tk",
          m: "w",
        },
        {
          b: 7,
          plank: 2,
          p: "hr",
          m: "s",
        },
      ],
    },
  ];
}
