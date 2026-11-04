import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
var $l = {
  short: "jue 22 oct",
  long: "el jueves 22 de octubre",
  day: "el jueves 22",
};
var b0 = {
  absent: ["laura", "nerea"],
  worked: ["otono", "tren"],
};
var Be = [
  {
    id: "laura",
    name: "Laura",
    tape: "#E2453C",
    ink: "#FFFFFF",
  },
  {
    id: "irati",
    name: "Irati",
    tape: "#EDB92E",
    ink: "#1A1406",
  },
  {
    id: "nerea",
    name: "Nerea",
    tape: "#2F6FE4",
    ink: "#FFFFFF",
  },
  {
    id: "maialen",
    name: "Maialen",
    tape: "#2E9E58",
    ink: "#FFFFFF",
  },
  {
    id: "sofia",
    name: "Sof\xEDa",
    tape: "#8B5CF6",
    ink: "#FFFFFF",
  },
  {
    id: "ane",
    name: "Ane",
    tape: "#F3F1EA",
    ink: "#1A1A1A",
  },
];
var k0 = {
  laura: "K7P2",
  irati: "R4M9",
  nerea: "B2X6",
  maialen: "H8T3",
  sofia: "Z5C1",
  ane: "W9F4",
};
var m0 = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function x0(e) {
  for (;;) {
    let t = "";
    for (let n = 0; n < 4; n++) t += m0[Math.floor(Math.random() * m0.length)];
    if (!e.includes(t)) return t;
  }
}
var N0 = [
  "step",
  "ball",
  "brush",
  "spank",
  "scuff",
  "heel",
  "dig",
  "toe",
  "stamp",
  "hop",
];
var ni = [
  "flap",
  "shuffle",
  "ballChange",
  "paddle",
  "cramp",
  "riff",
  "paradiddle",
  "stamp",
  "hop",
  "step",
  "heel",
];
var jc = {
  flap: "flap",
  shuffle: "shuffle",
  ballChange: "ball change",
  paddle: "paddle and roll",
  cramp: "cramp roll",
  riff: "riff",
  paradiddle: "paradiddle",
  stamp: "stamp",
  hop: "hop",
  step: "step",
  heel: "heel drop",
};
var ai = {
  sounds: {
    step: {
      name: "paso",
      abbr: "Pa",
    },
    ball: {
      name: "planta",
      abbr: "Pl",
    },
    brush: {
      name: "cepillado",
      abbr: "Ce",
    },
    spank: {
      name: "cepillado atr\xE1s",
      abbr: "CA",
    },
    scuff: {
      name: "rozado de tal\xF3n",
      abbr: "Ro",
    },
    heel: {
      name: "tal\xF3n",
      abbr: "Ta",
    },
    dig: {
      name: "clavado de tal\xF3n",
      abbr: "Cl",
    },
    toe: {
      name: "punta",
      abbr: "Pu",
    },
    stamp: {
      name: "golpe",
      abbr: "Go",
    },
    hop: {
      name: "salto",
      abbr: "Sa",
    },
  },
  steps: {
    flap: {
      name: "cepillado y paso",
    },
    shuffle: {
      name: "cepillado doble",
    },
    ballChange: {
      name: "cambio de peso",
    },
    paddle: {
      name: "rueda de tal\xF3n",
    },
    cramp: {
      name: "redoble",
    },
    riff: {
      name: "rozado",
    },
    paradiddle: {
      name: "paradiddle",
    },
    stamp: {
      name: "golpe",
    },
    hop: {
      name: "salto",
    },
    step: {
      name: "paso",
    },
    heel: {
      name: "tal\xF3n",
    },
  },
};
var He = (e, t, n) => ({
  b: e,
  f: t,
  s: n,
});
var ka = (e) => (e === "R" ? "L" : "R");
var qn = (e, t) => ({
  key: e,
  evs: t,
});
var mn = (e, t) => qn("stamp", [He(e, t, "stamp")]);
var Ev = (e, t) => qn("hop", [He(e, t, "hop")]);
var fo = (e, t) => qn("step", [He(e, t, "step")]);
var h0 = (e, t) => qn("heel", [He(e, t, "heel")]);
var ti = (e, t, n = 0.5) =>
  qn("flap", [He(e, t, "brush"), He(e + n, t, "step")]);
var Oc = (e, t, n = 0.5) =>
  qn("shuffle", [He(e, t, "brush"), He(e + n, t, "spank")]);
var g0 = (e, t, n = 0.5) =>
  qn("ballChange", [He(e, t, "ball"), He(e + n, ka(t), "step")]);
var v0 = (e, t, n = 0.25) =>
  qn("paddle", [
    He(e, t, "dig"),
    He(e + n, t, "spank"),
    He(e + 2 * n, ka(t), "heel"),
    He(e + 3 * n, t, "toe"),
  ]);
var $v = (e, t, n = 0.25) =>
  qn("cramp", [
    He(e, t, "ball"),
    He(e + n, ka(t), "ball"),
    He(e + 2 * n, t, "heel"),
    He(e + 3 * n, ka(t), "heel"),
  ]);
var y0 = (e, t, n = 0.25) =>
  qn("riff", [He(e, t, "brush"), He(e + n, t, "scuff")]);
var Js = (e, t, n = 0.25) =>
  qn("paradiddle", [
    He(e, t, "dig"),
    He(e + n, t, "spank"),
    He(e + 2 * n, t, "step"),
    He(e + 3 * n, t, "heel"),
  ]);
var ei = (e, t) => [
  mn(e, t),
  Ev(e + 0.5, ka(t)),
  fo(e + 1, t),
  ti(e + 1.5, ka(t)),
  fo(e + 2.5, t),
];
var co = (e, t) => [
  y0(e, t),
  fo(e + 0.5, t),
  y0(e + 1, ka(t)),
  fo(e + 1.5, ka(t)),
  $v(e + 2, t),
  mn(e + 3, t),
];
function El(e) {
  let t = [],
    n = [];
  for (let a of e.flat()) {
    t.push(...a.evs);
    let l = a.evs.map((o) => o.b);
    n.push({
      key: a.key,
      from: Math.min(...l),
      to: Math.max(...l),
    });
  }
  return (
    t.sort((a, l) => a.b - l.b),
    n.sort((a, l) => a.from - l.from),
    {
      type: "feet",
      events: t,
      spans: n,
    }
  );
}
function po({ counts, from, to, order = null, stagger = 0, move }) {
  let r = (u) => (order ? order.indexOf(u) * stagger : 0),
    s = [],
    i = "R";
  for (let u = 0; u < counts; u++)
    Be.some((d) => {
      let c = r(d.id);
      return u >= c - 1e-9 && u < c + move;
    }) && (s.push(He(u, i, "step")), (i = ka(i)));
  return {
    type: "stage",
    angle: "escenario",
    counts,
    from,
    to,
    order,
    stagger,
    move,
    events: s,
    spans: [],
  };
}
var w0 = [
  {
    id: "otono",
    title: "Oto\xF1o en swing",
    bpm: 132,
    swing: !0,
    status: "En ensayo",
    show: {
      name: "Festival de Navidad",
      date: "2026-12-19",
    },
    week: "Limpiar el canon del estribillo. Repasad el v\xEDdeo despacio antes del jueves.",
    blocks: [
      {
        id: "o1",
        done: !0,
        name: "Intro",
        len: 3,
        formation: "Fila",
        isNew: !1,
        notes:
          "Ocho 1: entramos por el hombro derecho de una en una, cada media cuenta. Ochos 2 y 3: paso b\xE1sico de tiempo a derecha e izquierda. Peso adelante y rodillas sueltas: que suene limpio, no fuerte.",
        personal: {
          ane: "Sales la primera: arranca en el \xABy\xBB del 8, no esperes al 1.",
          sofia:
            "Cuando llegues a tu marca, para en seco. Nada de pasitos de ajuste.",
        },
      },
      {
        id: "o2",
        done: !0,
        name: "Estrofa",
        len: 4,
        formation: "Cu\xF1a",
        isNew: !1,
        notes:
          "En el ocho 4 pasamos de la fila a la cu\xF1a en cuatro tiempos, andando sobre la punta. Despu\xE9s, cepillado doble y cambio de peso a cada lado, y rueda de tal\xF3n. La rueda son cuatro sonidos iguales, sin acentos.",
        personal: {
          irati:
            "Tu rueda de tal\xF3n corre. Pract\xEDcala a 0,75\xD7 con el metr\xF3nomo hasta que suene pareja.",
          laura:
            "En la cu\xF1a vas delante: t\xFA marcas el pulso, que se te oiga.",
        },
      },
      {
        id: "o3",
        done: !0,
        name: "Estribillo",
        len: 4,
        formation: "Diagonal en canon",
        isNew: !0,
        notes:
          "La diagonal entra en canon en el ocho 8: cada una sale una cuenta despu\xE9s de la anterior, empezando por Ane al fondo. Luego dos rozados, redoble y golpe, primero a la derecha y despu\xE9s a la izquierda. Mirada al p\xFAblico desde el primer rozado.",
        personal: {
          laura:
            "Te he cambiado de sitio: ahora vas la tercera de la diagonal, entre Irati y Maialen.",
          nerea:
            "Eres la quinta del canon: sales en el 5 y llegas a tu sitio en el 7.",
          maialen:
            "Cuidado con el redoble a la izquierda: el \xFAltimo tal\xF3n se te come.",
        },
      },
      {
        id: "o4",
        name: "Break y final",
        len: 3,
        formation: "Semic\xEDrculo y solo",
        isNew: !1,
        acapella: [2, 3],
        notes:
          "Ocho 12: vamos al semic\xEDrculo en seis tiempos y Nerea se queda delante. Ochos 13 y 14: break a capella, sin m\xFAsica. Paradiddles alternando pies y tres golpes; el resto marca el pulso con talones. Pose final en el 8 y aguantamos dos tiempos.",
        personal: {
          nerea:
            "El break delante es tuyo. Si te pierdes, vuelve al tal\xF3n en el 1.",
          ane: "Marca el pulso con talones bajito, que se oiga a Nerea por encima.",
        },
      },
    ],
    formations: {
      o1: {
        laura: [15, 52],
        irati: [29, 52],
        nerea: [43, 52],
        maialen: [57, 52],
        sofia: [71, 52],
        ane: [85, 52],
      },
      o2: {
        laura: [43, 76],
        maialen: [57, 76],
        irati: [30, 61],
        nerea: [70, 61],
        ane: [17, 46],
        sofia: [83, 46],
      },
      o3: {
        ane: [18, 22],
        irati: [31, 34],
        laura: [44, 46],
        maialen: [57, 58],
        nerea: [70, 70],
        sofia: [83, 82],
      },
      o4: {
        ane: [20, 48],
        irati: [30, 30],
        laura: [50, 22],
        sofia: [70, 30],
        maialen: [80, 48],
        nerea: [50, 72],
      },
    },
  },
  {
    id: "tren",
    title: "Tren de medianoche",
    bpm: 120,
    swing: !1,
    status: "En ensayo",
    show: {
      name: "Festival de Navidad",
      date: "2026-12-19",
    },
    week: "",
    blocks: [
      {
        id: "t1",
        done: !0,
        name: "La salida",
        len: 2,
        formation: "Columna",
        isNew: !1,
        notes:
          "Empezamos en columna, como vagones. Golpes lentos que arrancan el tren y luego cepillado y paso cada vez m\xE1s ligero. Brazos de biela pegados al cuerpo.",
        personal: {
          laura:
            "Eres la locomotora: vas la primera de la columna y marcas la velocidad.",
        },
      },
      {
        id: "t2",
        done: !0,
        name: "El traqueteo",
        len: 4,
        formation: "Dos v\xEDas",
        isNew: !0,
        notes:
          "Nuevo: la columna se abre en dos v\xEDas de tres. El traqueteo es cepillado doble y paso, sin parar, \xABta-ca-TA\xBB. Que no se acelere: el tren va constante.",
        personal: {
          nerea:
            "Vas en la v\xEDa de tu izquierda, en medio. Maialen va delante de ti: id a la vez.",
          laura:
            "En las dos v\xEDas vas la primera de la v\xEDa de tu derecha.",
        },
      },
      {
        id: "t3",
        name: "Llegada al and\xE9n",
        len: 2,
        formation: "And\xE9n",
        isNew: !1,
        notes:
          "Frenamos poco a poco: cada ocho m\xE1s lento con talones. Terminamos en l\xEDnea delante, como en el and\xE9n.",
        personal: {},
      },
    ],
    formations: {
      t1: {
        laura: [50, 82],
        irati: [50, 70],
        nerea: [50, 58],
        maialen: [50, 46],
        sofia: [50, 34],
        ane: [50, 22],
      },
      t2: {
        laura: [30, 75],
        irati: [30, 55],
        ane: [30, 35],
        maialen: [70, 75],
        nerea: [70, 55],
        sofia: [70, 35],
      },
      t3: {
        laura: [15, 74],
        irati: [29, 74],
        nerea: [43, 74],
        maialen: [57, 74],
        sofia: [71, 74],
        ane: [85, 74],
      },
    },
  },
  {
    id: "fin",
    title: "Fin de curso",
    bpm: 128,
    swing: !1,
    status: "Borrador",
    blocks: [
      {
        id: "f1",
        name: "Idea de inicio",
        len: 2,
        formation: "Por decidir",
        isNew: !1,
        notes:
          "Idea: empezar a oscuras, solo con el sonido de los pies. Falta elegir canci\xF3n.",
        personal: {},
      },
    ],
    formations: {
      f1: {
        laura: [15, 60],
        irati: [29, 60],
        nerea: [43, 60],
        maialen: [57, 60],
        sofia: [71, 60],
        ane: [85, 60],
      },
    },
  },
  {
    id: "txala",
    title: "Txalaparta",
    bpm: 104,
    swing: !1,
    status: "En ensayo",
    show: {
      name: "Fiesta de la escuela",
      date: "2026-11-27",
    },
    week: "Cada una aprende su papel del Di\xE1logo en el taller de txalaparta, con \xABPracticar mi papel\xBB.",
    links: [
      {
        id: "k1",
        src: "c1",
        block: "x1",
        rel: 1,
      },
    ],
    logistics: {
      schedule: [
        {
          time: "16:30",
          what: "Llegada al camerino",
        },
        {
          time: "17:00",
          what: "Calentamiento y prueba en el escenario",
        },
        {
          time: "18:15",
          what: "Actuaci\xF3n",
        },
      ],
      costume:
        "Camiseta blanca, pantal\xF3n negro y zapatos de claqu\xE9. Pelo recogido.",
      notes: {
        nerea: "Llevas el pa\xF1uelo rojo del solo del break.",
      },
      auth: {
        laura: !0,
        irati: !0,
        nerea: !1,
        maialen: !0,
        sofia: !1,
        ane: !0,
      },
    },
    blocks: [
      {
        id: "x1",
        done: !0,
        name: "Entrada",
        len: 2,
        formation: "Dos filas enfrentadas",
        isNew: !1,
        notes:
          "Dos filas enfrentadas, como los dos lados de la txalaparta: la fila de delante es ttakun y la del fondo, herren. Entramos marcando el pulso con talones.",
        personal: {},
      },
      {
        id: "x2",
        name: "Di\xE1logo",
        len: 2,
        formation: "Pregunta y respuesta",
        isNew: !1,
        rhythmId: "rx1",
        notes:
          "Sobre el ritmo que creamos en el taller. La fila ttakun marca el pulso y la fila herren contesta en los huecos. Los pasos de cada cuenta est\xE1n apuntados en el taller.",
        personal: {},
      },
    ],
    formations: {
      x1: {
        laura: [25, 72],
        irati: [50, 72],
        nerea: [75, 72],
        maialen: [25, 32],
        sofia: [50, 32],
        ane: [75, 32],
      },
      x2: {
        laura: [20, 68],
        irati: [45, 68],
        nerea: [70, 68],
        maialen: [30, 36],
        sofia: [55, 36],
        ane: [80, 36],
      },
    },
  },
];
var Bc = [
  {
    id: "c2",
    block: "o1",
    rel: 1,
    bpm: 132,
    isNew: !1,
    title: "Entrada desde el hombro y colocaci\xF3n en fila",
    ...po({
      counts: 8,
      from: "entrada",
      to: "o1",
      order: ["ane", "sofia", "maialen", "nerea", "irati", "laura"],
      stagger: 0.5,
      move: 3.5,
    }),
  },
  {
    id: "c1",
    block: "o1",
    rel: 2,
    angle: "frente",
    bpm: 132,
    swing: !0,
    counts: 16,
    isNew: !1,
    title: "Paso b\xE1sico de tiempo, a derecha e izquierda",
    ...El([ei(-1, "R"), ei(3, "L"), ei(7, "R"), ei(11, "L"), [mn(15, "R")]]),
  },
  {
    id: "c4",
    block: "o2",
    rel: 1,
    bpm: 132,
    isNew: !1,
    title: "Transici\xF3n de la fila a la cu\xF1a",
    ...po({
      counts: 8,
      from: "o1",
      to: "o2",
      move: 4,
    }),
  },
  {
    id: "c3",
    block: "o2",
    rel: 2,
    angle: "lado",
    bpm: 88,
    counts: 8,
    isNew: !1,
    title: "Cepillado doble y rueda de tal\xF3n, explicado despacio",
    ...El([
      Oc(0, "R"),
      g0(1, "R"),
      Oc(2, "L"),
      g0(3, "L"),
      v0(4, "R"),
      v0(5, "L"),
      [fo(6, "R")],
      [mn(7, "L")],
    ]),
  },
  {
    id: "c6",
    block: "o3",
    rel: 1,
    bpm: 132,
    isNew: !0,
    title: "Canon en diagonal: qui\xE9n sale en cada cuenta",
    ...po({
      counts: 8,
      from: "o2",
      to: "o3",
      order: ["ane", "irati", "laura", "maialen", "nerea", "sofia"],
      stagger: 1,
      move: 2,
    }),
  },
  {
    id: "c5",
    block: "o3",
    rel: 2,
    angle: "lado",
    bpm: 96,
    counts: 8,
    isNew: !0,
    title: "Paso de pies del estribillo explicado despacio",
    ...El([co(0, "R"), co(4, "L")]),
  },
  {
    id: "c7",
    block: "o3",
    rel: 2,
    angle: "frente",
    bpm: 132,
    swing: !0,
    counts: 16,
    isNew: !0,
    title: "Estribillo completo a tempo",
    ...El([co(0, "R"), co(4, "L"), co(8, "R"), co(12, "L")]),
  },
  {
    id: "c9",
    block: "o4",
    rel: 1,
    bpm: 132,
    isNew: !1,
    title: "Del estribillo al semic\xEDrculo",
    ...po({
      counts: 8,
      from: "o3",
      to: "o4",
      move: 6,
    }),
  },
  {
    id: "c8",
    block: "o4",
    rel: 2,
    angle: "lado",
    bpm: 120,
    counts: 8,
    acapella: !0,
    isNew: !0,
    title: "Break a capella: paradiddles y golpes",
    ...El([
      Js(0, "R"),
      Js(1, "L"),
      Js(2, "R"),
      Js(3, "L"),
      [mn(4, "R")],
      [mn(4.5, "L")],
      [mn(5, "R")],
      [h0(6, "L")],
      [h0(6.5, "R")],
      [mn(7, "R")],
    ]),
  },
  {
    id: "r1",
    block: "t1",
    rel: 1,
    angle: "frente",
    bpm: 120,
    counts: 8,
    isNew: !1,
    title: "Arranque: golpes lentos y cepillado y paso",
    ...El([
      [mn(0, "R")],
      [mn(1, "L")],
      [mn(2, "R")],
      [mn(3, "L")],
      ti(4, "R"),
      ti(5, "L"),
      ti(6, "R"),
      [mn(7, "L")],
    ]),
  },
  {
    id: "r2",
    block: "t2",
    rel: 1,
    bpm: 120,
    isNew: !0,
    title: "La columna se abre en dos v\xEDas",
    ...po({
      counts: 8,
      from: "t1",
      to: "t2",
      order: ["ane", "sofia", "irati", "nerea", "maialen", "laura"],
      stagger: 0.5,
      move: 4,
    }),
  },
  {
    id: "r3",
    block: "t2",
    rel: 2,
    angle: "lado",
    bpm: 100,
    counts: 8,
    isNew: !0,
    title: "El traqueteo, explicado despacio",
    ...El(
      Array.from(
        {
          length: 8,
        },
        (e, t) => [
          Oc(t, t % 2 ? "L" : "R", 0.25),
          fo(t + 0.5, t % 2 ? "L" : "R"),
        ],
      ),
    ),
  },
  {
    id: "r4",
    block: "t3",
    rel: 1,
    bpm: 120,
    isNew: !1,
    title: "Llegada al and\xE9n",
    ...po({
      counts: 8,
      from: "t2",
      to: "t3",
      move: 4,
    }),
  },
];
var xa = {
  frente: "De frente",
  lado: "De lado",
  escenario: "Plano del escenario",
  musica: "Con m\xFAsica",
};
function Rv() {
  let e = [],
    t = [];
  for (let a = 0; a < 7; a++)
    e.push(
      {
        b: a,
        plank: 0,
        p: "tk",
      },
      {
        b: a + 0.25,
        plank: 1,
        p: "tk",
      },
    );
  for (let a of [0, 1, 3, 4, 5])
    t.push({
      b: a + 0.5,
      plank: 3,
      p: "hr",
    });
  for (let a of [2, 6])
    t.push(
      {
        b: a + 0.5,
        plank: 2,
        p: "hr",
      },
      {
        b: a + 0.75,
        plank: 3,
        p: "hr",
      },
    );
  return [
    {
      id: "l1",
      label: "Ttakun",
      muted: !1,
      strikes: e,
    },
    {
      id: "l2",
      label: "Herren",
      muted: !1,
      strikes: t,
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
var S0 = [
  {
    id: "rx1",
    name: "Di\xE1logo de ejemplo",
    bpm: 104,
    eights: 1,
    material: "madera",
    snap: "16",
    author: "profe",
    layers: Rv(),
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
    layers: Tv(),
    moves: ["Entramos", "", "", "Golpe", "Giro", "", "", "Pose"],
  },
];
function Tv() {
  let e = [];
  for (let l = 0; l < 7; l++)
    e.push({
      b: l,
      plank: l % 2,
      p: "tk",
      m: "w",
    });
  let t = [0, 1, 2, 4, 5, 6].map((l) => ({
    b: l + 0.5,
    plank: l % 3,
    p: "hr",
    m: "s",
  }));
  return [
    {
      id: "m1",
      label: "Ttakun en madera",
      muted: !1,
      strikes: e,
    },
    {
      id: "m2",
      label: "Herren en piedra",
      muted: !1,
      strikes: t,
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
var be = null;
var Mt = null;
var br = null;
var Rl = !1;
var mt = null;
var kr = !1;
var Uc = null;
var xr = null;
var mo = () => (xr != null ? Math.max(be.currentTime, xr) : be.currentTime);
var Fe = () => (be ? be.currentTime : 0);
var oi = () => (be ? (be.outputLatency || 0) + (be.baseLatency || 0) : 0);
var Vc = () => {
  if (!(!be || be.state === "running" || be.state === "closed"))
    try {
      let e = be.resume();
      e && e.catch && e.catch(() => {});
    } catch {}
};
function Pv() {
  try {
    let e = navigator.userAgent || "";
    return (
      /iPad|iPhone|iPod/.test(e) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  } catch {
    return !1;
  }
}
function Lv() {
  let n = new ArrayBuffer(4044),
    a = new DataView(n),
    l = (o, r) => {
      for (let s = 0; s < r.length; s++) a.setUint8(o + s, r.charCodeAt(s));
    };
  return (
    l(0, "RIFF"),
    a.setUint32(4, 36 + 2e3 * 2, !0),
    l(8, "WAVE"),
    l(12, "fmt "),
    a.setUint32(16, 16, !0),
    a.setUint16(20, 1, !0),
    a.setUint16(22, 1, !0),
    a.setUint32(24, 8e3, !0),
    a.setUint32(28, 8e3 * 2, !0),
    a.setUint16(32, 2, !0),
    a.setUint16(34, 16, !0),
    l(36, "data"),
    a.setUint32(40, 2e3 * 2, !0),
    URL.createObjectURL(
      new Blob([n], {
        type: "audio/wav",
      }),
    )
  );
}
function Qc() {
  if (!(!mt || !mt.paused))
    try {
      let e = mt.play();
      e && e.catch && e.catch(() => {});
    } catch {}
}
function Av() {
  if (Pv())
    try {
      (mt ||
        ((mt = document.createElement("audio")),
        (mt.src = Lv()),
        (mt.loop = !0),
        (mt.preload = "auto"),
        mt.setAttribute("playsinline", ""),
        mt.setAttribute("webkit-playsinline", ""),
        mt.setAttribute("x-webkit-airplay", "deny"),
        (mt.disableRemotePlayback = !0)),
        Qc());
    } catch {}
}
function M0(e) {
  let t = Math.floor(e.sampleRate * 0.3),
    n = e.createBuffer(1, t, e.sampleRate),
    a = n.getChannelData(0);
  for (let l = 0; l < t; l++) a[l] = Math.random() * 2 - 1;
  return n;
}
function Ue() {
  ((kr = !0), clearTimeout(Uc));
  try {
    navigator.audioSession &&
      navigator.audioSession.type !== "playback" &&
      (navigator.audioSession.type = "playback");
  } catch {}
  Av();
  try {
    if (!be) {
      let t = window.AudioContext || window.webkitAudioContext;
      if (!t) return null;
      ((be = new t()),
        (Mt = be.createGain()),
        (Mt.gain.value = Rl ? 0 : 0.9),
        Mt.connect(be.destination),
        (br = M0(be)));
    }
    Vc();
    let e = be.createBufferSource();
    ((e.buffer = be.createBuffer(1, 1, be.sampleRate)),
      e.connect(be.destination),
      e.start(0));
  } catch {
    return null;
  }
  return be;
}
function _t(e) {
  ((kr = e),
    clearTimeout(Uc),
    mt &&
      (e
        ? Qc()
        : (Uc = setTimeout(() => {
            !kr && mt && !mt.paused && mt.pause();
          }, 600))));
}
if (typeof window != "undefined") {
  let e = () => {
    (Vc(), kr && Qc());
  };
  (["touchend", "click", "keydown"].forEach((t) =>
    window.addEventListener(t, e, !0),
  ),
    document.addEventListener("visibilitychange", () => {
      document.hidden ? mt && !mt.paused && mt.pause() : kr && Vc();
    }));
}
function E0(e) {
  ((Rl = e), Mt && (Mt.gain.value = e ? 0 : 0.9));
}
function Rn({
  freq,
  q = 2,
  dur = 0.05,
  gain = 0.8,
  type = "bandpass",
  attack = 0.001,
}) {
  let r = mo(),
    s = be.createBufferSource();
  s.buffer = br;
  let i = be.createBiquadFilter();
  ((i.type = type), (i.frequency.value = freq), (i.Q.value = q));
  let u = be.createGain();
  (u.gain.setValueAtTime(1e-4, r),
    u.gain.exponentialRampToValueAtTime(gain, r + attack),
    u.gain.exponentialRampToValueAtTime(1e-4, r + attack + dur),
    s.connect(i),
    i.connect(u),
    u.connect(Mt),
    s.start(r, Math.random() * 0.2),
    s.stop(r + attack + dur + 0.03));
}
function na(e, t = 0.04, n = 0.25, a = "triangle") {
  let l = mo(),
    o = be.createOscillator();
  ((o.type = a), o.frequency.setValueAtTime(e, l));
  let r = be.createGain();
  (r.gain.setValueAtTime(1e-4, l),
    r.gain.exponentialRampToValueAtTime(n, l + 0.001),
    r.gain.exponentialRampToValueAtTime(1e-4, l + t),
    o.connect(r),
    r.connect(Mt),
    o.start(l),
    o.stop(l + t + 0.03));
}
function zv() {
  let e = mo(),
    t = be.createOscillator();
  ((t.type = "sine"),
    t.frequency.setValueAtTime(130, e),
    t.frequency.exponentialRampToValueAtTime(48, e + 0.12));
  let n = be.createGain();
  (n.gain.setValueAtTime(1e-4, e),
    n.gain.exponentialRampToValueAtTime(0.32, e + 0.004),
    n.gain.exponentialRampToValueAtTime(1e-4, e + 0.22),
    t.connect(n),
    n.connect(Mt),
    t.start(e),
    t.stop(e + 0.25));
}
function Iv(e) {
  let t = mo(),
    n = be.createOscillator();
  ((n.type = "triangle"), n.frequency.setValueAtTime(e, t));
  let a = be.createBiquadFilter();
  ((a.type = "lowpass"), (a.frequency.value = 700));
  let l = be.createGain();
  (l.gain.setValueAtTime(1e-4, t),
    l.gain.exponentialRampToValueAtTime(0.3, t + 0.01),
    l.gain.exponentialRampToValueAtTime(1e-4, t + 0.38),
    n.connect(a),
    a.connect(l),
    l.connect(Mt),
    n.start(t),
    n.stop(t + 0.4));
}
var Nr = (e, t) => 170 * Math.pow(380 / 170, t > 1 ? e / (t - 1) : 0);
function _v(e) {
  let t = !!(e && e.hr),
    n = !!(e && e.stone),
    a = ((e && e.f) || 220) * (t ? 1.015 : 1) * (n ? 1.9 : 1),
    l = mo(),
    o = n
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
  for (let [r, s, i] of o) {
    let u = be.createOscillator();
    ((u.type = "sine"),
      u.frequency.setValueAtTime(a * r * (n ? 1.01 : 1.03), l),
      u.frequency.exponentialRampToValueAtTime(a * r, l + 0.025));
    let p = be.createGain();
    (p.gain.setValueAtTime(1e-4, l),
      p.gain.exponentialRampToValueAtTime(s, l + 0.002),
      p.gain.exponentialRampToValueAtTime(1e-4, l + i),
      u.connect(p),
      p.connect(Mt),
      u.start(l),
      u.stop(l + i + 0.03));
  }
  Rn(
    n
      ? {
          freq: 4600,
          q: 1.4,
          dur: 0.012,
          gain: 0.5,
        }
      : {
          freq: t ? 2900 : 2300,
          q: 1.2,
          dur: 0.018,
          gain: 0.42,
        },
  );
}
function Ft(e, t, n) {
  if (!(!be || !Mt || Rl)) {
    xr = n != null ? n : null;
    try {
      let a = (t && t.key) || (t == null ? Fv[e] : null);
      if (a && aa.has(a)) {
        F0(a, t && t.hr ? 1.015 : 1);
        return;
      }
      switch (e) {
        case "tx":
          _v(t);
          break;
        case "kick":
          zv();
          break;
        case "snare":
          Rn({
            freq: 1900,
            q: 0.8,
            dur: 0.12,
            gain: 0.16,
            attack: 0.004,
          });
          break;
        case "ride":
          (Rn({
            freq: 7e3,
            q: 0.6,
            dur: 0.16,
            gain: 0.07,
            type: "highpass",
          }),
            na(5300, 0.12, 0.025, "sine"));
          break;
        case "rideSoft":
          Rn({
            freq: 7e3,
            q: 0.6,
            dur: 0.08,
            gain: 0.04,
            type: "highpass",
          });
          break;
        case "bass":
          Iv(t || 110);
          break;
        case "click":
          na(1e3, 0.03, 0.16, "sine");
          break;
        case "clickHi":
          na(1560, 0.035, 0.22, "sine");
          break;
        case "brush":
          (Rn({
            freq: 3600,
            q: 0.7,
            dur: 0.07,
            gain: 0.34,
            type: "highpass",
            attack: 0.006,
          }),
            na(3100, 0.02, 0.07));
          break;
        case "spank":
          (Rn({
            freq: 3200,
            q: 0.7,
            dur: 0.06,
            gain: 0.32,
            type: "highpass",
            attack: 0.005,
          }),
            na(2800, 0.02, 0.07));
          break;
        case "scuff":
          Rn({
            freq: 1300,
            q: 1.5,
            dur: 0.06,
            gain: 0.5,
            attack: 0.003,
          });
          break;
        case "heel":
        case "dig":
          (Rn({
            freq: 1700,
            q: 3,
            dur: 0.05,
            gain: 0.9,
          }),
            na(940, 0.05, 0.22));
          break;
        case "stamp":
          (Rn({
            freq: 2200,
            q: 1.5,
            dur: 0.07,
            gain: 1,
          }),
            na(1800, 0.05, 0.24),
            na(110, 0.12, 0.5, "sine"));
          break;
        case "hop":
          (Rn({
            freq: 2500,
            q: 3,
            dur: 0.045,
            gain: 0.75,
          }),
            na(2e3, 0.04, 0.2));
          break;
        default:
          (Rn({
            freq: 3100,
            q: 4,
            dur: 0.04,
            gain: 0.8,
          }),
            na(2350, 0.045, 0.22));
      }
    } catch {
    } finally {
      xr = null;
    }
  }
}
async function $0(e, t, n) {
  let a = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!a || typeof MediaRecorder == "undefined") throw new Error("unsupported");
  let l = Ue();
  if (!l || !l.createMediaStreamDestination) throw new Error("unsupported");
  let o = 44100,
    r = new a(1, Math.ceil(e * o), o),
    s = [be, Mt, br, Rl];
  ((be = r),
    (Mt = r.createGain()),
    (Mt.gain.value = 0.9),
    Mt.connect(r.destination),
    (br = M0(r)),
    (Rl = !1));
  try {
    t((w, P, T) => Ft(w, P, T));
  } finally {
    [be, Mt, br, Rl] = s;
  }
  let i = await r.startRendering(),
    u = l.createMediaStreamDestination(),
    p = l.createBufferSource();
  ((p.buffer = i), p.connect(u));
  let c = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find(
      (w) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(w),
    ),
    h = new MediaRecorder(
      u.stream,
      c
        ? {
            mimeType: c,
          }
        : void 0,
    ),
    b = [];
  h.ondataavailable = (w) => {
    w.data && w.data.size && b.push(w.data);
  };
  let y = new Promise((w) => {
      h.onstop = w;
    }),
    M = new Promise((w) => {
      p.onended = w;
    });
  h.start(250);
  let f = l.currentTime;
  p.start();
  let m = setInterval(
    () => n && n(Math.min(1, (l.currentTime - f) / i.duration)),
    200,
  );
  (await M, clearInterval(m), h.stop(), await y);
  let v = h.mimeType || c || "audio/webm";
  return {
    blob: new Blob(b, {
      type: v,
    }),
    ext: v.includes("mp4") ? "mp4" : "webm",
  };
}
var R0 = "contratiempo-sonidos-v1";
var aa = new Map();
var qc = new Set();
var C0 = new WeakMap();
var Fv = {
  stamp: "f0",
  heel: "f1",
  toe: "f2",
  brush: "f3",
};
var Hc = !0;
function T0(e) {
  return (qc.add(e), () => qc.delete(e));
}
var ri = () => qc.forEach((e) => e());
var P0 = (e) => aa.has(e);
var L0 = () => Hc;
function Dv(e) {
  let t = new Int16Array(e.length);
  for (let l = 0; l < e.length; l++)
    t[l] = Math.max(-1, Math.min(1, e[l])) * 32767;
  let n = new Uint8Array(t.buffer),
    a = "";
  for (let l = 0; l < n.length; l += 32768)
    a += String.fromCharCode.apply(null, n.subarray(l, l + 32768));
  return btoa(a);
}
function A0(e) {
  let t = atob(e),
    n = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++) n[o] = t.charCodeAt(o);
  let a = new Int16Array(n.buffer),
    l = new Float32Array(a.length);
  for (let o = 0; o < a.length; o++) l[o] = a[o] / 32767;
  return l;
}
function Wc() {
  let e = {};
  for (let [t, n] of aa)
    e[t] = {
      rate: n.rate,
      b64: Dv(n.data),
    };
  return e;
}
function Gc() {
  try {
    (localStorage.setItem(R0, JSON.stringify(Wc())), (Hc = !0));
  } catch {
    Hc = !1;
  }
}
function z0(e) {
  aa.clear();
  try {
    for (let t of Object.keys(e || {}))
      aa.set(t, {
        rate: e[t].rate,
        data: A0(e[t].b64),
      });
  } catch {}
  (Gc(), ri());
}
function I0() {
  try {
    let e = JSON.parse(localStorage.getItem(R0) || "null");
    if (!e) return;
    for (let t of Object.keys(e))
      aa.set(t, {
        rate: e[t].rate,
        data: A0(e[t].b64),
      });
    ri();
  } catch {}
}
function Kc(e, t, n) {
  (aa.set(e, {
    data: t,
    rate: n,
  }),
    Gc(),
    ri());
}
function _0(e) {
  (aa.delete(e), Gc(), ri());
}
function Ov(e) {
  let t = aa.get(e),
    n = C0.get(be);
  n || ((n = new Map()), C0.set(be, n));
  let a = n.get(e);
  if (!a || a.src !== t) {
    let l = be.createBuffer(1, t.data.length, t.rate);
    (l.getChannelData(0).set(t.data),
      (a = {
        src: t,
        buf: l,
      }),
      n.set(e, a));
  }
  return a.buf;
}
function F0(e, t) {
  let n = mo(),
    a = be.createBufferSource();
  ((a.buffer = Ov(e)), (a.playbackRate.value = t), a.connect(Mt), a.start(n));
}
async function Yc(e) {
  let t = Ue();
  if (!t) throw new Error("audio");
  let n = await e.arrayBuffer(),
    a = await new Promise((c, h) => {
      let b = t.decodeAudioData(n, c, h);
      b && b.then && b.then(c, h);
    }),
    l = a.length,
    o = new Float32Array(l);
  for (let c = 0; c < a.numberOfChannels; c++) {
    let h = a.getChannelData(c);
    for (let b = 0; b < l; b++) o[b] += h[b] / a.numberOfChannels;
  }
  let r = 22050,
    s = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!s || a.sampleRate === r)
    return {
      data: o,
      rate: a.sampleRate,
    };
  let i = new s(1, Math.ceil((l * r) / a.sampleRate), r),
    u = i.createBuffer(1, l, a.sampleRate);
  u.getChannelData(0).set(o);
  let p = i.createBufferSource();
  return (
    (p.buffer = u),
    p.connect(i.destination),
    p.start(),
    {
      data: (await i.startRendering()).getChannelData(0).slice(),
      rate: r,
    }
  );
}
function Xc(e, t) {
  let n = Math.max(1, Math.floor(t * 0.005)),
    a = new Float32Array(Math.ceil(e.length / n));
  for (let c = 0; c < a.length; c++) {
    let h = 0,
      b = Math.min(e.length, (c + 1) * n);
    for (let y = c * n; y < b; y++) {
      let M = Math.abs(e[y]);
      M > h && (h = M);
    }
    a[c] = h;
  }
  let l = 0;
  for (let c of a) c > l && (l = c);
  if (l < 0.01) return [];
  let o = Array.from(a).sort((c, h) => c - h),
    r = o[Math.floor(o.length * 0.5)],
    s = Math.max(l * 0.22, r * 4, 0.015),
    i = [],
    u = !0,
    p = -1e9,
    d = Math.floor(0.2 / 0.005);
  for (let c = 0; c < a.length; c++)
    u && a[c] >= s && c - p >= d
      ? (i.push(c * n), (p = c), (u = !1))
      : a[c] < s * 0.35 && (u = !0);
  return i;
}
function Zc(e, t, n, a) {
  let l = Math.floor(t * 0.004),
    o = Math.max(0, n - l),
    r = Math.min(e.length, o + Math.floor(t * 0.9));
  a != null && (r = Math.min(r, Math.max(o + 1, a - l)));
  let s = e.slice(o, r),
    i = 0;
  for (let d of s) Math.abs(d) > i && (i = Math.abs(d));
  let u = i > 0 ? 0.9 / i : 1,
    p = Math.min(s.length, Math.floor(t * 0.06));
  for (let d = 0; d < s.length; d++) {
    let c = s.length - d;
    s[d] = s[d] * u * (c < p ? c / p : 1);
  }
  return s;
}
function D0(e) {
  (Ue(), !(!be || !aa.has(e)) && ((xr = null), F0(e, 1)));
}
var li = null;
var Za = () => typeof window != "undefined" && "speechSynthesis" in window;
function Na(e) {
  try {
    if (!Za() || Rl) return;
    let t = window.speechSynthesis;
    if (!li) {
      let a = t.getVoices();
      li =
        a.find((l) => /^es[-_]ES/i.test(l.lang)) ||
        a.find((l) => /^es/i.test(l.lang)) ||
        null;
    }
    t.cancel();
    let n = new SpeechSynthesisUtterance(e);
    ((n.lang = "es-ES"), li && (n.voice = li), (n.rate = 1.12), t.speak(n));
  } catch {}
}
function Tl() {
  try {
    Za() && window.speechSynthesis.cancel();
  } catch {}
}
var wr = {
  wood: 4,
  stone: 4,
};
var Tn = [
  {
    key: "stamp",
    name: "Golpe",
    short: "G",
  },
  {
    key: "heel",
    name: "Tal\xF3n",
    short: "T",
  },
  {
    key: "toe",
    name: "Punta",
    short: "P",
  },
  {
    key: "brush",
    name: "Cepillado",
    short: "C",
  },
];
var O0 = [
  ["madera", "Madera"],
  ["piedra", "Piedra"],
  ["ambas", "Las dos"],
];
var Jc = (e) =>
  e === "piedra" ? "piedra" : e === "ambas" ? "madera y piedra" : "madera";
var j0 = (e, t) => e.m || (t.material === "piedra" ? "s" : "w");
function Ja(e, t) {
  let n = Array.from(
      {
        length: t.wood,
      },
      (l, o) => ({
        m: "w",
        i: o,
        n: t.wood,
        key: `w${o}`,
      }),
    ),
    a = Array.from(
      {
        length: t.stone,
      },
      (l, o) => ({
        m: "s",
        i: o,
        n: t.stone,
        key: `s${o}`,
      }),
    );
  return e.material === "piedra"
    ? a
    : e.material === "ambas"
      ? [...n, ...a]
      : n;
}
var wa = (e, t) => (e.p === "pi" ? `f${e.plank}` : `${j0(e, t)}${e.plank}`);
function Sa(e, t, n, a) {
  if (e.b >= a) return !1;
  if (e.p === "pi") return !!t.feet && e.plank < Tn.length;
  let l = wa(e, t);
  return n.some((o) => o.key === l);
}
function Pl(e, t, n) {
  if (e.p === "pi")
    return {
      s: Tn[e.plank].key,
      arg: {
        key: `f${e.plank}`,
      },
    };
  let a = j0(e, t),
    l = a === "s" ? n.stone : n.wood;
  return {
    s: "tx",
    arg: {
      f: Nr(e.plank, l),
      hr: e.p === "hr",
      stone: a === "s",
      key: `${a}${e.plank}`,
    },
  };
}
function B0(e, t) {
  let n = e.eights * 8,
    a = Ja(e, t);
  return e.layers
    .filter((l) => !l.muted)
    .flatMap((l) =>
      l.strikes
        .filter((o) => Sa(o, e, a, n))
        .map((o) => ({
          b: o.b,
          ...Pl(o, e, t),
        })),
    );
}
function U0(e, t) {
  if (t === e.material) return e;
  if (t !== "ambas" || e.material === "ambas")
    return {
      ...e,
      material: t,
    };
  let n = e.material === "piedra" ? "s" : "w";
  return {
    ...e,
    material: t,
    layers: e.layers.map((a) => ({
      ...a,
      strikes: a.strikes.map((l) =>
        l.p === "pi" || l.m
          ? l
          : {
              ...l,
              m: n,
            },
      ),
    })),
  };
}
function V0(e, t) {
  let n = e.eights * 8,
    a = Ja(e, t),
    l = 0;
  for (let o of e.layers)
    for (let r of o.strikes) r.b < n && !Sa(r, e, a, n) && l++;
  return l;
}
var Et = (e) => Be.find((t) => t.id === e);
function jv(e) {
  let t = {},
    n = 1;
  return (
    e.forEach((a, l) => {
      ((t[a.id] = {
        start: n,
        end: n + a.len - 1,
        n: l + 1,
      }),
        (n += a.len));
    }),
    t
  );
}
function Ca(e) {
  return e.reduce((t, n) => t + n.len, 0);
}
function H0(e) {
  return e.layers.some((n) => n.strikes.some((a) => a.lane != null))
    ? {
        ...e,
        material: e.material || "madera",
        layers: e.layers.map((n) => ({
          ...n,
          strikes: n.strikes.map((a) =>
            a.lane != null
              ? {
                  b: a.b,
                  plank: a.lane % 2,
                  p: a.lane < 2 ? "tk" : "hr",
                }
              : a,
          ),
        })),
      }
    : {
        material: "madera",
        ...e,
      };
}
function Q0(e, t) {
  return {
    id: e.id,
    name: e.name,
    loopBeats: e.eights * 8,
    sounds: B0(e, t || wr),
    moves: e.moves || [],
  };
}
function Bv(e, t, n, a) {
  let l = e.blocks.reduce((o, r) => o + r.len, 0);
  return {
    id: `full-${e.id}`,
    type: "music",
    full: !0,
    block: e.blocks[0].id,
    title: `${e.title}, entera`,
    angle: "musica",
    bpm: e.bpm,
    swing: e.swing,
    counts: l * 8,
    eight: 1,
    acapella: [],
    rhythm: null,
    segments: e.blocks.map((o) => {
      let r = o.rhythmId && n ? n.find((s) => s.id === o.rhythmId) : null;
      return {
        id: o.id,
        name: o.name,
        start: t[o.id].start,
        len: o.len,
        acapella: o.acapella || [],
        rhythm: r ? Q0(r, a) : null,
      };
    }),
    events: [],
    spans: [],
    isNew: !1,
  };
}
function Uv(e, t, n, a, l) {
  let o = t.rhythmId && a ? a.find((r) => r.id === t.rhythmId) : null;
  return {
    id: `m-${t.id}`,
    type: "music",
    block: t.id,
    title: o
      ? `${t.name} con el ritmo \xAB${o.name}\xBB`
      : `${t.name} con m\xFAsica`,
    angle: "musica",
    bpm: o ? o.bpm : e.bpm,
    swing: o ? !1 : e.swing,
    counts: t.len * 8,
    eight: n[t.id].start,
    acapella: t.acapella || [],
    rhythm: o ? Q0(o, l) : null,
    events: [],
    spans: [],
    isNew: !1,
  };
}
function W0(e, t, n, a, l) {
  let o = jv(e.blocks),
    r = [...Bc, ...t],
    s = r.filter((p) => o[p.block]);
  for (let p of e.links || []) {
    let d = r.find((c) => c.id === p.src);
    d &&
      o[p.block] &&
      s.push({
        ...d,
        id: p.id,
        srcId: d.id,
        block: p.block,
        rel: p.rel || 1,
        isNew: !1,
        linked: !0,
      });
  }
  let i = s.map((p) => {
      let d = n[p.id] || {},
        c = p.srcId ? n[p.srcId] || {} : d;
      return {
        ...p,
        isNew: d.isNew != null ? d.isNew : !!p.isNew,
        angle: c.angle != null ? c.angle : p.angle,
        eight: o[p.block].start + (p.rel || 1) - 1,
      };
    }),
    u = e.blocks.map((p) => Uv(e, p, o, a, l));
  return {
    ranges: o,
    clips: i,
    music: u,
    full: Bv(e, o, a, l),
  };
}
function si(e, t, n) {
  let a = [];
  for (let l of e.blocks) {
    l.isNew &&
      n &&
      l.personal &&
      l.personal[n] &&
      a.push({
        kind: "note",
        id: `n-${l.id}`,
        block: l,
        text: l.personal[n],
      });
    for (let o of t.filter((r) => r.block === l.id && r.isNew))
      a.push({
        kind: "clip",
        id: o.id,
        block: l,
        clip: o,
      });
  }
  return a;
}
var Sr = (e) => Math.round((Math.abs(e - 50) / 50) * 8);
var nd = (e) => (Sr(e) === 0 ? "centro" : e < 50 ? "derecha" : "izquierda");
var go = (e) =>
  e >= 66
    ? "delante, cerca del p\xFAblico"
    : e >= 36
      ? "en medio del escenario"
      : "al fondo";
var vo = ([e]) => (Sr(e) === 0 ? "centro (0)" : `${Sr(e)} ${nd(e)}`);
var Vv = (e, t, n) => `${e} ${e === 1 ? t : n}`;
function G0(e, t, n) {
  let a = e.filter((o) => n.worked.includes(o.id)),
    l = [`*Clase ${$l.long.replace(/^el /, "del ")}*`, ""];
  if (a.length) {
    l.push("Hemos trabajado:");
    for (let o of a) {
      let r = o.blocks.filter((u) => u.isNew).map((u) => u.name),
        s = (t[o.id] || []).filter((u) => u.isNew).length,
        i = `\u2022 *${o.title}*: `;
      ((i += r.length ? `hemos cambiado ${qv(r)}` : "repaso, sin cambios"),
        s && (i += `. ${Vv(s, "v\xEDdeo nuevo", "v\xEDdeos nuevos")}`),
        l.push(`${i}.`));
    }
    l.push("");
  }
  return (
    l.push(
      "Si faltaste, entra con tu c\xF3digo: ver\xE1s la lista de lo nuevo en el orden en que conviene estudiarlo.",
    ),
    l.push("Para practicar: con espejo y a 0,75\xD7 hasta que salga limpio."),
    l.push(""),
    l.push("[enlace de la app]"),
    l.join(`
`)
  );
}
function qv(e) {
  return e.length <= 1
    ? e.join("")
    : `${e.slice(0, -1).join(", ")} y ${e[e.length - 1]}`;
}
function K0(e) {
  let t = e.length;
  if (t < 2) return null;
  let n = (t - 1) / 2,
    a = e.reduce((s, i) => s + i, 0) / t,
    l = 0,
    o = 0;
  e.forEach((s, i) => {
    ((l += (i - n) * (s - a)), (o += (i - n) * (i - n)));
  });
  let r = l / o;
  return r > 0.25 && r < 1.5
    ? {
        bpm: Math.round(600 / r) / 10,
        offset: Math.max(0, a - r * n),
      }
    : null;
}
function Pn(e) {
  if (!e) return null;
  let [t, n, a] = e.split("-").map(Number);
  if (!t || !n || !a) return null;
  let l = new Date(t, n - 1, a),
    o = new Date(),
    r = new Date(o.getFullYear(), o.getMonth(), o.getDate());
  return Math.round((l - r) / 864e5);
}
var Hv = ["dom", "lun", "mar", "mi\xE9", "jue", "vie", "s\xE1b"];
var Qv = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
function yo(e) {
  if (!e) return "";
  let [t, n, a] = e.split("-").map(Number),
    l = new Date(t, n - 1, a);
  return `${Hv[l.getDay()]} ${a} ${Qv[n - 1]}`;
}
function ad(e) {
  return e == null
    ? ""
    : e < 0
      ? "ya pas\xF3"
      : e === 0
        ? "\xA1es hoy!"
        : e === 1
          ? "falta 1 d\xEDa"
          : `faltan ${e} d\xEDas`;
}
function Y0(e, t) {
  let n = {};
  for (let l of e)
    for (let o of l.blocks)
      n[o.id] = {
        choreo: l,
        block: o,
      };
  return [...Bc, ...t]
    .filter((l) => l.type === "feet" || l.type === "upload")
    .filter((l) => n[l.block])
    .map((l) => {
      let o = [n[l.block]];
      for (let r of e)
        for (let s of r.links || [])
          s.src === l.id && n[s.block] && o.push(n[s.block]);
      return {
        clip: l,
        origin: n[l.block],
        uses: o,
      };
    });
}
var ho = (e, t, n) =>
  Array.from(
    {
      length: e,
    },
    (a, l) => t + ((n - t) * l) / Math.max(1, e - 1),
  );
var ld = [
  {
    id: "fila",
    name: "Fila",
    slots: (e) => ho(e, 15, 85).map((t) => [t, 55]),
  },
  {
    id: "dosfilas",
    name: "Dos filas",
    slots: (e) => {
      let t = Math.ceil(e / 2);
      return [
        ...ho(t, 22, 78).map((n) => [n, 72]),
        ...ho(e - t, 30, 70).map((n) => [n, 40]),
      ];
    },
  },
  {
    id: "cuna",
    name: "Cu\xF1a",
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
    slots: (e) => ho(e, 0, 1).map((t) => [18 + 65 * t, 22 + 60 * t]),
  },
  {
    id: "semicirculo",
    name: "Semic\xEDrculo",
    slots: (e) =>
      ho(e, Math.PI, 2 * Math.PI).map((t) => [
        50 + 36 * Math.cos(t),
        66 + 34 * Math.sin(t),
      ]),
  },
  {
    id: "circulo",
    name: "C\xEDrculo",
    slots: (e) =>
      ho(e + 1, -Math.PI / 2, 1.5 * Math.PI)
        .slice(0, e)
        .map((t) => [50 + 28 * Math.cos(t), 52 + 24 * Math.sin(t)]),
  },
];
function X0(e, t) {
  let n = ld.find((i) => i.id === e),
    a = Object.keys(t),
    l = n
      .slots(a.length)
      .map(([i, u]) => [Math.round(i * 2) / 2, Math.round(u * 2) / 2]),
    o = [...a].sort((i, u) => t[i][0] - t[u][0] || t[i][1] - t[u][1]),
    r = l
      .map((i, u) => u)
      .sort((i, u) => l[i][0] - l[u][0] || l[i][1] - l[u][1]),
    s = {};
  return (
    o.forEach((i, u) => {
      s[i] = l[r[u]];
    }),
    s
  );
}
var ed = 1;
var td = 11 / 16;
var q0 = 7;
function Z0(e, t) {
  if (!t) return [];
  let n = Object.keys(t),
    a = [];
  for (let l = 0; l < n.length; l++)
    for (let o = l + 1; o < n.length; o++) {
      let r = n[l],
        s = n[o],
        i = t[r],
        u = t[s];
      if (Math.hypot((i[0] - u[0]) * ed, (i[1] - u[1]) * td) < q0) {
        a.push({
          a: r,
          b: s,
          kind: "juntas",
        });
        continue;
      }
      if (!e || !e[r] || !e[s]) continue;
      let d = e[r],
        c = e[s],
        h = [(d[0] - c[0]) * ed, (d[1] - c[1]) * td],
        b = [
          (i[0] - d[0] - (u[0] - c[0])) * ed,
          (i[1] - d[1] - (u[1] - c[1])) * td,
        ],
        y = b[0] * b[0] + b[1] * b[1];
      if (!y) continue;
      let M = Math.max(0, Math.min(1, -(h[0] * b[0] + h[1] * b[1]) / y));
      Math.hypot(h[0] + M * b[0], h[1] + M * b[1]) < q0 &&
        M > 0.02 &&
        M < 0.98 &&
        a.push({
          a: r,
          b: s,
          kind: "cruce",
        });
    }
  return a;
}
var Wv = (e) => {
  let t = Math.floor(e),
    n = e - t;
  return (
    t + (n <= 0.5 ? (n * 4) / 3 : 0.6666666666666666 + ((n - 0.5) * 2) / 3)
  );
};
var Gv = (e) => {
  let t = Math.floor(e),
    n = e - t;
  return (
    t +
    (n <= 0.6666666666666666 ? n * 0.75 : 0.5 + (n - 0.6666666666666666) * 1.5)
  );
};
var od = (e) => 60 / e.bpm;
function eh(e, t) {
  let n = t + 4;
  return (e.swing && (n = Wv(n)), n * od(e));
}
function th(e, t) {
  let n = t / od(e);
  return (e.swing && (n = Gv(n)), n - 4);
}
function ii(e) {
  return (e.counts + 4) * od(e);
}
function bo(e) {
  return (((Math.floor(e + 1e-6) % 8) + 8) % 8) + 1;
}
var rd = ["", "\xB7", "y", "\xB7"];
function nh(e) {
  let t = Math.floor(e * 4 + 1e-6);
  return rd[((t % 4) + 4) % 4];
}
function Ll(e) {
  return ((Math.floor(e * 4 + 1e-6) % 4) + 4) % 4 === 2
    ? `${bo(e)} y`
    : `${bo(e)}`;
}
function ui(e, t, n) {
  let a = [],
    l = (o, r, s) => {
      let i = t(o);
      i >= 0 &&
        a.push({
          time: i,
          kind: r,
          arg: s,
        });
    };
  if (n.countIn)
    for (let o = -4; o < 0; o++) l(o, o === -4 ? "clickHi" : "click");
  if (n.metro)
    for (let o = 0; o < n.counts; o++) l(o, o % 8 === 0 ? "clickHi" : "click");
  if (n.backing)
    for (let o of sd(
      0,
      n.counts,
      n.swing,
      (r) => !!(n.acapella && n.acapella.includes(r)),
    ))
      l(o.b, o.s, o.arg);
  for (let o of e) l(o.b, o.s, o.arg);
  return a.sort((o, r) => o.time - r.time);
}
function sd(e, t, n, a) {
  let l = [];
  for (let o = 0; o < t; o++) {
    if (a && a(Math.floor(o / 8) + 1)) continue;
    let r = e + o,
      s = o % 4;
    ((s === 0 || s === 2) &&
      l.push({
        b: r,
        s: "kick",
      }),
      (s === 1 || s === 3) &&
        l.push({
          b: r,
          s: "snare",
        }),
      l.push({
        b: r,
        s: "ride",
      }),
      (!n || s === 1 || s === 3) &&
        l.push({
          b: r + 0.5,
          s: "rideSoft",
        }),
      l.push({
        b: r,
        s: "bass",
        arg: J0[o % J0.length],
      }));
  }
  return l;
}
var J0 = [
  87.31, 110, 130.81, 146.83, 116.54, 146.83, 174.61, 196, 87.31, 110, 130.81,
  110, 130.81, 164.81, 196, 233.08,
];
function la(e) {
  (!isFinite(e) || e < 0) && (e = 0);
  let t = Math.floor(e / 60),
    n = Math.floor(e % 60),
    a = Math.floor((e % 1) * 10);
  return `${t}:${String(n).padStart(2, "0")},${a}`;
}
var Ln = (e, t, n) => Math.max(t, Math.min(n, e));
var ci = {
  R: "#EE8B26",
  L: "#1AA2B2",
};
var di = ["#CFA877", "#C79F6D", "#D3AE7E", "#C49A69", "#CCA473"];
var ud = '"IBM Plex Mono", ui-monospace, monospace';
var Kv = "Archivo, system-ui, sans-serif";
var id = {
  key: "",
  c: null,
};
function Yv(e) {
  let t = e;
  return () => (t = (t * 16807) % 2147483647) / 2147483647;
}
function lh(e, t, n) {
  let a = `${t}x${n}`;
  if (id.key !== a) {
    let l = document.createElement("canvas");
    ((l.width = t), (l.height = n));
    let o = l.getContext("2d"),
      r = Yv(42),
      s = Math.max(12, Math.round(n / 10)),
      i = Math.max(1, n / 360);
    for (let u = 0, p = 0; u < n; u += s, p++) {
      ((o.fillStyle = di[p % di.length]),
        o.fillRect(0, u, t, s),
        (o.strokeStyle = "rgba(110,70,30,0.10)"),
        (o.lineWidth = Math.max(1, n / 500)));
      for (let c = 0; c < 4; c++) {
        let h = u + r() * s;
        (o.beginPath(),
          o.moveTo(0, h),
          o.bezierCurveTo(
            t * 0.33,
            h + (r() - 0.5) * s * 0.5,
            t * 0.66,
            h + (r() - 0.5) * s * 0.5,
            t,
            h + (r() - 0.5) * s * 0.3,
          ),
          o.stroke());
      }
      ((o.fillStyle = "rgba(70,40,15,0.45)"), o.fillRect(0, u + s - i, t, i));
      let d = r() * t * 0.6;
      for (; d < t;) (o.fillRect(d, u, i, s), (d += t * (0.4 + r() * 0.5)));
    }
    id = {
      key: a,
      c: l,
    };
  }
  e.drawImage(id.c, 0, 0);
}
function oh(e, t, n) {
  let a = e.createRadialGradient(
    t / 2,
    n * 0.55,
    Math.min(t, n) * 0.25,
    t / 2,
    n * 0.55,
    Math.max(t, n) * 0.75,
  );
  (a.addColorStop(0, "rgba(0,0,0,0)"),
    a.addColorStop(1, "rgba(10,6,2,0.55)"),
    (e.fillStyle = a),
    e.fillRect(0, 0, t, n));
}
function Ma(e, t, n, a, l, o, r, s = 700, i = Kv) {
  (e.save(),
    e.translate(n, a),
    l && e.scale(-1, 1),
    (e.font = `${s} ${Math.max(8, Math.round(o))}px ${i}`),
    (e.fillStyle = r),
    (e.textAlign = "center"),
    (e.textBaseline = "middle"),
    e.fillText(t, 0, 0),
    e.restore());
}
var rh = (e, t) => (e && e.sounds[t] ? e.sounds[t].name : t);
function Xv(e, t, n, a) {
  (e.beginPath(),
    e.moveTo(0, -0.5 * t),
    e.bezierCurveTo(a * 0.55, -0.5 * t, a * 0.55, -0.32 * t, a * 0.5, -0.2 * t),
    e.bezierCurveTo(a * 0.45, -0.05 * t, n * 0.5, 0.05 * t, n * 0.5, 0.2 * t),
    e.bezierCurveTo(n * 0.5, 0.42 * t, n * 0.2, 0.5 * t, 0, 0.5 * t),
    e.bezierCurveTo(-n * 0.2, 0.5 * t, -n * 0.5, 0.42 * t, -n * 0.5, 0.2 * t),
    e.bezierCurveTo(
      -n * 0.5,
      0.05 * t,
      -a * 0.45,
      -0.05 * t,
      -a * 0.5,
      -0.2 * t,
    ),
    e.bezierCurveTo(-a * 0.55, -0.32 * t, -a * 0.55, -0.5 * t, 0, -0.5 * t),
    e.closePath());
}
function Zv(e, t, n, a, l, o, r, s) {
  let i = 30 * l,
    u = 11.5 * l,
    p = 8.5 * l;
  (e.save(),
    e.translate(t + r * 1.6 * l, n + a + 1.6 * l),
    e.rotate(o),
    (e.fillStyle = `rgba(40,22,5,${0.4 - r * 0.2})`),
    e.beginPath(),
    e.ellipse(
      0,
      0,
      u * 0.62 * (1 + r * 0.18),
      i * 0.54 * (1 + r * 0.08),
      0,
      0,
      Math.PI * 2,
    ),
    e.fill(),
    e.restore(),
    e.save(),
    e.translate(t, n + a - r * 2.6 * l),
    e.rotate(o));
  let d = 1 + r * 0.05;
  e.scale(d, d);
  let c = e.createLinearGradient(-u / 2, 0, u / 2, 0);
  (c.addColorStop(0, "#2B2A33"),
    c.addColorStop(0.45, "#17161C"),
    c.addColorStop(1, "#0B0B0F"),
    Xv(e, i, u, p),
    (e.fillStyle = c),
    e.fill(),
    (e.strokeStyle = "rgba(255,255,255,0.16)"),
    (e.lineWidth = 0.5 * l),
    e.stroke(),
    (e.fillStyle = "#060608"),
    e.beginPath(),
    e.ellipse(0, -0.24 * i, p * 0.34, 0.15 * i, 0, 0, Math.PI * 2),
    e.fill(),
    (e.strokeStyle = s),
    (e.lineWidth = 1.3 * l),
    (e.lineCap = "round"));
  for (let h = 0; h < 3; h++) {
    let b = -0.04 * i + h * 0.065 * i;
    (e.beginPath(),
      e.moveTo(-u * 0.22, b),
      e.lineTo(u * 0.22, b + 0.02 * i),
      e.stroke());
  }
  ((e.strokeStyle = "#D9DDE3"),
    (e.lineWidth = 1.2 * l),
    e.beginPath(),
    e.ellipse(
      0,
      0.33 * i,
      u * 0.47,
      0.17 * i,
      0,
      0.12 * Math.PI,
      0.88 * Math.PI,
    ),
    e.stroke(),
    e.beginPath(),
    e.ellipse(
      0,
      -0.36 * i,
      p * 0.5,
      0.14 * i,
      0,
      1.15 * Math.PI,
      1.85 * Math.PI,
    ),
    e.stroke(),
    e.restore());
}
function ah(e, t, n) {
  let a = Math.cos(n),
    l = Math.sin(n);
  return [e * a - t * l, e * l + t * a];
}
function sh(e, t, n, a, l, o, r) {
  (lh(e, t, n), oh(e, t, n));
  let s = n / 100,
    i = {
      R: {
        x: t / 2 - 11 * s,
        y: n * 0.52,
        rot: 0.12,
      },
      L: {
        x: t / 2 + 11 * s,
        y: n * 0.52,
        rot: -0.12,
      },
    },
    u = {};
  for (let p of ["R", "L"]) {
    let d = null,
      c = null;
    for (let y of a.events)
      if (y.f === p)
        if (y.b <= l + 1e-6) d = y;
        else {
          c = y;
          break;
        }
    let h = 0,
      b = 0;
    if (d && (d.s === "brush" || d.s === "scuff")) {
      let y = Math.max(0, 1 - (l - d.b) / 0.6);
      ((h += 8 * s * y), (b = Math.max(b, y)));
    }
    if (d && d.s === "spank") {
      let y = Math.max(0, 1 - (l - d.b) / 0.6);
      ((h -= 6 * s * y), (b = Math.max(b, y)));
    }
    (c &&
      c.b - l < 0.3 &&
      c.s !== "heel" &&
      (b = Math.max(b, 1 - (c.b - l) / 0.3)),
      (u[p] = {
        dy: h,
        lift: b,
      }),
      Zv(e, i[p].x, i[p].y, h, s, i[p].rot, b, ci[p]),
      Ma(
        e,
        p === "R" ? "D" : "I",
        i[p].x,
        i[p].y - 24 * s,
        o,
        5 * s,
        ci[p],
        800,
      ));
  }
  for (let p of a.events) {
    let d = l - p.b;
    if (d < 0 || d > 0.55) continue;
    let c = d / 0.55,
      h = 30 * s,
      b =
        p.s === "stamp"
          ? ["toe", "heel"]
          : ["heel", "dig", "scuff"].includes(p.s)
            ? ["heel"]
            : ["toe"],
      y = i[p.f],
      M = u[p.f];
    for (let f of b) {
      let [m, v] = ah(0, f === "toe" ? 0.38 * h : -0.4 * h, y.rot),
        w = y.x + m,
        P = y.y + M.dy + v;
      ((e.strokeStyle = `rgba(255,236,190,${(1 - c) * 0.95})`),
        (e.lineWidth = (1 - c) * 1.1 * s + 0.3 * s),
        e.beginPath(),
        e.arc(w, P, (2.5 + c * 11) * s, 0, Math.PI * 2),
        e.stroke());
    }
    if (d < 0.45) {
      let [f, m] = ah(0, b[0] === "toe" ? 0.38 * h : -0.4 * h, y.rot),
        v = y.y + M.dy + m + (b[0] === "toe" ? 1 : -1) * (9 + c * 5) * s;
      Ma(
        e,
        rh(r, p.s),
        y.x + f + (p.f === "R" ? -9 : 9) * s,
        v,
        o,
        3.8 * s,
        `rgba(255,248,232,${1 - c})`,
        600,
        ud,
      );
    }
  }
}
var Jv = (e) => (e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2);
function ey(e, t, n, a) {
  let l = n[e.to][a],
    o = e.from === "entrada" ? [-8, l[1]] : n[e.from][a],
    r = e.order ? e.order.indexOf(a) * e.stagger : 0,
    s = Math.max(0, Math.min(1, (t - r) / e.move)),
    i = Jv(s);
  return {
    x: o[0] + (l[0] - o[0]) * i,
    y: o[1] + (l[1] - o[1]) * i,
    p: s,
  };
}
function ih(e, t, n, a, l, o, r, s) {
  lh(e, t, n);
  let i = n * 0.13,
    u = t * 0.07,
    p = u,
    d = t - 2 * u,
    c = n - i;
  ((e.fillStyle = "#16120E"),
    e.fillRect(0, 0, u, c),
    e.fillRect(t - u, 0, u, c),
    (e.fillStyle = "rgba(255,240,220,0.06)"));
  for (let f = 1; f < 4; f++)
    (e.fillRect(u * (f / 4), 0, Math.max(1, t / 900), c),
      e.fillRect(t - u * (f / 4), 0, Math.max(1, t / 900), c));
  ((e.fillStyle = "#0D0B09"), e.fillRect(0, c, t, i));
  let h = Math.max(2, n / 180);
  ((e.fillStyle = "#EDE3D2"),
    e.fillRect(p, c - h, d, h),
    e.save(),
    (e.strokeStyle = "rgba(255,248,235,0.45)"),
    e.setLineDash([n / 60, n / 60]),
    (e.lineWidth = Math.max(1, n / 300)),
    e.beginPath(),
    e.moveTo(t / 2, 0),
    e.lineTo(t / 2, c),
    e.stroke(),
    e.restore(),
    [8, 6, 4, 2, 0, 2, 4, 6, 8].forEach((f, m) => {
      let v = p + (d * m) / 8;
      ((e.fillStyle = f === 0 ? "#FFD86B" : "rgba(245,238,225,0.8)"),
        e.fillRect(v - h / 2, c - n * 0.03, h, n * 0.03),
        Ma(
          e,
          String(f),
          v,
          c + i * 0.33,
          s,
          i * 0.27,
          f === 0 ? "#FFD86B" : "rgba(240,230,215,0.8)",
          500,
          ud,
        ));
    }),
    Ma(
      e,
      "P\xDABLICO",
      t / 2,
      c + i * 0.75,
      s,
      i * 0.2,
      "rgba(240,230,215,0.5)",
      700,
    ),
    Ma(e, "FONDO", t / 2, n * 0.04, s, i * 0.18, "rgba(60,35,12,0.55)", 700));
  let b = Math.min(d, c) * 0.055,
    y = (f, m) => [p + (d * f) / 100, (c * m) / 100],
    M = [...Be].sort((f, m) => (f.id === r) - (m.id === r));
  for (let f of M) {
    let m = ey(a, l, o, f.id),
      [v, w] = y(m.x, m.y),
      P = r === f.id,
      T = r && !P,
      $ = m.x < 0;
    ((e.globalAlpha = $ || T ? 0.55 : 1),
      (e.fillStyle = "rgba(30,15,0,0.35)"),
      e.beginPath(),
      e.ellipse(
        v + b * 0.15,
        w + b * 0.35,
        b * 1.05,
        b * 0.7,
        0,
        0,
        Math.PI * 2,
      ),
      e.fill(),
      P &&
        ((e.strokeStyle = "#FF3D8F"),
        (e.lineWidth = b * 0.32),
        e.beginPath(),
        e.arc(v, w, b * 1.38, 0, Math.PI * 2),
        e.stroke()),
      (e.fillStyle = f.tape),
      e.beginPath(),
      e.arc(v, w, b, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "rgba(20,12,4,0.5)"),
      (e.lineWidth = Math.max(1, b * 0.08)),
      e.stroke(),
      Ma(e, f.name[0], v, w + b * 0.04, s, b * 1.05, f.ink, 800),
      P && Ma(e, "T\xDA", v, w - b * 2.1, s, b * 0.75, "#FF3D8F", 800),
      (e.globalAlpha = 1));
  }
}
function ty(e, t, n) {
  let a = null,
    l = null;
  for (let r of e.events)
    if (r.f === t)
      if (r.b <= n + 1e-6) a = r;
      else {
        l = r;
        break;
      }
  let o = {
    lift: 0,
    dx: 0,
    heelUp: 0,
    toeUp: 0,
  };
  if (a) {
    let r = Math.max(0, 1 - (n - a.b) / 0.6);
    a.s === "brush" || a.s === "scuff"
      ? ((o.dx += 9 * r), (o.lift = Math.max(o.lift, 0.5 * r)))
      : a.s === "spank"
        ? ((o.dx -= 7 * r), (o.lift = Math.max(o.lift, 0.5 * r)))
        : a.s === "dig" && (o.toeUp = Math.max(o.toeUp, r));
  }
  if (l) {
    let r = Math.max(0, 1 - (l.b - n) / 0.3);
    l.s === "heel"
      ? (o.heelUp = Math.max(o.heelUp, r))
      : l.s === "toe"
        ? (o.toeUp = Math.max(o.toeUp, r))
        : l.s === "dig"
          ? ((o.toeUp = Math.max(o.toeUp, r)),
            (o.lift = Math.max(o.lift, r * 0.6)))
          : (o.lift = Math.max(o.lift, r));
  }
  return o;
}
function ny(e, t, n, a, l, o, r, s) {
  let i = 34 * a * l;
  (e.save(),
    e.translate(t + o.dx * a, n - o.lift * 5 * a),
    o.heelUp > 0 &&
      (e.translate(0.45 * i, 0),
      e.rotate(0.32 * o.heelUp),
      e.translate(-0.45 * i, 0)),
    o.toeUp > 0 &&
      (e.translate(-0.45 * i, 0),
      e.rotate(-0.36 * o.toeUp),
      e.translate(0.45 * i, 0)),
    (e.fillStyle = s ? "#1f1a24" : "#2c2533"),
    e.beginPath(),
    e.moveTo(-0.42 * i, -0.36 * i),
    e.lineTo(-0.16 * i, -0.4 * i),
    e.lineTo(-0.1 * i, -3 * i),
    e.lineTo(-0.44 * i, -3 * i),
    e.closePath(),
    e.fill());
  let u = e.createLinearGradient(0, -0.42 * i, 0, 0);
  (u.addColorStop(0, s ? "#1b1a20" : "#34333d"),
    u.addColorStop(1, s ? "#08080b" : "#0d0d11"),
    (e.fillStyle = u),
    e.beginPath(),
    e.moveTo(-0.5 * i, 0),
    e.lineTo(0.47 * i, 0),
    e.quadraticCurveTo(0.54 * i, -0.02 * i, 0.5 * i, -0.1 * i),
    e.quadraticCurveTo(0.44 * i, -0.2 * i, 0.25 * i, -0.24 * i),
    e.lineTo(0, -0.33 * i),
    e.lineTo(-0.2 * i, -0.42 * i),
    e.lineTo(-0.44 * i, -0.38 * i),
    e.quadraticCurveTo(-0.54 * i, -0.3 * i, -0.5 * i, 0),
    e.closePath(),
    e.fill(),
    (e.strokeStyle = "rgba(255,255,255,0.14)"),
    (e.lineWidth = 0.4 * a),
    e.stroke(),
    (e.fillStyle = "#060608"),
    e.fillRect(-0.5 * i, -0.08 * i, 0.21 * i, 0.08 * i),
    (e.strokeStyle = r),
    (e.lineWidth = 1.1 * a * l),
    (e.lineCap = "round"));
  for (let p = 0; p < 3; p++) {
    let d = p / 2,
      c = 0.02 * i + d * 0.16 * i,
      h = -0.32 * i + d * 0.07 * i;
    (e.beginPath(),
      e.moveTo(c - 0.03 * i, h - 0.03 * i),
      e.lineTo(c + 0.03 * i, h + 0.02 * i),
      e.stroke());
  }
  ((e.fillStyle = s ? "#9aa0a8" : "#D9DDE3"),
    e.fillRect(0.1 * i, -0.005 * i, 0.37 * i, 0.035 * i),
    e.fillRect(-0.49 * i, -0.005 * i, 0.19 * i, 0.035 * i),
    e.restore());
}
function uh(e, t, n, a, l, o, r) {
  let s = n / 100,
    i = n * 0.56,
    u = e.createLinearGradient(0, 0, 0, i);
  (u.addColorStop(0, "#2a2830"),
    u.addColorStop(1, "#3b3742"),
    (e.fillStyle = u),
    e.fillRect(0, 0, t, i),
    (e.fillStyle = "rgba(255,255,255,0.05)"),
    e.fillRect(0, i * 0.18, t, i * 0.5),
    (e.fillStyle = "#18161c"),
    e.fillRect(0, i - 1.6 * s, t, 1.6 * s));
  let p = 9;
  for (let h = 0; h < p; h++) {
    let b = i + (n - i) * Math.pow(h / p, 1.7),
      y = i + (n - i) * Math.pow((h + 1) / p, 1.7);
    ((e.fillStyle = di[h % di.length]),
      e.fillRect(0, b, t, y - b + 1),
      (e.fillStyle = "rgba(70,40,15,0.35)"),
      e.fillRect(0, y, t, Math.max(1, n / 400)));
  }
  oh(e, t, n);
  let d = [
      {
        f: "L",
        x: t * 0.47,
        y: i + 15 * s,
        s: 0.88,
        back: !0,
      },
      {
        f: "R",
        x: t * 0.53,
        y: i + 27 * s,
        s: 1,
        back: !1,
      },
    ],
    c = {};
  for (let h of d) {
    let b = ty(a, h.f, l);
    ((c[h.f] = b),
      (e.fillStyle = `rgba(30,15,0,${0.38 - b.lift * 0.15})`),
      e.beginPath(),
      e.ellipse(
        h.x + b.dx * s,
        h.y + 0.8 * s,
        17 * s * h.s * (1 + b.lift * 0.1),
        2.2 * s * h.s,
        0,
        0,
        Math.PI * 2,
      ),
      e.fill(),
      ny(e, h.x, h.y, s, h.s, b, ci[h.f], h.back),
      Ma(
        e,
        h.f === "R" ? "D" : "I",
        h.x - 24 * s * h.s,
        h.y - 4 * s,
        o,
        4.6 * s,
        ci[h.f],
        800,
      ));
  }
  for (let h of a.events) {
    let b = l - h.b;
    if (b < 0 || b > 0.55) continue;
    let y = b / 0.55,
      M = d.find((w) => w.f === h.f),
      f = c[h.f],
      m = 34 * s * M.s,
      v =
        h.s === "stamp"
          ? [0.3, -0.4]
          : ["heel", "dig", "scuff"].includes(h.s)
            ? [-0.4]
            : [0.36];
    for (let w of v) {
      let P = M.x + f.dx * s + w * m;
      ((e.strokeStyle = `rgba(255,236,190,${(1 - y) * 0.95})`),
        (e.lineWidth = (1 - y) * 1.1 * s + 0.3 * s),
        e.beginPath(),
        e.ellipse(
          P,
          M.y,
          (2.5 + y * 12) * s,
          (1 + y * 4) * s,
          0,
          0,
          Math.PI * 2,
        ),
        e.stroke());
    }
    if (b < 0.45) {
      let w = M.x + f.dx * s + v[0] * m,
        P = M.back ? M.y - 20 * s - y * 4 * s : M.y + 9 * s + y * 3 * s;
      Ma(
        e,
        rh(r, h.s),
        w,
        Math.min(P, n - 4 * s),
        o,
        3.8 * s,
        `rgba(255,248,232,${1 - y})`,
        600,
        ud,
      );
    }
  }
}
function on(e) {
  let [t, n] = useState(null);
  return (
    useEffect(() => {
      let a = !0;
      try {
        let l = typeof window != "undefined" ? window.claude : null;
        l &&
          typeof l.use == "function" &&
          l
            .use(e)
            .then((o) => a && n(o || null))
            .catch(() => {});
      } catch {}
      return () => {
        a = !1;
      };
    }, [e]),
    t
  );
}
var fi = (e) =>
  (e || "archivo")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "archivo";
async function el(e, t, n) {
  try {
    return (
      await e.save({
        filename: t,
        data: n,
      }),
      "Guardado."
    );
  } catch (a) {
    let l = a && a.code;
    return l === "declined"
      ? null
      : l === "rate_limited"
        ? "Ya hay una descarga esperando. Prueba en unos segundos."
        : "No se ha podido guardar el archivo aqu\xED.";
  }
}
var uy = {
  play: {
    fill: !0,
    d: ["M8 5.5v13l10.5-6.5z"],
  },
  pause: {
    fill: !0,
    d: ["M7 5h3.5v14H7z", "M13.5 5H17v14h-3.5z"],
  },
  restart: {
    d: ["M4 5v5h5", "M5.2 15a7.5 7.5 0 1 0 1.3-7.8L4 10"],
  },
  mirror: {
    d: ["M12 3v18", "M9 7 4 17h5z", "M15 7l5 10h-5z"],
  },
  loop: {
    d: [
      "M17 3l3 3-3 3",
      "M4 12v-1a5 5 0 0 1 5-5h11",
      "M7 21l-3-3 3-3",
      "M20 12v1a5 5 0 0 1-5 5H4",
    ],
  },
  metro: {
    d: ["M9 3h6l4 18H5z", "M8 15h8", "M12 15l5-9"],
  },
  sound: {
    d: [
      "M4 9h4l5-4v14l-5-4H4z",
      "M16.5 8.5a5 5 0 0 1 0 7",
      "M19 6a8.5 8.5 0 0 1 0 12",
    ],
  },
  mute: {
    d: ["M4 9h4l5-4v14l-5-4H4z", "M17 9l5 6", "M22 9l-5 6"],
  },
  upload: {
    d: ["M12 15V4", "M7 9l5-5 5 5", "M5 20h14"],
  },
  edit: {
    d: ["M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"],
  },
  copy: {
    d: ["M9 9h11v11H9z", "M5 15H4V4h11v1"],
  },
  check: {
    d: ["M5 12.5l4.5 4.5L19 7.5"],
  },
  x: {
    d: ["M6 6l12 12", "M18 6 6 18"],
  },
  arrow: {
    d: ["M5 12h14", "M13 6l6 6-6 6"],
  },
  txala: {
    d: ["M3 10h18", "M3 15h18", "M8 3.5l1.2 6.5", "M16 3.5l-1.2 6.5"],
  },
  record: {
    fill: !0,
    d: ["M12 6.5a5.5 5.5 0 1 0 0.001 0z"],
  },
  stop: {
    fill: !0,
    d: ["M7 7h10v10H7z"],
  },
  undo: {
    d: ["M9 14 4 9l5-5", "M4 9h10.5a5.5 5.5 0 0 1 0 11H11"],
  },
  ladder: {
    d: ["M3 20h5v-5h5v-5h5V5h3"],
  },
  feet: {
    d: [
      "M7 4c2 0 3 1.6 3 4s-1 4.5-3 4.5S4 10.5 4 8s1-4 3-4z",
      "M5 15.5h4v3.5H5z",
      "M16 7c2 0 3 1.6 3 4s-1 4.5-3 4.5-3-2-3-4.5S14 7 16 7z",
      "M14 18.5h4V22h-4z",
    ],
  },
  download: {
    d: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  },
  expand: {
    d: ["M4 9V4h5", "M20 9V4h-5", "M4 15v5h5", "M20 15v5h-5"],
  },
  flag: {
    d: ["M5 21V4", "M5 4h11l-2 4 2 4H5"],
  },
  compare: {
    d: ["M4 5h7v14H4z", "M13 5h7v14h-7z"],
  },
  spark: {
    d: [
      "M12 3v5",
      "M12 16v5",
      "M3 12h5",
      "M16 12h5",
      "M6.5 6.5l2.5 2.5",
      "M15 15l2.5 2.5",
      "M17.5 6.5 15 9",
      "M9 15l-2.5 2.5",
    ],
  },
  voice: {
    d: [
      "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z",
      "M5 11a7 7 0 0 0 14 0",
      "M12 18v3",
    ],
  },
  sun: {
    d: [
      "M12 8a4 4 0 1 0 0.001 0z",
      "M12 2v2",
      "M12 20v2",
      "M2 12h2",
      "M20 12h2",
      "M4.9 4.9l1.4 1.4",
      "M17.7 17.7l1.4 1.4",
      "M4.9 19.1l1.4-1.4",
      "M17.7 6.3l1.4-1.4",
    ],
  },
  remote: {
    d: [
      "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
      "M10.5 8.5 14 11l-3.5 2.5z",
      "M11 17.5h2",
    ],
  },
  save: {
    d: ["M5 4h11l3 3v13H5z", "M8 4v5h7V4", "M8 20v-6h8v6"],
  },
};
function O({ name, size = 16 }) {
  let n = uy[name];
  return n ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={n.fill ? "currentColor" : "none"}
      stroke={n.fill ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {n.d.map((a, l) => (
        <path key={l} d={a} />
      ))}
    </svg>
  ) : null;
}
function CFh({ angle }) {
  return angle === "pies" ? (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      <path
        d="M18 3c2.6 0 4 1.8 4 4.4 0 2.4-1 3.4-1 6 0 2.4 1.4 3.6 1.4 6.4 0 3.4-1.8 6.2-4.6 6.2s-4.6-2.8-4.6-6.2c0-2.8 1.4-4 1.4-6.4 0-2.6-1-3.6-1-6C13.6 4.8 15.4 3 18 3z"
        fill="#16151B"
      />
      <path
        d="M30 3c2.6 0 4.4 1.8 4.4 4.4 0 2.4-1 3.4-1 6 0 2.4 1.4 3.6 1.4 6.4 0 3.4-1.8 6.2-4.6 6.2s-4.6-2.8-4.6-6.2c0-2.8 1.4-4 1.4-6.4 0-2.6-1-3.6-1-6C26 4.8 27.4 3 30 3z"
        fill="#16151B"
      />
      <path d="M15 12.5h6M27 12.5h6" stroke="var(--foot-r)" strokeWidth="1.6" />
    </svg>
  ) : angle === "escenario" ? (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      <rect
        x="4"
        y="4"
        width="40"
        height="19"
        rx="1"
        fill="none"
        stroke="rgba(255,244,228,.55)"
      />
      <circle cx="13" cy="10" r="2.6" fill="#E2453C" />
      <circle cx="21" cy="13" r="2.6" fill="#EDB92E" />
      <circle cx="29" cy="16" r="2.6" fill="#2F6FE4" />
      <circle cx="37" cy="19" r="2.6" fill="#2E9E58" />
      <path
        d="M4 26.5h40"
        stroke="rgba(255,244,228,.4)"
        strokeDasharray="2 3"
      />
    </svg>
  ) : angle === "musica" ? (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      {[6, 12, 18, 9, 22, 14, 8, 17, 11, 20, 7].map((t, n) => (
        <rect
          key={n}
          x={4 + n * 3.8}
          y={15 - t / 2}
          width="2.2"
          height={t}
          rx="1"
          fill="rgba(255,255,255,.85)"
        />
      ))}
    </svg>
  ) : (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      <rect
        x="9"
        y="5"
        width="30"
        height="20"
        rx="2"
        fill="none"
        stroke="rgba(255,255,255,.7)"
        strokeWidth="1.5"
      />
      <path d="M21 10.5v9l7-4.5z" fill="rgba(255,255,255,.85)" />
    </svg>
  );
}
var hi = {
  tk: "Ttakun",
  hr: "Herren",
};
var mh = {
  tk: "#EE7447",
  hr: "#38B8CC",
};
var cy = {
  8: 0.5,
  16: 0.25,
  free: null,
};
var hh = (e) => `${e.m === "s" ? "Piedra" : "Madera"} ${e.i + 1}`;
var gh = (e, t) => ((e % t) + t) % t;
function CVh({ rhythm, instruments, onAddLayers, onClose, onPractice }) {
  let o = on("room"),
    r = useMemo(() => Ja(rhythm, instruments), [rhythm, instruments]),
    [s, i] = useState(!1),
    [u, p] = useState("tk"),
    [d, c] = useState(!1),
    [h, b] = useState(null),
    [y, M] = useState(0),
    [f, m] = useState(null),
    v = useRef([]),
    w = useRef(new Map()),
    P = useRef(null),
    T = useRef(null),
    $ = rhythm.eights * 8,
    A = 60 / rhythm.bpm,
    Y = (_, B) => {
      let G = Pl(
        {
          p: _,
          plank: B.i,
          m: B.m,
        },
        rhythm,
        instruments,
      );
      Ft(G.s, G.arg);
    },
    F = (_, B) => {
      (v.current.push({
        t: Fe(),
        p: _,
      }),
        v.current.length > 80 && v.current.shift());
      let G = w.current.get(`${_}:${B}`);
      G &&
        (G.classList.remove("is-lit"),
        G.offsetWidth,
        G.classList.add("is-lit"));
    },
    Z = (_, B) => {
      (Ue(), Y(_, B), F(_, B.key));
      let G = T.current;
      if (G && G.phase === "rec") {
        let ee = (Fe() - G.start) / A;
        ee >= -0.25 &&
          ee < $ &&
          G.strikes.push({
            b: ee,
            p: _,
            plank: B.i,
            m: B.m,
          });
      }
      s &&
        o &&
        o
          .emit("duo.hit", {
            p: _,
            m: B.m,
            i: B.i,
          })
          .catch((ee) =>
            m(
              ee && ee.code === "not_permitted"
                ? "Este m\xF3vil no puede enviar golpes: hace falta permiso de edici\xF3n en la demo."
                : "Se ha perdido la conexi\xF3n con el otro m\xF3vil.",
            ),
          );
    };
  (useEffect(() => {
    if (!s || !o) return;
    let _ = o.on(
      "duo.hit",
      (G) => {
        if (G.sameTab || !G.data) return;
        let { p: ee, m: me, i: pe } = G.data;
        if (
          (ee !== "tk" && ee !== "hr") ||
          (me !== "w" && me !== "s") ||
          !Number.isInteger(pe)
        )
          return;
        let ke =
          r.find((H) => H.m === me && H.i === pe) ||
          r[Math.min(pe, r.length - 1)];
        ke && (Y(ee, ke), F(ee, ke.key));
      },
      () => m("Se ha perdido la conexi\xF3n con el otro m\xF3vil."),
    );
    o.presence({
      duo: {
        role: u,
      },
    }).catch(() => {});
    let B = o.onPeers((G) =>
      M(
        G.peers.filter((ee) => !ee.sameTab && ee.presence && ee.presence.duo)
          .length,
      ),
    );
    return () => {
      (_(),
        B(),
        o
          .presence({
            duo: null,
          })
          .catch(() => {}));
    };
  }, [s, o, r, u]),
    useEffect(() => {
      if (!d && !h) return;
      (Ue(), _t(!0));
      let _ = T.current,
        B = _ ? _.start - 4 * A : Fe() + 0.1,
        G = 0,
        ee = setInterval(() => {
          let me = Fe() + 0.12;
          for (; B + G * A < me;) {
            let pe = B + G * A,
              ke = G - (_ ? 4 : 0);
            (pe >= Fe() - 0.02 &&
              Ft(gh(ke, 8) === 0 ? "clickHi" : "click", null, pe),
              (G += 1));
          }
          if (_) {
            let pe = (Fe() - _.start) / A;
            if (pe >= $) {
              de();
              return;
            }
            let ke = pe < 0 ? "count" : "rec";
            (ke !== _.phase || Math.floor(pe) !== _.shown) &&
              ((_.phase = ke),
              (_.shown = Math.floor(pe)),
              b({
                phase: ke,
                beat: pe,
              }));
          }
        }, 25);
      return () => {
        (clearInterval(ee), _t(!1));
      };
    }, [d, h ? h.id : null]),
    useEffect(() => {
      if (!onPractice) return;
      let _ = setInterval(() => {
        let B = v.current[v.current.length - 1];
        B && Fe() - B.t < 5 && onPractice(5);
      }, 5e3);
      return () => clearInterval(_);
    }, []));
  let q = () => {
      Ue();
      let _ = Date.now();
      ((T.current = {
        id: _,
        start: Fe() + 0.15 + 4 * A,
        strikes: [],
        phase: "count",
        shown: -5,
      }),
        b({
          id: _,
          phase: "count",
          beat: -4,
        }));
    },
    de = () => {
      let _ = T.current;
      if (((T.current = null), b(null), !_)) return;
      let B = cy[rhythm.snap],
        G = {
          tk: [],
          hr: [],
        };
      for (let me of _.strikes) {
        let pe = B ? Math.round(me.b / B) * B : Math.round(me.b * 100) / 100;
        pe = gh(pe, $);
        let ke = G[me.p];
        ke.some(
          (H) =>
            Math.abs(H.b - pe) < 1e-6 && H.plank === me.plank && H.m === me.m,
        ) ||
          ke.push({
            b: pe,
            p: me.p,
            plank: me.plank,
            m: me.m,
          });
      }
      let ee = ["tk", "hr"]
        .filter((me) => G[me].length)
        .map((me) => ({
          id: `l${Date.now().toString(36)}${me}`,
          label: `D\xFAo \xB7 ${hi[me].toLowerCase()}`,
          muted: !1,
          strikes: G[me].sort((pe, ke) => pe.b - ke.b),
        }));
      (ee.length && onAddLayers(ee),
        m(
          ee.length
            ? `A\xF1adidas ${ee.length === 2 ? "dos capas" : "una capa"} al ritmo \xAB${rhythm.name}\xBB.`
            : "No se ha grabado ning\xFAn golpe.",
        ));
    },
    ge = () => {
      ((T.current = null), b(null));
    };
  (useEffect(() => {
    let _ = 0,
      B = () => {
        let G = P.current;
        if (G) {
          let ee = G.getBoundingClientRect(),
            me = Math.min(2, window.devicePixelRatio || 1),
            pe = Math.round(ee.width * me),
            ke = Math.round(ee.height * me);
          (G.width !== pe || G.height !== ke) &&
            ((G.width = pe), (G.height = ke));
          let H = G.getContext("2d");
          H.clearRect(0, 0, pe, ke);
          let et = Fe(),
            bt = 3;
          for (let kt of v.current) {
            let $e = et - kt.t;
            if ($e > bt) continue;
            let xt = pe - ($e / bt) * pe;
            ((H.fillStyle = mh[kt.p]), (H.globalAlpha = 1 - ($e / bt) * 0.6));
            let Ht = kt.p === "tk" ? ke * 0.3 : ke * 0.7;
            (H.beginPath(), H.arc(xt, Ht, 5 * me, 0, Math.PI * 2), H.fill());
          }
          H.globalAlpha = 1;
        }
        _ = requestAnimationFrame(B);
      };
    return ((_ = requestAnimationFrame(B)), () => cancelAnimationFrame(_));
  }, []),
    useEffect(() => {
      let _ = (B) => {
        B.key === "Escape" && onClose();
      };
      return (
        window.addEventListener("keydown", _),
        () => window.removeEventListener("keydown", _)
      );
    }, []));
  let ie = (_, B) => (
      <div
        className={`duo-half ${B ? "is-flip" : ""}`}
        style={{
          "--c": mh[_],
        }}
      >
        <p className="duo-role f-display">{hi[_]}</p>
        <div
          className="duo-pads"
          style={{
            gridTemplateColumns: `repeat(${r.length}, minmax(0, 1fr))`,
          }}
        >
          {r.map((G) => (
            <button
              key={G.key}
              type="button"
              ref={(ee) =>
                ee
                  ? w.current.set(`${_}:${G.key}`, ee)
                  : w.current.delete(`${_}:${G.key}`)
              }
              className={`duo-pad ${G.m === "s" ? "is-stone" : ""}`}
              onPointerDown={(ee) => {
                (ee.preventDefault(), Z(_, G));
              }}
              onKeyDown={(ee) => {
                (ee.key === "Enter" || ee.key === " ") &&
                  (ee.preventDefault(), Z(_, G));
              }}
              aria-label={`${hi[_]}: ${hh(G)}`}
            >
              <span>{hh(G)}</span>
            </button>
          ))}
        </div>
      </div>
    ),
    D = h
      ? h.phase === "count"
        ? `Preparadas\u2026 ${Math.max(1, Math.ceil(-h.beat))}`
        : `Grabando \xB7 ocho ${Math.floor(h.beat / 8) + 1} de ${rhythm.eights}`
      : null;
  return (
    <div
      className="duo"
      role="dialog"
      aria-modal="true"
      aria-label="Txalaparta a dúo"
    >
      {s ? null : ie("tk", !0)}
      <div className="duo-mid">
        <canvas ref={P} className="duo-strip" aria-hidden="true" />
        <div className="duo-bar">
          <button type="button" className="btn btn-xs" onClick={onClose}>
            <O name="x" size={13} />
            Salir
          </button>
          <button
            type="button"
            className="btn btn-xs"
            aria-pressed={d}
            onClick={() => c((_) => !_)}
            disabled={!!h}
          >
            <O name="metro" size={13} />
            {rhythm.bpm}
            {" bpm"}
          </button>
          {!s &&
            (h ? (
              <button
                type="button"
                className="btn btn-xs btn-warn"
                onClick={ge}
              >
                <O name="stop" size={13} />
                {D}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-xs"
                onClick={q}
                title={`Graba ${rhythm.eights === 1 ? "un ocho" : `${rhythm.eights} ochos`} y lo a\xF1ade como capas al ritmo`}
              >
                <O name="record" size={13} />
                Grabar en «{rhythm.name}»
              </button>
            ))}
          {o && (
            <button
              type="button"
              className="btn btn-xs"
              aria-pressed={s}
              onClick={() => i((_) => !_)}
              disabled={!!h}
            >
              <O name="compare" size={13} />
              {s ? "Cada una en su m\xF3vil" : "Un m\xF3vil para las dos"}
            </button>
          )}
          {s && (
            <div
              className="seg seg-sm"
              role="radiogroup"
              aria-label="Qué tocas tú"
            >
              {["tk", "hr"].map((_) => (
                <button
                  key={_}
                  type="button"
                  role="radio"
                  aria-checked={u === _}
                  className="seg-btn"
                  onClick={() => p(_)}
                >
                  {hi[_]}
                </button>
              ))}
            </div>
          )}
          {s && (
            <span className="duo-note">
              {y
                ? `${y === 1 ? "Hay otro m\xF3vil" : `Hay ${y} m\xF3viles`} conectado${y === 1 ? "" : "s"}`
                : "Abre el d\xFAo en el otro m\xF3vil"}
            </span>
          )}
        </div>
        {f && (
          <p className="duo-note" role="status">
            {f}
          </p>
        )}
        {s && (
          <p className="duo-note">
            Entre dos móviles hay un pequeño retraso: va mejor por turnos, como
            pregunta y respuesta.
          </p>
        )}
      </div>
      {ie(s ? u : "hr", !1)}
    </div>
  );
}
function yh(e, t, n) {
  let a = on("room"),
    l = useRef(null),
    o = useRef(n);
  o.current = n;
  let [r, s] = useState(0);
  useEffect(() => {
    if (!a || !e) return;
    let u = a.onPeers((d) => {
        let c = d.peers.find((h) => h.sameTab);
        (c && (l.current = c.peer),
          s(
            d.peers.filter(
              (h) =>
                !h.sameTab &&
                h.presence &&
                h.presence.remote &&
                h.presence.remote.to === l.current,
            ).length,
          ));
      }),
      p = a.on("clase.cmd", (d) => {
        !d.data || d.data.to !== l.current || d.sameTab || o.current(d.data);
      });
    return () => {
      (p(),
        u(),
        a
          .presence({
            tv: null,
          })
          .catch(() => {}),
        s(0));
    };
  }, [a, e]);
  let i = JSON.stringify(t);
  return (
    useEffect(() => {
      a &&
        e &&
        a
          .presence({
            tv: t,
          })
          .catch(() => {});
    }, [a, e, i]),
    {
      available: !!a,
      remotes: r,
    }
  );
}
var dy = [
  [0.5, "0,5\xD7"],
  [0.75, "0,75\xD7"],
  [1, "1\xD7"],
];
function CBh({ onClose }) {
  let t = on("room"),
    [n, a] = useState([]),
    [l, o] = useState(null),
    [r, s] = useState(null),
    [i, u] = useState(!1);
  (useEffect(() => {
    let h = setTimeout(() => u(!0), 1500);
    return () => clearTimeout(h);
  }, []),
    useEffect(() => {
      if (t)
        return t.onPeers((h) =>
          a(h.peers.filter((b) => !b.sameTab && b.presence && b.presence.tv)),
        );
    }, [t]));
  let p = n.find((h) => h.peer === l) || (n.length === 1 ? n[0] : null);
  (useEffect(() => {
    t &&
      t
        .presence({
          remote: p
            ? {
                to: p.peer,
              }
            : null,
        })
        .catch(() => {});
  }, [t, p ? p.peer : null]),
    useEffect(
      () => () => {
        t &&
          t
            .presence({
              remote: null,
            })
            .catch(() => {});
      },
      [t],
    ));
  let d = p ? p.presence.tv : null,
    c = (h, b) => {
      !t ||
        !p ||
        (s(null),
        t
          .emit("clase.cmd", {
            to: p.peer,
            cmd: h,
            arg: b,
          })
          .catch((y) =>
            s(
              y && y.code === "not_permitted"
                ? "Este aparato no puede mandar \xF3rdenes: hace falta permiso de edici\xF3n en la demo."
                : "No llega la orden. Revisa la conexi\xF3n.",
            ),
          ));
    };
  return (
    <div
      className="rm"
      role="dialog"
      aria-modal="true"
      aria-label="Mando del modo clase"
    >
      <div className="rm-top">
        <div>
          <p className="f-label">Mando</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            {d ? d.title : "Modo clase"}
          </h2>
        </div>
        <button type="button" className="btn" onClick={onClose}>
          <O name="x" />
          Cerrar
        </button>
      </div>
      {t ? (
        p ? (
          <div className="rm-body">
            <p className="rm-now">
              {d.playing ? "Sonando" : "En pausa"}
              {d.seg ? ` \xB7 ${d.seg}` : ""}
              {" \xB7 "}
              {String(d.rate).replace(".", ",")}×
            </p>
            <div className="rm-main">
              <button
                type="button"
                className="btn btn-icon rm-small"
                onClick={() => c("restart")}
                aria-label="Desde el principio"
              >
                <O name="restart" size={22} />
              </button>
              <button
                type="button"
                className="btn btn-primary rm-play"
                onClick={() => c(d.playing ? "pause" : "play")}
              >
                <O name={d.playing ? "pause" : "play"} size={30} />
                {d.playing ? "Pausa" : "Play"}
              </button>
              <button
                type="button"
                className="btn btn-icon rm-small"
                aria-pressed={!!d.flip}
                onClick={() => c("flip")}
                aria-label="Vista desde el escenario"
              >
                <O name="mirror" size={22} />
              </button>
            </div>
            <div className="seg" role="radiogroup" aria-label="Velocidad">
              {dy.map(([h, b]) => (
                <button
                  key={h}
                  type="button"
                  role="radio"
                  aria-checked={d.rate === h}
                  className="seg-btn"
                  onClick={() => c("rate", h)}
                >
                  {b}
                </button>
              ))}
            </div>
            {Array.isArray(d.segs) && d.segs.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="f-label">Ir a un bloque</p>
                {d.segs.map((h) => (
                  <div
                    key={h.id}
                    className={`rm-seg ${d.seg === h.name ? "is-on" : ""}`}
                  >
                    <button
                      type="button"
                      className="rm-seg-go"
                      onClick={() => c("block", h.id)}
                    >
                      {h.name}
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs"
                      aria-pressed={d.loop === h.id}
                      onClick={() => c("loop", h.id)}
                    >
                      <O name="loop" size={13} />
                      Repetir
                    </button>
                  </div>
                ))}
              </div>
            )}
            {r && (
              <p
                className="text-[13px] font-semibold text-[color:var(--warn)]"
                role="status"
              >
                {r}
              </p>
            )}
          </div>
        ) : (
          <div className="rm-empty">
            {n.length > 1 ? (
              <>
                <p>
                  Hay varias pantallas en modo clase. ¿Cuál quieres manejar?
                </p>
                <div className="flex flex-col gap-2">
                  {n.map((h, b) => (
                    <button
                      key={h.peer}
                      type="button"
                      className="btn"
                      onClick={() => o(h.peer)}
                    >
                      {"Pantalla "}
                      {b + 1}
                      {": "}
                      {h.presence.tv.title}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p>
                {i
                  ? "En la tele u ordenador, abre la coreograf\xEDa y pulsa \xABModo clase\xBB. Aparecer\xE1 aqu\xED sola."
                  : "Buscando pantallas\u2026"}
              </p>
            )}
          </div>
        )
      ) : (
        <p className="rm-empty">
          El mando funciona cuando la demo está abierta desde claude.ai en los
          dos aparatos (este móvil y la tele u ordenador), con la misma cuenta.
        </p>
      )}
    </div>
  );
}
var kh = 0;
var py = [
  [0.5, "0,5\xD7"],
  [0.75, "0,75\xD7"],
  [1, "1\xD7"],
];
var cd = (e) => `${String(Math.round(e * 100) / 100).replace(".", ",")}\xD7`;
var fy = (e) => (e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2);
function my(e, t, n, a) {
  let l = [];
  for (let o = 0; o < n; o += e.loopBeats)
    for (let r of e.sounds) {
      let s = o + r.b;
      s >= n ||
        a(Math.floor(s / 8) + 1) ||
        l.push({
          b: t + s,
          s: r.s,
          arg: r.arg,
        });
    }
  return l;
}
var Cr = (e, t) => (e.steps[t] ? e.steps[t].name : t);
var xh = (e, t) => (e.sounds[t] ? e.sounds[t].abbr : t);
function CDd({
  clip,
  block,
  blockClips,
  prefs,
  setPrefs,
  me: o,
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
  let y = clip.type === "upload",
    M = clip.type === "music",
    f = M && !!song,
    m = y ? "video" : f ? "audio" : null,
    v = useRef(null),
    w = useRef(null),
    P = useRef(null),
    [T, $] = useState({
      w: 640,
      h: 360,
    }),
    [A, Y] = useState(0),
    [F, Z] = useState(!1),
    [q, de] = useState({
      a: null,
      b: null,
      on: !1,
    }),
    [ge, ie] = useState(clip.angle === "frente"),
    [D, _] = useState(0),
    [B, G] = useState(0),
    [ee, me] = useState(!1),
    [pe, ke] = useState(null),
    [H, et] = useState(!1),
    [bt, kt] = useState(0),
    [$e, xt] = useState(!1),
    [Ht, Se] = useState(!1),
    Qt = useRef(null),
    gn = useRef(null),
    Wt = useRef(!1);
  Wt.current = ee;
  let we = useMemo(() => {
      if (y)
        return {
          segStart: 0,
          segEnd: 1 / 0,
          beatAt: null,
          timeAt: null,
          bpm: null,
        };
      if (f) {
        let E = 60 / sync.bpm,
          Q = sync.offset + (clip.eight - 1) * 8 * E,
          oe = Math.max(0, Q - 4 * E),
          Ce = Q + clip.counts * E;
        return {
          segStart: oe,
          segEnd: Ce,
          beatAt: (Ie) => (oe + Ie - Q) / E,
          timeAt: (Ie) => Q + Ie * E - oe,
          bpm: sync.bpm,
        };
      }
      return {
        segStart: 0,
        segEnd: ii(clip),
        beatAt: (E) => th(clip, E),
        timeAt: (E) => eh(clip, E),
        bpm: clip.bpm,
      };
    }, [clip, f, sync, y]),
    st;
  y
    ? (st = D)
    : f
      ? (st = Math.max(
          0,
          (D ? Math.min(we.segEnd, D) : we.segEnd) - we.segStart,
        ))
      : (st = we.segEnd);
  let Qn = useMemo(() => {
      if (y) return [];
      let E = prefs.voice ? gy(clip, blockClips, vocab) : [];
      if (f)
        return ui(E, we.timeAt, {
          metro: prefs.metro,
          countIn: prefs.metro,
          counts: clip.counts,
        });
      if (M) {
        let Q = clip.full
            ? clip.segments
            : [
                {
                  start: clip.eight,
                  len: clip.counts / 8,
                  acapella: clip.acapella || [],
                  rhythm: clip.rhythm,
                },
              ],
          oe = [];
        for (let Ce of Q) {
          let Ie = (Ce.start - clip.eight) * 8,
            kn = Ce.len * 8,
            gt = (Dt) => (Ce.acapella || []).includes(Dt);
          Ce.rhythm
            ? oe.push(...my(Ce.rhythm, Ie, kn, gt))
            : oe.push(...sd(Ie, kn, clip.swing, gt));
        }
        return ui([...oe, ...E], we.timeAt, {
          metro: prefs.metro,
          countIn: !0,
          counts: clip.counts,
        });
      }
      return ui([...clip.events, ...E], we.timeAt, {
        metro: prefs.metro,
        countIn: !0,
        counts: clip.counts,
      });
    }, [clip, we, prefs.metro, prefs.voice, y, f, M, blockClips, vocab]),
    Qe = useRef(0),
    ht = useRef(q),
    Nt = useRef(prefs),
    $t = useRef(st),
    Pe = useRef(we.segStart),
    Ea = useRef(Qn);
  ((ht.current = q),
    (Nt.current = prefs),
    ($t.current = st),
    (Pe.current = we.segStart),
    (Ea.current = Qn),
    useEffect(() => {
      let E = w.current;
      if (!E || typeof ResizeObserver == "undefined") return;
      let Q = new ResizeObserver(([oe]) => {
        let Ce = oe.contentRect;
        $({
          w: Math.max(1, Ce.width),
          h: Math.max(1, Ce.height),
        });
      });
      return (Q.observe(E), () => Q.disconnect());
    }, []),
    useEffect(() => {
      document.fonts &&
        document.fonts.ready &&
        document.fonts.ready.then(() => G((E) => E + 1));
    }, []),
    useEffect(() => {
      ((Qe.current = 0),
        Y(0),
        de({
          a: null,
          b: null,
          on: !1,
        }),
        _(0));
      let E = !!playReq && playReq.id === clip.id && playReq.n !== kh;
      (E && (kh = playReq.n),
        Wt.current &&
          setPrefs((Q) => ({
            ...Q,
            rate: 0.5,
          })),
        E && playReq.big && An(),
        Z(E));
    }, [clip.id, playReq, song ? song.src : null]),
    useEffect(() => {
      ie(clip.angle === "frente");
    }, [clip.id, clip.angle]),
    useEffect(() => {
      let E = Qt.current;
      if (E)
        if (((E.playbackRate = prefs.rate), F)) {
          let Q = E.play();
          Q && Q.catch && Q.catch(() => {});
        } else E.pause();
    }, [F, pe, prefs.rate]),
    useEffect(() => {
      let E = Qt.current;
      if (!E || !E.duration) return;
      let Q = Ln(A + bt, 0, Math.max(0, E.duration - 0.05));
      Math.abs(E.currentTime - Q) > (F ? 0.3 : 0.04) && (E.currentTime = Q);
    }, [A, bt, pe]),
    useEffect(() => {
      (kt(0), ke((E) => (E && URL.revokeObjectURL(E.src), null)));
    }, [clip.id]));
  let $a = (E) => {
    E &&
      (ke(
        (Q) => (
          Q && URL.revokeObjectURL(Q.src),
          {
            src: URL.createObjectURL(E),
            name: E.name,
          }
        ),
      ),
      kt(0),
      et(!1));
  };
  function An() {
    xt(!0);
    let E = gn.current;
    try {
      if (E && E.requestFullscreen && !document.fullscreenElement) {
        let Q = E.requestFullscreen();
        Q && Q.catch && Q.catch(() => {});
      }
    } catch {}
  }
  let ra = () => {
    xt(!1);
    try {
      document.fullscreenElement &&
        document.exitFullscreen &&
        document.exitFullscreen().catch(() => {});
    } catch {}
  };
  useEffect(() => {
    if (!$e) return;
    let E = (Q) => {
      Q.key === "Escape" && ra();
    };
    return (
      window.addEventListener("keydown", E),
      () => window.removeEventListener("keydown", E)
    );
  }, [$e]);
  let zn = () => {
      Wt.current &&
        setPrefs((E) =>
          E.rate >= 1
            ? E
            : {
                ...E,
                rate: Math.min(1, Math.round((E.rate + 0.1) * 10) / 10),
              },
        );
    },
    sa = () => {
      if (Wt.current) return me(!1);
      (me(!0),
        setPrefs((E) => ({
          ...E,
          rate: 0.5,
        })));
    },
    rn = (E, Q) => {
      if (!Nt.current.muted)
        for (let oe of Ea.current)
          oe.time > E &&
            oe.time <= Q &&
            (oe.kind === "say" ? Na(oe.arg) : Ft(oe.kind, oe.arg));
    };
  (useEffect(() => {
    (_t(F), F || Tl());
  }, [F]),
    useEffect(() => {
      if (!F || !onPractice) return;
      let E = setInterval(() => onPractice(5), 5e3);
      return () => clearInterval(E);
    }, [F, onPractice]),
    useEffect(() => () => _t(!1), []),
    useEffect(() => {
      if (!F) return;
      let E,
        Q = performance.now(),
        oe = !0,
        Ce = (Ie) => {
          let kn = Math.min(0.1, (Ie - Q) / 1e3);
          Q = Ie;
          let gt = P.current,
            Dt = Qe.current;
          oe && ((Dt -= 1e-4), (oe = !1));
          let it =
              m && gt
                ? gt.currentTime - Pe.current
                : Qe.current + kn * Nt.current.rate,
            at = ht.current,
            R = $t.current;
          if (at.on && at.a != null && at.b != null && it >= at.b)
            (rn(Dt, at.b),
              (Dt = at.a - 1e-4),
              (it = at.a),
              m && gt && (gt.currentTime = Pe.current + at.a),
              zn());
          else if (R > 0 && it >= R) {
            if ((rn(Dt, R), !Wt.current)) {
              ((Qe.current = R), Y(R), Z(!1));
              return;
            }
            let L = at.on && at.a != null ? at.a : 0;
            ((Dt = L - 1e-4),
              (it = L),
              m &&
                gt &&
                ((gt.currentTime = Pe.current + L),
                gt.paused && gt.play().catch(() => {})),
              zn());
          }
          (it < Dt && (Dt = it - 1e-4),
            rn(Dt, it),
            (Qe.current = it),
            Y(it),
            (E = requestAnimationFrame(Ce)));
        };
      return ((E = requestAnimationFrame(Ce)), () => cancelAnimationFrame(E));
    }, [F, clip.id, m]),
    useEffect(() => {
      let E = P.current;
      if (!(!m || !E))
        if (F) {
          let Q = Pe.current + Qe.current;
          Math.abs(E.currentTime - Q) > 0.25 && (E.currentTime = Q);
          let oe = E.play();
          oe && oe.catch && oe.catch(() => Z(!1));
        } else E.pause();
    }, [F, m, clip.id]),
    useEffect(() => {
      let E = P.current;
      E &&
        ((E.playbackRate = prefs.rate),
        (E.preservesPitch = !0),
        (E.webkitPreservesPitch = !0));
    }, [prefs.rate, clip.id, m]),
    useEffect(() => {
      if (y || M) return;
      let E = v.current;
      if (!E) return;
      let Q = Math.min(2, window.devicePixelRatio || 1),
        oe = Math.round(T.w * Q),
        Ce = Math.round(T.h * Q);
      (E.width !== oe && (E.width = oe), E.height !== Ce && (E.height = Ce));
      let Ie = E.getContext("2d"),
        kn = we.beatAt(A),
        gt = mode === "bailarina" ? o : null;
      clip.type === "stage"
        ? ih(Ie, oe, Ce, clip, kn, formations, gt, ge)
        : clip.angle === "lado"
          ? uh(Ie, oe, Ce, clip, kn, ge, vocab)
          : sh(Ie, oe, Ce, clip, kn, ge, vocab);
    }, [A, T, clip, formations, o, mode, ge, vocab, B, we, y, M]));
  let nt = useCallback((E) => {
      let Q = Ln(E, 0, $t.current || 0);
      ((Qe.current = Q),
        Y(Q),
        P.current && (P.current.currentTime = Pe.current + Q));
    }, []),
    vn = () => {
      if ((Ue(), !F)) {
        let E = ht.current,
          Q = $t.current;
        (E.on &&
        E.a != null &&
        E.b != null &&
        (Qe.current < E.a || Qe.current >= E.b - 0.01)
          ? nt(E.a)
          : Q > 0 &&
            Qe.current >= Q - 0.02 &&
            nt(E.on && E.a != null ? E.a : 0),
          onSeen(clip.id));
      }
      Z((E) => !E);
    },
    Al = () => nt(q.on && q.a != null ? q.a : 0),
    Ra = () => {
      let E = Qe.current;
      de((Q) => {
        let oe = Q.b != null && Q.b > E + 0.1 ? Q.b : null;
        return {
          a: E,
          b: oe,
          on: oe != null && Q.on,
        };
      });
    },
    nl = () => {
      let E = Qe.current,
        Q = ht.current.a != null ? ht.current.a : 0;
      E <= Q + 0.1 ||
        (de({
          a: Q,
          b: E,
          on: !0,
        }),
        nt(Q));
    },
    al = () =>
      de((E) =>
        E.a != null && E.b != null
          ? {
              ...E,
              on: !E.on,
            }
          : E,
      ),
    ia = () =>
      de({
        a: null,
        b: null,
        on: !1,
      }),
    Wn = (E, Q) => {
      if (!we.timeAt) return;
      Ue();
      let oe = Math.max(0, we.timeAt(E - 1)),
        Ce = Math.min($t.current || 1 / 0, we.timeAt(Q));
      (de({
        a: oe,
        b: Ce,
        on: !0,
      }),
        nt(oe),
        onSeen(clip.id),
        Z(!0));
    },
    Rt = (E) =>
      setPrefs((Q) => ({
        ...Q,
        rate: E,
      })),
    dt = () => {
      M || ie((E) => !E);
    },
    Gt = useRef({});
  Gt.current = {
    togglePlay: vn,
    markA: Ra,
    markB: nl,
    toggleLoop: al,
    setRate: Rt,
    toggleMirror: dt,
  };
  let ll = we.beatAt ? we.beatAt(A) : 0,
    ol =
      clip.full && clip.segments
        ? clip.segments.find(
            (E) => ll >= (E.start - 1) * 8 && ll < (E.start - 1 + E.len) * 8,
          )
        : null,
    yn =
      (clip.full &&
        q.on &&
        we.timeAt &&
        (
          clip.segments.find(
            (E) =>
              Math.abs(q.a - Math.max(0, we.timeAt((E.start - 1) * 8 - 1))) <
              0.05,
          ) || {}
        ).id) ||
      null,
    So = $e
      ? {
          title: title || clip.title || "Modo clase",
          segs: clip.full
            ? clip.segments.map((E) => ({
                id: E.id,
                name: E.name,
              }))
            : [],
          seg: ol ? ol.name : block ? block.name : "",
          playing: F,
          rate: prefs.rate,
          flip: Ht,
          loop: yn,
        }
      : null,
    rl = yh($e, So, (E) => {
      let Q = (oe) => (clip.segments || []).find((Ce) => Ce.id === oe);
      if (E.cmd === "play" && !F) vn();
      else if (E.cmd === "pause" && F) vn();
      else if (E.cmd === "restart")
        (de({
          a: null,
          b: null,
          on: !1,
        }),
          nt(0));
      else if (E.cmd === "rate" && [0.5, 0.75, 1].includes(E.arg)) Rt(E.arg);
      else if (E.cmd === "flip") Se((oe) => !oe);
      else if (E.cmd === "block" && we.timeAt) {
        let oe = Q(E.arg);
        if (!oe) return;
        (Ue(),
          de({
            a: null,
            b: null,
            on: !1,
          }),
          nt(Math.max(0, we.timeAt((oe.start - 1) * 8 - 4))),
          Z(!0));
      } else if (E.cmd === "loop") {
        let oe = Q(E.arg);
        if (!oe) return;
        yn === oe.id
          ? de((Ce) => ({
              ...Ce,
              on: !1,
            }))
          : Wn((oe.start - 1) * 8, (oe.start - 1 + oe.len) * 8);
      }
    });
  useEffect(() => {
    let E = (Q) => {
      if (Q.metaKey || Q.ctrlKey || Q.altKey) return;
      let oe = Q.target,
        Ce = oe && oe.tagName;
      if (
        Ce === "INPUT" ||
        Ce === "TEXTAREA" ||
        Ce === "SELECT" ||
        (oe && oe.isContentEditable) ||
        (oe && oe.closest && oe.closest("[data-no-shortcuts]"))
      )
        return;
      let Ie = Q.key.toLowerCase();
      if (Ie === " ") {
        if (Ce === "BUTTON" || Ce === "LABEL" || Ce === "SUMMARY" || Ce === "A")
          return;
        (Q.preventDefault(), Gt.current.togglePlay());
      } else
        Ie === "m"
          ? Gt.current.toggleMirror()
          : Ie === "a"
            ? Gt.current.markA()
            : Ie === "b"
              ? Gt.current.markB()
              : Ie === "l"
                ? Gt.current.toggleLoop()
                : Ie === "1"
                  ? Gt.current.setRate(0.5)
                  : Ie === "2"
                    ? Gt.current.setRate(0.75)
                    : Ie === "3" && Gt.current.setRate(1);
    };
    return (
      window.addEventListener("keydown", E),
      () => window.removeEventListener("keydown", E)
    );
  }, []);
  let bn = we.beatAt ? we.beatAt(A) : null,
    sl = q.a != null && q.b != null,
    il = we.bpm ? Math.round(we.bpm * 10) / 10 : null;
  return (
    <div ref={gn} className={`panel overflow-hidden ${$e ? "player-big" : ""}`}>
      <div className="pl-head flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-4 pb-3 pt-4">
        <div className="min-w-0">
          <p className="f-label">
            {"Reproductor de pr\xE1ctica \xB7 "}
            {clip.full ? "coreograf\xEDa entera" : block ? block.name : ""}
          </p>
          <h2 className="mt-1 text-[17px] font-semibold leading-snug text-ink [text-wrap:balance]">
            {clip.title}
          </h2>
        </div>
        {il && (
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {String(il).replace(".", ",")}
            {" bpm"}
            {clip.swing && !f ? " \xB7 swing" : ""}
            {clip.acapella === !0 ? " \xB7 a capella" : ""}
          </p>
        )}
      </div>
      <div
        className={`screen ${pe ? "is-split" : ""}`}
        onClick={vn}
        role="presentation"
      >
        <div ref={w} className="screen-pane">
          {y && (
            <video
              key={clip.id}
              ref={P}
              src={clip.src}
              playsInline={!0}
              muted={prefs.muted}
              className={ge ? "is-mirror" : ""}
              onLoadedMetadata={(E) => {
                (_(E.currentTarget.duration || 0),
                  (E.currentTarget.playbackRate = Nt.current.rate));
              }}
              onTimeUpdate={(E) => {
                F ||
                  ((Qe.current = E.currentTarget.currentTime),
                  Y(E.currentTarget.currentTime));
              }}
              onEnded={(E) => {
                let Q = ht.current;
                (Q.on && Q.a != null) || Wt.current
                  ? ((E.currentTarget.currentTime =
                      Q.on && Q.a != null ? Q.a : 0),
                    zn(),
                    E.currentTarget.play().catch(() => Z(!1)))
                  : Z(!1);
              }}
            />
          )}
          {f && (
            <audio
              key={`${clip.id}-${song.src}`}
              ref={P}
              src={song.src}
              preload="auto"
              muted={prefs.muted}
              onLoadedMetadata={(E) => {
                let Q = E.currentTarget;
                (_(Q.duration || 0),
                  (Q.playbackRate = Nt.current.rate),
                  (Q.currentTime = Pe.current + Qe.current));
              }}
              onEnded={() => Z(!1)}
            />
          )}
          {M ? (
            <CXy
              clip={clip}
              beat={bn}
              block={block}
              blockClips={blockClips}
              vocab={vocab}
              song={song}
              formations={formations}
              highlight={mode === "bailarina" ? o : null}
              flip={$e && Ht}
            />
          ) : (
            !y && (
              <canvas
                ref={v}
                className={ge ? "is-mirror" : ""}
                aria-label={`V\xEDdeo de muestra: ${clip.title}`}
              />
            )
          )}
        </div>
        {pe && (
          <div className="screen-pane is-me">
            <video
              key={pe.src}
              ref={Qt}
              src={pe.src}
              playsInline={!0}
              muted={!0}
              preload="auto"
              className={H ? "is-mirror" : ""}
            />
            <span className="hud-chip pane-label">Tú</span>
          </div>
        )}
        {!M && (
          <div className="hud-tl">
            <span className="hud-chip">{xa[clip.angle] || "V\xEDdeo"}</span>
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
          {ge && !M && <span className="hud-chip is-on">Espejo</span>}
          {(ee || prefs.rate !== 1) && (
            <span className="hud-chip is-on">
              {ee
                ? `Escalera \xB7 ${prefs.rate >= 1 ? "a tempo" : cd(prefs.rate)}`
                : cd(prefs.rate)}
            </span>
          )}
          {q.on && <span className="hud-chip is-on">Bucle A–B</span>}
        </div>
        {!M && <CHy clip={clip} beat={bn} vocab={vocab} />}
        {!F && (
          <span className="bigplay" aria-hidden="true">
            <O name="play" size={30} />
          </span>
        )}
      </div>
      <div className="pl-controls flex flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <CWy
            t={A}
            duration={st}
            loop={q}
            preroll={we.timeAt ? Math.max(0, we.timeAt(0)) : 0}
            onSeek={nt}
          />
          <span className="shrink-0 font-mono text-[12px] tabular-nums text-muted">
            {la(A)}
            {" / "}
            {la(st)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={vn}>
            <O name={F ? "pause" : "play"} />
            {F ? "Pausa" : "Reproducir"}
          </button>
          <button
            type="button"
            className="btn btn-icon"
            onClick={Al}
            aria-label={q.on ? "Volver a A" : "Volver al principio"}
            title={q.on ? "Volver a A" : "Volver al principio"}
          >
            <O name="restart" />
          </button>
          <div className="seg" role="radiogroup" aria-label="Velocidad">
            {py.map(([E, Q]) => (
              <button
                key={E}
                type="button"
                role="radio"
                aria-checked={prefs.rate === E}
                className="seg-btn tabular-nums"
                onClick={() => Rt(E)}
              >
                {Q}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn"
            aria-pressed={ee}
            onClick={sa}
            title="Empieza a 0,5× y sube 0,1× en cada vuelta hasta 1×"
          >
            <O name="ladder" />
            Escalera
          </button>
          {!M && (
            <button
              type="button"
              className="btn"
              aria-pressed={ge}
              onClick={dt}
            >
              <O name="mirror" />
              Espejo
            </button>
          )}
          <label
            className="btn btn-file pl-extra"
            title="Elige un vídeo tuyo bailando este paso para verlo al lado"
          >
            <O name="compare" />
            {pe ? "Cambiar mi v\xEDdeo" : "Compararme"}
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(E) => {
                ($a(E.target.files && E.target.files[0]),
                  (E.target.value = ""));
              }}
            />
          </label>
          {$e && clip.full && (
            <button
              type="button"
              className="btn"
              aria-pressed={Ht}
              onClick={() => Se((E) => !E)}
              title="Para cuando la pantalla está de cara a las bailarinas"
            >
              <O name="mirror" />
              Vista desde el escenario
            </button>
          )}
          {$e && rl.available && (
            <span
              className={`pl-remote ${rl.remotes ? "is-on" : ""}`}
              title="Abre Contratiempo en tu móvil y pulsa «Mando»"
            >
              {rl.remotes
                ? "Mando conectado"
                : "Mando: \xE1brelo en tu m\xF3vil"}
            </span>
          )}
          {$e ? (
            <button type="button" className="btn" onClick={ra}>
              <O name="x" />
              Salir de pantalla grande
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={An}
              title="Para proyectar en clase o ver en la tele"
            >
              <O name="expand" />
              Pantalla grande
            </button>
          )}
        </div>
        {pe && (
          <div className="mine-bar">
            <span className="f-label">Tu vídeo</span>
            <button
              type="button"
              className="btn btn-xs"
              aria-pressed={H}
              onClick={() => et((E) => !E)}
            >
              <O name="mirror" size={13} />
              Espejo
            </button>
            <span className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => kt((E) => Math.round((E - 0.25) * 100) / 100)}
                aria-label="Tu vídeo empieza antes"
              >
                −
              </button>
              <span className="font-mono text-[12px] tabular-nums text-ink">{`${bt > 0 ? "+" : ""}${String(bt).replace(".", ",")} s`}</span>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => kt((E) => Math.round((E + 0.25) * 100) / 100)}
                aria-label="Tu vídeo empieza después"
              >
                +
              </button>
            </span>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => {
                ke((E) => (E && URL.revokeObjectURL(E.src), null));
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
        {ee && (
          <p className="text-[13px] text-ink">
            <b className="font-semibold">Escalera de tempo:</b>{" "}
            {prefs.rate >= 1
              ? "ya vas a tempo. Sigue repitiendo hasta que salga limpio."
              : `vas a ${cd(prefs.rate)}; al terminar cada vuelta vuelve a empezar un poco m\xE1s r\xE1pido, hasta 1\xD7.`}
            {!sl &&
              " Repite el v\xEDdeo entero; marca A y B para subir solo un trozo."}
          </p>
        )}
        <div className="pl-extra flex flex-wrap items-center gap-2">
          <span className="f-label mr-1">Repetir paso</span>
          <button
            type="button"
            className="btn"
            onClick={Ra}
            aria-label="Marcar inicio A en el punto actual"
          >
            <span className="ab">A</span>Marcar inicio
          </button>
          <button
            type="button"
            className="btn"
            onClick={nl}
            aria-label="Marcar final B en el punto actual"
          >
            <span className="ab">B</span>Marcar final
          </button>
          <button
            type="button"
            className="btn"
            aria-pressed={q.on}
            onClick={al}
            disabled={!sl}
          >
            <O name="loop" />
            Bucle
          </button>
          {(q.a != null || q.b != null) && (
            <button
              type="button"
              className="btn btn-icon"
              onClick={ia}
              aria-label="Quitar bucle"
              title="Quitar bucle"
            >
              <O name="x" />
            </button>
          )}
          <span className="font-mono text-[12px] tabular-nums text-muted">
            {q.a != null ? `A ${la(q.a)}` : "Sin marcas"}
            {q.b != null ? ` \u2192 B ${la(q.b)}` : ""}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!y && (
            <button
              type="button"
              className="btn"
              aria-pressed={prefs.metro}
              onClick={() =>
                setPrefs((E) => ({
                  ...E,
                  metro: !E.metro,
                }))
              }
            >
              <O name="metro" />
              Metrónomo
            </button>
          )}
          <button
            type="button"
            className="btn"
            aria-pressed={!prefs.muted}
            onClick={() =>
              setPrefs((E) => ({
                ...E,
                muted: !E.muted,
              }))
            }
          >
            <O name={prefs.muted ? "mute" : "sound"} />
            {prefs.muted ? "Sin sonido" : "Sonido"}
          </button>
          {Za() && !y && (
            <button
              type="button"
              className="btn"
              aria-pressed={!!prefs.voice}
              title="Una voz dice los pasos de cada ocho un poco antes de que lleguen"
              onClick={() => {
                let E = !prefs.voice;
                (setPrefs((Q) => ({
                  ...Q,
                  voice: E,
                })),
                  E ? Na("Voz activada") : Tl());
              }}
            >
              <O name="voice" />
              Voz
            </button>
          )}
          <p className="text-[12px] text-muted md:hidden">
            ¿No se oye? Sube el volumen del móvil y vuelve a darle a Reproducir.
          </p>
          <p className="hidden text-[12px] text-muted md:block">
            {"Teclado: "}
            <kbd>espacio</kbd>
            {" reproducir \xB7 "}
            <kbd>M</kbd>
            {" espejo \xB7 "}
            <kbd>A</kbd> <kbd>B</kbd>
            {" bucle \xB7 "}
            <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>
            {" velocidad"}
          </p>
        </div>
      </div>
      <div className="pl-extra border-t border-line px-4 py-4">
        {y ? (
          <p className="text-sm text-muted">
            Vídeo subido desde este dispositivo (
            {xa[clip.angle] ? xa[clip.angle].toLowerCase() : "sin \xE1ngulo"}).
            En la demo solo se conserva mientras la pestaña esté abierta.
          </p>
        ) : M ? (
          <Ny
            clip={clip}
            block={block}
            song={song}
            bpm={il}
            onLoopBeats={Wn}
            beat={bn}
          />
        ) : clip.type === "stage" ? (
          <Cy clip={clip} me={o} mode={mode} />
        ) : (
          <Sy
            clip={clip}
            beat={bn}
            vocab={vocab}
            onSeekBeat={(E) => nt(we.timeAt(E))}
            onLoopBeats={Wn}
          />
        )}
      </div>
    </div>
  );
}
function Nh({ beat }) {
  let t = Math.floor(beat + 1e-6) + 4;
  return (
    <div className="hud-countin">
      {[5, 6, 7, 8].map((n, a) => (
        <span key={n} className={a === t ? "is-on" : ""}>
          {n}
        </span>
      ))}
    </div>
  );
}
function CHy({ clip, beat, vocab }) {
  if (beat == null) return null;
  if (beat < 0)
    return (
      <div className="hud-count">
        <span className="hud-small">Cuenta de entrada</span>
        <Nh beat={beat} />
      </div>
    );
  let a = Math.min(beat, clip.counts - 0.001),
    l = (clip.eight || 1) + Math.floor(a / 8),
    o =
      clip.spans &&
      clip.spans.find((r) => a >= r.from - 0.05 && a <= r.to + 0.2);
  return (
    <div className="hud-count">
      <span className="hud-small">
        {"Ocho "}
        {l}
      </span>
      <div className="hud-big">
        <span className="f-display">{bo(a)}</span>
        <span className="hud-sub">{nh(a)}</span>
      </div>
      {o && <span className="hud-step">{Cr(vocab, o.key)}</span>}
    </div>
  );
}
function wh(e, t) {
  let n = e
      .filter(
        (l) =>
          l.type === "feet" &&
          t >= l.eight &&
          t < l.eight + Math.ceil(l.counts / 8),
      )
      .sort((l, o) => o.bpm - l.bpm),
    a = e.filter(
      (l) =>
        l.type === "stage" &&
        t >= l.eight &&
        t < l.eight + Math.ceil(l.counts / 8),
    );
  return {
    feet: n[0] || null,
    stage: a[0] || null,
  };
}
function gy(e, t, n) {
  let a = [],
    l = (r) => {
      let s = [];
      for (let i of r) {
        let u = Cr(n, i.key);
        if ((s.includes(u) || s.push(u), s.length >= 3)) break;
      }
      return s.join(", ");
    };
  if (e.type === "feet") {
    for (let r = 0; r < e.counts; r += 8) {
      let s = l(
        e.spans.filter((i) => i.from >= r - 1e-6 && i.from < r + 8 - 1e-6),
      );
      s &&
        a.push({
          b: r - 2,
          s: "say",
          arg: s,
        });
    }
    return a;
  }
  if (e.type !== "music") return a;
  let o = e.full
    ? e.segments
    : [
        {
          id: e.block,
          name: null,
          start: e.eight,
          len: e.counts / 8,
          rhythm: e.rhythm,
        },
      ];
  for (let r of o)
    for (let s = 0; s < r.len; s++) {
      let i = r.start + s,
        u = [];
      s === 0 && e.full && u.push(r.name);
      let p = e.full ? t.filter((c) => c.block === r.id) : t,
        { feet } = wh(p, i);
      if (feet) {
        let c = (i - feet.eight) * 8,
          h = l(
            feet.spans.filter(
              (b) => b.from >= c - 1e-6 && b.from < c + 8 - 1e-6,
            ),
          );
        h && u.push(h);
      } else if (r.rhythm) {
        let c = [];
        for (let h = 0; h < 8; h++) {
          let b = r.rhythm.moves[(s * 8 + h) % r.rhythm.loopBeats];
          b && !c.includes(b) && c.push(b);
        }
        c.length && u.push(c.slice(0, 3).join(", "));
      }
      u.length &&
        a.push({
          b: (i - e.eight) * 8 - 2,
          s: "say",
          arg: u.join(". "),
        });
    }
  return a;
}
function vy(e, t, n) {
  if (!e.full)
    return {
      id: t.id,
      name: t.name,
      start: e.eight,
      len: t.len,
      acapella: t.acapella || [],
      rhythm: e.rhythm,
      i: 0,
    };
  let a = Math.max(
    0,
    e.segments.findIndex((l) => n >= l.start && n < l.start + l.len),
  );
  return {
    ...e.segments[a],
    i: a,
  };
}
function yy(e, t, n, a) {
  let l = a[t.id] || {};
  if (t.i === 0 || n >= 4) return l;
  let o = a[e.segments[t.i - 1].id] || l,
    r = fy(Math.max(0, n) / 4),
    s = {};
  for (let i of Object.keys(l)) {
    let u = o[i] || l[i];
    s[i] = [u[0] + (l[i][0] - u[0]) * r, u[1] + (l[i][1] - u[1]) * r];
  }
  return s;
}
function CBy({ pos, highlight, flip }) {
  return (
    <div className={`board-stage ${flip ? "is-flip" : ""}`} aria-hidden="true">
      <span className="board-stage-front">Público</span>
      {Be.map((a) => {
        let l = pos[a.id];
        if (!l) return null;
        let o = flip ? [100 - l[0], 100 - l[1]] : l,
          r = highlight === a.id;
        return (
          <i
            key={a.id}
            className={r ? "is-me" : highlight ? "is-dim" : ""}
            style={{
              left: `${o[0]}%`,
              top: `${o[1]}%`,
              background: r || highlight ? void 0 : a.tape,
            }}
          >
            {r ? "T\xDA" : ""}
          </i>
        );
      })}
    </div>
  );
}
function CKy({ clip, seg, b, abs, blockClips, vocab }) {
  let r = clip.full ? blockClips.filter((u) => u.block === seg.id) : blockClips,
    { feet, stage } = wh(r, abs);
  if (feet) {
    let u = (abs - feet.eight) * 8,
      p = b - (feet.eight - clip.eight) * 8,
      d = feet.spans.filter((h) => h.from >= u - 1e-6 && h.from < u + 8 - 1e-6),
      c = d.find((h) => p >= h.from - 0.05 && p <= h.to + 0.2) || null;
    if (d.length)
      return d.map((h, b) => (
        <span key={b} className={`board-step ${h === c ? "is-on" : ""}`}>
          <b>{Ll(h.from)}</b> {Cr(vocab, h.key)}
        </span>
      ));
  }
  if (seg.rhythm && seg.rhythm.moves.some(Boolean)) {
    let u = b - (seg.start - clip.eight) * 8,
      p = Math.floor(u) % seg.rhythm.loopBeats,
      d = Math.floor(p / 8) * 8,
      c = [];
    for (let h = 0; h < 8; h++) seg.rhythm.moves[d + h] && c.push(h);
    if (c.length)
      return c.map((h) => (
        <span key={h} className={`board-step ${d + h === p ? "is-on" : ""}`}>
          <b>{h + 1}</b> {seg.rhythm.moves[d + h]}
        </span>
      ));
  }
  return stage ? (
    <span className="board-step is-on">
      {"Desplazamiento: "}
      {stage.title.toLowerCase()}
    </span>
  ) : (
    <span className="board-step">Sin paso grabado para este ocho</span>
  );
}
function CXy({
  clip,
  beat,
  block,
  blockClips,
  vocab,
  song,
  formations,
  highlight,
  flip,
}) {
  if (beat == null) return null;
  let u = beat < 0,
    p = u ? 0 : Math.min(beat, clip.counts - 0.001),
    d = clip.eight + Math.floor(p / 8),
    c = vy(clip, block, d),
    h = d - c.start + 1,
    b = p - (c.start - clip.eight) * 8,
    y = bo(p),
    M = !u && (c.acapella || []).includes(h),
    f = song
      ? song.name
      : c.rhythm
        ? `Txalaparta \xB7 ${c.rhythm.name}`
        : "Pista de ensayo generada",
    m = u ? (
      <div className="board-center">
        <span className="hud-small">
          {"Cuenta de entrada \xB7 "}
          {c.name}
        </span>
        <Nh beat={beat} />
      </div>
    ) : (
      <div className="board-center">
        <span className="hud-small">
          {clip.full
            ? `${c.name} \xB7 ocho ${h} de ${c.len}`
            : `Ocho ${d} \xB7 ${h}\xBA de ${c.len} en ${c.name}`}
        </span>
        <div className="board-boxes" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
            <span
              key={v}
              className={v === y ? "is-on" : v < y ? "is-past" : ""}
            >
              {v}
            </span>
          ))}
        </div>
        <div className="board-steps">
          <CKy
            clip={clip}
            seg={c}
            b={p}
            abs={d}
            blockClips={blockClips}
            vocab={vocab}
          />
        </div>
      </div>
    );
  return (
    <div className={`board ${clip.full ? "is-full" : ""}`}>
      <span className="hud-chip board-src">
        {clip.full
          ? `Entera \xB7 bloque ${c.i + 1} de ${clip.segments.length}`
          : "Con m\xFAsica"}
        {" \xB7 "}
        {f}
      </span>
      {M && <span className="hud-chip is-on board-acap">A capella</span>}
      {clip.full ? (
        <div className="board-full">
          {m}
          <CBy
            pos={yy(clip, c, u ? 0 : b, formations)}
            highlight={highlight}
            flip={flip}
          />
        </div>
      ) : (
        m
      )}
    </div>
  );
}
function Ny({ clip, block, song, bpm, onLoopBeats }) {
  return clip.full ? (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="f-label">Coreografía entera</p>
        <p className="text-[12px] text-muted">
          {song
            ? `Con la canci\xF3n sincronizada a ${String(bpm).replace(".", ",")} bpm.`
            : "Cada bloque suena con lo suyo: la pista de ensayo o su ritmo de txalaparta."}
        </p>
      </div>
      <p className="text-sm text-ink">
        De principio a fin, sin parar, como en el escenario. Arriba ves el
        bloque, la cuenta, el paso que toca y tu sitio, que se mueve cuando
        cambia la formación.
      </p>
      <div className="flex flex-wrap gap-2">
        {clip.segments.map((o) => (
          <button
            key={o.id}
            type="button"
            className="btn btn-xs"
            onClick={() =>
              onLoopBeats((o.start - 1) * 8, (o.start - 1 + o.len) * 8)
            }
          >
            <O name="loop" size={13} />
            {"Repetir "}
            {o.name}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="f-label">Bloque entero con música</p>
        <p className="text-[12px] text-muted">
          {song
            ? `Canci\xF3n sincronizada a ${String(bpm).replace(".", ",")} bpm.`
            : clip.rhythm
              ? `Ritmo de txalaparta \xAB${clip.rhythm.name}\xBB del taller, a ${bpm} bpm, repetido durante todo el bloque.`
              : `Pista de ensayo generada a ${bpm} bpm, hasta que la core\xF3grafa suba la canci\xF3n.`}
        </p>
      </div>
      <p className="text-sm text-ink">
        Arriba ves en qué ocho y en qué cuenta vas, y qué paso toca. A 0,75× la
        música va más lenta sin cambiar de tono.
      </p>
      <div className="flex flex-wrap gap-2">
        {Array.from(
          {
            length: block.len,
          },
          (o, r) => (
            <button
              key={r}
              type="button"
              className="btn btn-xs"
              onClick={() => onLoopBeats(r * 8, r * 8 + 8)}
            >
              <O name="loop" size={13} />
              {"Repetir ocho "}
              {clip.eight + r}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
function CWy({ t: e, duration, loop, preroll, onSeek }) {
  let o = useRef(null),
    r = useRef(!1),
    s = (u) => (duration > 0 ? Ln((u / duration) * 100, 0, 100) : 0),
    i = (u) => {
      let p = o.current.getBoundingClientRect();
      return Ln((u.clientX - p.left) / p.width, 0, 1) * duration;
    };
  return (
    <div
      ref={o}
      className="scrub"
      role="slider"
      tabIndex={0}
      aria-label="Posición"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration * 10) / 10}
      aria-valuenow={Math.round(e * 10) / 10}
      aria-valuetext={la(e)}
      onPointerDown={(u) => {
        duration &&
          ((r.current = !0),
          u.currentTarget.setPointerCapture(u.pointerId),
          onSeek(i(u)));
      }}
      onPointerMove={(u) => {
        r.current && onSeek(i(u));
      }}
      onPointerUp={() => {
        r.current = !1;
      }}
      onPointerCancel={() => {
        r.current = !1;
      }}
      onKeyDown={(u) => {
        u.key === "ArrowRight"
          ? (u.preventDefault(), onSeek(e + 0.25))
          : u.key === "ArrowLeft" && (u.preventDefault(), onSeek(e - 0.25));
      }}
    >
      <div className="scrub-track">
        {preroll > 0 && (
          <div
            className="scrub-pre"
            style={{
              width: `${s(preroll)}%`,
            }}
            title="Cuenta de entrada"
          />
        )}
        {loop.a != null && loop.b != null && (
          <div
            className={`scrub-loop ${loop.on ? "is-on" : ""}`}
            style={{
              left: `${s(loop.a)}%`,
              width: `${s(loop.b) - s(loop.a)}%`,
            }}
          />
        )}
        <div
          className="scrub-fill"
          style={{
            width: `${s(e)}%`,
          }}
        />
      </div>
      {loop.a != null && (
        <span
          className="scrub-mark"
          style={{
            left: `${s(loop.a)}%`,
          }}
        >
          A
        </span>
      )}
      {loop.b != null && (
        <span
          className="scrub-mark"
          style={{
            left: `${s(loop.b)}%`,
          }}
        >
          B
        </span>
      )}
      <span
        className="scrub-thumb"
        style={{
          left: `${s(e)}%`,
        }}
      />
    </div>
  );
}
function Sy({ clip, beat, vocab, onSeekBeat, onLoopBeats }) {
  let o = useRef(null),
    [r, s] = useState(8);
  useEffect(() => {
    let c = o.current;
    if (!c || typeof ResizeObserver == "undefined") return;
    let h = new ResizeObserver(([b]) => s(b.contentRect.width < 560 ? 4 : 8));
    return (h.observe(c), () => h.disconnect());
  }, []);
  let i = useMemo(() => {
      let c = [];
      clip.events.some((h) => h.b < 0) &&
        c.push({
          start: -4,
          len: 4,
          pickup: !0,
        });
      for (let h = 0; h < clip.counts; h += r)
        c.push({
          start: h,
          len: Math.min(r, clip.counts - h),
        });
      return c;
    }, [clip, r]),
    u = beat == null ? null : Math.floor(beat * 4 + 1e-6) / 4,
    p = [...new Set(clip.events.map((c) => c.s))],
    d =
      beat == null
        ? null
        : clip.spans.find((c) => beat >= c.from - 0.05 && beat <= c.to + 0.2);
  return (
    <div ref={o} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="f-label">Partitura de sonidos</p>
        <p className="text-[12px] text-muted">
          {"Cada fila es un ocho contado "}
          <span className="font-mono">1 · y · 2</span>. Toca una casilla para ir
          a ese sonido.
        </p>
      </div>
      {i.map((c) => {
        let h = c.len * 4,
          b = (clip.eight || 1) + Math.floor(c.start / 8),
          y = (((c.start % 8) + 8) % 8) + 1,
          M = c.pickup
            ? "Entrada \xB7 5 6 7 8"
            : c.len === 8
              ? `Ocho ${b}`
              : `Ocho ${b} \xB7 cuentas ${y}\u2013${y + c.len - 1}`,
          f = u != null && u >= c.start && u < c.start + c.len,
          m = clip.spans.filter(
            (v) => v.from >= c.start - 1e-6 && v.from < c.start + c.len - 1e-6,
          );
        return (
          <div key={c.start} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                {M}
              </span>
              {!c.pickup && (
                <button
                  type="button"
                  className="btn btn-xs"
                  onClick={() => onLoopBeats(c.start, c.start + c.len)}
                >
                  <O name="loop" size={13} />
                  {"Repetir "}
                  {c.len === 8 ? "este ocho" : "estas cuentas"}
                </button>
              )}
            </div>
            {m.length > 0 && (
              <p className="phrase-line">
                {m.map((v, w) => (
                  <span key={w} className={`phrase ${v === d ? "is-on" : ""}`}>
                    <b>{Ll(v.from)}</b> {Cr(vocab, v.key)}
                  </span>
                ))}
              </p>
            )}
            <div
              className="rgrid"
              style={{
                gridTemplateColumns: `1.5rem repeat(${h}, minmax(0, 1fr))`,
              }}
            >
              {f && (
                <div
                  className="rplay"
                  style={{
                    gridColumn: `${Math.round((u - c.start) * 4) + 2}`,
                    gridRow: "1 / 5",
                  }}
                />
              )}
              {Array.from(
                {
                  length: h,
                },
                (v, w) => {
                  let P = w % 4 === 0,
                    T = P ? bo(c.start + w / 4) : rd[w % 4];
                  return (
                    <span
                      key={`h${w}`}
                      className={`rcount ${P ? "is-beat" : ""}`}
                      style={{
                        gridColumn: w + 2,
                        gridRow: 1,
                      }}
                    >
                      {T}
                    </span>
                  );
                },
              )}
              {m.map((v, w) => {
                let P = Math.round((v.from - c.start) * 4),
                  T = Math.min(h, Math.round((v.to - c.start) * 4) + 1);
                return (
                  <span
                    key={`s${w}`}
                    className={`rspan ${v === d ? "is-on" : ""}`}
                    style={{
                      gridColumn: `${P + 2} / ${T + 2}`,
                      gridRow: 2,
                    }}
                    title={Cr(vocab, v.key)}
                  />
                );
              })}
              <span
                className="rlane"
                style={{
                  gridColumn: 1,
                  gridRow: 3,
                }}
                title="Pie derecho"
              >
                D
              </span>
              <span
                className="rlane is-l"
                style={{
                  gridColumn: 1,
                  gridRow: 4,
                }}
                title="Pie izquierdo"
              >
                I
              </span>
              {Array.from(
                {
                  length: h,
                },
                (v, w) => (
                  <button
                    key={`c${w}`}
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className={`rcell ${w % 4 === 0 ? "is-beat" : ""}`}
                    style={{
                      gridColumn: w + 2,
                      gridRow: "3 / 5",
                    }}
                    onClick={() => onSeekBeat(c.start + w / 4 - 0.01)}
                  />
                ),
              )}
              {clip.events
                .filter(
                  (v) => v.b >= c.start - 1e-6 && v.b < c.start + c.len - 1e-6,
                )
                .map((v, w) => {
                  let P = Math.round((v.b - c.start) * 4),
                    T = beat != null && beat >= v.b - 1e-6 && beat - v.b < 0.22,
                    $ = vocab.sounds[v.s] ? vocab.sounds[v.s].name : v.s;
                  return (
                    <span
                      key={`e${w}`}
                      className={`rev ${v.f === "R" ? "is-r" : "is-l"} ${T ? "is-hit" : ""}`}
                      style={{
                        gridColumn: P + 2,
                        gridRow: v.f === "R" ? 3 : 4,
                      }}
                      title={`${Ll(v.b)} \xB7 ${$} \xB7 pie ${v.f === "R" ? "derecho" : "izquierdo"}`}
                    >
                      {xh(vocab, v.s)}
                    </span>
                  );
                })}
            </div>
          </div>
        );
      })}
      <p className="font-mono text-[11px] leading-relaxed text-muted">
        {p.map((c, h) => (
          <span key={c}>
            {h > 0 ? " \xB7 " : ""}
            <b className="font-medium text-ink">{xh(vocab, c)}</b>{" "}
            {vocab.sounds[c] ? vocab.sounds[c].name : c}
          </span>
        ))}
      </p>
    </div>
  );
}
function Cy({ clip, me, mode }) {
  let a = mode === "bailarina";
  if (!clip.order)
    return (
      <div className="flex flex-col gap-1.5">
        <p className="f-label">Movimiento</p>
        <p className="text-sm text-ink">
          {"Todas a la vez: sal\xEDs en el 1 y lleg\xE1is a la nueva marca en "}
          {clip.move}
          {" tiempos, sin correr."}
        </p>
        <p className="text-[12px] text-muted">
          Los círculos son del color de la cinta de cada una en el suelo.
        </p>
      </div>
    );
  let l = clip.order.indexOf(me);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="f-label">
          {clip.from === "entrada" ? "Orden de entrada" : "Orden de salida"}
        </p>
        {a && l >= 0 && (
          <p className="text-sm font-semibold text-ink">
            {"T\xFA sales en el "}
            {Ll(l * clip.stagger)}
            {" y llegas en el "}
            {Ll(l * clip.stagger + clip.move)}.
          </p>
        )}
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {clip.order.map((o, r) => {
          let s = Be.find((u) => u.id === o);
          return (
            <li
              key={o}
              className={`order-item ${a && me === o ? "is-me" : ""}`}
            >
              <span
                className="tape-dot"
                style={{
                  background: s.tape,
                }}
              />
              <span className="min-w-0 truncate font-semibold">{s.name}</span>
              <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums">
                {"en el "}
                {Ll(r * clip.stagger)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
var My = (e) => JSON.parse(JSON.stringify(e));
function Sh({ codes, onLogin }) {
  let [n, a] = useState(""),
    [l, o] = useState(!1),
    r = (s) => {
      let i = Object.keys(codes).find(
        (u) => codes[u] === s.trim().toUpperCase(),
      );
      i ? onLogin(i) : o(!0);
    };
  return (
    <section className="panel login">
      <p className="f-label">Estudio en casa · grupo de claqué</p>
      <h1 className="f-display mt-1 text-[2.6rem] uppercase leading-[0.9]">
        Entra con tu código
      </h1>
      <p className="mt-2 text-sm text-muted">
        Te lo da tu profe en clase. Son cuatro letras o números, sin correo ni
        contraseña.
      </p>
      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(s) => {
          (s.preventDefault(), r(n));
        }}
      >
        <label htmlFor="code" className="sr-only">
          Tu código
        </label>
        <input
          id="code"
          className="code-input"
          value={n}
          maxLength={4}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={!1}
          placeholder="····"
          onChange={(s) => {
            (a(s.target.value.toUpperCase()), o(!1));
          }}
        />
        <button type="submit" className="btn btn-primary btn-lg">
          Entrar
        </button>
      </form>
      {l && (
        <p
          role="alert"
          className="mt-2 text-[13px] font-semibold text-[color:var(--warn)]"
        >
          Ese código no existe. Revisa las letras o pídeselo a tu profe.
        </p>
      )}
      <div className="demo-hint">
        <p className="f-label">Solo en la demo · códigos de prueba</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Be.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              onClick={() => r(codes[s.id])}
            >
              <span
                className="tape-dot"
                style={{
                  background: s.tape,
                }}
              />
              {s.name}
              <span className="font-mono text-[12px] text-muted">
                {codes[s.id]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
function Ey({ positions, highlight }) {
  return (
    <span className="mini-stage" aria-hidden="true">
      {Be.map((n) => {
        let a = positions[n.id];
        if (!a) return null;
        let l = highlight === n.id;
        return (
          <i
            key={n.id}
            className={l ? "is-me" : highlight ? "is-dim" : ""}
            style={{
              left: `${a[0]}%`,
              top: `${a[1]}%`,
              background: l || highlight ? void 0 : n.tape,
            }}
          />
        );
      })}
    </span>
  );
}
function CPd({ choreos, clipsById, mode, me, onOpen, onCreate }) {
  let r = mode === "coreo",
    s = r ? choreos : choreos.filter((i) => i.status !== "Borrador");
  return (
    <section className="flex flex-col gap-3" aria-label="Repertorio">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="f-display text-[1.9rem] uppercase leading-none">
          Repertorio
        </h2>
        <p className="font-mono text-[12px] text-muted">
          {s.length}
          {" coreograf\xEDas"}
          {r ? " \xB7 las de borrador no las ven las bailarinas" : ""}
        </p>
      </div>
      <div className="rep-grid">
        {s.map((i) => {
          let u = clipsById[i.id] || [],
            p = r
              ? i.blocks.filter((d) => d.isNew).length +
                u.filter((d) => d.isNew).length
              : si(i, u, me).length;
          return (
            <button
              key={i.id}
              type="button"
              className="rep-card"
              onClick={() => onOpen(i.id)}
            >
              <Ey
                positions={i.formations[i.blocks[0].id] || {}}
                highlight={r ? null : me}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5 p-3.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={`status ${i.status === "Borrador" ? "is-draft" : ""}`}
                  >
                    {i.status}
                  </span>
                  {p > 0 && (
                    <span className="tag-new">
                      {p} {p === 1 ? "novedad" : "novedades"}
                    </span>
                  )}
                  {i.show && Pn(i.show.date) >= 0 && (
                    <span className="status is-show">
                      {"Funci\xF3n: "}
                      {Pn(i.show.date) === 0
                        ? "hoy"
                        : `en ${Pn(i.show.date)} ${Pn(i.show.date) === 1 ? "d\xEDa" : "d\xEDas"}`}
                    </span>
                  )}
                </span>
                <span className="f-display text-[1.7rem] uppercase leading-[0.95] text-ink [text-wrap:balance]">
                  {i.title}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                  {i.blocks.length}{" "}
                  {i.blocks.length === 1 ? "bloque" : "bloques"}
                  {" \xB7 "}
                  {Ca(i.blocks)}
                  {" ochos \xB7 "}
                  {i.bpm}
                  {" bpm"}
                </span>
              </span>
            </button>
          );
        })}
        {r && <CY onCreate={onCreate} />}
      </div>
    </section>
  );
}
function CY({ onCreate }) {
  let [t, n] = useState(!1),
    [a, l] = useState(""),
    [o, r] = useState(120);
  return t ? (
    <form
      className="rep-card rep-new is-form"
      onSubmit={(s) => {
        (s.preventDefault(),
          a.trim() &&
            onCreate(a.trim(), Math.max(40, Math.min(240, Number(o) || 120))));
      }}
    >
      <label
        className="flex w-full flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor="new-title"
      >
        Título
        <input
          id="new-title"
          className="field"
          value={a}
          onChange={(s) => l(s.target.value)}
          placeholder="Por ejemplo: Gala de primavera"
          autoFocus={!0}
        />
      </label>
      <label
        className="flex w-full flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor="new-bpm"
      >
        Tempo de la canción (bpm)
        <input
          id="new-bpm"
          type="number"
          min="40"
          max="240"
          className="field"
          value={o}
          onChange={(s) => r(s.target.value)}
        />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={!a.trim()}>
          Crear
        </button>
        <button type="button" className="btn" onClick={() => n(!1)}>
          Cancelar
        </button>
      </div>
    </form>
  ) : (
    <button type="button" className="rep-card rep-new" onClick={() => n(!0)}>
      <span className="rep-plus" aria-hidden="true">
        +
      </span>
      <span className="text-[15px] font-semibold text-ink">
        Nueva coreografía
      </span>
      <span className="text-[13px] text-muted">
        Empieza como borrador: las bailarinas no la ven hasta que la publiques.
      </span>
    </button>
  );
}
function Ch({ me, choreos, clipsById, lastClass, seen, onPlay, onNote }) {
  let s = Et(me),
    i = lastClass.absent.includes(me),
    u = seen[me] || [],
    p = choreos
      .filter((b) => lastClass.worked.includes(b.id) && b.status !== "Borrador")
      .map((b) => ({
        choreo: b,
        items: si(b, clipsById[b.id] || [], me),
      }))
      .filter((b) => b.items.length),
    d = p.flatMap((b) => b.items),
    c = d.filter((b) => u.includes(b.id)).length;
  if (!i)
    return (
      <section className="panel flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <span className="ok-badge">
          <O name="check" size={14} />
          Al día
        </span>
        <p className="min-w-0 flex-1 text-sm text-ink">
          {"Viniste a la \xFAltima clase, "}
          {$l.long}
          {". Lo que se cambi\xF3 ese d\xEDa lleva la etiqueta "}
          <span className="tag-new">Nuevo</span>
          {" por si quieres repasarlo."}
        </p>
      </section>
    );
  let h = 0;
  return (
    <section className="panel catch">
      <div className="catch-head">
        <p className="f-label">
          {"\xDAltima clase \xB7 "}
          {$l.short}
        </p>
        <h2 className="f-display mt-1 text-[2.2rem] uppercase leading-[0.92] [text-wrap:balance]">
          {"Faltaste "}
          {$l.day}
          {", "}
          {s.name}
        </h2>
        <p className="mt-2 max-w-[48ch] text-sm text-muted">
          Esto es lo que se hizo nuevo, en el orden en que te conviene
          estudiarlo. Cada vídeo se marca como repasado cuando lo reproduces.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="progress" aria-hidden="true">
            <span
              style={{
                width: `${d.length ? (c / d.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-mono text-[12px] tabular-nums text-ink">
            {c}
            {" de "}
            {d.length}
            {" repasado"}
            {d.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {p.map((b) => (
          <div key={b.choreo.id} className="flex flex-col gap-1.5">
            <p className="f-label">{b.choreo.title}</p>
            <ol className="catch-list">
              {b.items.map((y) => {
                h += 1;
                let M = u.includes(y.id);
                return (
                  <li key={y.id}>
                    <button
                      type="button"
                      className={`catch-item ${M ? "is-seen" : ""}`}
                      onClick={() =>
                        y.kind === "clip"
                          ? onPlay(b.choreo.id, y.clip)
                          : onNote(b.choreo.id, y.block.id, y.id)
                      }
                    >
                      <span className="catch-num f-display">{h}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold leading-snug text-ink">
                          {y.kind === "clip"
                            ? y.clip.title
                            : `Nota para ti en ${y.block.name}`}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                          {y.kind === "clip"
                            ? `${y.block.name} \xB7 ${xa[y.clip.angle] || "V\xEDdeo"}${y.clip.bpm ? ` \xB7 ${y.clip.bpm} bpm` : ""}`
                            : y.text}
                        </span>
                      </span>
                      <span className="catch-state">
                        {M ? (
                          <O name="check" size={16} />
                        ) : (
                          <O
                            name={y.kind === "clip" ? "play" : "arrow"}
                            size={14}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
function Mh({ choreos, clipsById, lastClass, setLastClass }) {
  let l = useMemo(
      () => G0(choreos, clipsById, lastClass),
      [choreos, clipsById, lastClass],
    ),
    [o, r] = useState(null),
    [s, i] = useState(!1),
    u = useRef(null),
    p = o != null ? o : l,
    d = (b) =>
      setLastClass((y) => ({
        ...y,
        absent: y.absent.includes(b)
          ? y.absent.filter((M) => M !== b)
          : [...y.absent, b],
      })),
    c = (b) =>
      setLastClass((y) => ({
        ...y,
        worked: y.worked.includes(b)
          ? y.worked.filter((M) => M !== b)
          : [...y.worked, b],
      })),
    h = () => {
      let b = () => {
          (i(!0), setTimeout(() => i(!1), 2200));
        },
        y = () => {
          u.current && (u.current.focus(), u.current.select());
        };
      try {
        navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(p).then(b, y)
          : y();
      } catch {
        y();
      }
    };
  return (
    <section className="panel flex flex-col gap-4 p-4">
      <div>
        <p className="f-label">
          {"Despu\xE9s de clase \xB7 "}
          {$l.short}
        </p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Última clase
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-ink">¿Quién faltó?</p>
        <div className="flex flex-wrap gap-2">
          {Be.map((b) => {
            let y = lastClass.absent.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                className={`chip chip-att ${y ? "is-out" : ""}`}
                aria-pressed={y}
                onClick={() => d(b.id)}
              >
                <span
                  className="tape-dot"
                  style={{
                    background: b.tape,
                  }}
                />
                {b.name}
                <span className="chip-state">{y ? "Falt\xF3" : "Vino"}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-muted">
          Quien faltó verá al entrar la lista de lo marcado como Nuevo y sus
          notas personales.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-ink">
          ¿Qué coreografías trabajasteis?
        </p>
        <div className="flex flex-wrap gap-2">
          {choreos.map((b) => (
            <button
              key={b.id}
              type="button"
              className="chip"
              aria-pressed={lastClass.worked.includes(b.id)}
              onClick={() => c(b.id)}
            >
              {lastClass.worked.includes(b.id) && <O name="check" size={14} />}
              {b.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-ink" htmlFor="wa-text">
          Resumen para el grupo de WhatsApp
        </label>
        <textarea
          id="wa-text"
          ref={u}
          className="field wa-text"
          rows={10}
          value={p}
          onChange={(b) => r(b.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={h}>
            <O name={s ? "check" : "copy"} />
            {s ? "Copiado" : "Copiar el mensaje"}
          </button>
          <a
            className="btn"
            href={`https://wa.me/?text=${encodeURIComponent(p)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en WhatsApp
          </a>
          {o != null && (
            <button type="button" className="btn" onClick={() => r(null)}>
              Volver a generarlo
            </button>
          )}
        </div>
        <p className="text-[12px] text-muted">
          El mensaje no nombra a quién faltó: cada una lo ve solo al entrar con
          su código.
        </p>
      </div>
    </section>
  );
}
function Eh({ codes, setCodes }) {
  return (
    <section className="panel flex flex-col gap-3 p-4">
      <div>
        <p className="f-label">Acceso de las alumnas</p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Bailarinas y códigos
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">
          Cada una entra solo con su código: sin correo ni datos personales. Así
          sus notas personales solo las ve ella.
        </p>
      </div>
      <ul className="flex flex-col">
        {Be.map((n) => (
          <li key={n.id} className="code-row">
            <span
              className="tape-dot"
              style={{
                background: n.tape,
              }}
            />
            <span className="min-w-0 flex-1 font-semibold text-ink">
              {n.name}
            </span>
            <span className="code-chip">{codes[n.id]}</span>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() =>
                setCodes((a) => ({
                  ...a,
                  [n.id]: x0(Object.values(a)),
                }))
              }
              title="El código anterior deja de funcionar"
            >
              Nuevo código
            </button>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-muted">
        Si alguna pierde su código o lo comparte, dale uno nuevo: el anterior
        deja de funcionar.
      </p>
    </section>
  );
}
function CH({ vocab, setVocab }) {
  let n = (l, o, r) =>
      setVocab((s) => ({
        ...s,
        sounds: {
          ...s.sounds,
          [l]: {
            ...s.sounds[l],
            [o]: r,
          },
        },
      })),
    a = (l, o) =>
      setVocab((r) => ({
        ...r,
        steps: {
          ...r.steps,
          [l]: {
            name: o,
          },
        },
      }));
  return (
    <section className="panel p-4">
      <details open={!0}>
        <summary className="vocab-summary">
          <span>
            <span className="f-label block">Cómo lo dices tú</span>
            <span className="f-display mt-1 block text-[1.9rem] uppercase leading-none">
              Diccionario de pasos
            </span>
          </span>
        </summary>
        <p className="mt-2 max-w-[70ch] text-[13px] text-muted">
          He puesto nombres orientativos en castellano. Cámbialos por los que
          usas en clase: la partitura, los vídeos y la vista con música usarán
          tus palabras. La abreviatura es lo que se ve dentro de cada casilla de
          la partitura.
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-ink">Sonidos</p>
            <div className="vocab-grid">
              <span className="f-label">Término</span>
              <span className="f-label">Cómo lo llamas</span>
              <span className="f-label">Abrev.</span>
              {N0.map((l) => (
                <Fragment key={l}>
                  <span className="font-mono text-[12px] text-muted">{l}</span>
                  <input
                    aria-label={`Nombre para ${l}`}
                    id={`vs-${l}`}
                    className="field field-sm"
                    value={vocab.sounds[l].name}
                    onChange={(o) => n(l, "name", o.target.value)}
                  />
                  <input
                    aria-label={`Abreviatura para ${l}`}
                    id={`va-${l}`}
                    className="field field-sm text-center font-mono"
                    maxLength={3}
                    value={vocab.sounds[l].abbr}
                    onChange={(o) => n(l, "abbr", o.target.value)}
                  />
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-ink">Pasos</p>
            <div className="vocab-grid is-steps">
              <span className="f-label">Término</span>
              <span className="f-label">Cómo lo llamas</span>
              {ni.map((l) => (
                <Fragment key={l}>
                  <span className="font-mono text-[12px] text-muted">
                    {jc[l]}
                  </span>
                  <input
                    aria-label={`Nombre para ${jc[l]}`}
                    id={`vp-${l}`}
                    className="field field-sm"
                    value={vocab.steps[l].name}
                    onChange={(o) => a(l, o.target.value)}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn mt-4"
          onClick={() => setVocab(My(ai))}
        >
          Restaurar los nombres de ejemplo
        </button>
      </details>
    </section>
  );
}
function Rh({ choreos, onFull }) {
  let n = choreos
    .filter((o) => o.status !== "Borrador" && o.show && Pn(o.show.date) >= 0)
    .sort((o, r) => Pn(o.show.date) - Pn(r.show.date));
  if (!n.length) return null;
  let a = n[0],
    l = Pn(a.show.date);
  return (
    <section className="panel show-panel" aria-label="Próxima función">
      <div className="show-main">
        <div
          className={`show-days ${l <= 14 ? "is-soon" : ""}`}
          aria-hidden="true"
        >
          <span className="f-display">{l}</span>
          <span className="show-unit">{l === 1 ? "d\xEDa" : "d\xEDas"}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="f-label">
            {"Pr\xF3xima funci\xF3n \xB7 "}
            {a.show.name}
            {" \xB7 "}
            {yo(a.show.date)}
          </p>
          <p className="mt-1 text-[16px] font-semibold leading-snug text-ink">
            {a.title}
            {": "}
            {ad(l)}.
          </p>
          {n.length > 1 && (
            <p className="mt-1 text-[13px] text-muted">
              {"Despu\xE9s: "}
              {n
                .slice(1)
                .map((o) => `${o.title} (${ad(Pn(o.show.date))})`)
                .join(" \xB7 ")}
            </p>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg show-cta"
          onClick={() => onFull(a.id)}
        >
          <O name="play" />
          Ensayar entera
        </button>
      </div>
      {a.week && (
        <p className="show-week">
          <span className="f-label">Esta semana</span>
          <span>{a.week}</span>
        </p>
      )}
    </section>
  );
}
function Th({ bank, onOpenUse }) {
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Banco de pasos"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="f-label">Se graban una vez, se usan en todas</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Banco de pasos
          </h2>
        </div>
        <p className="font-mono text-[12px] text-muted">
          {bank.length}
          {" pasos con v\xEDdeo"}
        </p>
      </div>
      <p className="max-w-[70ch] text-[13px] text-muted">
        Cada vídeo de pasos que grabas entra aquí. Para usarlo en otra
        coreografía, abre el bloque y pulsa «Añadir paso del banco»: las alumnas
        verán siempre la misma explicación.
      </p>
      <ul className="bank-list">
        {bank.map((n) => (
          <li key={n.clip.id} className="bank-item">
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-snug text-ink">
                {n.clip.title}
              </span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
                {xa[n.clip.angle] || "V\xEDdeo"}
                {n.clip.bpm ? ` \xB7 ${n.clip.bpm} bpm` : ""}
                {" \xB7 "}
                {n.uses.length === 1
                  ? "en 1 bloque"
                  : `en ${n.uses.length} bloques`}
              </span>
            </span>
            <span className="flex flex-wrap justify-end gap-1.5">
              {n.uses.map((a, l) => (
                <button
                  key={l}
                  type="button"
                  className={`bank-use ${l > 0 ? "is-reused" : ""}`}
                  onClick={() => onOpenUse(a.choreo.id, a.block.id)}
                >
                  {a.choreo.title}
                  {" \xB7 "}
                  {a.block.name}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
function Ph({ choreos, clipsById, lastClass, seen, hard, onOpenClip }) {
  let r = [];
  for (let d of choreos)
    for (let c of clipsById[d.id] || [])
      r.push({
        choreo: d,
        clip: c,
      });
  let s = (d) => r.find((c) => c.clip.id === d),
    i = choreos.filter(
      (d) => lastClass.worked.includes(d.id) && d.status !== "Borrador",
    ),
    u = {};
  for (let d of Object.values(hard)) for (let c of d) u[c] = (u[c] || 0) + 1;
  let p = Object.entries(u)
    .sort((d, c) => c[1] - d[1])
    .map(([d, c]) => ({
      found: s(d),
      n: c,
      who: Object.keys(hard).filter((h) => hard[h].includes(d)),
    }))
    .filter((d) => d.found)
    .slice(0, 4);
  return (
    <section
      className="panel flex flex-col gap-4 p-4"
      aria-label="Seguimiento de las alumnas"
    >
      <div>
        <p className="f-label">Antes de la próxima clase</p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Quién está al día
        </h2>
        <p className="mt-1.5 max-w-[70ch] text-[13px] text-muted">
          Lo que han repasado las que faltaron y los pasos que cada una ha
          marcado como «Me cuesta». Solo lo ves tú.
        </p>
      </div>
      {p.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="f-label">Lo que más cuesta al grupo</p>
          <ul className="flex flex-col gap-1.5">
            {p.map(({ found, n, who }) => (
              <li key={found.clip.id}>
                <button
                  type="button"
                  className="follow-hard"
                  onClick={() => onOpenClip(found.choreo.id, found.clip)}
                >
                  <span className="follow-n f-display">{n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold leading-snug text-ink">
                      {found.clip.title}
                    </span>
                    <span className="block text-[12px] text-muted">
                      {found.choreo.title}
                      {" \xB7 "}
                      {who.map((b) => Et(b).name).join(", ")}
                    </span>
                  </span>
                  <O name="arrow" size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="follow-grid">
        {Be.map((d) => {
          let c = lastClass.absent.includes(d.id),
            h = i.flatMap((M) => si(M, clipsById[M.id] || [], d.id)),
            b = h.filter((M) => (seen[d.id] || []).includes(M.id)).length,
            y = (hard[d.id] || []).map(s).filter(Boolean);
          return (
            <div key={d.id} className="follow-row">
              <span
                className="tape-dot"
                style={{
                  background: d.tape,
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <b className="text-[14px] font-semibold text-ink">{d.name}</b>
                  {c ? (
                    <span
                      className={`follow-state ${b >= h.length && h.length ? "is-ok" : "is-todo"}`}
                    >
                      {"Falt\xF3 \xB7 ha repasado "}
                      {b}
                      {" de "}
                      {h.length}
                    </span>
                  ) : (
                    <span className="follow-state is-ok">Vino a clase</span>
                  )}
                </span>
                {y.length > 0 && (
                  <span className="mt-0.5 block text-[12px] text-muted">
                    {"Le cuesta: "}
                    {y.map((M) => M.clip.title).join(" \xB7 ")}
                  </span>
                )}
              </span>
              {c && h.length > 0 && (
                <span className="follow-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${(b / h.length) * 100}%`,
                    }}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
var oa = (e) => {
  let t = Math.max(0, Math.round(e));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
var Ry = (e) => {
  let t = String(e || "")
    .trim()
    .match(/^(\d{1,2})(?:[:.,'](\d{1,2}))?$/);
  return t ? Number(t[1]) * 60 + Number(t[2] || 0) : null;
};
var fd = (e) => (Ca(e.blocks) * 8 * 60) / e.bpm;
async function Lh(e, t) {
  let n = URL.createObjectURL(e);
  try {
    let a = await new Promise((s, i) => {
        let u = new Image();
        ((u.onload = () => s(u)), (u.onerror = i), (u.src = n));
      }),
      l = Math.min(1, t / Math.max(a.naturalWidth, a.naturalHeight)),
      o = document.createElement("canvas");
    ((o.width = Math.round(a.naturalWidth * l)),
      (o.height = Math.round(a.naturalHeight * l)),
      o.getContext("2d").drawImage(a, 0, 0, o.width, o.height));
    let r = await new Promise((s) => o.toBlob(s, "image/jpeg", 0.82));
    return {
      blob: r,
      dataUrl: r ? null : o.toDataURL("image/jpeg", 0.8),
      canvas: o,
    };
  } finally {
    URL.revokeObjectURL(n);
  }
}
function Ih({ choreo, song, sync, onUpload, onSaveSync }) {
  let [o, r] = useState(!1);
  return (
    <section className="panel flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">Canción</p>
          <p className="mt-1 text-[14px] text-ink">
            {song ? (
              <>
                <b className="font-semibold">{song.name}</b>
                {" \xB7 "}
                {String(sync.bpm).replace(".", ",")}
                {" bpm \xB7 el ocho 1 empieza en "}
                {la(sync.offset)}
              </>
            ) : (
              <>
                {
                  "Sin canci\xF3n todav\xEDa: los bloques se practican con una pista de ensayo generada a "
                }
                {choreo.bpm}
                {" bpm."}
              </>
            )}
          </p>
          {song && !sync.synced && (
            <p className="mt-1 text-[13px] font-semibold text-[color:var(--warn)]">
              Falta sincronizar los ochos con la canción.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-file">
            <O name="upload" />
            {song ? "Cambiar canci\xF3n" : "Subir la canci\xF3n"}
            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(s) => {
                let i = s.target.files && s.target.files[0];
                (i && (onUpload(i), r(!0)), (s.target.value = ""));
              }}
            />
          </label>
          {song && (
            <button
              type="button"
              className="btn"
              aria-pressed={o}
              onClick={() => r((s) => !s)}
            >
              <O name="metro" />
              Sincronizar ochos
            </button>
          )}
        </div>
      </div>
      {song && o && (
        <Ty
          key={song.src}
          song={song}
          sync={sync}
          onSave={(s) => {
            (onSaveSync(s), r(!1));
          }}
        />
      )}
    </section>
  );
}
function Ty({ song, sync, onSave }) {
  let a = useRef(null),
    [l, o] = useState(!1),
    [r, s] = useState(0),
    [i, u] = useState([]),
    [p, d] = useState(sync.bpm),
    [c, h] = useState(sync.offset),
    b = K0(i);
  (useEffect(() => {
    if (!l) return;
    let f,
      m = () => {
        (a.current && s(a.current.currentTime), (f = requestAnimationFrame(m)));
      };
    return ((f = requestAnimationFrame(m)), () => cancelAnimationFrame(f));
  }, [l]),
    useEffect(() => {
      b && (d(b.bpm), h(Math.round(b.offset * 100) / 100));
    }, [i.length]));
  let y = () => {
      let f = a.current;
      f &&
        (f.paused
          ? f
              .play()
              .then(() => o(!0))
              .catch(() => o(!1))
          : (f.pause(), o(!1)));
    },
    M = () => {
      let f = a.current;
      !f || f.paused || u((m) => [...m, f.currentTime]);
    };
  return (
    <div className="sync" data-no-shortcuts={!0}>
      <audio ref={a} src={song.src} preload="auto" onEnded={() => o(!1)} />
      <ol className="sync-steps">
        <li>Dale a reproducir la canción.</li>
        <li>
          Cuando llegue el 1 del primer ocho, toca «Tiempo» en cada tiempo. Con
          8 toques basta; con más, más preciso.
        </li>
        <li>
          Revisa el tempo y guarda. Si algo se desvía, puedes ajustar los
          números a mano.
        </li>
      </ol>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn" onClick={y}>
          <O name={l ? "pause" : "play"} />
          {l ? "Pausa" : "Reproducir"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            (a.current && (a.current.currentTime = 0), s(0), u([]));
          }}
        >
          <O name="restart" />
          Desde el principio
        </button>
        <span className="font-mono text-[12px] tabular-nums text-muted">
          {la(r)}
        </span>
      </div>
      <button
        type="button"
        className="tapbtn"
        disabled={!l}
        onPointerDown={M}
        onKeyDown={(f) => {
          (f.key === " " || f.key === "Enter") &&
            (f.preventDefault(), f.repeat || M());
        }}
      >
        <span className="f-display text-[2rem] uppercase leading-none">
          Tiempo
        </span>
        <span className="font-mono text-[12px]">
          {l ? `${i.length} toques` : "Primero dale a reproducir"}
        </span>
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <label
          className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
          htmlFor="sync-bpm"
        >
          Tempo (bpm)
          <input
            id="sync-bpm"
            type="number"
            step="0.1"
            min="40"
            max="240"
            className="field"
            value={p}
            onChange={(f) => d(Number(f.target.value) || p)}
          />
        </label>
        <label
          className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
          htmlFor="sync-off"
        >
          El ocho 1 empieza en (segundos)
          <input
            id="sync-off"
            type="number"
            step="0.01"
            min="0"
            className="field"
            value={c}
            onChange={(f) => h(Math.max(0, Number(f.target.value) || 0))}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            onSave({
              bpm: Ln(p, 40, 240),
              offset: c,
              synced: !0,
            })
          }
        >
          Guardar sincronización
        </button>
        {i.length > 0 && (
          <button type="button" className="btn" onClick={() => u([])}>
            Borrar toques
          </button>
        )}
        {i.length === 1 && (
          <span className="text-[12px] text-muted">
            Sigue tocando en cada tiempo…
          </span>
        )}
      </div>
    </div>
  );
}
function Ah({ flip }) {
  return (
    <div
      className="aud"
      title="Derecha e izquierda de la bailarina mirando al público"
    >
      <div className="aud-nums" aria-hidden="true">
        {[8, 6, 4, 2, 0, 2, 4, 6, 8].map((t, n) => (
          <span
            key={n}
            style={{
              left: `${n * 12.5}%`,
            }}
            className={t === 0 ? "is-zero" : ""}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="aud-row">
        <span>{flip ? "\u25C2 tu izquierda" : "\u25C2 su derecha"}</span>
        <span className="aud-title">Público · espejo del estudio</span>
        <span>{flip ? "tu derecha \u25B8" : "su izquierda \u25B8"}</span>
      </div>
    </div>
  );
}
function CH2({
  choreo,
  ranges,
  blockId,
  setBlockId,
  setPos,
  setFormation,
  copyPrev,
  mode,
  me,
  view,
  setView,
}) {
  let d = useRef(null),
    [c, h] = useState(null),
    b = choreo.blocks,
    y = view === "escenario",
    M = mode === "coreo",
    f = M ? null : me,
    m = Math.max(
      0,
      b.findIndex((D) => D.id === blockId),
    ),
    v = b[m],
    w = choreo.formations[v.id],
    P = m > 0 ? b[m - 1] : null,
    T = P ? choreo.formations[P.id] : null,
    $ = ([D, _]) => (y ? [100 - D, 100 - _] : [D, _]),
    A = (D, _) => {
      M &&
        (D.preventDefault(),
        D.currentTarget.setPointerCapture(D.pointerId),
        h(_));
    },
    Y = (D, _) => {
      if (c !== _ || !d.current) return;
      let B = d.current.getBoundingClientRect(),
        G = Ln(((D.clientX - B.left) / B.width) * 100, 4, 96),
        ee = Ln(((D.clientY - B.top) / B.height) * 100, 5, 95),
        [me, pe] = y ? [100 - G, 100 - ee] : [G, ee];
      setPos(v.id, _, [Math.round(me * 2) / 2, Math.round(pe * 2) / 2]);
    },
    F = () => h(null),
    Z = (D, _) => {
      if (!M) return;
      let B = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      }[D.key];
      if (!B) return;
      D.preventDefault();
      let G = D.shiftKey ? 5 : 1,
        ee = (y ? -B[0] : B[0]) * G,
        me = (y ? -B[1] : B[1]) * G,
        [pe, ke] = w[_];
      setPos(v.id, _, [Ln(pe + ee, 4, 96), Ln(ke + me, 5, 95)]);
    },
    q = f ? w[f] : null,
    de = f && T ? T[f] : null,
    ge = M ? Z0(T, w) : [],
    ie = new Set(ge.flatMap((D) => [D.a, D.b]));
  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="f-label">Mapa del escenario</p>
          <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none [text-wrap:balance]">
            {v.name}{" "}
            <span className="text-muted">
              {"\xB7 "}
              {v.formation}
            </span>
          </h2>
        </div>
        <div
          className="seg seg-sm"
          role="radiogroup"
          aria-label="Punto de vista del mapa"
        >
          {[
            ["publico", "Desde el p\xFAblico"],
            ["escenario", "Desde el escenario"],
          ].map(([D, _]) => (
            <button
              key={D}
              type="button"
              role="radio"
              aria-checked={view === D}
              className="seg-btn"
              onClick={() => setView(D)}
            >
              {_}
            </button>
          ))}
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Bloques">
        {b.map((D) => (
          <button
            key={D.id}
            type="button"
            role="tab"
            aria-selected={D.id === v.id}
            className="tab"
            onClick={() => setBlockId(D.id)}
          >
            <span className="f-display text-[1.35rem] leading-none">
              {ranges[D.id].n}
            </span>
            <span className="tab-name">{D.name}</span>
            {D.isNew && (
              <span className="tab-new" title="Nuevo en la última clase" />
            )}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {y && <Ah flip={!0} />}
        <div ref={d} className={`stage ${M ? "is-edit" : ""}`}>
          <span className="stage-center" aria-hidden="true" />
          <span className={`stage-upstage ${y ? "is-bottom" : ""}`}>Fondo</span>
          {M && T && (
            <svg
              className="stage-paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {Be.map((D) => {
                if (!T[D.id] || !w[D.id]) return null;
                let [_, B] = $(T[D.id]),
                  [G, ee] = $(w[D.id]);
                return Math.abs(_ - G) + Math.abs(B - ee) < 0.5 ? null : (
                  <line
                    key={D.id}
                    className={ie.has(D.id) ? "is-bad" : ""}
                    x1={_}
                    y1={B}
                    x2={G}
                    y2={ee}
                  />
                );
              })}
            </svg>
          )}
          {q && de && (
            <>
              <svg
                className="stage-path"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line x1={$(de)[0]} y1={$(de)[1]} x2={$(q)[0]} y2={$(q)[1]} />
              </svg>
              <span
                className="stage-ghost"
                style={{
                  left: `${$(de)[0]}%`,
                  top: `${$(de)[1]}%`,
                }}
                aria-hidden="true"
              />
            </>
          )}
          {Be.map((D) => {
            if (!w[D.id]) return null;
            let [_, B] = $(w[D.id]),
              G = f === D.id,
              ee = [
                "dot",
                M ? "is-edit" : "",
                c === D.id ? "is-drag" : "",
                f ? (G ? "is-me" : "is-dim") : "",
              ].join(" ");
            return (
              <button
                key={D.id}
                type="button"
                className={ee}
                style={{
                  left: `${_}%`,
                  top: `${B}%`,
                  "--tape": D.tape,
                  "--tape-ink": D.ink,
                }}
                onPointerDown={(me) => A(me, D.id)}
                onPointerMove={(me) => Y(me, D.id)}
                onPointerUp={F}
                onPointerCancel={F}
                onKeyDown={(me) => Z(me, D.id)}
                tabIndex={M || G ? 0 : -1}
                aria-label={`${D.name}: n\xFAmero ${vo(w[D.id])}, ${go(w[D.id][1])}`}
              >
                <span className="disc">{D.name[0]}</span>
                <span className="name">{D.name}</span>
              </button>
            );
          })}
        </div>
        {!y && <Ah />}
      </div>
      {M ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 flex-1 text-[13px] text-muted">
              {c
                ? `${Et(c).name} \u2192 n\xFAmero ${vo(w[c])}, ${go(w[c][1])}`
                : "Arrastra los c\xEDrculos para colocar a cada bailarina. Con el teclado: tabulador y flechas."}
            </p>
            {P && (
              <button
                type="button"
                className="btn"
                onClick={() => copyPrev(v.id)}
              >
                <O name="copy" />
                {"Copiar de "}
                {P.name}
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="f-label">Plantillas</p>
            <div className="flex flex-wrap gap-1.5">
              {ld.map((D) => (
                <button
                  key={D.id}
                  type="button"
                  className="btn btn-xs"
                  onClick={() => setFormation(v.id, X0(D.id, w), D.name)}
                >
                  {D.name}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-muted">
              Cada una se coloca en el hueco más cercano por su lado, para que
              nadie cruce el escenario entero.
            </p>
          </div>
          {P && (
            <div
              className={`stage-check ${ge.length ? "is-bad" : "is-ok"}`}
              role="status"
            >
              {ge.length ? (
                <>
                  <p className="font-semibold">
                    {ge.length === 1
                      ? "Ojo en la transici\xF3n desde "
                      : `${ge.length} avisos en la transici\xF3n desde `}
                    {P.name}:
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {ge.map((D, _) => (
                      <li key={_}>
                        {Et(D.a).name}
                        {" y "}
                        {Et(D.b).name}{" "}
                        {D.kind === "cruce"
                          ? "se cruzan muy cerca por el camino."
                          : "acaban demasiado juntas."}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-[12px] opacity-80">
                    Las líneas rojas son sus recorridos. Separa sus marcas o
                    cambia el orden.
                  </p>
                </>
              ) : (
                <p>
                  <O name="check" size={14} />
                  {" Nadie choca en la transici\xF3n desde "}
                  {P.name}.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <Py block={v} pos={q} prevBlock={P} prevPos={de} />
      )}
    </div>
  );
}
function Py({ block, pos, prevBlock, prevPos }) {
  if (!pos) return null;
  let l = Sr(pos[0]),
    o = nd(pos[0]);
  return (
    <div className="mark">
      <div className="mark-num" aria-hidden="true">
        <span className="f-display">{l}</span>
        <span className="mark-side">{o}</span>
      </div>
      <div className="min-w-0">
        <p className="f-label">
          {"Tu marca en "}
          {block.name}
        </p>
        <p className="mt-1 text-[15px] font-semibold leading-snug text-ink">
          {l === 0 ? "N\xFAmero 0, en el centro" : `N\xFAmero ${l} a tu ${o}`}
          {", "}
          {go(pos[1])}.
        </p>
        <p className="mt-0.5 text-[13px] text-muted">
          {prevPos
            ? `Vienes del ${vo(prevPos)} en ${prevBlock.name}; la l\xEDnea discontinua es tu recorrido.`
            : "Es tu marca de inicio en esta coreograf\xEDa."}
        </p>
      </div>
    </div>
  );
}
function Fh(e) {
  let { choreo, ranges, clips, mode, onAddBlock } = e,
    r = mode === "coreo";
  return (
    <div className="panel">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pb-2 pt-4">
        <div>
          <p className="f-label">Desglose por bloques</p>
          <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
            Cuentas de 8
          </h2>
        </div>
        <p className="font-mono text-[12px] text-muted">
          {Ca(choreo.blocks)}
          {" ochos \xB7 "}
          {oa(fd(choreo))}
          {" \xB7 "}
          {clips.length}
          {" v\xEDdeos de pasos"}
        </p>
      </div>
      <div className="flex flex-col">
        {choreo.blocks.map((s) => (
          <Ly
            key={s.id}
            b={s}
            range={ranges[s.id]}
            {...e}
            blockClips={clips.filter((i) => i.block === s.id)}
            music={e.music.find((i) => i.block === s.id)}
          />
        ))}
      </div>
      {r && (
        <div className="border-t border-line px-4 py-4">
          <button type="button" className="btn" onClick={onAddBlock}>
            <span aria-hidden="true">+</span>
            {" A\xF1adir bloque"}
          </button>
        </div>
      )}
    </div>
  );
}
function CZh({
  c: e,
  playingNow,
  isCoreo,
  wasSeen,
  onPlay,
  toggleNew,
  setAngle,
  removeUpload,
  onRemoveLink,
  hardOn,
  hardN,
  onToggleHard,
}) {
  let c = e.type === "upload" ? null : ii(e),
    h = e.type === "music";
  return (
    <li
      className={`clip ${playingNow ? "is-playing" : ""} ${h ? "is-music" : ""}`}
    >
      <button type="button" className="clip-main" onClick={() => onPlay(e.id)}>
        <span
          className={`thumb thumb-${e.type === "upload" ? "subido" : e.type === "stage" ? "escenario" : h ? "musica" : "pies"}`}
        >
          <CFh
            angle={
              e.type === "upload"
                ? "subido"
                : e.type === "stage"
                  ? "escenario"
                  : h
                    ? "musica"
                    : "pies"
            }
          />
          {c != null && (
            <span className="thumb-dur">{la(c).replace(/,\d$/, "")}</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-ink">
            {h
              ? e.rhythm
                ? `Practicar con el ritmo \xAB${e.rhythm.name}\xBB`
                : "Practicar el bloque con m\xFAsica"
              : e.title}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
            {e.linked ? "Del banco \xB7 " : ""}
            {e.rhythm ? "Txalaparta" : xa[e.angle] || "V\xEDdeo"}
            {e.bpm ? ` \xB7 ${e.bpm} bpm` : ""}
            {e.acapella === !0 ? " \xB7 a capella" : ""}
            {playingNow ? " \xB7 en el reproductor" : ""}
          </span>
        </span>
        {!isCoreo && wasSeen && (
          <span className="seen" title="Ya lo has reproducido">
            <O name="check" size={14} />
          </span>
        )}
        {!isCoreo && e.isNew && <span className="tag-new">Nuevo</span>}
        {isCoreo && hardN > 0 && (
          <span className="tag-hard">
            {"Les cuesta a "}
            {hardN}
          </span>
        )}
      </button>
      {!isCoreo && !h && onToggleHard && (
        <div className="clip-tools">
          <button
            type="button"
            className={`btn btn-xs btn-hard ${hardOn ? "is-on" : ""}`}
            aria-pressed={!!hardOn}
            onClick={() => onToggleHard(e.id)}
            title="Avisa a la profe de que este paso te cuesta"
          >
            <O name="flag" size={13} />
            Me cuesta
          </button>
        </div>
      )}
      {isCoreo && !h && (
        <div className="clip-tools">
          <button
            type="button"
            className={`btn btn-xs btn-new ${e.isNew ? "is-on" : ""}`}
            aria-pressed={e.isNew}
            onClick={() => toggleNew(e.id)}
          >
            Nuevo
          </button>
          {(e.type === "feet" || e.type === "upload") && (
            <div
              className="seg seg-xs"
              role="radiogroup"
              aria-label="Ángulo de la cámara"
            >
              {[
                ["frente", "Frente"],
                ["lado", "Lado"],
              ].map(([b, y]) => (
                <button
                  key={b}
                  type="button"
                  role="radio"
                  aria-checked={e.angle === b}
                  className="seg-btn"
                  onClick={() => setAngle(e.srcId || e.id, b)}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
          {e.linked ? (
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => onRemoveLink(e.id)}
            >
              Quitar
            </button>
          ) : (
            e.type === "upload" && (
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => removeUpload(e.id)}
              >
                Quitar
              </button>
            )
          )}
        </div>
      )}
    </li>
  );
}
function Ly({
  choreo,
  b: t,
  range,
  blockClips,
  music,
  clipId,
  blockId,
  onPlay,
  onSelect,
  mode,
  me: p,
  seen,
  updateBlock,
  toggleNew,
  setAngle,
  onUpload,
  removeUpload,
  rhythms,
  onOpenRhythm,
  bank,
  onAddLink,
  onRemoveLink,
  hardMine,
  hardCount,
  onToggleHard,
}) {
  let [Y, F] = useState(!1),
    [Z, q] = useState(""),
    de = new Set(blockClips.map((H) => H.srcId || H.id)),
    ge = (bank || []).filter((H) => !de.has(H.clip.id)),
    ie =
      t.rhythmId && rhythms ? rhythms.find((H) => H.id === t.rhythmId) : null,
    [D, _] = useState(null),
    B = mode === "coreo",
    G = !B && t.personal ? t.personal[p] : null,
    ee = Object.entries(t.personal || {}).filter(([, H]) => H),
    me = t.id === blockId,
    pe = () =>
      _({
        name: t.name,
        formation: t.formation,
        len: t.len,
        notes: t.notes,
        personal: {
          ...(t.personal || {}),
        },
        isNew: t.isNew,
      }),
    ke = () => {
      let H = Object.fromEntries(
        Object.entries(D.personal).filter(([, et]) => et && et.trim()),
      );
      (updateBlock(t.id, {
        name: D.name.trim() || t.name,
        formation: D.formation.trim() || t.formation,
        len: Ln(Math.round(Number(D.len) || t.len), 1, 16),
        notes: D.notes,
        personal: H,
        isNew: D.isNew,
      }),
        _(null));
    };
  return (
    <article className={`blk ${me ? "is-active" : ""}`}>
      <button
        type="button"
        className="block-head"
        onClick={() => onSelect(t.id)}
        aria-label={`Ver la formaci\xF3n de ${t.name} en el mapa`}
      >
        <span className="block-n f-display">{range.n}</span>
        <span className="min-w-0 flex-1">
          <span className="f-display block text-[1.6rem] uppercase leading-none">
            {t.name}
          </span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
            {range.start === range.end
              ? `Ocho ${range.start}`
              : `Ochos ${range.start}\u2013${range.end}`}
            {" \xB7 "}
            {oa(((range.start - 1) * 8 * 60) / choreo.bpm)}–
            {oa((range.end * 8 * 60) / choreo.bpm)}
            {" \xB7 "}
            {t.formation}
          </span>
        </span>
        <span className="flex flex-wrap items-center justify-end gap-1.5">
          {!t.done && <span className="tag-todo">Por montar</span>}
          {t.isNew && <span className="tag-new">Nuevo en la última clase</span>}
        </span>
      </button>
      <div className="block-body">
        {D ? (
          <div className="flex flex-col gap-3">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_6rem]">
              <label
                className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                htmlFor={`bn-${t.id}`}
              >
                Nombre del bloque
                <input
                  id={`bn-${t.id}`}
                  className="field"
                  value={D.name}
                  onChange={(H) =>
                    _({
                      ...D,
                      name: H.target.value,
                    })
                  }
                />
              </label>
              <label
                className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                htmlFor={`bf-${t.id}`}
              >
                Formación
                <input
                  id={`bf-${t.id}`}
                  className="field"
                  value={D.formation}
                  onChange={(H) =>
                    _({
                      ...D,
                      formation: H.target.value,
                    })
                  }
                />
              </label>
              <label
                className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                htmlFor={`bl-${t.id}`}
              >
                Ochos
                <input
                  id={`bl-${t.id}`}
                  type="number"
                  min="1"
                  max="16"
                  className="field"
                  value={D.len}
                  onChange={(H) =>
                    _({
                      ...D,
                      len: H.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="f-label" htmlFor={`notes-${t.id}`}>
                Notas para todas
              </label>
              <textarea
                id={`notes-${t.id}`}
                rows={4}
                className="field note-field"
                value={D.notes}
                onChange={(H) =>
                  _({
                    ...D,
                    notes: H.target.value,
                  })
                }
              />
            </div>
            <fieldset className="flex flex-col gap-1.5">
              <legend className="f-label mb-1.5">
                Notas personales (cada una ve solo la suya)
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {Be.map((H) => (
                  <label
                    key={H.id}
                    className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                    htmlFor={`pn-${t.id}-${H.id}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="tape-dot"
                        style={{
                          background: H.tape,
                        }}
                      />
                      {H.name}
                    </span>
                    <input
                      id={`pn-${t.id}-${H.id}`}
                      className="field"
                      value={D.personal[H.id] || ""}
                      placeholder="Sin nota"
                      onChange={(et) =>
                        _({
                          ...D,
                          personal: {
                            ...D.personal,
                            [H.id]: et.target.value,
                          },
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            </fieldset>
            <label
              className="flex items-center gap-2 text-[13px] text-ink"
              htmlFor={`new-${t.id}`}
            >
              <input
                id={`new-${t.id}`}
                type="checkbox"
                className="h-4 w-4 accent-[var(--accent)]"
                checked={D.isNew}
                onChange={(H) =>
                  _({
                    ...D,
                    isNew: H.target.checked,
                  })
                }
              />
              Marcar el bloque como «Nuevo en la última clase»
            </label>
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={ke}>
                Guardar
              </button>
              <button type="button" className="btn" onClick={() => _(null)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="f-label">Notas de la coreógrafa</p>
              <p className="note mt-1">
                {t.notes || (
                  <span className="text-muted">Sin notas todavía.</span>
                )}
              </p>
            </div>
            {G && (
              <div className="foryou">
                <p className="f-label foryou-label">
                  {"Para ti, "}
                  {Et(p).name}
                </p>
                <p className="mt-0.5 text-[14px] leading-snug text-ink">{G}</p>
              </div>
            )}
            {B && ee.length > 0 && (
              <ul className="flex flex-col gap-1 text-[13px]">
                {ee.map(([H, et]) => (
                  <li key={H} className="flex gap-2">
                    <span className="flex shrink-0 items-center gap-1.5 font-semibold text-ink">
                      <span
                        className="tape-dot"
                        style={{
                          background: Et(H).tape,
                        }}
                      />
                      {Et(H).name}
                    </span>
                    <span className="min-w-0 text-muted">{et}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {ie && !D && (
          <div className="tx-link">
            <O name="txala" />
            <span className="min-w-0 flex-1 text-[14px] text-ink">
              {"M\xFAsica de este bloque: ritmo de txalaparta "}
              <b className="font-semibold">«{ie.name}»</b>
            </span>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => onOpenRhythm(ie.id)}
            >
              Abrir en el taller
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="f-label">Vídeos de pasos sueltos</p>
          <ul className="flex flex-col gap-1.5">
            {music && (
              <CZh
                c={music}
                playingNow={clipId === music.id}
                isCoreo={B}
                wasSeen={!1}
                onPlay={onPlay}
              />
            )}
            {blockClips.map((H) => (
              <CZh
                key={H.id}
                c={H}
                playingNow={clipId === H.id}
                isCoreo={B}
                wasSeen={!B && seen.includes(H.id)}
                onPlay={onPlay}
                toggleNew={toggleNew}
                setAngle={setAngle}
                removeUpload={removeUpload}
                onRemoveLink={onRemoveLink}
                hardOn={(hardMine || []).includes(H.id)}
                hardN={(hardCount || {})[H.id] || 0}
                onToggleHard={onToggleHard}
              />
            ))}
          </ul>
          {blockClips.length === 0 && (
            <p className="text-[13px] text-muted">
              Aún no hay vídeos de pasos en este bloque.
            </p>
          )}
        </div>
        {B && !D && (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn" onClick={pe}>
                <O name="edit" />
                Editar bloque y notas
              </button>
              <button
                type="button"
                className="btn"
                aria-pressed={!!t.done}
                onClick={() =>
                  updateBlock(t.id, {
                    done: !t.done,
                  })
                }
              >
                <O name="check" />
                {t.done ? "Montado" : "Marcar como montado"}
              </button>
              <button
                type="button"
                className="btn"
                aria-pressed={Y}
                onClick={() => F((H) => !H)}
                disabled={!ge.length && !Y}
              >
                <O name="copy" />
                Añadir paso del banco
              </button>
              <label className="btn btn-file">
                <O name="upload" />
                Subir vídeo de un paso
                <input
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(H) => {
                    let et = H.target.files && H.target.files[0];
                    (et && onUpload(t.id, et), (H.target.value = ""));
                  }}
                />
              </label>
            </div>
            {Y && (
              <div className="bank-pick">
                <label
                  className="flex min-w-0 flex-1 flex-col gap-1 text-[13px] font-semibold text-ink"
                  htmlFor={`bank-${t.id}`}
                >
                  Paso del banco
                  <select
                    id={`bank-${t.id}`}
                    className="field"
                    value={Z || (ge[0] ? ge[0].clip.id : "")}
                    onChange={(H) => q(H.target.value)}
                  >
                    {ge.map((H) => (
                      <option key={H.clip.id} value={H.clip.id}>
                        {H.clip.title}
                        {" ("}
                        {H.origin.choreo.title})
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="btn btn-primary self-end"
                  disabled={!ge.length}
                  onClick={() => {
                    let H = Z || (ge[0] && ge[0].clip.id);
                    (H && onAddLink(t.id, H), q(""), F(!1));
                  }}
                >
                  Añadir
                </button>
              </div>
            )}
            <p className="text-[12px] text-muted">
              Mejor graba los pasos tú misma. Si sale alguna alumna, pide antes
              permiso a su familia. Un paso del banco usa el mismo vídeo en
              todas las coreografías.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
var Ay = {
  schedule: [],
  costume: "",
  notes: {},
  auth: {},
};
function Dh({
  choreo,
  mode,
  me,
  onSave,
  onSaveLogistics,
  onFull,
  onClass,
  playingFull,
  countSheet,
}) {
  let u = mode === "coreo",
    [p, d] = useState(null),
    [c, h] = useState(!1),
    [b, y] = useState(null),
    M = on("downloads"),
    f = choreo.show || null,
    m = f ? Pn(f.date) : null,
    v = choreo.blocks.filter((q) => q.done).length,
    w = choreo.blocks.length,
    P = w ? Math.round((v / w) * 100) : 0,
    T = choreo.logistics || null,
    $ = f
      ? m < 0
        ? "La funci\xF3n ya pas\xF3."
        : m === 0
          ? "\xA1La funci\xF3n es hoy!"
          : `${m === 1 ? "Falta 1 d\xEDa" : `Faltan ${m} d\xEDas`} para la funci\xF3n.`
      : u
        ? "Pon la fecha de la actuaci\xF3n para ver la cuenta atr\xE1s."
        : "Todav\xEDa no hay fecha de funci\xF3n.",
    A = T ? Be.filter((q) => !T.auth[q.id]) : [],
    Y = fd(choreo),
    F = T && T.maxTime ? Y - T.maxTime : 0,
    Z = async () => {
      if (!M) return;
      let { filename, html } = countSheet();
      y(await el(M, filename, html));
    };
  return (
    <section
      className="panel show-panel"
      aria-label="Función y ensayo completo"
    >
      <div className="show-main">
        <div
          className={`show-days ${f && m != null && m >= 0 && m <= 14 ? "is-soon" : ""}`}
          aria-hidden="true"
        >
          <span className="f-display">
            {f && m != null && m >= 0 ? m : "\u2014"}
          </span>
          <span className="show-unit">
            {f && m === 1 ? "d\xEDa" : "d\xEDas"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="f-label">
            {f ? `${f.name} \xB7 ${yo(f.date)}` : "Funci\xF3n"}
          </p>
          <p className="mt-1 text-[16px] font-semibold leading-snug text-ink">
            {$}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="progress" aria-hidden="true">
              <span
                style={{
                  width: `${P}%`,
                }}
              />
            </div>
            <span className="font-mono text-[12px] tabular-nums text-ink">
              {v}
              {" de "}
              {w} {w === 1 ? "bloque montado" : "bloques montados"}
              {" \xB7 dura "}
              {oa(Y)}
            </span>
          </div>
          {T && T.maxTime ? (
            <p
              className={`mt-1.5 text-[12.5px] font-semibold ${F > 0 ? "text-[color:var(--warn)]" : "text-[color:var(--ok)]"}`}
            >
              {F > 0
                ? `Se pasa ${oa(F)} del m\xE1ximo de la funci\xF3n (${oa(T.maxTime)}).`
                : `Cabe en el m\xE1ximo de la funci\xF3n (${oa(T.maxTime)}); sobran ${oa(-F)}.`}
            </p>
          ) : null}
        </div>
        <div className="show-ctas">
          <button
            type="button"
            className="btn btn-primary btn-lg show-cta"
            onClick={onFull}
            aria-pressed={playingFull}
          >
            <O name="play" />
            Ensayar entera
          </button>
          <button
            type="button"
            className="btn show-cta"
            onClick={onClass}
            title="Pantalla grande para proyectar en clase o verla en la tele"
          >
            <O name="expand" />
            Modo clase
          </button>
        </div>
      </div>
      {choreo.week && !p && (
        <p className="show-week">
          <span className="f-label">Esta semana</span>
          <span>{choreo.week}</span>
        </p>
      )}
      {!u &&
        T &&
        (T.schedule.length > 0 ||
          T.costume ||
          (T.photos && T.photos.length) ||
          T.notes[me] ||
          me) && (
          <div className="show-day">
            <p className="f-label">El día de la función</p>
            {T.schedule.length > 0 && (
              <ul className="show-sched">
                {T.schedule.map((q, de) => (
                  <li key={de}>
                    <b className="font-mono tabular-nums">{q.time}</b> {q.what}
                  </li>
                ))}
              </ul>
            )}
            {T.costume && (
              <p className="text-[14px] text-ink">
                <b className="font-semibold">Vestuario:</b> {T.costume}
              </p>
            )}
            {T.photos && T.photos.length > 0 && <Oh photos={T.photos} />}
            {T.notes[me] && (
              <p className="text-[14px] text-ink">
                <b className="font-semibold">Para ti:</b> {T.notes[me]}
              </p>
            )}
            {me && (
              <p
                className={`text-[13px] font-semibold ${T.auth[me] ? "text-[color:var(--ok)]" : "text-[color:var(--warn)]"}`}
              >
                {T.auth[me]
                  ? "Tu familia ya ha firmado la autorizaci\xF3n."
                  : "Falta la autorizaci\xF3n de tu familia: recu\xE9rdaselo."}
              </p>
            )}
          </div>
        )}
      {u && !p && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-xs"
            onClick={() =>
              d({
                name: f ? f.name : "",
                date: f ? f.date : "",
                week: choreo.week || "",
              })
            }
          >
            <O name="edit" size={13} />
            {f
              ? "Editar funci\xF3n y plan de la semana"
              : "Poner fecha de funci\xF3n"}
          </button>
          <button
            type="button"
            className="btn btn-xs"
            aria-pressed={c}
            onClick={() => h((q) => !q)}
          >
            <O name="check" size={13} />
            Logística
            {T && A.length ? ` \xB7 faltan ${A.length} autorizaciones` : ""}
          </button>
          {M && (
            <button type="button" className="btn btn-xs" onClick={Z}>
              <O name="download" size={13} />
              Descargar hoja de cuentas
            </button>
          )}
        </div>
      )}
      {!u && M && (
        <div>
          <button type="button" className="btn btn-xs" onClick={Z}>
            <O name="download" size={13} />
            Descargar hoja de cuentas
          </button>
        </div>
      )}
      {b && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {b}
        </p>
      )}
      {p && (
        <form
          className="flex flex-col gap-3"
          onSubmit={(q) => {
            (q.preventDefault(),
              onSave(
                p.date
                  ? {
                      name: p.name.trim() || "Funci\xF3n",
                      date: p.date,
                    }
                  : null,
                p.week.trim(),
              ),
              d(null));
          }}
        >
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <label
              className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
              htmlFor={`show-name-${choreo.id}`}
            >
              Nombre de la función
              <input
                id={`show-name-${choreo.id}`}
                className="field"
                value={p.name}
                placeholder="Por ejemplo: Festival de Navidad"
                onChange={(q) =>
                  d({
                    ...p,
                    name: q.target.value,
                  })
                }
              />
            </label>
            <label
              className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
              htmlFor={`show-date-${choreo.id}`}
            >
              Fecha
              <input
                id={`show-date-${choreo.id}`}
                type="date"
                className="field"
                value={p.date}
                onChange={(q) =>
                  d({
                    ...p,
                    date: q.target.value,
                  })
                }
              />
            </label>
          </div>
          <label
            className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
            htmlFor={`show-week-${choreo.id}`}
          >
            Plan de esta semana (lo ven las bailarinas)
            <textarea
              id={`show-week-${choreo.id}`}
              rows={2}
              className="field"
              value={p.week}
              placeholder="Qué repasar en casa antes de la próxima clase"
              onChange={(q) =>
                d({
                  ...p,
                  week: q.target.value,
                })
              }
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button type="button" className="btn" onClick={() => d(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
      {u && c && <CZy choreo={choreo} lg={T || Ay} onSave={onSaveLogistics} />}
    </section>
  );
}
function Oh({ photos, onRemove }) {
  let [n, a] = useState(null);
  return (
    <>
      <div className="lg-photos">
        {photos.map((l, o) => (
          <figure key={l.id || o} className="lg-photo">
            <button
              type="button"
              className="lg-photo-btn"
              onClick={() => a(l)}
              aria-label={`Ver la foto ${o + 1} del vestuario en grande`}
            >
              <img
                src={l.url}
                alt={`Vestuario, foto ${o + 1}`}
                loading="lazy"
              />
            </button>
            {onRemove && (
              <button
                type="button"
                className="btn btn-icon lg-photo-x"
                aria-label={`Quitar la foto ${o + 1}`}
                onClick={() => onRemove(l)}
              >
                <O name="x" size={14} />
              </button>
            )}
          </figure>
        ))}
      </div>
      {n && (
        <div
          className="lg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Foto del vestuario"
          onClick={() => a(null)}
        >
          <img src={n.url} alt="Vestuario" />
          <button type="button" className="btn" onClick={() => a(null)}>
            <O name="x" />
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
function CZy({ choreo, lg, onSave }) {
  let a = (y) =>
      onSave({
        ...lg,
        ...y,
      }),
    l = Be.filter((y) => !lg.auth[y.id]),
    o = on("assets"),
    [r, s] = useState(!1),
    [i, u] = useState(null),
    [p, d] = useState(lg.maxTime ? oa(lg.maxTime) : ""),
    c = lg.photos || [],
    h = async (y) => {
      (u(null), s(!0));
      let M = [];
      for (let f of y)
        if (/^image\//.test(f.type))
          try {
            if (o) {
              let { blob } = await Lh(f, 1600),
                v = await o.upload(blob || f);
              M.push({
                id: v.id,
                url: v.url,
              });
            } else {
              let { canvas } = await Lh(f, 900);
              M.push({
                url: canvas.toDataURL("image/jpeg", 0.78),
              });
            }
          } catch (m) {
            u(
              m && m.code === "not_granted"
                ? "No se han podido guardar las fotos: falta el permiso."
                : "Una foto no se ha podido guardar.",
            );
          }
      (M.length &&
        a({
          photos: [...c, ...M],
        }),
        s(!1));
    },
    b = async (y) => {
      if (
        (a({
          photos: c.filter((M) => M !== y),
        }),
        o && y.id)
      )
        try {
          await o.delete(y.id);
        } catch {}
    };
  return (
    <div className="lg-editor">
      <label
        className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor={`lg-max-${choreo.id}`}
      >
        Tiempo máximo en la función (m:ss)
        <input
          id={`lg-max-${choreo.id}`}
          className="field lg-time"
          inputMode="numeric"
          placeholder="3:00"
          value={p}
          onChange={(y) => {
            d(y.target.value);
            let M = Ry(y.target.value);
            (M || !y.target.value.trim()) &&
              a({
                maxTime: M || null,
              });
          }}
        />
        <span className="text-[12px] font-normal text-muted">
          {"La coreograf\xEDa dura "}
          {oa(fd(choreo))}
          {" a "}
          {choreo.bpm}
          {" bpm."}
        </span>
      </label>
      <div className="flex flex-col gap-2">
        <p className="f-label">Horario del día</p>
        {lg.schedule.map((y, M) => (
          <div key={M} className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor={`lg-t-${choreo.id}-${M}`}>
              Hora
            </label>
            <input
              id={`lg-t-${choreo.id}-${M}`}
              type="time"
              className="field lg-time"
              value={y.time}
              onChange={(f) =>
                a({
                  schedule: lg.schedule.map((m, v) =>
                    v === M
                      ? {
                          ...m,
                          time: f.target.value,
                        }
                      : m,
                  ),
                })
              }
            />
            <label className="sr-only" htmlFor={`lg-w-${choreo.id}-${M}`}>
              Qué
            </label>
            <input
              id={`lg-w-${choreo.id}-${M}`}
              className="field min-w-0 flex-1"
              value={y.what}
              placeholder="Llegada, calentamiento, actuación…"
              onChange={(f) =>
                a({
                  schedule: lg.schedule.map((m, v) =>
                    v === M
                      ? {
                          ...m,
                          what: f.target.value,
                        }
                      : m,
                  ),
                })
              }
            />
            <button
              type="button"
              className="btn btn-icon"
              aria-label="Quitar esta hora"
              onClick={() =>
                a({
                  schedule: lg.schedule.filter((f, m) => m !== M),
                })
              }
            >
              <O name="x" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-xs self-start"
          onClick={() =>
            a({
              schedule: [
                ...lg.schedule,
                {
                  time: "",
                  what: "",
                },
              ],
            })
          }
        >
          <span aria-hidden="true">+</span>
          {" A\xF1adir hora"}
        </button>
      </div>
      <label
        className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor={`lg-c-${choreo.id}`}
      >
        Vestuario (para todas)
        <textarea
          id={`lg-c-${choreo.id}`}
          rows={2}
          className="field"
          value={lg.costume}
          onChange={(y) =>
            a({
              costume: y.target.value,
            })
          }
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <p className="f-label">Fotos del vestuario</p>
        {c.length > 0 && <Oh photos={c} onRemove={b} />}
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn btn-xs btn-file">
            <O name="upload" size={13} />
            {r ? "Guardando\u2026" : "A\xF1adir fotos"}
            <input
              type="file"
              accept="image/*"
              multiple={!0}
              className="sr-only"
              disabled={r}
              onChange={(y) => {
                (h(Array.from(y.target.files || [])), (y.target.value = ""));
              }}
            />
          </label>
          <span className="text-[12px] text-muted">
            Del vestido, el peinado o los zapatos. Mejor sin caras: las
            bailarinas son menores.
          </span>
        </div>
        {i && (
          <p
            className="text-[12px] font-semibold text-[color:var(--warn)]"
            role="status"
          >
            {i}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="f-label mb-1.5">
          Notas para cada una (vestuario, peinado, lo que lleva)
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {Be.map((y) => (
            <label
              key={y.id}
              className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
              htmlFor={`lg-n-${choreo.id}-${y.id}`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="tape-dot"
                  style={{
                    background: y.tape,
                  }}
                />
                {y.name}
              </span>
              <input
                id={`lg-n-${choreo.id}-${y.id}`}
                className="field"
                value={lg.notes[y.id] || ""}
                placeholder="Sin nota"
                onChange={(M) =>
                  a({
                    notes: {
                      ...lg.notes,
                      [y.id]: M.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <p className="f-label">Autorizaciones de las familias</p>
        <div className="flex flex-wrap gap-2">
          {Be.map((y) => {
            let M = !!lg.auth[y.id];
            return (
              <button
                key={y.id}
                type="button"
                className={`chip chip-att ${M ? "" : "is-out"}`}
                aria-pressed={M}
                onClick={() =>
                  a({
                    auth: {
                      ...lg.auth,
                      [y.id]: !M,
                    },
                  })
                }
              >
                <span
                  className="tape-dot"
                  style={{
                    background: y.tape,
                  }}
                />
                {y.name}
                <span className="chip-state">
                  {M ? "Firmada" : "Pendiente"}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-muted">
          {l.length
            ? `Faltan ${l.length}: ${l.map((y) => y.name).join(", ")}. Cada una ve en su m\xF3vil si la suya est\xE1 pendiente.`
            : "Est\xE1n todas firmadas."}
        </p>
      </div>
    </div>
  );
}
var vi = ["hr", "tk"];
var ko = {
  tk: "Ttakun",
  hr: "Herren",
  pi: "Pies",
};
var Mr = {
  hr: "asdfghjkl",
  tk: "zxcvbnm,.",
  pi: "1234",
};
var gd = {
  tk: "#EE7447",
  hr: "#38B8CC",
  pi: "#B794F6",
};
var Iy = {
  8: 0.5,
  16: 0.25,
  free: null,
};
var Hn = 4;
var jh = 0.12;
var md = 26;
var hd = 0.16;
var Bh = 0.11;
var vd = (e) => (((Math.floor(e + 1e-6) % 8) + 8) % 8) + 1;
var xo = (e, t) => ((e % t) + t) % t;
var Uh = (e) => (e === "profe" ? "la profe" : Et(e) ? Et(e).name : e);
var Vh = (e) => {
  let t = Math.round(e * 4);
  return `${vd(Math.floor(t / 4))}${["", " \xB7", " y", " \xB7"][xo(t, 4)]}`;
};
var Er = (e) => `${e.m === "s" ? "Piedra" : "Madera"} ${e.i + 1}`;
var No = (e) =>
  e.n < 2 ? "" : e.i === 0 ? "grave" : e.i === e.n - 1 ? "aguda" : "";
var qh = (e, t) => {
  if (!t) return "";
  let n = e / t;
  return n >= 1
    ? "\u2605\u2605\u2605"
    : n >= 0.8
      ? "\u2605\u2605\u2606"
      : n >= 0.5
        ? "\u2605\u2606\u2606"
        : "\u2606\u2606\u2606";
};
function _y(e) {
  return {
    tk: e.strikes.some((t) => t.p === "tk"),
    hr: e.strikes.some((t) => t.p === "hr"),
    pi: e.strikes.some((t) => t.p === "pi"),
  };
}
function CYd({ rhythms, instruments, onOpen }) {
  let a = rhythms[0],
    l = a ? Ja(a, instruments) : [],
    o = a ? a.eights * 8 : 8,
    r = a
      ? a.layers
          .filter((s) => !s.muted)
          .flatMap((s) => s.strikes)
          .filter((s) => s.b < Math.min(o, 4) && s.p !== "pi" && Sa(s, a, l, o))
      : [];
  return (
    <section className="panel tx-card">
      <div
        className="tx-card-art"
        aria-hidden="true"
        style={{
          gridTemplateColumns: `repeat(${Math.max(1, l.length)}, minmax(0, 1fr))`,
        }}
      >
        {l.map((s) => (
          <span key={s.key} className={s.m === "s" ? "is-stone" : ""}>
            {r
              .filter((i) => wa(i, a) === s.key)
              .map((i, u) => (
                <i
                  key={u}
                  style={{
                    bottom: `${12 + (i.b / 4) * 80}%`,
                    background: gd[i.p],
                  }}
                />
              ))}
          </span>
        ))}
        <b className="tx-card-line" />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4 sm:p-5">
        <p className="f-label">Taller de txalaparta</p>
        <h2 className="f-display text-[2rem] uppercase leading-[0.92] [text-wrap:balance]">
          Cread el ritmo y los pasos a la vez
        </h2>
        <p className="max-w-[56ch] text-sm text-muted">
          Tocad la txalaparta en la pantalla, de madera, de piedra o las dos, y
          añadid los pies de claqué. Cada vuelta se graba y se queda repitiendo,
          como un pedal de loops, mientras apuntáis qué paso va en cada cuenta.
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpen(a ? a.id : null)}
          >
            <O name="txala" />
            Abrir el taller
          </button>
          <span className="font-mono text-[12px] text-muted">
            {rhythms.length}{" "}
            {rhythms.length === 1 ? "ritmo guardado" : "ritmos guardados"}
          </span>
        </div>
      </div>
    </section>
  );
}
function CBd({
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
  let f = rhythm.eights * 8,
    m = useMemo(
      () => Ja(rhythm, instruments),
      [rhythm.material, instruments.wood, instruments.stone],
    ),
    v = !!rhythm.feet,
    w = (x) => updateRhythm(rhythm.id, x),
    [P, T] = useState("stop"),
    [$, A] = useState({
      phase: "stop",
      idx: null,
      slot: null,
      cin: null,
      count: null,
      eight: null,
    }),
    [Y, F] = useState(!0),
    [Z, q] = useState(!1),
    [de, ge] = useState(null),
    [ie, D] = useState(null),
    [_, B] = useState(null),
    [G, ee] = useState(null),
    me = on("downloads"),
    pe = on("sample"),
    [ke, H] = useState(null),
    [et, bt] = useState(!1),
    kt = (x) =>
      vocab && vocab.sounds[Tn[x].key]
        ? vocab.sounds[Tn[x].key].name
        : Tn[x].name,
    $e = useRef(null),
    xt = useRef(null),
    Ht = useRef({}),
    Se = useRef({
      mode: "stop",
      start: 0,
      spb: 60 / rhythm.bpm,
      L: f,
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
    }),
    Qt = useRef(rhythm),
    gn = useRef(m),
    Wt = useRef(instruments),
    we = useRef(null),
    st = useRef(null),
    Qn = useRef(Y),
    Qe = useRef(updateRhythm),
    ht = useRef(null),
    Nt = useRef(null),
    $t = useRef(null),
    Pe = useRef({
      w: 600,
      h: 240,
    }),
    Ea = useRef("");
  ((Qt.current = rhythm),
    (gn.current = m),
    (Wt.current = instruments),
    (we.current = de),
    (st.current = ie),
    (Qn.current = Y),
    (Qe.current = updateRhythm),
    (Se.current.L = f),
    (Se.current.bpm = rhythm.bpm));
  let $a = () => {
      let x = Se.current;
      return (Fe() - oi() - x.start) / x.spb;
    },
    An = (x, N) => {
      let I = Se.current.flashes;
      (I[x] || (I[x] = []), I[x].push(N));
    },
    ra = (x) => Sa(x, Qt.current, gn.current, Se.current.L),
    zn = (x, N) => {
      let I = Se.current,
        K = Qt.current;
      for (let X = Math.ceil(x - 1e-9); X < N; X++)
        if (
          X < 0 ||
          (I.mode === "rec" && X >= I.recStart - Hn && X < I.recStart) ||
          Qn.current
        ) {
          let U =
            X === -Hn ||
            (I.mode === "rec" && X === I.recStart - Hn) ||
            (X >= 0 && xo(X, 8) === 0);
          Ft(U ? "clickHi" : "click", null, I.start + X * I.spb);
        }
      let J = st.current;
      for (let X of K.layers) {
        if (X.muted) continue;
        let fe = X.runId === I.runId && X.fromBeat != null ? X.fromBeat : 0,
          U = Math.max(x, fe, 0);
        for (let ce of X.strikes) {
          if (!ra(ce)) continue;
          let ae = wa(ce, K);
          for (
            let Ne = ce.b + Math.ceil((U - ce.b) / I.L - 1e-9) * I.L;
            Ne < N;
            Ne += I.L
          ) {
            if (Ne < U - 1e-9) continue;
            if (J && ce.p === J) {
              let Yt = `${ce.p}:${ae}:${Math.round(Ne * 100)}`;
              if (!I.expect.has(Yt)) {
                let Tt = Math.floor(Ne / I.L);
                I.expect.set(Yt, {
                  x: Ne,
                  ck: ae,
                  hit: !1,
                  pass: Tt,
                  time: I.start + Ne * I.spb,
                });
                let De = I.passes.get(Tt) || {
                  total: 0,
                  hits: 0,
                  extra: 0,
                };
                ((De.total += 1), I.passes.set(Tt, De));
              }
              continue;
            }
            let We = I.start + Ne * I.spb,
              Ye = Pl(ce, K, Wt.current);
            (Ft(Ye.s, Ye.arg, We), An(`${ce.p}:${ae}`, We));
          }
        }
      }
    },
    sa = () => {
      let x = Se.current;
      if (x.mode === "stop") return;
      let N = x.lastBeat,
        I = (Fe() + jh - x.start) / x.spb;
      if (I <= N) return;
      let K = we.current,
        J = K === "accel" ? 1.6 : 1;
      if (K && x.factor < J) {
        let X = (Math.floor(N / x.L + 1e-9) + 1) * x.L;
        if (X > 0 && I >= X) {
          zn(N, X);
          let fe = x.start + X * x.spb;
          ((x.factor = Math.min(
            J,
            Math.round((x.factor + (K === "accel" ? 0.08 : 0.1)) * 100) / 100,
          )),
            (x.spb = 60 / (x.bpm * x.factor)),
            (x.start = fe - X * x.spb),
            (N = X),
            (I = (Fe() + jh - x.start) / x.spb));
        }
      }
      (zn(N, I), (x.lastBeat = I));
    },
    rn = () => {
      let x = Se.current,
        N = x.recLayerId;
      ((x.recLayerId = null),
        N &&
          Qe.current(x.rid, (I) => ({
            ...I,
            layers: I.layers.filter((K) => K.id !== N || K.strikes.length > 0),
          })));
    },
    nt = () => {
      let x = Se.current;
      (x.mode === "rec" && rn(),
        (x.mode = "stop"),
        clearInterval(ht.current),
        (ht.current = null),
        T("stop"),
        _t(!1),
        Rt());
    },
    vn = () => {
      (clearInterval(ht.current),
        (ht.current = setInterval(sa, 25)),
        sa(),
        Rt());
    },
    Al = (x) => {
      let N = Se.current,
        I = `l${Date.now().toString(36)}`;
      ((N.recLayerId = I),
        Qe.current(N.rid, (K) => ({
          ...K,
          layers: [
            ...K.layers,
            {
              id: I,
              label: `Capa ${K.layers.length + 1}`,
              muted: !1,
              strikes: [],
              runId: N.runId,
              fromBeat: x,
            },
          ],
        })));
    },
    Ra = (x) => {
      Ue();
      let N = Se.current,
        I = Fe();
      ((N.bpm = rhythm.bpm),
        (N.factor = we.current === "up" ? 0.5 : 1),
        (N.spb = 60 / (rhythm.bpm * N.factor)),
        (N.rid = rhythm.id),
        (N.runId += 1),
        (N.flashes = {}),
        (N.expect = new Map()),
        (N.passes = new Map()),
        (N.lastPass = -1),
        x
          ? ((N.start = I + 0.1 + Hn * N.spb),
            (N.lastBeat = -Hn - 1e-6),
            (N.recStart = 0),
            (N.recEnd = f),
            (N.mode = "rec"),
            Al(f))
          : ((N.start = I + 0.06), (N.lastBeat = -1e-6), (N.mode = "play")),
        T(N.mode),
        _t(!0),
        vn());
    },
    nl = () => {
      Se.current.mode === "stop" ? Ra(!1) : nt();
    },
    al = () => {
      let x = Se.current;
      if (!st.current) {
        if (x.mode === "stop") return Ra(!0);
        if ((Ue(), x.mode === "play")) {
          let N = $a();
          ((x.recStart = Math.ceil((N + 1) / f) * f),
            (x.recEnd = x.recStart + f),
            (x.mode = "rec"),
            Al(x.recEnd),
            T("rec"));
        } else (rn(), (x.mode = "play"), T("play"));
      }
    },
    ia = (x) => {
      let N = Qt.current,
        { p, plank } = x;
      if (p === "pi" && !N.feet) return;
      let J =
          p === "pi"
            ? {
                p,
                plank,
              }
            : {
                p,
                plank,
                m: x.m,
              },
        X = p === "pi" ? `f${plank}` : `${x.m}${plank}`;
      if (p !== "pi" && !gn.current.some((Tt) => Tt.key === X)) return;
      Ue();
      let fe = Pl(J, N, Wt.current);
      Ft(fe.s, fe.arg);
      let U = Se.current,
        ce = Fe();
      if (
        (An(`${p}:${X}`, ce),
        (U.lastTap = ce),
        Rt(),
        st.current && U.mode !== "stop")
      ) {
        if (p !== st.current) return;
        let Tt = ce - oi(),
          De = null;
        for (let xn of U.expect.values()) {
          if (xn.hit || xn.ck !== X) continue;
          let Co = Math.abs(xn.time - Tt);
          Co <= Bh && (!De || Co < Math.abs(De.time - Tt)) && (De = xn);
        }
        let Gn = Math.floor(Math.max(0, (Tt - U.start) / U.spb) / U.L),
          ul = U.passes.get(De ? De.pass : Gn) || {
            total: 0,
            hits: 0,
            extra: 0,
          };
        (De ? ((De.hit = !0), (ul.hits += 1)) : (ul.extra += 1),
          U.passes.set(De ? De.pass : Gn, ul));
        return;
      }
      if (U.mode === "stop") {
        (clearTimeout($t.current),
          ($t.current = setTimeout(() => {
            Se.current.mode === "stop" && _t(!1);
          }, 4e3)));
        return;
      }
      if (U.mode !== "rec" || !U.recLayerId) return;
      let ae = (ce - oi() - U.start) / U.spb - U.recStart;
      if (ae < -0.3 || ae >= U.L + 0.3) return;
      let Ne = Iy[N.snap],
        We = Ne ? Math.round(ae / Ne) * Ne : Math.round(ae * 100) / 100;
      ((We = xo(We, U.L)), We > U.L - 1e-6 && (We = 0));
      let Ye = U.recLayerId,
        Yt =
          p === "pi" || N.material !== "ambas"
            ? {
                b: We,
                plank,
                p,
              }
            : {
                b: We,
                plank,
                p,
                m: x.m,
              };
      Qe.current(U.rid, (Tt) => ({
        ...Tt,
        layers: Tt.layers.map((De) =>
          De.id !== Ye ||
          De.strikes.some(
            (Gn) =>
              Gn.p === p && wa(Gn, Tt) === X && Math.abs(Gn.b - We) < 0.01,
          )
            ? De
            : {
                ...De,
                strikes: [...De.strikes, Yt],
              },
        ),
      }));
    },
    Wn = () => {
      let x = $e.current;
      if (!x) return;
      let N = Se.current,
        I = Qt.current,
        K = gn.current,
        J = Math.min(2, window.devicePixelRatio || 1),
        X = Math.round(Pe.current.w * J),
        fe = Math.round(Pe.current.h * J);
      (x.width !== X && (x.width = X), x.height !== fe && (x.height = fe));
      let U = x.getContext("2d"),
        ce = N.mode !== "stop",
        ae = ce ? $a() : -0.35,
        Ne = md * J,
        We = X - Ne,
        Ye = I.feet ? We * hd : 0,
        Yt = (We - Ye) / Math.max(1, K.length),
        Tt = (se) => {
          if (se[0] === "f")
            return {
              x: Ne + We - Ye,
              w: Ye,
            };
          let le = K.findIndex((Ee) => Ee.key === se);
          return {
            x: Ne + le * Yt,
            w: Yt,
          };
        },
        De = fe - 8 * J,
        Gn = 3,
        ul = De / Gn;
      ((U.fillStyle = "#0D0F14"),
        U.fillRect(0, 0, X, fe),
        K.forEach((se, le) => {
          let Ee = se.m === "s";
          ((U.fillStyle = Ee
            ? le % 2
              ? "rgba(170,180,195,0.09)"
              : "rgba(170,180,195,0.05)"
            : le % 2
              ? "rgba(214,170,110,0.07)"
              : "rgba(214,170,110,0.035)"),
            U.fillRect(Ne + le * Yt, 0, Yt, fe));
          let _e = le > 0 && K[le - 1].m !== se.m;
          ((U.fillStyle = _e
            ? "rgba(255,255,255,0.35)"
            : "rgba(255,255,255,0.07)"),
            U.fillRect(Ne + le * Yt, 0, Math.max(1, _e ? 2 * J : J), fe));
        }),
        Ye &&
          ((U.fillStyle = "rgba(183,148,246,0.08)"),
          U.fillRect(Ne + We - Ye, 0, Ye, fe),
          (U.fillStyle = "rgba(255,255,255,0.35)"),
          U.fillRect(Ne + We - Ye, 0, 2 * J, fe)),
        (U.font = `600 ${10 * J}px "IBM Plex Mono", ui-monospace, monospace`),
        (U.textAlign = "left"),
        (U.textBaseline = "top"),
        (U.fillStyle = "rgba(255,255,255,0.45)"),
        K.forEach((se, le) => {
          (le === 0 || K[le - 1].m !== se.m) &&
            U.fillText(
              se.m === "s" ? "PIEDRA" : "MADERA",
              Ne + le * Yt + 6 * J,
              6 * J,
            );
        }),
        Ye && U.fillText("PIES", Ne + We - Ye + 6 * J, 6 * J),
        (U.textAlign = "right"),
        (U.textBaseline = "middle"),
        (U.font = `600 ${12 * J}px "IBM Plex Mono", ui-monospace, monospace`));
      for (
        let se = Math.floor((ae - 1) * 2);
        se <= Math.ceil((ae + Gn) * 2);
        se++
      ) {
        let le = se / 2,
          Ee = De - (le - ae) * ul;
        if (Ee < -10 || Ee > fe + 10) continue;
        let _e = se % 2 === 0,
          lt = le >= 0 && xo(le, 8) === 0;
        if (
          ((U.fillStyle = lt
            ? "rgba(255,255,255,0.32)"
            : _e
              ? "rgba(255,255,255,0.14)"
              : "rgba(255,255,255,0.05)"),
          U.fillRect(Ne, Ee, X - Ne, lt ? 2 * J : Math.max(1, J)),
          _e)
        ) {
          let Xt =
              le < 0 ||
              (N.mode === "rec" && le < N.recStart && le >= N.recStart - Hn),
            Zt =
              le < 0
                ? le + Hn + 5
                : Xt
                  ? le - N.recStart + Hn + 5
                  : vd(xo(le, N.L));
          ((U.fillStyle = Xt ? "#E4EE32" : "rgba(255,255,255,0.7)"),
            U.fillText(String(Zt), Ne - 6 * J, Ee));
        }
      }
      let xn = Math.max(9 * J, ul * 0.15),
        Co = [],
        Cd = new Set(),
        Md = new Map();
      for (let se of I.layers)
        if (!se.muted)
          for (let le of se.strikes) {
            if (!Sa(le, I, K, N.L)) continue;
            let Ee = wa(le, I),
              _e = Math.floor((ae - 1 - le.b) / N.L),
              lt = Math.ceil((ae + Gn - le.b) / N.L);
            for (let Xt = _e; Xt <= lt; Xt++) {
              let Zt = le.b + Xt * N.L;
              if (Zt < 0) continue;
              let Ta = `${le.p === "pi" ? "f" : Ee}:${Math.round(Zt * 100)}`,
                dl = Md.get(Ta);
              (dl && dl !== le.p && Cd.add(Ta),
                Md.set(Ta, le.p),
                Co.push({
                  x: Zt,
                  ck: Ee,
                  p: le.p,
                  key: Ta,
                  plank: le.plank,
                }));
            }
          }
      ((U.textAlign = "center"),
        (U.textBaseline = "middle"),
        (U.font = `700 ${10 * J}px "IBM Plex Mono", ui-monospace, monospace`));
      for (let se of Co) {
        let le = De - (se.x - ae) * ul;
        if (le < -xn || le > fe + xn) continue;
        let Ee = se.x < ae ? Math.max(0, 1 - (ae - se.x) / 0.45) : 1;
        if (Ee <= 0) continue;
        let _e = Tt(se.ck),
          lt = Cd.has(se.key),
          Xt = 4 * J,
          Zt = _e.w - 2 * Xt,
          Tr = lt ? Zt / 2 - J : Zt,
          Ta = _e.x + Xt + (lt && se.p === "hr" ? Zt / 2 + J : 0);
        if (
          ((U.globalAlpha = Ee),
          U.beginPath(),
          U.roundRect
            ? U.roundRect(Ta, le - xn, Tr, xn, 4 * J)
            : U.rect(Ta, le - xn, Tr, xn),
          ce && st.current === se.p)
        ) {
          let dl = N.expect.get(`${se.p}:${se.ck}:${Math.round(se.x * 100)}`),
            Pd = dl && !dl.hit && se.x < ae - Bh / N.spb;
          dl && dl.hit
            ? ((U.globalAlpha = 1), (U.fillStyle = "#E4EE32"), U.fill())
            : ((U.globalAlpha = Math.max(Ee, 0.6)),
              (U.fillStyle = Pd
                ? "rgba(255,80,80,0.25)"
                : "rgba(255,255,255,0.08)"),
              U.fill(),
              (U.lineWidth = 2 * J),
              (U.strokeStyle = Pd ? "#FF6B6B" : gd[se.p]),
              U.stroke());
        } else ((U.fillStyle = gd[se.p]), U.fill());
        (se.p === "pi" &&
          ((U.fillStyle = "#1B1030"),
          U.fillText(Tn[se.plank].short, Ta + Tr / 2, le - xn / 2)),
          (U.globalAlpha = 1));
      }
      let $r = Fe();
      ((U.fillStyle = "rgba(255,255,255,0.55)"),
        U.fillRect(Ne, De, X - Ne, 2 * J));
      let Ed = (se) => {
          let le = N.flashes[se];
          if (!le) return null;
          for (; le.length > 1 && le[1] <= $r;) le.shift();
          return le.length && le[0] <= $r && $r - le[0] < 0.14 ? le[0] : null;
        },
        $d = (se, le, Ee) => {
          let _e = 1 - ($r - Ee) / 0.14,
            lt = U.createLinearGradient(0, De - 60 * J, 0, De);
          (lt.addColorStop(0, "rgba(255,255,255,0)"),
            lt.addColorStop(1, `rgba(255,248,225,${0.55 * _e})`),
            (U.fillStyle = lt),
            U.fillRect(se, De - 60 * J, le, 60 * J));
        };
      for (let se of K) {
        let le = null;
        for (let Ee of vi) {
          let _e = Ed(`${Ee}:${se.key}`),
            lt = Ht.current[`${Ee}:${se.key}`];
          (lt && lt.classList.toggle("is-hit", _e != null),
            _e != null && (le == null || _e > le) && (le = _e));
        }
        if (le != null) {
          let Ee = Tt(se.key);
          $d(Ee.x, Ee.w, le);
        }
      }
      if (I.feet) {
        let se = null;
        (Tn.forEach((le, Ee) => {
          let _e = Ed(`pi:f${Ee}`),
            lt = Ht.current[`pi:f${Ee}`];
          (lt && lt.classList.toggle("is-hit", _e != null),
            _e != null && (se == null || _e > se) && (se = _e));
        }),
          se != null && $d(Ne + We - Ye, Ye, se));
      }
      let Mo = N.mode,
        Rr = null,
        cl = null,
        bi = null;
      if (
        ce &&
        (ae < 0
          ? ((Mo = "countin"), (Rr = Math.floor(ae) + Hn + 5))
          : N.mode === "rec" &&
            ae < N.recStart &&
            ((Mo = ae >= N.recStart - Hn ? "countin" : "armed"),
            Mo === "countin" && (Rr = Math.floor(ae - N.recStart) + Hn + 5)),
        ae >= 0)
      ) {
        let se = xo(ae, N.L);
        ((cl = Math.floor(se)), (bi = Math.floor(se * 4 + 1e-6) / 4));
      }
      let Kn = null;
      if (ce && st.current && ae >= 0) {
        let se = Math.floor(ae / N.L),
          le = N.passes.get(se) || {
            total: 0,
            hits: 0,
            extra: 0,
          },
          Ee = (se > 0 && N.passes.get(se - 1)) || null;
        Kn = {
          pass: se + 1,
          hits: le.hits,
          total: le.total,
          extra: le.extra,
          prev: Ee,
        };
        for (let [_e, lt] of N.expect)
          lt.x < ae - 2 * N.L && N.expect.delete(_e);
        if (se > 0 && N.lastPass !== se - 1 && Ee && Ee.total > 0) {
          N.lastPass = se - 1;
          let _e = st.current,
            lt = Ee.hits / Ee.total;
          Qe.current(N.rid, (Xt) => {
            let Zt = (Xt.best || {})[_e];
            return Zt && Zt.total && Zt.hits / Zt.total >= lt
              ? Xt
              : {
                  ...Xt,
                  best: {
                    ...(Xt.best || {}),
                    [_e]: {
                      hits: Ee.hits,
                      total: Ee.total,
                    },
                  },
                };
          });
        }
      }
      let Rd = ce ? N.factor : null,
        Td = `${Mo}|${Rr}|${cl}|${bi}|${Rd}|${Kn ? `${Kn.pass}:${Kn.hits}/${Kn.total}/${Kn.extra}:${Kn.prev ? `${Kn.prev.hits}/${Kn.prev.total}` : ""}` : ""}`;
      (Td !== Ea.current &&
        ((Ea.current = Td),
        A({
          phase: Mo,
          cin: Rr,
          idx: cl,
          slot: bi,
          factor: Rd,
          score: Kn,
          count: cl != null ? (cl % 8) + 1 : null,
          eight: cl != null ? Math.floor(cl / 8) + 1 : null,
        })),
        N.mode === "rec" &&
          N.recLayerId &&
          ae >= N.recEnd + 0.3 &&
          (rn(), (N.mode = "play"), T("play")));
    },
    Rt = () => {
      if (Nt.current) return;
      let x = () => {
        Wn();
        let N = Se.current,
          I = Fe(),
          K =
            I - N.lastTap < 0.6 ||
            Object.values(N.flashes).some(
              (J) => J.length && I - J[J.length - 1] < 0.6,
            );
        N.mode !== "stop" || K
          ? (Nt.current = requestAnimationFrame(x))
          : ((Nt.current = null), Wn());
      };
      Nt.current = requestAnimationFrame(x);
    };
  (useEffect(() => {
    let x = xt.current;
    if (!x || typeof ResizeObserver == "undefined") return;
    let N = new ResizeObserver(([I]) => {
      ((Pe.current = {
        w: Math.max(1, I.contentRect.width),
        h: Math.max(1, I.contentRect.height),
      }),
        Wn());
    });
    return (N.observe(x), () => N.disconnect());
  }, []),
    useEffect(() => {
      Nt.current || Wn();
    }),
    useEffect(() => {
      let x = Se.current;
      x.bpm = rhythm.bpm;
      let N = 60 / (rhythm.bpm * (x.mode !== "stop" ? x.factor : 1));
      if (x.mode !== "stop") {
        let I = Fe(),
          K = (I - x.start) / x.spb;
        x.start = I - K * N;
      }
      x.spb = N;
    }, [rhythm.bpm]),
    useEffect(
      () => () => {
        Se.current.mode !== "stop" && nt();
      },
      [rhythm.id],
    ),
    useEffect(
      () => () => {
        (clearInterval(ht.current),
          clearTimeout($t.current),
          Nt.current && cancelAnimationFrame(Nt.current),
          (Nt.current = null),
          (Se.current.mode = "stop"),
          _t(!1));
      },
      [],
    ),
    useEffect(() => {
      if (P === "stop" || !onPractice) return;
      let x = setInterval(() => onPractice(5), 5e3);
      return () => clearInterval(x);
    }, [P, onPractice]));
  let dt = useRef({});
  ((dt.current = {
    hit: ia,
    togglePlay: nl,
    record: al,
  }),
    useEffect(() => {
      let x = (N) => {
        if (N.metaKey || N.ctrlKey || N.altKey || N.repeat) return;
        let I = N.target,
          K = I && I.tagName;
        if (
          K === "INPUT" ||
          K === "TEXTAREA" ||
          K === "SELECT" ||
          (I && I.isContentEditable)
        )
          return;
        let J = N.key.toLowerCase();
        if (J.length === 1) {
          let X = Mr.pi.indexOf(J);
          if (X >= 0) {
            (N.preventDefault(),
              dt.current.hit({
                p: "pi",
                plank: X,
              }));
            return;
          }
          for (let fe of vi) {
            let U = Mr[fe].indexOf(J),
              ce = gn.current[U];
            if (U >= 0 && ce) {
              (N.preventDefault(),
                dt.current.hit({
                  p: fe,
                  plank: ce.i,
                  m: ce.m,
                }));
              return;
            }
          }
        }
        if (J === " ") {
          if (K === "BUTTON" || K === "A" || K === "SUMMARY") return;
          (N.preventDefault(), dt.current.togglePlay());
        } else J === "r" && (N.preventDefault(), dt.current.record());
      };
      return (
        window.addEventListener("keydown", x),
        () => window.removeEventListener("keydown", x)
      );
    }, []));
  let Gt = (x) => {
      let N = Se.current;
      if (N.mode !== "stop") {
        let I = Fe(),
          K = (I - N.start) / N.spb;
        ((N.spb = 60 / (N.bpm * x)), (N.start = I - K * N.spb));
      }
      N.factor = x;
    },
    ll = (x) => {
      let N = we.current === x ? null : x;
      (ge(N), (we.current = N), Gt(N === "up" ? 0.5 : 1));
    },
    ol = (x) => {
      let N = Se.current;
      (x && N.mode === "rec" && (rn(), (N.mode = "play"), T("play")),
        (N.expect = new Map()),
        (N.passes = new Map()),
        (N.lastPass = -1),
        D(x));
    },
    yn = (x) =>
      w((N) => ({
        ...N,
        ...x,
      })),
    So = (x) => w((N) => U0(N, x)),
    rl = () => {
      (rhythm.feet && ie === "pi" && ol(null),
        yn({
          feet: !rhythm.feet,
        }));
    },
    bn = rhythm.snap === "16" ? 0.25 : 0.5,
    sl = (x, N) => {
      w((I) => {
        let K = N.p === "pi" ? `f${N.plank}` : `${N.m}${N.plank}`,
          J = (ae) =>
            ae.p === N.p &&
            wa(ae, I) === K &&
            Math.abs(Math.round(ae.b / bn) * bn - x) < 1e-6;
        if (I.layers.some((ae) => ae.strikes.some(J)))
          return {
            ...I,
            layers: I.layers.map((ae) => ({
              ...ae,
              strikes: ae.strikes.filter((Ne) => !J(Ne)),
            })),
          };
        let fe =
            N.p === "pi" || I.material !== "ambas"
              ? {
                  b: x,
                  plank: N.plank,
                  p: N.p,
                }
              : {
                  b: x,
                  plank: N.plank,
                  p: N.p,
                  m: N.m,
                },
          ce = I.layers.find((ae) => ae.id === "manual")
            ? I.layers.map((ae) =>
                ae.id === "manual"
                  ? {
                      ...ae,
                      muted: !1,
                      strikes: [...ae.strikes, fe],
                    }
                  : ae,
              )
            : [
                ...I.layers,
                {
                  id: "manual",
                  label: "Editado a mano",
                  muted: !1,
                  strikes: [fe],
                },
              ];
        return {
          ...I,
          layers: ce,
        };
      });
    },
    il = (x) => {
      w((N) => {
        let I = (ce) =>
            ce.p === "pi" && Math.abs(Math.round(ce.b / bn) * bn - x) < 1e-6,
          K = -1;
        for (let ce of N.layers)
          for (let ae of ce.strikes) I(ae) && (K = Math.max(K, ae.plank));
        let J = K + 1,
          X = N.layers.map((ce) => ({
            ...ce,
            strikes: ce.strikes.filter((ae) => !I(ae)),
          }));
        if (J >= Tn.length)
          return {
            ...N,
            layers: X,
          };
        let fe = {
            b: x,
            plank: J,
            p: "pi",
          },
          U = X.find((ce) => ce.id === "manual");
        return {
          ...N,
          layers: U
            ? X.map((ce) =>
                ce.id === "manual"
                  ? {
                      ...ce,
                      muted: !1,
                      strikes: [...ce.strikes, fe],
                    }
                  : ce,
              )
            : [
                ...X,
                {
                  id: "manual",
                  label: "Editado a mano",
                  muted: !1,
                  strikes: [fe],
                },
              ],
        };
      });
    },
    E = () => {
      let x = rhythm.layers[rhythm.layers.length - 1];
      x &&
        (x.id === Se.current.recLayerId &&
          ((Se.current.recLayerId = null),
          Se.current.mode === "rec" && (Se.current.mode = "play"),
          T(Se.current.mode)),
        w((N) => ({
          ...N,
          layers: N.layers.slice(0, -1),
        })));
    },
    Q = (x, N) =>
      w((I) => {
        let K = [...(I.moves || [])];
        for (; K.length <= x;) K.push("");
        return (
          (K[x] = N),
          {
            ...I,
            moves: K,
          }
        );
      }),
    oe = (x, N) =>
      setInstruments((I) => ({
        ...I,
        [x]: Math.max(1, Math.min(8, N)),
      })),
    Ce = async () => {
      if (!me || _ != null) return;
      let x = Qt.current,
        N = 60 / x.bpm,
        I = 2,
        K = 0.15,
        J = K + I * f * N + 1.2;
      (ee(null), B(0));
      try {
        let { blob, ext } = await $0(
          J,
          (ce) => {
            for (let ae of x.layers)
              if (!ae.muted)
                for (let Ne of ae.strikes) {
                  if (!Sa(Ne, x, gn.current, f)) continue;
                  let We = Pl(Ne, x, Wt.current);
                  for (let Ye = 0; Ye < I; Ye++)
                    ce(We.s, We.arg, K + (Ye * f + Ne.b) * N);
                }
          },
          (ce) => B(ce),
        );
        B(null);
        let U = await el(me, `${fi(x.name)}.${ext}`, blob);
        ee(U);
      } catch {
        (B(null),
          ee(
            "Este navegador no puede preparar el audio. Prueba desde otro navegador o desde el ordenador.",
          ));
      }
    },
    Ie = () => {
      w((x) => {
        let N = Ja(x, instruments),
          I = N[0],
          K = N[1] || N[0],
          J = x.snap === "16" ? 0.25 : 0.5,
          X = [];
        for (let fe = 0; fe < x.eights * 8; fe++)
          for (let [U, ce] of [
            [I, 0],
            [K, J],
          ]) {
            let ae = {
              b: fe + ce,
              plank: U.i,
              p: "tk",
            };
            (x.material === "ambas" && (ae.m = U.m), X.push(ae));
          }
        return {
          ...x,
          layers: [
            ...x.layers,
            {
              id: `l${Date.now().toString(36)}`,
              label: "Ttakun b\xE1sico",
              muted: !1,
              strikes: X,
            },
          ],
        };
      });
    },
    kn = async () => {
      if (!pe || ke === "thinking") return;
      let x = Qt.current,
        N = gn.current,
        I = [];
      for (let X of x.layers)
        if (!X.muted)
          for (let fe of X.strikes)
            fe.p !== "tk" ||
              !Sa(fe, x, N, f) ||
              I.push({
                b: fe.b,
                col: N.findIndex((U) => U.key === wa(fe, x)),
              });
      if (!I.length) {
        H(
          "Primero grabad o poned algo de ttakun: la propuesta responde a lo que ya suena.",
        );
        return;
      }
      I.sort((X, fe) => X.b - fe.b);
      let K = N.map(
          (X, fe) => `${fe} = ${Er(X)}${No(X) ? ` (${No(X)})` : ""}`,
        ).join("; "),
        J = `Eres txalapartari. En la txalaparta hay dos papeles: ttakun lleva el pulso con golpes regulares y herren responde en los huecos, variando y "cojeando" a prop\xF3sito; al final suelen coincidir en un golpe fuerte.
Este bucle dura ${f} tiempos (cuentas), del 0 al ${f}. Columnas disponibles (tablas o piedras): ${K}.
Golpes de ttakun ya grabados (b = tiempo dentro del bucle; col = columna):
${JSON.stringify(I)}
Prop\xF3n los golpes de herren: entre ${f} y ${Math.round(f * 1.8)} golpes, con b m\xFAltiplo de 0.25 entre 0 y ${f - 0.25}, y col entre 0 y ${N.length - 1}. Responde en los huecos del ttakun, no coincidas exactamente con \xE9l salvo en el \xFAltimo tiempo, y usa m\xE1s de una columna.
Responde solo con un array JSON de objetos {"b": n\xFAmero, "col": n\xFAmero}. Ejemplo: [{"b":0.5,"col":2},{"b":1.75,"col":3}]`;
      H("thinking");
      try {
        let X = await pe.json(J, {
            modelTier: "quick",
            cache: !1,
          }),
          fe = new Set(),
          U = [];
        for (let ce of Array.isArray(X) ? X : []) {
          let ae = Math.round(Number(ce && ce.b) * 4) / 4,
            Ne = Math.round(Number(ce && ce.col));
          if (!isFinite(ae) || ae < 0 || ae >= f || !(Ne >= 0 && Ne < N.length))
            continue;
          let We = `${ae}:${Ne}`;
          if (fe.has(We)) continue;
          fe.add(We);
          let Ye = N[Ne],
            Yt = {
              b: ae,
              plank: Ye.i,
              p: "hr",
            };
          (x.material === "ambas" && (Yt.m = Ye.m), U.push(Yt));
        }
        if (!U.length) {
          H("La propuesta no ha servido. Prueba otra vez.");
          return;
        }
        (w((ce) => ({
          ...ce,
          layers: [
            ...ce.layers,
            {
              id: `l${Date.now().toString(36)}`,
              label: "Propuesta de herren",
              muted: !1,
              strikes: U,
            },
          ],
        })),
          H(
            `A\xF1adida una capa con ${U.length} golpes de herren. Escuchadla; si no os convence, \xABDeshacer capa\xBB.`,
          ));
      } catch (X) {
        let fe = X && X.code;
        H(
          fe === "not_granted" ||
            fe === "sampling_disabled" ||
            fe === "capability_disabled" ||
            fe === "capability_removed" ||
            fe === "not_declared"
            ? "Las propuestas no est\xE1n disponibles aqu\xED."
            : fe === "rate_limited"
              ? "Demasiadas peticiones seguidas. Prueba dentro de un rato."
              : fe === "cancelled"
                ? null
                : "No ha salido bien esta vez. Prueba otra vez.",
        );
      }
    },
    gt = [];
  for (let x of choreos)
    for (let N of x.blocks)
      N.rhythmId === rhythm.id &&
        gt.push({
          c: x,
          b: N,
        });
  let Dt = rhythm.layers.find((x) => x.id === Se.current.recLayerId),
    it = V0(rhythm, instruments),
    at = ie && rhythm.best ? rhythm.best[ie] : null,
    R =
      $.factor != null && $.factor !== 1
        ? ` \xB7 ${Math.round($.factor * 100)} %`
        : "",
    L = {
      stop: "Parado",
      play: ie
        ? `Practicando ${ko[ie].toLowerCase()}${R}`
        : `Sonando en bucle${R}`,
      rec: `Grabando ${Dt ? Dt.label.toLowerCase() : ""}`,
      countin: "Cuenta de entrada",
      armed: "Grabar\xE1s en el pr\xF3ximo 1",
    }[$.phase],
    j = $.phase === "rec" || (P === "rec" && $.phase === "countin"),
    ne = v ? `${((hd * Math.max(1, m.length)) / (1 - hd)).toFixed(3)}fr` : "",
    ye = {
      gridTemplateColumns: `${md}px repeat(${m.length}, minmax(0, 1fr))${v ? ` ${ne}` : ""}`,
    },
    Kt = [
      [null, "Crear el ritmo"],
      ["hr", "Practicar herren"],
      ["tk", "Practicar ttakun"],
      ...(v ? [["pi", "Practicar pies"]] : []),
    ],
    In = ie === "hr" ? "ttakun" : ie === "tk" ? "herren" : "la txalaparta";
  return (
    <>
      {et && (
        <CVh
          rhythm={rhythm}
          instruments={instruments}
          onPractice={onPractice}
          onAddLayers={(x) =>
            w((N) => ({
              ...N,
              layers: [...N.layers, ...x],
            }))
          }
          onClose={() => bt(!1)}
        />
      )}
      <div className="flex flex-col gap-2">
        <button type="button" className="back" onClick={onBack}>
          <span aria-hidden="true">←</span>
          {" Inicio"}
        </button>
        <div className="min-w-0">
          <p className="f-label">
            {"Taller de txalaparta \xB7 "}
            {Jc(rhythm.material)}
            {v ? " y pies" : ""}
            {" \xB7 creado por "}
            {Uh(rhythm.author)}
          </p>
          <label htmlFor="tx-name" className="sr-only">
            Nombre del ritmo
          </label>
          <input
            id="tx-name"
            className="tx-title f-display"
            value={rhythm.name}
            onChange={(x) =>
              yn({
                name: x.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="tx-layout">
        <div className="tx-col">
          <section className="panel tx-inst o-1" aria-label="Txalaparta">
            <div className="tx-top">
              <span className={`tx-state is-${j ? "rec" : $.phase}`}>
                {j && <i className="tx-dot" aria-hidden="true" />}
                {L}
              </span>
              <div className="tx-count">
                {$.cin != null ? (
                  <span className="f-display tx-cin">{$.cin}</span>
                ) : $.count != null ? (
                  <>
                    <span className="f-display">{$.count}</span>
                    <span className="font-mono text-[12px] text-muted">
                      {"ocho "}
                      {$.eight}
                      {" de "}
                      {rhythm.eights}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-[12px] text-muted">
                    {rhythm.bpm}
                    {" bpm \xB7 "}
                    {m.length}{" "}
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
                {Kt.map(([x, N]) => (
                  <button
                    key={N}
                    type="button"
                    role="radio"
                    aria-checked={ie === x}
                    className="seg-btn"
                    onClick={() => ol(x)}
                  >
                    {N}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-xs"
                title="Dos bailarinas, una frente a otra: el móvil o la tablet en medio, o cada una en su móvil"
                onClick={() => {
                  (nt(), Ue(), bt(!0));
                }}
              >
                <O name="compare" size={13} />
                Tocar a dúo
              </button>
            </div>
            {ie ? (
              <div className="tx-practice">
                <p className="text-[13px] text-ink">
                  {"La app toca "}
                  {ie === "pi" ? "la txalaparta" : In}
                  {"; t\xFA tocas "}
                  <b className="font-semibold">{ko[ie].toLowerCase()}</b>. Tus
                  fichas bajan con borde: tócalas cuando lleguen a la línea. Se
                  ponen amarillas si aciertas.
                </p>
                <div className="tx-score" aria-live="polite">
                  {$.score ? (
                    <>
                      <span>
                        {"Vuelta "}
                        {$.score.pass}
                        {": "}
                        <b>{$.score.hits}</b>
                        {" de "}
                        {$.score.total}
                        {$.score.extra
                          ? ` \xB7 ${$.score.extra} de m\xE1s`
                          : ""}
                      </span>
                      {$.score.prev && $.score.prev.total > 0 && (
                        <span className="text-muted">
                          {"Anterior: "}
                          {$.score.prev.hits}
                          {" de "}
                          {$.score.prev.total}{" "}
                          {qh($.score.prev.hits, $.score.prev.total)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted">
                      Dale a Reproducir y entra en tu papel.
                    </span>
                  )}
                  {at && at.total > 0 && (
                    <span className="tx-best">
                      {"R\xE9cord: "}
                      {at.hits}
                      {" de "}
                      {at.total}{" "}
                      <span aria-hidden="true">{qh(at.hits, at.total)}</span>
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
                {v && (
                  <span className="is-pi">
                    <i aria-hidden="true" />
                    Pies de claqué
                  </span>
                )}
              </div>
            )}
            <div ref={xt} className="tx-screen">
              <canvas
                ref={$e}
                aria-label="Cascada de golpes: las fichas bajan hasta la línea cuando les toca sonar"
              />
            </div>
            <div className="tx-pads">
              {vi.map((x) => (
                <div key={x} className="tx-pad-row" style={ye}>
                  <span className={`tx-row-label is-${x}`} title={ko[x]}>
                    {ko[x][0]}
                  </span>
                  {m.map((N, I) => (
                    <button
                      key={N.key}
                      type="button"
                      ref={(K) => {
                        Ht.current[`${x}:${N.key}`] = K;
                      }}
                      className={`tx-pad is-${x} ${N.m === "s" ? "is-stone" : ""} ${I > 0 && m[I - 1].m !== N.m ? "is-group" : ""} ${ie && ie !== x ? "is-off" : ""}`}
                      aria-label={`${ko[x]}, ${Er(N).toLowerCase()}${No(N) ? ` (${No(N)})` : ""}`}
                      onPointerDown={(K) => {
                        (K.preventDefault(),
                          ia({
                            p: x,
                            plank: N.i,
                            m: N.m,
                          }));
                      }}
                      onClick={(K) => {
                        K.detail === 0 &&
                          ia({
                            p: x,
                            plank: N.i,
                            m: N.m,
                          });
                      }}
                    >
                      <span className="tx-pad-n f-display">{N.i + 1}</span>
                      {Mr[x][I] && (
                        <kbd className="tx-key">{Mr[x][I].toUpperCase()}</kbd>
                      )}
                    </button>
                  ))}
                  {v && <span aria-hidden="true" />}
                </div>
              ))}
              {v && (
                <div
                  className="tx-pad-row"
                  style={{
                    gridTemplateColumns: `${md}px repeat(4, minmax(0, 1fr))`,
                  }}
                >
                  <span className="tx-row-label is-pi" title="Pies">
                    P
                  </span>
                  {Tn.map((x, N) => (
                    <button
                      key={x.key}
                      type="button"
                      ref={(I) => {
                        Ht.current[`pi:f${N}`] = I;
                      }}
                      className={`tx-pad is-pi ${ie && ie !== "pi" ? "is-off" : ""}`}
                      aria-label={`Pies: ${kt(N)}`}
                      onPointerDown={(I) => {
                        (I.preventDefault(),
                          ia({
                            p: "pi",
                            plank: N,
                          }));
                      }}
                      onClick={(I) => {
                        I.detail === 0 &&
                          ia({
                            p: "pi",
                            plank: N,
                          });
                      }}
                    >
                      <span className="tx-pad-word">{kt(N)}</span>
                      <kbd className="tx-key">{Mr.pi[N]}</kbd>
                    </button>
                  ))}
                </div>
              )}
              <div
                className="tx-pad-row tx-tones"
                style={ye}
                aria-hidden="true"
              >
                <span />
                {m.map((x, N) => {
                  let I = N === 0 || m[N - 1].m !== x.m,
                    K = N === m.length - 1 || m[N + 1].m !== x.m,
                    J = I
                      ? `${x.m === "s" ? "piedra" : "madera"}${m.length <= 4 ? " grave" : ""}`
                      : K && m.length <= 4
                        ? "aguda"
                        : "";
                  return (
                    <span key={x.key} className={I ? "is-start" : ""}>
                      {J}
                    </span>
                  );
                })}
                {v && <span />}
              </div>
            </div>
            <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="btn btn-primary" onClick={nl}>
                  <O name={P === "stop" ? "play" : "stop"} />
                  {P === "stop" ? "Reproducir" : "Parar"}
                </button>
                <button
                  type="button"
                  className={`btn btn-rec ${P === "rec" ? "is-on" : ""}`}
                  onClick={al}
                  disabled={!!ie}
                  title={
                    ie ? "Para grabar, vuelve a \xABCrear el ritmo\xBB" : void 0
                  }
                >
                  <O name="record" />
                  {P === "rec" ? "Terminar de grabar" : "Grabar una vuelta"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={E}
                  disabled={!rhythm.layers.length}
                >
                  <O name="undo" />
                  Deshacer capa
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={Y}
                  onClick={() => F((x) => !x)}
                >
                  <O name="metro" />
                  Metrónomo
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={de === "up"}
                  onClick={() => ll("up")}
                  title="Empieza al 50 % del tempo y sube un 10 % en cada vuelta"
                >
                  <O name="ladder" />
                  Escalera de tempo
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={de === "accel"}
                  onClick={() => ll("accel")}
                  title="Como el final de una txalaparta: cada vuelta un poco más rápida, hasta un 60 % más"
                >
                  <O name="ladder" />
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
                    {O0.map(([x, N]) => (
                      <button
                        key={x}
                        type="button"
                        role="radio"
                        aria-checked={(rhythm.material || "madera") === x}
                        className="seg-btn"
                        onClick={() => So(x)}
                      >
                        {N}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  aria-pressed={v}
                  onClick={rl}
                >
                  <O name="feet" />
                  Pies de claqué
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="f-label mr-1">Tempo</span>
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label="Más lento"
                    onClick={() =>
                      yn({
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
                    onChange={(x) => {
                      let N = Number(x.target.value);
                      N >= 50 &&
                        N <= 200 &&
                        yn({
                          bpm: N,
                        });
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label="Más rápido"
                    onClick={() =>
                      yn({
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
                    {[1, 2, 4].map((x) => (
                      <button
                        key={x}
                        type="button"
                        role="radio"
                        aria-checked={rhythm.eights === x}
                        className="seg-btn"
                        onClick={() =>
                          yn({
                            eights: x,
                          })
                        }
                      >
                        {x} {x === 1 ? "ocho" : "ochos"}
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
                    ].map(([x, N]) => (
                      <button
                        key={x}
                        type="button"
                        role="radio"
                        aria-checked={rhythm.snap === x}
                        className="seg-btn"
                        onClick={() =>
                          yn({
                            snap: x,
                          })
                        }
                      >
                        {N}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {it > 0 && (
                <p className="text-[12px] font-semibold text-[color:var(--warn)]">
                  {"Hay "}
                  {it} {it === 1 ? "golpe" : "golpes"}
                  {
                    " en tablas, piedras o pies que ahora no se ven. Cambia la txalaparta o el n\xFAmero de tablas para recuperarlos."
                  }
                </p>
              )}
              {me && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={Ce}
                    disabled={_ != null || !rhythm.layers.length}
                  >
                    <O name="download" />
                    {_ != null
                      ? `Preparando audio\u2026 ${Math.round(_ * 100)} %`
                      : "Guardar audio para el grupo"}
                  </button>
                  <span className="text-[12px] text-muted">
                    Dos vueltas del ritmo, sin metrónomo, para mandar por
                    WhatsApp.
                  </span>
                </div>
              )}
              {G && (
                <p className="text-[13px] font-semibold text-ink" role="status">
                  {G}
                </p>
              )}
              <p className="text-[12px] text-muted">
                <span className="hidden md:inline">
                  {"Teclado: herren "}
                  <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>
                  {"\u2026 \xB7 ttakun "}
                  <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd>
                  {"\u2026 \xB7 pies "}
                  <kbd>1</kbd>–<kbd>4</kbd>
                  {" \xB7 "}
                  <kbd>espacio</kbd>
                  {" reproducir \xB7 "}
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
                {v ? " En la fila de pies, cada toque cambia el sonido." : ""}
              </p>
            </div>
            <Dy
              rhythm={rhythm}
              cols={m}
              L={f}
              q={bn}
              slot={$.slot}
              onToggle={sl}
              onCycleFeet={il}
              feetName={kt}
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
              (x, N) => (
                <div key={N} className="flex flex-col gap-1.5">
                  {rhythm.eights > 1 && (
                    <p className="f-label">
                      {"Ocho "}
                      {N + 1}
                    </p>
                  )}
                  <div className="tx-move-grid">
                    {Array.from(
                      {
                        length: 8,
                      },
                      (I, K) => {
                        let J = N * 8 + K;
                        return (
                          <label
                            key={J}
                            className={`tx-move ${$.idx === J ? "is-now" : ""}`}
                            htmlFor={`mv-${rhythm.id}-${J}`}
                          >
                            <span className="tx-move-n f-display">{K + 1}</span>
                            <input
                              id={`mv-${rhythm.id}-${J}`}
                              className="tx-move-input"
                              value={(rhythm.moves || [])[J] || ""}
                              placeholder="—"
                              onChange={(X) => Q(J, X.target.value)}
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
              ].map(([x, N, I]) => (
                <div
                  key={x}
                  className={`tx-inst-row ${x === "stone" ? "is-stone" : ""}`}
                >
                  <span className="min-w-0 flex-1 text-[14px] font-semibold text-ink">
                    {N}
                  </span>
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label={`Una ${I === "tablas" ? "tabla" : "piedra"} menos`}
                    onClick={() => oe(x, instruments[x] - 1)}
                    disabled={instruments[x] <= 1}
                  >
                    −
                  </button>
                  <span className="tx-inst-n f-display" aria-live="polite">
                    {instruments[x]}
                  </span>
                  <button
                    type="button"
                    className="btn btn-icon"
                    aria-label={`Una ${I === "tablas" ? "tabla" : "piedra"} m\xE1s`}
                    onClick={() => oe(x, instruments[x] + 1)}
                    disabled={instruments[x] >= 8}
                  >
                    +
                  </button>
                  <span className="font-mono text-[12px] text-muted">{I}</span>
                </div>
              ))}
            </div>
          </section>
          <CJy instruments={instruments} feetName={kt} />
          <section
            className="panel flex flex-col gap-2 p-4 o-5"
            aria-label="Capas"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="f-label">Capas grabadas</p>
              <span className="font-mono text-[12px] text-muted">
                {rhythm.layers.reduce((x, N) => x + N.strikes.length, 0)}
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
              <button type="button" className="btn btn-xs" onClick={Ie}>
                <span aria-hidden="true">+</span>
                {" Ttakun b\xE1sico"}
              </button>
              {pe && (
                <button
                  type="button"
                  className="btn btn-xs"
                  onClick={kn}
                  disabled={ke === "thinking"}
                >
                  <O name="spark" size={13} />
                  {ke === "thinking"
                    ? "Pensando una respuesta\u2026"
                    : "Proponer una respuesta de herren"}
                </button>
              )}
            </div>
            {ke && ke !== "thinking" && (
              <p className="text-[12px] text-ink" role="status">
                {ke}
              </p>
            )}
            <ul className="flex flex-col">
              {rhythm.layers.map((x) => {
                let N = _y(x),
                  I = x.id === Se.current.recLayerId,
                  K = [N.tk && "ttakun", N.hr && "herren", N.pi && "pies"]
                    .filter(Boolean)
                    .join(", ");
                return (
                  <li
                    key={x.id}
                    className={`tx-layer ${x.muted ? "is-muted" : ""}`}
                  >
                    <span className="tx-layer-dots" aria-hidden="true">
                      {N.tk && <i className="is-tk" />}
                      {N.hr && <i className="is-hr" />}
                      {N.pi && <i className="is-pi" />}
                      {!N.tk && !N.hr && !N.pi && <i />}
                    </span>
                    <span className="min-w-0 flex-1 text-[14px]">
                      <b className="font-semibold text-ink">{x.label}</b>{" "}
                      <span className="text-[12px] text-muted">
                        {I
                          ? "grabando\u2026"
                          : `${x.strikes.length} golpes${K ? ` \xB7 ${K}` : ""}`}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-xs"
                      aria-pressed={!x.muted}
                      onClick={() =>
                        w((J) => ({
                          ...J,
                          layers: J.layers.map((X) =>
                            X.id === x.id
                              ? {
                                  ...X,
                                  muted: !X.muted,
                                }
                              : X,
                          ),
                        }))
                      }
                    >
                      {x.muted ? "Silenciada" : "Suena"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs"
                      onClick={() =>
                        w((J) => ({
                          ...J,
                          layers: J.layers.filter((X) => X.id !== x.id),
                        }))
                      }
                      aria-label={`Borrar ${x.label}`}
                    >
                      <O name="x" size={13} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
          <Fy
            rhythm={rhythm}
            choreos={choreos}
            usage={gt}
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
              {rhythms.map((x) => (
                <li key={x.id}>
                  <button
                    type="button"
                    className={`tx-rrow ${x.id === rhythm.id ? "is-current" : ""}`}
                    onClick={() => onOpen(x.id)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">
                        {x.name}
                      </span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
                        {x.bpm}
                        {" bpm \xB7 "}
                        {x.eights} {x.eights === 1 ? "ocho" : "ochos"}
                        {" \xB7 "}
                        {Jc(x.material)}
                        {x.feet ? " y pies" : ""}
                        {" \xB7 de "}
                        {Uh(x.author)}
                      </span>
                    </span>
                    {x.id === rhythm.id && (
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
                <O name="copy" />
                Duplicar
              </button>
              <button
                type="button"
                className={`btn ${Z ? "btn-warn" : ""}`}
                onClick={() => {
                  Z
                    ? (q(!1), onDelete(rhythm.id))
                    : (q(!0), setTimeout(() => q(!1), 4e3));
                }}
              >
                {Z ? "Pulsa otra vez para borrarlo" : "Borrar este ritmo"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
function Fy({ rhythm, choreos, usage, onAssign, onUnassign, onOpenBlock }) {
  let [r, s] = useState(choreos[0] ? choreos[0].id : ""),
    i = choreos.find((c) => c.id === r) || choreos[0],
    [u, p] = useState(""),
    d = i ? i.blocks.find((c) => c.id === u) || i.blocks[0] : null;
  return (
    <section
      className="panel flex flex-col gap-3 p-4 o-6"
      aria-label="Usar en una coreografía"
    >
      <div>
        <p className="f-label">Usar en una coreografía</p>
        <p className="mt-1 text-[13px] text-muted">
          El ritmo sonará en bucle en «Practicar con el ritmo» de ese bloque,
          durante todos sus ochos.
        </p>
      </div>
      {usage.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {usage.map(({ c, b }) => (
            <li key={b.id} className="tx-use">
              <O name="check" size={14} />
              <span className="min-w-0 flex-1 text-[14px] text-ink">
                {c.title}
                {" \xB7 "}
                <b className="font-semibold">{b.name}</b>
              </span>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => onOpenBlock(c.id, b.id)}
              >
                Abrir
              </button>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => onUnassign(c.id, b.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
      {i && (
        <div className="grid gap-2 sm:grid-cols-2">
          <label
            className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
            htmlFor="use-choreo"
          >
            Coreografía
            <select
              id="use-choreo"
              className="field"
              value={i.id}
              onChange={(c) => {
                (s(c.target.value), p(""));
              }}
            >
              {choreos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label
            className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
            htmlFor="use-block"
          >
            Bloque
            <select
              id="use-block"
              className="field"
              value={d ? d.id : ""}
              onChange={(c) => p(c.target.value)}
            >
              {i.blocks.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.rhythmId && c.rhythmId !== rhythm.id
                    ? " (ya tiene otro ritmo)"
                    : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {d && (
        <button
          type="button"
          className="btn self-start"
          disabled={d.rhythmId === rhythm.id}
          onClick={() => onAssign(rhythm.id, i.id, d.id)}
        >
          {d.rhythmId === rhythm.id
            ? "Ya suena en ese bloque"
            : "Usar como m\xFAsica de ese bloque"}
        </button>
      )}
    </section>
  );
}
function Dy({ rhythm, cols, L, q, slot, onToggle, onCycleFeet, feetName }) {
  let i = useRef(null),
    [u, p] = useState(8);
  useEffect(() => {
    let y = i.current;
    if (!y || typeof ResizeObserver == "undefined") return;
    let M = new ResizeObserver(([f]) => p(f.contentRect.width < 560 ? 4 : 8));
    return (M.observe(y), () => M.disconnect());
  }, []);
  let d = Math.round(1 / q),
    c = useMemo(() => {
      let y = new Map();
      for (let M of rhythm.layers)
        for (let f of M.strikes) {
          if (!Sa(f, rhythm, cols, L)) continue;
          let m = Math.round(f.b / q);
          if (f.p === "pi") {
            let w = `pi:${m}`,
              P = y.get(w);
            (!P || (!M.muted && P.muted)) &&
              y.set(w, {
                plank: f.plank,
                muted: M.muted,
              });
            continue;
          }
          let v = `${f.p}:${wa(f, rhythm)}:${m}`;
          M.muted ? y.has(v) || y.set(v, "muted") : y.set(v, "on");
        }
      return y;
    }, [rhythm, cols, L, q]),
    h = [];
  for (let y = 0; y < L; y += u) h.push(y);
  let b = slot != null ? Math.floor(slot / q + 1e-6) : null;
  return (
    <div ref={i} className="flex flex-col gap-4">
      {h.map((y) => {
        let M = Math.min(u, L - y) * d,
          f = y * d;
        return (
          <div key={y} className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {"Ocho "}
              {Math.floor(y / 8) + 1}
              {u < 8 ? ` \xB7 cuentas ${(y % 8) + 1}\u2013${(y % 8) + u}` : ""}
            </span>
            <div
              className="tx-grid"
              style={{
                gridTemplateColumns: `4rem repeat(${M}, minmax(0, 1fr))`,
              }}
            >
              <span />
              {Array.from(
                {
                  length: M,
                },
                (m, v) => {
                  let w = (f + v) * q,
                    P = v % d === 0;
                  return (
                    <span
                      key={`h${v}`}
                      className={`tx-head ${P ? "is-beat" : ""} ${b === f + v ? "is-now" : ""}`}
                    >
                      {P ? vd(w) : d === 4 ? (v % 4 === 2 ? "y" : "\xB7") : "y"}
                    </span>
                  );
                },
              )}
              {cols.map((m) => (
                <Fragment key={m.key}>
                  <span
                    className={`tx-plank ${m.m === "s" ? "is-stone" : ""}`}
                    title={Er(m)}
                  >
                    <b>{Er(m)}</b>
                    {No(m) && <span>{No(m)}</span>}
                  </span>
                  {Array.from(
                    {
                      length: M,
                    },
                    (v, w) => {
                      let P = f + w;
                      return (
                        <span
                          key={`${m.key}-${w}`}
                          className={`tx-cell ${w % d === 0 ? "is-beat" : ""} ${b === P ? "is-now" : ""}`}
                        >
                          {vi.map((T) => {
                            let $ = c.get(`${T}:${m.key}:${P}`);
                            return (
                              <button
                                key={T}
                                type="button"
                                className={`tx-half is-${T} ${$ ? `is-${$}` : ""}`}
                                aria-pressed={$ === "on"}
                                aria-label={`${ko[T]}, ${Er(m).toLowerCase()}, en el ${Vh(P * q)}`}
                                onClick={() =>
                                  onToggle(P * q, {
                                    p: T,
                                    plank: m.i,
                                    m: m.m,
                                  })
                                }
                              >
                                <i />
                              </button>
                            );
                          })}
                        </span>
                      );
                    },
                  )}
                </Fragment>
              ))}
              {rhythm.feet && (
                <>
                  <span className="tx-plank is-feet">
                    <b>Pies</b>
                    <span>claqué</span>
                  </span>
                  {Array.from(
                    {
                      length: M,
                    },
                    (m, v) => {
                      let w = f + v,
                        P = c.get(`pi:${w}`);
                      return (
                        <button
                          key={`pi-${v}`}
                          type="button"
                          className={`tx-cell tx-feet ${v % d === 0 ? "is-beat" : ""} ${b === w ? "is-now" : ""} ${P ? (P.muted ? "is-muted" : "is-on") : ""}`}
                          aria-label={`Pies en el ${Vh(w * q)}: ${P ? feetName(P.plank) : "nada"}. Toca para cambiar.`}
                          onClick={() => onCycleFeet(w * q)}
                        >
                          {P ? Tn[P.plank].short : ""}
                        </button>
                      );
                    },
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function Oy() {
  let [, e] = useState(0);
  useEffect(() => T0(() => e((t) => t + 1)), []);
}
function CJy({ instruments, feetName }) {
  Oy();
  let [n, a] = useState(null),
    [l, o] = useState(null),
    r = [
      {
        id: "w",
        name: "Madera",
        all: `Subir las ${instruments.wood} tablas en un audio`,
        items: Array.from(
          {
            length: instruments.wood,
          },
          (u, p) => ({
            key: `w${p}`,
            label: `Tabla ${p + 1}`,
            test: () =>
              Ft("tx", {
                f: Nr(p, instruments.wood),
                stone: !1,
                key: `w${p}`,
              }),
          }),
        ),
      },
      {
        id: "s",
        name: "Piedra",
        all: `Subir las ${instruments.stone} piedras en un audio`,
        items: Array.from(
          {
            length: instruments.stone,
          },
          (u, p) => ({
            key: `s${p}`,
            label: `Piedra ${p + 1}`,
            test: () =>
              Ft("tx", {
                f: Nr(p, instruments.stone),
                stone: !0,
                key: `s${p}`,
              }),
          }),
        ),
      },
      {
        id: "f",
        name: "Pies: vuestros zapatos",
        all: "Subir los 4 sonidos en un audio",
        items: Tn.map((u, p) => ({
          key: `f${p}`,
          label: feetName(p),
          test: () =>
            Ft(u.key, {
              key: `f${p}`,
            }),
        })),
      },
    ],
    s = async (u, p) => {
      if (p) {
        (a(u.key), o(null));
        try {
          let { data, rate } = await Yc(p),
            h = Xc(data, rate);
          h.length
            ? (Kc(u.key, Zc(data, rate, h[0], h[1]), rate),
              D0(u.key),
              o(`${u.label}: sonido real guardado.`))
            : o(
                "No he o\xEDdo ning\xFAn golpe en ese audio. Prueba a grabar m\xE1s cerca.",
              );
        } catch {
          o(
            "No he podido leer ese archivo de audio. Prueba con otro formato (m4a, mp3, wav).",
          );
        }
        a(null);
      }
    },
    i = async (u, p) => {
      if (p) {
        (a(u.id), o(null));
        try {
          let { data, rate } = await Yc(p),
            h = Xc(data, rate),
            b = Math.min(h.length, u.items.length);
          for (let y = 0; y < b; y++)
            Kc(u.items[y].key, Zc(data, rate, h[y], h[y + 1]), rate);
          h.length
            ? h.length === u.items.length
              ? o(`Listo: ${b} golpes asignados, del primero al \xFAltimo.`)
              : o(
                  `He o\xEDdo ${h.length} golpes y esperaba ${u.items.length}; he asignado ${b}. Si falta alguno, deja un segundo de silencio entre golpe y golpe.`,
                )
            : o("No he o\xEDdo ning\xFAn golpe en ese audio.");
        } catch {
          o(
            "No he podido leer ese archivo de audio. Prueba con otro formato (m4a, mp3, wav).",
          );
        }
        a(null);
      }
    };
  return (
    <section
      className="panel flex flex-col gap-3 p-4 o-4"
      aria-label="Sonido real"
    >
      <div>
        <p className="f-label">Que suene como vuestra txalaparta</p>
        <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
          Sonido real
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">
          Grabad con la app de notas de voz del móvil un golpe seco en cada
          tabla y piedra, con un segundo de silencio entre golpes, de la más
          grave a la más aguda. Podéis subir un audio por tabla o uno con todas
          seguidas: la app encuentra cada golpe. Lo mismo con vuestros zapatos
          de claqué.
        </p>
      </div>
      {r.map((u) => (
        <div key={u.id} className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-semibold text-ink">{u.name}</p>
            <label className="btn btn-xs btn-file">
              <O name="upload" size={13} />
              {n === u.id ? "Buscando los golpes\u2026" : u.all}
              <input
                type="file"
                accept="audio/*"
                className="sr-only"
                onChange={(p) => {
                  (i(u, p.target.files && p.target.files[0]),
                    (p.target.value = ""));
                }}
              />
            </label>
          </div>
          <ul className="snd-list">
            {u.items.map((p) => {
              let d = P0(p.key);
              return (
                <li key={p.key} className="snd-row">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                    {p.label}
                  </span>
                  <span className={`snd-state ${d ? "is-real" : ""}`}>
                    {d ? "Grabado" : "Sint\xE9tico"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-xs btn-icon"
                    aria-label={`Escuchar ${p.label}`}
                    onClick={() => {
                      (Ue(), p.test());
                    }}
                  >
                    <O name="play" size={12} />
                  </button>
                  <label
                    className="btn btn-xs btn-file"
                    aria-label={`Subir el sonido de ${p.label}`}
                  >
                    <O name="upload" size={12} />
                    {n === p.key ? "\u2026" : d ? "Cambiar" : "Subir"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="sr-only"
                      onChange={(c) => {
                        (s(p, c.target.files && c.target.files[0]),
                          (c.target.value = ""));
                      }}
                    />
                  </label>
                  {d && (
                    <button
                      type="button"
                      className="btn btn-xs btn-icon"
                      aria-label={`Volver al sonido sint\xE9tico de ${p.label}`}
                      onClick={() => _0(p.key)}
                    >
                      <O name="x" size={12} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {l && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {l}
        </p>
      )}
      {!L0() && (
        <p className="text-[12px] text-[color:var(--warn)]">
          Este navegador no deja guardar más sonidos: los grabados durarán
          mientras la pestaña esté abierta.
        </p>
      )}
      <p className="text-[12px] text-muted">
        Los sonidos grabados también se usan en «Practicar con el ritmo» y, los
        de los zapatos, en los vídeos de pasos.
      </p>
    </section>
  );
}
var hn = (e) =>
  String(e == null ? "" : e)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
var By = (e, t) => (e && e.steps[t] ? e.steps[t].name : t);
function Uy(e, t) {
  return e
    .filter(
      (n) =>
        n.type === "feet" &&
        t >= n.eight &&
        t < n.eight + Math.ceil(n.counts / 8),
    )
    .sort((n, a) => a.bpm - n.bpm)[0];
}
function Hh(e, t, n, a) {
  let { ranges, clips, music } = t,
    s = [];
  for (let d of e.blocks) {
    let c = ranges[d.id],
      h = music.find((m) => m.block === d.id),
      b = h && h.rhythm,
      y = [];
    for (let m = 0; m < d.len; m++) {
      let v = c.start + m,
        w = Array.from(
          {
            length: 8,
          },
          () => [],
        ),
        P = Uy(clips, v);
      if (P) {
        let $ = (v - P.eight) * 8;
        for (let A of P.spans) {
          if (A.from < $ - 1e-6 || A.from >= $ + 8 - 1e-6) continue;
          let Y = A.from - $,
            F = Math.floor(Y + 1e-6),
            Z = Y - F;
          w[F].push(
            `${Z > 0.4 && Z < 0.6 ? "y " : Z > 1e-6 ? "\xB7 " : ""}${By(a, A.key)}`,
          );
        }
      } else if (b && b.moves.some(Boolean))
        for (let $ = 0; $ < 8; $++) {
          let A = b.moves[(m * 8 + $) % b.loopBeats];
          A && w[$].push(A);
        }
      let T = clips.find(
        ($) =>
          $.type === "stage" &&
          v >= $.eight &&
          v < $.eight + Math.ceil($.counts / 8),
      );
      y.push(
        `<tr><th scope="row">${v}</th>${w.map(($) => `<td>${hn($.join(", "))}</td>`).join("")}<td class="note">${T ? hn(T.title) : ""}</td></tr>`,
      );
    }
    let M = e.formations[d.id] || {},
      f = Be.filter((m) => M[m.id])
        .map((m) => `${hn(m.name)}: ${hn(vo(M[m.id]))}, ${hn(go(M[m.id][1]))}`)
        .join(" \xB7 ");
    s.push(`
<section class="block">
  <h2>${c.n}. ${hn(d.name)} <small>${c.start === c.end ? `Ocho ${c.start}` : `Ochos ${c.start}\u2013${c.end}`} \xB7 ${hn(d.formation)}${b ? ` \xB7 txalaparta \xAB${hn(b.name)}\xBB` : ""}</small></h2>
  ${d.notes ? `<p class="notes">${hn(d.notes)}</p>` : ""}
  <table>
    <thead><tr><th>Ocho</th>${[1, 2, 3, 4, 5, 6, 7, 8].map((m) => `<th>${m}</th>`).join("")}<th>Desplazamiento</th></tr></thead>
    <tbody>${y.join("")}</tbody>
  </table>
  <p class="marks"><b>Marcas:</b> ${f}</p>
</section>`);
  }
  let i = e.show ? `${hn(e.show.name)} \xB7 ${hn(yo(e.show.date))} \xB7 ` : "",
    u = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hoja de cuentas \xB7 ${hn(e.title)}</title>
<style>
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; margin: 24px; color: #15171c; background: #fff; }
  h1 { font-size: 26px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: .02em; }
  .meta { margin: 0 0 18px; color: #555; font-size: 13px; }
  h2 { font-size: 17px; margin: 0 0 4px; }
  h2 small { font-weight: 400; color: #555; font-size: 12px; }
  .block { margin-bottom: 20px; page-break-inside: avoid; }
  .notes { margin: 0 0 6px; font-style: italic; font-size: 13px; }
  table { border-collapse: collapse; width: 100%; table-layout: fixed; }
  th, td { border: 1px solid #b9bcc4; padding: 4px 5px; font-size: 11.5px; vertical-align: top; text-align: left; }
  thead th { background: #eef0f4; text-align: center; }
  tbody th { background: #f6f7f9; width: 3.2em; text-align: center; }
  td.note { color: #555; }
  .marks { font-size: 12px; color: #333; margin: 6px 0 0; }
  @media print { body { margin: 10mm; } }
</style>
</head>
<body>
<h1>${hn(e.title)}</h1>
<p class="meta">${i}${e.bpm} bpm \xB7 ${Ca(e.blocks)} ochos \xB7 hoja de cuentas generada con Contratiempo</p>
${s.join(`
`)}
</body>
</html>`;
  return {
    filename: `hoja-de-cuentas-${(e.title || "coreografia")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase()}.html`,
    html: u,
  };
}
var Vy = (e, t) => (e.steps[t] ? e.steps[t].name : t);
var qy = (e) => {
  let t = [...e].sort((n, a) => n - a);
  return t[Math.floor(t.length / 2)];
};
function Hy(e, t, n, a, l, o) {
  if (t.offset == null) return null;
  let r = ((e - t.offset) * t.bpm) / 60;
  if (r < -4) return null;
  if (r < 0)
    return {
      pre: !0,
      count: Math.floor(r) + 9,
    };
  let s = Math.floor(r / 8),
    i = n.blocks.reduce((y, M) => y + M.len, 0);
  if (s >= i)
    return {
      end: !0,
    };
  let u = n.blocks.find((y) => {
      let M = a[y.id];
      return M && s >= M.start - 1 && s < M.end;
    }),
    p = u ? a[u.id] : null,
    d = (Math.floor(r + 1e-6) % 8) + 1,
    c = r - Math.floor(r) >= 0.5,
    h = null,
    b = l
      .filter(
        (y) =>
          y.type === "feet" &&
          s >= y.eight &&
          s < y.eight + Math.ceil(y.counts / 8),
      )
      .sort((y, M) => M.bpm - y.bpm)[0];
  if (b) {
    let y = r - b.eight * 8,
      M = b.spans.filter((f) => f.from <= y + 0.05).pop();
    M && y - M.to < 1.5 && (h = Vy(o, M.key));
  }
  return {
    count: d,
    half: c,
    eight: s + 1,
    total: i,
    block: u ? u.name : "",
    inBlock: p ? `${s - (p.start - 1) + 1} de ${p.end - p.start + 1}` : "",
    formation: u ? u.formation : "",
    step: h,
  };
}
function yi(e, t, n, a, l, o) {
  (e.beginPath(),
    e.moveTo(t + o, n),
    e.arcTo(t + a, n, t + a, n + l, o),
    e.arcTo(t + a, n + l, t, n + l, o),
    e.arcTo(t, n + l, t, n, o),
    e.arcTo(t, n, t + a, n, o),
    e.closePath());
}
function kd(e, t, n, a) {
  if (!a) return;
  let l = Math.max(t, n) / 100;
  (e.save(), (e.textBaseline = "middle"));
  let o = (M, f) =>
    `${M} ${Math.round(f)}px Archivo, "Arial Narrow", system-ui, sans-serif`;
  if (a.end) {
    e.restore();
    return;
  }
  let r = l * 13,
    s = l * 13,
    i = t - r - l * 2,
    u = n - s - l * 2;
  if (
    ((e.fillStyle = a.pre ? "rgba(20,22,28,0.72)" : "rgba(43,63,207,0.9)"),
    yi(e, i, u, r, s, l * 1.6),
    e.fill(),
    (e.fillStyle = "#fff"),
    (e.textAlign = "center"),
    (e.font = o(800, s * 0.72)),
    e.fillText(String(a.count), i + r / 2, u + s * 0.53),
    a.half &&
      !a.pre &&
      ((e.font = o(700, s * 0.2)), e.fillText("y", i + r * 0.86, u + s * 0.2)),
    !a.pre)
  ) {
    let M = r / 8;
    ((e.fillStyle = "rgba(20,22,28,0.72)"),
      yi(e, i, u - l * 2.4, r, l * 2.4 - l * 0.4, l * 1),
      e.fill());
    for (let f = 0; f < 8; f++)
      ((e.fillStyle = f < a.count ? "#fff" : "rgba(255,255,255,0.35)"),
        e.beginPath(),
        e.arc(i + M * (f + 0.5), u - l * 1.4, l * 0.42, 0, Math.PI * 2),
        e.fill());
  }
  e.textAlign = "left";
  let p = a.pre ? "Preparadas\u2026" : a.block,
    d = a.pre
      ? ""
      : `Ocho ${a.inBlock}${a.formation ? ` \xB7 ${a.formation}` : ""}`;
  e.font = o(800, l * 3.4);
  let c = e.measureText(p.toUpperCase()).width;
  e.font = o(500, l * 2);
  let h = d ? e.measureText(d).width : 0,
    b = Math.max(c, h) + l * 3,
    y = d ? l * 8.2 : l * 5.4;
  if (
    ((e.fillStyle = "rgba(20,22,28,0.72)"),
    yi(e, l * 2, l * 2, b, y, l * 1.2),
    e.fill(),
    (e.fillStyle = "#fff"),
    (e.font = o(800, l * 3.4)),
    e.fillText(p.toUpperCase(), l * 3.5, l * 2 + l * 2.8),
    d &&
      ((e.fillStyle = "rgba(255,255,255,0.82)"),
      (e.font = o(500, l * 2)),
      e.fillText(d, l * 3.5, l * 2 + l * 6.1)),
    a.step && !a.pre)
  ) {
    e.font = o(700, l * 2.8);
    let M = e.measureText(a.step).width + l * 3;
    ((e.fillStyle = "rgba(228,238,50,0.95)"),
      yi(e, l * 2, n - l * 2 - l * 5, M, l * 5, l * 1.2),
      e.fill(),
      (e.fillStyle = "#1a1c0e"),
      e.fillText(a.step, l * 3.5, n - l * 2 - l * 2.5));
  }
  e.restore();
}
function Qy() {
  return typeof MediaRecorder == "undefined"
    ? null
    : [
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ].find(
        (t) =>
          MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t),
      ) || "";
}
function Qh({ choreo, derived, vocab }) {
  let a = on("downloads"),
    [l, o] = useState(null),
    [r, s] = useState({
      offset: null,
      bpm: choreo.bpm,
    }),
    [i, u] = useState([]),
    [p, d] = useState(null),
    [c, h] = useState(null),
    [b, y] = useState(16 / 9),
    M = useRef(null),
    f = useRef(null),
    m = useRef(!1),
    v = useRef(r);
  ((v.current = r),
    useEffect(() => () => l && URL.revokeObjectURL(l.src), [l]));
  let w = ($) => Hy($, v.current, choreo, derived.ranges, derived.clips, vocab);
  useEffect(() => {
    if (!l) return;
    let $ = 0,
      A = () => {
        let Y = M.current,
          F = f.current;
        if (Y && F) {
          let Z = Y.getBoundingClientRect(),
            q = Math.min(2, window.devicePixelRatio || 1),
            de = Y.videoWidth || 16,
            ge = Y.videoHeight || 9,
            ie = Math.min(Z.width / de, Z.height / ge),
            D = Math.max(1, Math.round(de * ie)),
            _ = Math.max(1, Math.round(ge * ie));
          (F.width !== Math.round(D * q) || F.height !== Math.round(_ * q)) &&
            ((F.width = Math.round(D * q)),
            (F.height = Math.round(_ * q)),
            (F.style.width = `${D}px`),
            (F.style.height = `${_}px`));
          let B = F.getContext("2d");
          (B.clearRect(0, 0, F.width, F.height),
            kd(B, F.width, F.height, w(Y.currentTime)));
        }
        $ = requestAnimationFrame(A);
      };
    return (($ = requestAnimationFrame(A)), () => cancelAnimationFrame($));
  }, [l, choreo, derived, vocab]);
  let P = () => {
      let $ = M.current;
      if (!$) return;
      if ($.paused) {
        $.play().catch(() => {});
        return;
      }
      let A = $.currentTime;
      u((Y) => {
        let F = Y.length && A - Y[Y.length - 1] > 2 ? [A] : [...Y, A],
          Z = {
            ...v.current,
            offset: F[0],
          };
        if (F.length >= 4) {
          let q = qy(F.slice(1).map((de, ge) => de - F[ge]));
          q > 0.2 && q < 1.5 && (Z.bpm = Math.round((60 / q) * 2) / 2);
        }
        return (s(Z), F);
      });
    },
    T = async () => {
      if (!a || !l) return;
      let $ = Qy();
      if ($ === null) {
        h(
          "Este navegador no puede grabar v\xEDdeo. Prueba con Chrome o Safari actualizados.",
        );
        return;
      }
      (h(null), (m.current = !1), M.current && M.current.pause());
      let A = document.createElement("video");
      ((A.src = l.src), (A.playsInline = !0), (A.preload = "auto"));
      let Y = null,
        F = () => {
          try {
            (A.pause(), A.removeAttribute("src"), A.load());
          } catch {}
          Y && Y.close().catch(() => {});
        };
      try {
        let Z = window.AudioContext || window.webkitAudioContext;
        Y = new Z();
        let q = Y.createMediaElementSource(A),
          de = Y.createMediaStreamDestination();
        (q.connect(de),
          d({
            pct: 0,
          }),
          await A.play(),
          A.pause(),
          (A.currentTime = 0),
          await new Promise(($e) => {
            ((A.onseeked = $e), setTimeout($e, 800));
          }));
        let ge = A.videoWidth || 1280,
          ie = A.videoHeight || 720,
          D = Math.min(1, 1280 / Math.max(ge, ie)),
          _ = Math.round((ge * D) / 2) * 2,
          B = Math.round((ie * D) / 2) * 2,
          G = document.createElement("canvas");
        ((G.width = _), (G.height = B));
        let ee = G.getContext("2d"),
          me = G.captureStream(30);
        de.stream.getAudioTracks().forEach(($e) => me.addTrack($e));
        let pe = new MediaRecorder(
            me,
            $
              ? {
                  mimeType: $,
                  videoBitsPerSecond: 35e5,
                }
              : void 0,
          ),
          ke = [];
        pe.ondataavailable = ($e) =>
          $e.data && $e.data.size && ke.push($e.data);
        let H = new Promise(($e) => (pe.onstop = $e));
        if (
          (ee.drawImage(A, 0, 0, _, B),
          kd(ee, _, B, w(0)),
          pe.start(500),
          await Y.resume(),
          await A.play(),
          await new Promise(($e) => {
            let xt = () => {
              if (m.current || A.ended) return $e();
              (ee.drawImage(A, 0, 0, _, B),
                kd(ee, _, B, w(A.currentTime)),
                d({
                  pct: A.duration
                    ? Math.round((A.currentTime / A.duration) * 100)
                    : 0,
                }),
                requestAnimationFrame(xt));
            };
            ((A.onended = $e), requestAnimationFrame(xt));
          }),
          pe.stop(),
          await H,
          F(),
          m.current)
        ) {
          d(null);
          return;
        }
        let et = pe.mimeType || $ || "video/webm",
          bt = /mp4/.test(et) ? "mp4" : "webm",
          kt = new Blob(ke, {
            type: et.split(";")[0],
          });
        (d(null),
          h(await el(a, `ensayo-con-cuentas-${fi(choreo.title)}.${bt}`, kt)));
      } catch {
        (F(),
          d(null),
          h("No se ha podido preparar el v\xEDdeo en este navegador."));
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
          <O name="upload" />
          {l ? "Cambiar v\xEDdeo" : "Subir v\xEDdeo del ensayo"}
          <input
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={($) => {
              let A = $.target.files && $.target.files[0];
              (($.target.value = ""),
                A &&
                  (o({
                    src: URL.createObjectURL(A),
                    name: A.name.replace(/\.[^.]+$/, ""),
                  }),
                  s({
                    offset: null,
                    bpm: choreo.bpm,
                  }),
                  u([]),
                  h(null)));
            }}
          />
        </label>
      </div>
      {l ? (
        <>
          <div
            className="rh-screen"
            style={{
              aspectRatio: String(b),
            }}
          >
            <video
              ref={M}
              src={l.src}
              controls={!0}
              playsInline={!0}
              preload="metadata"
              className="rh-video"
              onLoadedMetadata={($) =>
                $.target.videoWidth &&
                y($.target.videoWidth / $.target.videoHeight)
              }
            />
            <canvas ref={f} className="rh-canvas" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-primary rh-tap"
              onClick={P}
            >
              <O name="flag" />
              {r.offset == null
                ? "Toca en cada cuenta desde el primer 1"
                : `Toca al ritmo (${i.length} ${i.length === 1 ? "toque" : "toques"})`}
            </button>
            {r.offset != null && (
              <>
                <span className="font-mono text-[12px] tabular-nums text-ink">
                  {"1 en "}
                  {r.offset.toFixed(2)}
                  {" s"}
                </span>
                <button
                  type="button"
                  className="btn btn-xs"
                  aria-label="Adelantar las cuentas"
                  onClick={() =>
                    s(($) => ({
                      ...$,
                      offset: $.offset - 0.05,
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
                    s(($) => ({
                      ...$,
                      offset: $.offset + 0.05,
                    }))
                  }
                >
                  +0,05 s
                </button>
                <span className="font-mono text-[12px] tabular-nums text-ink">
                  {r.bpm}
                  {" bpm"}
                </span>
                <button
                  type="button"
                  className="btn btn-xs"
                  aria-label="Bajar el tempo"
                  onClick={() =>
                    s(($) => ({
                      ...$,
                      bpm: Math.round(($.bpm - 0.5) * 2) / 2,
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
                    s(($) => ({
                      ...$,
                      bpm: Math.round(($.bpm + 0.5) * 2) / 2,
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
          {r.offset != null && a && (
            <div className="flex flex-wrap items-center gap-2">
              {p ? (
                <>
                  <div className="progress rh-progress" aria-hidden="true">
                    <span
                      style={{
                        width: `${p.pct}%`,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[12px] tabular-nums text-ink"
                    role="status"
                  >
                    {"Preparando\u2026 "}
                    {p.pct}%
                  </span>
                  <button
                    type="button"
                    className="btn btn-xs"
                    onClick={() => (m.current = !0)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="button" className="btn" onClick={T}>
                  <O name="download" />
                  Descargar con las cuentas
                </button>
              )}
              {!p && (
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
      {c && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {c}
        </p>
      )}
    </section>
  );
}
var xd = (e) => {
  let t = Math.max(0, Math.ceil(e));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
var Wy = (e) => {
  let t = Math.floor(e / 60),
    n = e % 60;
  return t
    ? n
      ? `${t === 1 ? "un minuto" : `${t} minutos`} y ${n} segundos`
      : t === 1
        ? "un minuto"
        : `${t} minutos`
    : `${n} segundos`;
};
var Wh = [
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
    name: "Cepillados delante y atr\xE1s",
    secs: 45,
    bpm: 104,
  },
  {
    name: "Cepillado doble y cambio de peso",
    secs: 60,
    bpm: 112,
  },
  {
    name: "Paso b\xE1sico de tiempo",
    secs: 60,
    bpm: 132,
  },
  {
    name: "Estiramientos",
    secs: 90,
    bpm: 0,
  },
];
function Nd({ warmup, setWarmup, mode, onStart }) {
  let [l, o] = useState(!1),
    r = warmup.reduce((i, u) => i + (Number(u.secs) || 0), 0),
    s = (i, u) =>
      setWarmup((p) =>
        p.map((d, c) =>
          c === i
            ? {
                ...d,
                ...u,
              }
            : d,
        ),
      );
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Calentamiento"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">
            {warmup.length}
            {" ejercicios \xB7 "}
            {xd(r)}
            {" min"}
          </p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Calentamiento
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!warmup.length}
            onClick={() => {
              (Ue(), Za() && Na("Empezamos"), onStart());
            }}
          >
            <O name="play" />
            Empezar
          </button>
          {mode === "coreo" && (
            <button
              type="button"
              className="btn"
              aria-pressed={l}
              onClick={() => o((i) => !i)}
            >
              <O name="edit" />
              Editar
            </button>
          )}
        </div>
      </div>
      {l ? (
        <div className="flex flex-col gap-2">
          {warmup.map((i, u) => (
            <div key={u} className="wu-edit">
              <label className="sr-only" htmlFor={`wu-n-${u}`}>
                {"Ejercicio "}
                {u + 1}
              </label>
              <input
                id={`wu-n-${u}`}
                className="field min-w-0 flex-1"
                value={i.name}
                onChange={(p) =>
                  s(u, {
                    name: p.target.value,
                  })
                }
              />
              <label className="wu-num" htmlFor={`wu-s-${u}`}>
                <input
                  id={`wu-s-${u}`}
                  type="number"
                  min="5"
                  max="600"
                  className="field"
                  value={i.secs}
                  onChange={(p) =>
                    s(u, {
                      secs: Math.max(
                        5,
                        Math.min(600, Number(p.target.value) || 5),
                      ),
                    })
                  }
                />
                <span>seg</span>
              </label>
              <label className="wu-num" htmlFor={`wu-b-${u}`}>
                <input
                  id={`wu-b-${u}`}
                  type="number"
                  min="0"
                  max="220"
                  className="field"
                  value={i.bpm}
                  onChange={(p) =>
                    s(u, {
                      bpm: Math.max(
                        0,
                        Math.min(220, Number(p.target.value) || 0),
                      ),
                    })
                  }
                />
                <span>bpm</span>
              </label>
              <button
                type="button"
                className="btn btn-icon"
                aria-label={`Quitar ${i.name}`}
                onClick={() => setWarmup((p) => p.filter((d, c) => c !== u))}
              >
                <O name="x" />
              </button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-xs"
              onClick={() =>
                setWarmup((i) => [
                  ...i,
                  {
                    name: "Nuevo ejercicio",
                    secs: 60,
                    bpm: 0,
                  },
                ])
              }
            >
              <span aria-hidden="true">+</span>
              {" A\xF1adir ejercicio"}
            </button>
            <span className="text-[12px] text-muted">
              Con bpm a 0 no suena el metrónomo.
            </span>
          </div>
        </div>
      ) : (
        <ol className="wu-list">
          {warmup.map((i, u) => (
            <li key={u}>
              <span className="wu-n f-display">{u + 1}</span>
              <span className="min-w-0 flex-1 text-[14px] text-ink">
                {i.name}
              </span>
              <span className="font-mono text-[12px] tabular-nums text-muted">
                {xd(i.secs)}
                {i.bpm ? ` \xB7 ${i.bpm} bpm` : ""}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
function Gh({ warmup, onClose, onPractice, voice }) {
  let [l, o] = useState(0),
    [r, s] = useState(warmup[0] ? warmup[0].secs : 0),
    [i, u] = useState(!0),
    [p, d] = useState(!1),
    c = warmup[l];
  (useEffect(() => {
    if (!i || p) return;
    let M = performance.now(),
      f = setInterval(() => {
        let m = performance.now(),
          v = (m - M) / 1e3;
        ((M = m), s((w) => w - v));
      }, 200);
    return () => clearInterval(f);
  }, [i, l, p]),
    useEffect(() => {
      r > 0 ||
        p ||
        (l + 1 < warmup.length
          ? (o(l + 1), s(warmup[l + 1].secs))
          : (d(!0),
            u(!1),
            voice && Na("Calentamiento terminado. \xA1A bailar!")));
    }, [r]),
    useEffect(() => {
      c && voice && !p && Na(`${c.name}. ${Wy(c.secs)}`);
    }, [l]),
    useEffect(() => {
      if (!i || p || !c || !c.bpm) return;
      Ue();
      let M = 60 / c.bpm,
        f = Fe() + 0.15,
        m = 0,
        v = setInterval(() => {
          let w = Fe() + 0.12;
          for (; f < w;)
            (Ft(m % 8 === 0 ? "clickHi" : "click", null, f),
              (f += M),
              (m += 1));
        }, 25);
      return (
        _t(!0),
        () => {
          (clearInterval(v), _t(!1));
        }
      );
    }, [i, l, p]),
    useEffect(() => {
      if (!i || p || !onPractice) return;
      let M = setInterval(() => onPractice(5), 5e3);
      return () => clearInterval(M);
    }, [i, p]),
    useEffect(() => {
      let M = (f) => {
        f.key === "Escape" && h();
      };
      return (
        window.addEventListener("keydown", M),
        () => window.removeEventListener("keydown", M)
      );
    }, []));
  let h = () => {
      (Tl(), onClose());
    },
    b = () => s(0),
    y = c ? Math.min(100, Math.max(0, (1 - r / c.secs) * 100)) : 100;
  return (
    <div
      className="wu-run"
      role="dialog"
      aria-modal="true"
      aria-label="Calentamiento"
    >
      <div className="wu-run-top">
        <span className="f-label">
          {"Calentamiento \xB7 "}
          {Math.min(l + 1, warmup.length)}
          {" de "}
          {warmup.length}
        </span>
        <button type="button" className="btn" onClick={h}>
          <O name="x" />
          Salir
        </button>
      </div>
      <div className="wu-run-main">
        {p ? (
          <>
            <p className="wu-run-name f-display">¡Listas!</p>
            <p className="wu-run-next">
              Calentamiento terminado. Ahora, a ensayar.
            </p>
          </>
        ) : (
          <>
            <p className="wu-run-name f-display">{c.name}</p>
            <p className="wu-run-time f-display tabular-nums">{xd(r)}</p>
            <div className="wu-run-bar" aria-hidden="true">
              <span
                style={{
                  width: `${y}%`,
                }}
              />
            </div>
            <p className="wu-run-next">
              {c.bpm ? `Metr\xF3nomo a ${c.bpm} bpm` : "Sin metr\xF3nomo"}
              {warmup[l + 1]
                ? ` \xB7 Despu\xE9s: ${warmup[l + 1].name}`
                : " \xB7 \xDAltimo ejercicio"}
            </p>
          </>
        )}
      </div>
      {!p && (
        <div className="wu-run-ctrl">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              (Ue(), u((M) => !M));
            }}
          >
            <O name={i ? "pause" : "play"} />
            {i ? "Pausa" : "Seguir"}
          </button>
          <button type="button" className="btn btn-lg" onClick={b}>
            <O name="arrow" />
            Siguiente ejercicio
          </button>
        </div>
      )}
    </div>
  );
}
var Gy = ["D", "L", "M", "X", "J", "V", "S"];
var wo = (e) =>
  `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
function Kh({ log }) {
  let t = [],
    n = new Date();
  for (let r = 6; r >= 0; r--) {
    let s = new Date(n.getFullYear(), n.getMonth(), n.getDate() - r);
    t.push({
      d: s,
      key: wo(s),
      secs: (log || {})[wo(s)] || 0,
    });
  }
  let a = t.reduce((r, s) => r + s.secs, 0),
    l = Math.max(600, ...t.map((r) => r.secs)),
    o = 0;
  for (let r = t.length - 1; r >= 0; r--)
    if (t[r].secs >= 60) o++;
    else {
      if (r === t.length - 1) continue;
      break;
    }
  return (
    <section className="panel flex flex-col gap-3 p-4" aria-label="Tu práctica">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="f-label">Solo lo ves tú</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Tu práctica
          </h2>
        </div>
        <p className="font-mono text-[12px] text-ink">
          {"Esta semana: "}
          <b className="text-[15px]">
            {Math.round(a / 60)}
            {" min"}
          </b>
          {o > 1 ? ` \xB7 ${o} d\xEDas seguidos` : ""}
        </p>
      </div>
      <div
        className="pr-chart"
        role="img"
        aria-label={`Minutos practicados los \xFAltimos 7 d\xEDas: ${t.map((r) => Math.round(r.secs / 60)).join(", ")}`}
      >
        {t.map((r, s) => (
          <div
            key={r.key}
            className={`pr-day ${s === t.length - 1 ? "is-today" : ""}`}
          >
            <span className="pr-val tabular-nums">
              {r.secs >= 60 ? Math.round(r.secs / 60) : ""}
            </span>
            <span
              className="pr-bar"
              style={{
                height: `${Math.max(r.secs ? 4 : 0, (r.secs / l) * 100)}%`,
              }}
            />
            <span className="pr-lab">
              {s === t.length - 1 ? "hoy" : Gy[r.d.getDay()]}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-muted">
        Cuenta solo el tiempo con algo sonando: vídeos de pasos, ensayo entero,
        calentamiento y taller.
      </p>
    </section>
  );
}
function Yh({ getState, onImport }) {
  let n = on("downloads"),
    [a, l] = useState(null),
    [o, r] = useState(null),
    s = useRef(null),
    i = async () => {
      if (!n) return;
      let p = {
        app: "contratiempo",
        v: 4,
        saved: new Date().toISOString(),
        state: getState(),
        sonidos: Wc(),
      };
      l(
        await el(
          n,
          `contratiempo-copia-${wo(new Date())}.json`,
          JSON.stringify(p),
        ),
      );
    },
    u = async (p) => {
      if (p) {
        l(null);
        try {
          let d = JSON.parse(await p.text());
          if (
            !d ||
            d.app !== "contratiempo" ||
            !d.state ||
            !Array.isArray(d.state.choreos)
          )
            throw new Error("bad");
          r({
            data: d,
            name: p.name,
          });
        } catch {
          l("Ese archivo no es una copia de Contratiempo.");
        }
      }
    };
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Copia de seguridad"
    >
      <div>
        <p className="f-label">Para no perder nada</p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Copia de seguridad
        </h2>
        <p className="mt-1.5 max-w-[70ch] text-[13px] text-muted">
          La demo guarda todo solo en este navegador. Descarga una copia con
          coreografías, ritmos, sonidos grabados y ajustes, y cárgala en otro
          móvil u ordenador. Los vídeos y canciones subidos no van en la copia.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {n && (
          <button type="button" className="btn" onClick={i}>
            <O name="save" />
            Descargar copia
          </button>
        )}
        <label className="btn btn-file">
          <O name="upload" />
          Cargar una copia
          <input
            ref={s}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(p) => {
              (u(p.target.files && p.target.files[0]), (p.target.value = ""));
            }}
          />
        </label>
      </div>
      {o && (
        <div
          className="bk-confirm"
          role="alertdialog"
          aria-label="Confirmar copia"
        >
          <p className="text-[14px] text-ink">
            {"Vas a sustituir todo lo de este navegador por la copia "}
            <b className="font-semibold">{o.name}</b>
            {o.data.saved ? ` (del ${o.data.saved.slice(0, 10)})` : ""}.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-warn"
              onClick={() => {
                (onImport(o.data.state),
                  o.data.sonidos && z0(o.data.sonidos),
                  r(null),
                  l("Copia cargada."));
              }}
            >
              Sustituir
            </button>
            <button type="button" className="btn" onClick={() => r(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      {a && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {a}
        </p>
      )}
    </section>
  );
}
var Ky = ["flap", "shuffle", "ballChange", "paddle", "cramp", "riff", "stamp"];
function CWd({ vocab, onStart }) {
  let [n, a] = useState(112),
    [l, o] = useState(1),
    [r, s] = useState(2),
    [i, u] = useState(Ky),
    p = (c) => (vocab.steps[c] ? vocab.steps[c].name : c),
    d = (c) => u((h) => (h.includes(c) ? h.filter((b) => b !== c) : [...h, c]));
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Ruleta de improvisación"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">Pasos al azar con metrónomo</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Ruleta de improvisación
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={i.length < 2}
          onClick={() => {
            (Ue(),
              onStart({
                bpm: n,
                per: l,
                mins: r,
                pool: i,
              }));
          }}
        >
          <O name="spark" />
          Girar la ruleta
        </button>
      </div>
      <p className="max-w-[70ch] text-[13px] text-muted">
        {"Cada "}
        {l === 1 ? "ocho" : "dos ochos"}
        {
          " salen uno o dos pasos al azar y hay que encadenarlos a tiempo. La voz avisa del siguiente un poco antes."
        }
      </p>
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Pasos que pueden salir"
      >
        {ni.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={i.includes(c)}
            onClick={() => d(c)}
          >
            {p(c)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink">
        <label className="wu-num" htmlFor="impro-bpm">
          <input
            id="impro-bpm"
            type="number"
            min="60"
            max="200"
            className="field"
            value={n}
            onChange={(c) =>
              a(Math.max(60, Math.min(200, Number(c.target.value) || 60)))
            }
          />
          <span>bpm</span>
        </label>
        <div
          className="seg seg-sm"
          role="radiogroup"
          aria-label="Cada cuánto cambia"
        >
          {[
            [1, "Cada ocho"],
            [2, "Cada dos ochos"],
          ].map(([c, h]) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={l === c}
              className="seg-btn"
              onClick={() => o(c)}
            >
              {h}
            </button>
          ))}
        </div>
        <div className="seg seg-sm" role="radiogroup" aria-label="Duración">
          {[1, 2, 3].map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={r === c}
              className="seg-btn"
              onClick={() => s(c)}
            >
              {c}
              {" min"}
            </button>
          ))}
        </div>
      </div>
      {i.length < 2 && (
        <p className="text-[12px] font-semibold text-[color:var(--warn)]">
          Elige al menos dos pasos.
        </p>
      )}
    </section>
  );
}
function Yy(e, t) {
  let n = [],
    a = "";
  for (let l = 0; l < t; l++) {
    let o;
    for (let r = 0; r < 8; r++) {
      let s = e[Math.floor(Math.random() * e.length)],
        i = Math.random() < 0.45,
        u = e[Math.floor(Math.random() * e.length)];
      if (
        (u === s && (u = e[(e.indexOf(s) + 1) % e.length]),
        (o = i ? [s, u] : [s]),
        o.join() !== a)
      )
        break;
    }
    ((a = o.join()), n.push(o));
  }
  return n;
}
function Xh({ settings, vocab, voice, onPractice, onClose }) {
  let { bpm, per, mins, pool } = settings,
    u = 60 / bpm,
    p = Math.max(2, Math.round((mins * 60) / (u * 8 * per))),
    [d] = useState(() => Yy(pool, p)),
    [c, h] = useState(-4),
    [b, y] = useState(!0),
    M = useRef(0),
    f = useRef(-4),
    m = useRef(-1),
    v = (q) => (vocab.steps[q] ? vocab.steps[q].name : q),
    w = (q) => q.map(v).join(" y "),
    P = p * per * 8;
  (useEffect(() => {
    if (!b) return;
    (Ue(), _t(!0));
    let q = Fe() + 0.15;
    M.current = q - (f.current + 4) * u;
    let de = Math.ceil(f.current - 1e-6),
      ge = setInterval(() => {
        let _ = Fe() + 0.12;
        for (; de < P;) {
          let B = M.current + (de + 4) * u;
          if (B >= _) break;
          (B >= Fe() - 0.02 && Ft(de % 8 === 0 ? "clickHi" : "click", null, B),
            (de += 1));
        }
      }, 25),
      ie = 0,
      D = () => {
        let _ = (Fe() - M.current) / u - 4;
        if ((h(_), _ >= P)) {
          (y(!1), (f.current = P), voice && Na("\xA1Bien hecho!"));
          return;
        }
        let B = Math.floor((_ + 2) / (per * 8));
        (voice &&
          B !== m.current &&
          B < p &&
          _ + 2 >= B * per * 8 &&
          ((m.current = B), Na(w(d[B]))),
          (ie = requestAnimationFrame(D)));
      };
    return (
      (ie = requestAnimationFrame(D)),
      () => {
        (clearInterval(ge), cancelAnimationFrame(ie), _t(!1));
      }
    );
  }, [b]),
    useEffect(() => {
      if (!b || !onPractice) return;
      let q = setInterval(() => onPractice(5), 5e3);
      return () => clearInterval(q);
    }, [b]),
    useEffect(() => {
      let q = (de) => {
        de.key === "Escape" && T();
      };
      return (
        window.addEventListener("keydown", q),
        () => window.removeEventListener("keydown", q)
      );
    }, []));
  let T = () => {
      (Tl(), onClose());
    },
    $ = c >= P,
    A = Math.max(0, Math.min(p - 1, Math.floor(Math.max(0, c) / (per * 8)))),
    Y = c < 0 ? Math.floor(c) + 9 : (Math.floor(c + 1e-6) % 8) + 1,
    F = d[A],
    Z = d[A + 1];
  return (
    <div
      className="wu-run"
      role="dialog"
      aria-modal="true"
      aria-label="Ruleta de improvisación"
    >
      <div className="wu-run-top">
        <span className="f-label">
          {"Ruleta \xB7 "}
          {bpm}
          {" bpm \xB7 "}
          {Math.min(A + 1, p)}
          {" de "}
          {p}
        </span>
        <button type="button" className="btn" onClick={T}>
          <O name="x" />
          Salir
        </button>
      </div>
      <div className="wu-run-main">
        {$ ? (
          <>
            <p className="wu-run-name f-display">¡Bien hecho!</p>
            <p className="wu-run-next">
              {"Has encadenado "}
              {p}
              {" combinaciones."}
            </p>
          </>
        ) : (
          <>
            <p
              className={`wu-run-time f-display tabular-nums ${c < 0 ? "is-pre" : ""}`}
              aria-live="off"
            >
              {Y}
            </p>
            <p className="wu-run-name f-display">
              {c < 0 ? "Prep\xE1rate" : F.map(v).join(" + ")}
            </p>
            <p className="wu-run-next">
              {c < 0
                ? `Empieza con: ${F.map(v).join(" + ")}`
                : Z
                  ? `Despu\xE9s: ${Z.map(v).join(" + ")}`
                  : "\xDAltima combinaci\xF3n"}
            </p>
            <div className="wu-run-bar" aria-hidden="true">
              <span
                style={{
                  width: `${Math.max(0, Math.min(100, (c / P) * 100))}%`,
                }}
              />
            </div>
          </>
        )}
      </div>
      {!$ && (
        <div className="wu-run-ctrl">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              (b &&
                ((f.current = Math.max(-4, Math.floor(c / 8) * 8 - 4)), Tl()),
                y((q) => !q));
            }}
          >
            <O name={b ? "pause" : "play"} />
            {b ? "Pausa" : "Seguir"}
          </button>
        </div>
      )}
    </div>
  );
}
var eg = "contratiempo-demo-v2";
var Xy = () => {
  try {
    return JSON.parse(localStorage.getItem(eg) || "null");
  } catch {
    return null;
  }
};
var Zy = (e) => {
  try {
    localStorage.setItem(eg, JSON.stringify(e));
  } catch {}
};
var tl = (e) => JSON.parse(JSON.stringify(e));
var Zh = () =>
  typeof window != "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var Jy = () => {
  let e = new Date(),
    t = (n) => wo(new Date(e.getFullYear(), e.getMonth(), e.getDate() - n));
  return {
    laura: {
      [t(1)]: 840,
      [t(3)]: 1260,
      [t(4)]: 480,
      [t(6)]: 300,
    },
  };
};
var tg = () => ({
  mode: "bailarina",
  me: "laura",
  choreoId: null,
  view: "publico",
  prefs: {
    rate: 1,
    metro: !0,
    muted: !1,
    voice: !1,
  },
  choreos: tl(w0),
  clipMeta: {},
  lastClass: tl(b0),
  seen: {
    nerea: ["c6"],
  },
  hard: {
    irati: ["c3"],
    maialen: ["c5"],
    nerea: ["c5"],
    sofia: ["c8"],
  },
  codes: {
    ...k0,
  },
  vocab: tl(ai),
  sync: {},
  sel: {
    otono: {
      blockId: "o3",
      clipId: "c5",
    },
  },
  rhythms: tl(S0),
  tallerId: null,
  instruments: {
    ...wr,
  },
  warmup: tl(Wh),
  practice: Jy(),
});
function Jh(e) {
  let t = tg();
  if (!e || (e.v !== 2 && e.v !== 3 && e.v !== 4)) return t;
  let n = {
    ...t,
    ...e,
    prefs: {
      ...t.prefs,
      ...(e.prefs || {}),
    },
    vocab: {
      sounds: {
        ...t.vocab.sounds,
        ...(e.vocab || {}).sounds,
      },
      steps: {
        ...t.vocab.steps,
        ...(e.vocab || {}).steps,
      },
    },
  };
  (e.v === 2 &&
    ((n.choreos = [
      ...e.choreos,
      ...t.choreos.filter((a) => !e.choreos.some((l) => l.id === a.id)),
    ]),
    (n.rhythms = t.rhythms),
    (n.tallerId = null)),
    (n.choreos = n.choreos.map((a) => {
      let l = t.choreos.find((o) => o.id === a.id);
      return !l || a.show !== void 0
        ? a
        : {
            ...a,
            show: l.show || null,
            week: l.week || "",
            links: l.links || [],
            blocks: a.blocks.map((o) => {
              let r = l.blocks.find((s) => s.id === o.id);
              return r && o.done === void 0
                ? {
                    ...o,
                    done: !!r.done,
                  }
                : o;
            }),
          };
    })),
    (n.choreos = n.choreos.map((a) => {
      let l = t.choreos.find((o) => o.id === a.id);
      return l && l.logistics && a.logistics === void 0
        ? {
            ...a,
            logistics: l.logistics,
          }
        : a;
    })),
    (n.rhythms = (n.rhythms || t.rhythms).map((a) => {
      let l = H0(a);
      return a.id === "rx1" && l.planks === 2
        ? {
            ...t.rhythms[0],
            name: a.name,
            moves: a.moves,
          }
        : l;
    })));
  for (let a of t.rhythms)
    !n.rhythms.some((l) => l.id === a.id) && e.v !== 4 && n.rhythms.push(a);
  return (
    (n.instruments = {
      ...wr,
      ...(e.instruments || {}),
    }),
    (n.hard = e.hard || t.hard),
    (n.warmup = Array.isArray(e.warmup) ? e.warmup : t.warmup),
    (n.practice = e.practice || t.practice),
    n
  );
}
function eb(e) {
  if (!e) return !0;
  let t = e.getBoundingClientRect();
  return t.top >= 64 && t.top < window.innerHeight * 0.6;
}
function Sd() {
  let e = useMemo(() => Jh(Xy()), []),
    [t, n] = useState(e.mode),
    [a, l] = useState(e.me),
    [o, r] = useState(e.choreoId),
    [s, i] = useState(e.view),
    [u, p] = useState(e.prefs),
    [d, c] = useState(e.choreos),
    [h, b] = useState(e.clipMeta),
    [y, M] = useState(e.lastClass),
    [f, m] = useState(e.seen),
    [v, w] = useState(e.codes),
    [P, T] = useState(e.vocab),
    [$, A] = useState(e.sync),
    [Y, F] = useState(e.sel),
    [Z, q] = useState(e.rhythms),
    [de, ge] = useState(e.tallerId),
    [ie, D] = useState(e.instruments),
    [_, B] = useState(e.hard),
    [G, ee] = useState(e.warmup),
    [me, pe] = useState(e.practice),
    [ke, H] = useState(!1),
    [et, bt] = useState(null),
    [kt, $e] = useState(!1),
    [xt, Ht] = useState([]),
    [Se, Qt] = useState({}),
    [gn, Wt] = useState({
      id: null,
      n: 0,
    }),
    [we, st] = useState(!1),
    Qn = useRef(null),
    Qe = useRef(null);
  (useEffect(() => {
    Zy({
      v: 4,
      mode: t,
      me: a,
      choreoId: o,
      view: s,
      prefs: u,
      choreos: d,
      clipMeta: h,
      lastClass: y,
      seen: f,
      codes: v,
      vocab: P,
      sync: $,
      sel: Y,
      rhythms: Z,
      tallerId: de,
      instruments: ie,
      hard: _,
      warmup: G,
      practice: me,
    });
  }, [t, a, o, s, u, d, h, y, f, v, P, $, Y, Z, de, ie, _, G, me]),
    useEffect(() => E0(u.muted), [u.muted]),
    useEffect(() => {
      I0();
    }, []));
  let ht = useMemo(() => {
      let R = {};
      for (let L of d) R[L.id] = W0(L, xt, h, Z, ie);
      return R;
    }, [d, xt, h, Z, ie]),
    Nt = useMemo(() => Y0(d, xt), [d, xt]),
    $t = useMemo(
      () =>
        Object.fromEntries(Object.entries(ht).map(([R, L]) => [R, L.clips])),
      [ht],
    ),
    Pe = o ? d.find((R) => R.id === o) : null,
    Ea = t === "coreo" || !!a;
  useEffect(() => {
    t === "bailarina" && Pe && Pe.status === "Borrador" && r(null);
  }, [t, Pe]);
  let $a = useRef(t);
  $a.current = t;
  let An = useRef(a);
  An.current = a;
  let ra = useCallback((R) => {
      if ($a.current !== "bailarina" || !An.current) return;
      let L = An.current,
        j = wo(new Date());
      pe((ne) => {
        let ye = ne[L] || {};
        return {
          ...ne,
          [L]: {
            ...ye,
            [j]: (ye[j] || 0) + R,
          },
        };
      });
    }, []),
    zn = useCallback((R) => {
      if ($a.current !== "bailarina" || !An.current) return;
      let L = An.current;
      m((j) =>
        (j[L] || []).includes(R)
          ? j
          : {
              ...j,
              [L]: [...(j[L] || []), R],
            },
      );
    }, []),
    sa = (R, L) => {
      requestAnimationFrame(() => {
        let j = R.current;
        j &&
          (L || !eb(j)) &&
          j.scrollIntoView({
            behavior: Zh() ? "auto" : "smooth",
            block: "start",
          });
      });
    },
    rn = () => {
      (r(null), ge(null), window.scrollTo(0, 0));
    },
    nt = (de && Z.find((R) => R.id === de)) || null,
    vn = (R) => {
      let L = R && Z.find((j) => j.id === R) ? R : Z[0] ? Z[0].id : null;
      if (!L) return Ra();
      (ge(L), r(null), window.scrollTo(0, 0));
    },
    Al = useCallback(
      (R, L) => q((j) => j.map((ne) => (ne.id === R ? L(ne) : ne))),
      [],
    ),
    Ra = () => {
      let R = `rx${Date.now().toString(36)}`,
        L = (Z.find((j) => j.id === de) || {}).material || "madera";
      (q((j) => [
        ...j,
        {
          id: R,
          name: `Ritmo ${j.length + 1}`,
          bpm: 100,
          eights: 1,
          material: L,
          feet: !1,
          snap: "8",
          author: t === "coreo" ? "profe" : a,
          layers: [],
          moves: [],
        },
      ]),
        ge(R),
        r(null),
        window.scrollTo(0, 0));
    },
    nl = (R) => {
      let L = Z.find((ye) => ye.id === R);
      if (!L) return;
      let j = `rx${Date.now().toString(36)}`,
        ne = {
          ...tl(L),
          id: j,
          name: `${L.name} (copia)`,
          author: t === "coreo" ? "profe" : a,
        };
      ((ne.layers = ne.layers.map((ye) => ({
        ...ye,
        runId: void 0,
        fromBeat: void 0,
      }))),
        q((ye) => [...ye, ne]),
        ge(j));
    },
    al = (R) => {
      let L = Z.filter((j) => j.id !== R);
      (q(L),
        c((j) =>
          j.map((ne) => ({
            ...ne,
            blocks: ne.blocks.map((ye) =>
              ye.rhythmId === R
                ? {
                    ...ye,
                    rhythmId: void 0,
                  }
                : ye,
            ),
          })),
        ),
        ge(L[0] ? L[0].id : null));
    },
    ia = (R, L, j) =>
      c((ne) =>
        ne.map((ye) =>
          ye.id !== L
            ? ye
            : {
                ...ye,
                blocks: ye.blocks.map((Kt) =>
                  Kt.id === j
                    ? {
                        ...Kt,
                        rhythmId: R,
                      }
                    : Kt,
                ),
              },
        ),
      ),
    Wn = (R, L) =>
      c((j) =>
        j.map((ne) =>
          ne.id !== R
            ? ne
            : {
                ...ne,
                blocks: ne.blocks.map((ye) =>
                  ye.id === L
                    ? {
                        ...ye,
                        rhythmId: void 0,
                      }
                    : ye,
                ),
              },
        ),
      ),
    Rt = (R, L = {}) => {
      ge(null);
      let j = d.find((x) => x.id === R);
      if (!j) return;
      let ne = Y[R] || {},
        ye = L.blockId || ne.blockId || j.blocks[0].id,
        Kt = ht[R],
        In =
          L.clipId ||
          ne.clipId ||
          (
            Kt.clips.find((x) => x.block === ye) ||
            Kt.music.find((x) => x.block === ye)
          ).id;
      (F((x) => ({
        ...x,
        [R]: {
          blockId: ye,
          clipId: In,
        },
      })),
        r(R),
        L.play &&
          (Ue(),
          Wt((x) => ({
            id: In,
            n: x.n + 1,
          })),
          zn(In)),
        L.focus === "map"
          ? sa(Qe, !0)
          : L.focus === "player" || L.play
            ? sa(Qn, !0)
            : window.scrollTo(0, 0));
    },
    dt = useCallback(
      (R, L) => c((j) => j.map((ne) => (ne.id === R ? L(ne) : ne))),
      [],
    ),
    Gt = (R) =>
      F((L) => ({
        ...L,
        [o]: {
          ...(L[o] || {}),
          blockId: R,
        },
      })),
    ll = (R, L = {}) => {
      Ue();
      let j = ht[o],
        ne = [...j.clips, ...j.music, j.full].find((ye) => ye.id === R);
      ne &&
        (F((ye) => ({
          ...ye,
          [o]: {
            blockId: ne.block,
            clipId: R,
          },
        })),
        Wt((ye) => ({
          id: R,
          n: ye.n + 1,
          big: !!L.big,
        })),
        zn(R),
        sa(Qn));
    },
    ol = (R) => {
      (Gt(R),
        requestAnimationFrame(() => {
          let L = Qe.current;
          if (!L) return;
          let j = L.getBoundingClientRect();
          (j.bottom < 90 || j.top > window.innerHeight - 120) &&
            L.scrollIntoView({
              behavior: Zh() ? "auto" : "smooth",
              block: "start",
            });
        }));
    },
    yn = (R, L, j) =>
      dt(o, (ne) => ({
        ...ne,
        formations: {
          ...ne.formations,
          [R]: {
            ...ne.formations[R],
            [L]: j,
          },
        },
      })),
    So = (R) =>
      dt(o, (L) => {
        let j = L.blocks.findIndex((ne) => ne.id === R);
        return j <= 0
          ? L
          : {
              ...L,
              formations: {
                ...L.formations,
                [R]: tl(L.formations[L.blocks[j - 1].id]),
              },
            };
      }),
    rl = (R, L) =>
      dt(o, (j) => ({
        ...j,
        blocks: j.blocks.map((ne) =>
          ne.id === R
            ? {
                ...ne,
                ...L,
              }
            : ne,
        ),
      })),
    bn = () => {
      let R = `${o}-${Date.now().toString(36)}`;
      (dt(o, (L) => {
        let j = L.blocks[L.blocks.length - 1],
          ne = {
            id: R,
            name: `Bloque ${L.blocks.length + 1}`,
            len: 2,
            formation: j ? j.formation : "Fila",
            isNew: !1,
            notes: "",
            personal: {},
          };
        return {
          ...L,
          blocks: [...L.blocks, ne],
          formations: {
            ...L.formations,
            [R]: tl(j ? L.formations[j.id] : {}),
          },
        };
      }),
        F((L) => ({
          ...L,
          [o]: {
            ...(L[o] || {}),
            blockId: R,
            clipId: `m-${R}`,
          },
        })));
    },
    sl = (R, L) => {
      let j = `k${Date.now().toString(36)}`,
        ne = `${j}-1`,
        ye = Object.fromEntries(Be.map((In, x) => [In.id, [15 + x * 14, 60]])),
        Kt = {
          id: j,
          title: R,
          bpm: L,
          swing: !1,
          status: "Borrador",
          blocks: [
            {
              id: ne,
              name: "Bloque 1",
              len: 2,
              formation: "Fila",
              isNew: !1,
              notes: "",
              personal: {},
            },
          ],
          formations: {
            [ne]: ye,
          },
        };
      (c((In) => [...In, Kt]),
        F((In) => ({
          ...In,
          [j]: {
            blockId: ne,
            clipId: `m-${ne}`,
          },
        })),
        r(j),
        window.scrollTo(0, 0));
    },
    il = (R) => {
      let j = ($t[o] || []).find((ne) => ne.id === R);
      b((ne) => ({
        ...ne,
        [R]: {
          ...(ne[R] || {}),
          isNew: !(j && j.isNew),
        },
      }));
    },
    E = (R, L) =>
      b((j) => ({
        ...j,
        [R]: {
          ...(j[R] || {}),
          angle: L,
        },
      })),
    Q = (R, L) => {
      let j = `u${Date.now().toString(36)}`,
        ne =
          L.name
            .replace(/\.[^.]+$/, "")
            .replace(/[_-]+/g, " ")
            .trim() || "V\xEDdeo sin t\xEDtulo",
        ye = URL.createObjectURL(L);
      (Ht((Kt) => [
        ...Kt,
        {
          id: j,
          block: R,
          rel: 1,
          title: ne,
          type: "upload",
          angle: "frente",
          src: ye,
          isNew: !0,
        },
      ]),
        F((Kt) => ({
          ...Kt,
          [o]: {
            blockId: R,
            clipId: j,
          },
        })));
    },
    oe = (R) => {
      Ht((j) => {
        let ne = j.find((ye) => ye.id === R);
        return (
          ne && URL.revokeObjectURL(ne.src),
          j.filter((ye) => ye.id !== R)
        );
      });
      let L = Y[o];
      L &&
        L.clipId === R &&
        F((j) => ({
          ...j,
          [o]: {
            ...L,
            clipId: `m-${L.blockId}`,
          },
        }));
    },
    Ce = (R) => {
      let L = Se[o];
      (L && URL.revokeObjectURL(L.src),
        Qt((j) => ({
          ...j,
          [o]: {
            src: URL.createObjectURL(R),
            name: R.name.replace(/\.[^.]+$/, ""),
          },
        })),
        A((j) =>
          j[o]
            ? j
            : {
                ...j,
                [o]: {
                  bpm: Pe.bpm,
                  offset: 0,
                  synced: !1,
                },
              },
        ));
    },
    Ie = (R) => {
      (n(R.mode),
        l(R.me),
        r(R.choreoId),
        i(R.view),
        p(R.prefs),
        c(R.choreos),
        b(R.clipMeta),
        M(R.lastClass),
        m(R.seen),
        B(R.hard),
        w(R.codes),
        T(R.vocab),
        A(R.sync),
        F(R.sel),
        q(R.rhythms),
        ge(null),
        D(R.instruments),
        ee(R.warmup),
        pe(R.practice),
        Ht([]),
        Qt({}));
    },
    kn = () => ({
      v: 4,
      mode: t,
      me: a,
      choreoId: null,
      view: s,
      prefs: u,
      choreos: d,
      clipMeta: h,
      lastClass: y,
      seen: f,
      codes: v,
      vocab: P,
      sync: $,
      sel: Y,
      rhythms: Z,
      tallerId: null,
      instruments: ie,
      hard: _,
      warmup: G,
      practice: me,
    }),
    gt = (R) => {
      (xt.forEach((L) => URL.revokeObjectURL(L.src)),
        Object.values(Se).forEach((L) => URL.revokeObjectURL(L.src)),
        Ie({
          ...Jh(R),
          mode: "coreo",
        }),
        window.scrollTo(0, 0));
    },
    Dt = () => {
      if (!we) {
        (st(!0), setTimeout(() => st(!1), 4e3));
        return;
      }
      (xt.forEach((R) => URL.revokeObjectURL(R.src)),
        Object.values(Se).forEach((R) => URL.revokeObjectURL(R.src)),
        Ie(tg()),
        st(!1),
        window.scrollTo(0, 0));
    },
    it = t === "coreo",
    at = Za();
  return (
    <div className={`app mode-${t}`}>
      <header className="hdr">
        <div className="wrap flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
          <div className="flex min-w-0 items-baseline gap-3">
            <button
              type="button"
              className="f-display text-[2rem] uppercase leading-none text-ink"
              onClick={rn}
              aria-label="Contratiempo: volver al repertorio"
            >
              Contratiempo
            </button>
            {(Pe || nt) && (
              <span className="hidden truncate font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:inline">
                {"/ "}
                {nt ? "Taller de txalaparta" : Pe.title}
              </span>
            )}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {!it && a && (
              <span className="who">
                <span
                  className="tape-dot"
                  style={{
                    background: Et(a).tape,
                  }}
                />
                {Et(a).name}
                <button
                  type="button"
                  className="who-out"
                  onClick={() => {
                    (l(null), r(null));
                  }}
                >
                  Salir
                </button>
              </span>
            )}
            {Ea && (
              <button
                type="button"
                className="btn"
                aria-pressed={!!nt}
                aria-label="Taller de txalaparta"
                onClick={() => (nt ? rn() : vn(null))}
              >
                <O name="txala" />
                <span className="hidden sm:inline">Txalaparta</span>
              </button>
            )}
            {it && (
              <button
                type="button"
                className="btn"
                aria-label="Mando del modo clase"
                title="Maneja desde el móvil la pantalla en modo clase"
                onClick={() => $e(!0)}
              >
                <O name="remote" />
                <span className="hidden sm:inline">Mando</span>
              </button>
            )}
            <div
              className="seg seg-mode"
              role="radiogroup"
              aria-label="Vista de la demo"
            >
              {[
                ["coreo", "Core\xF3grafa"],
                ["bailarina", "Bailarina"],
              ].map(([R, L]) => (
                <button
                  key={R}
                  type="button"
                  role="radio"
                  aria-checked={t === R}
                  className="seg-btn"
                  onClick={() => n(R)}
                >
                  {L}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main className="wrap flex flex-col gap-5 pb-10 pt-5 sm:pt-6">
        {Ea ? (
          nt ? (
            <CBd
              key={nt.id}
              rhythm={nt}
              rhythms={Z}
              choreos={it ? d : d.filter((R) => R.status !== "Borrador")}
              mode={t}
              instruments={ie}
              setInstruments={D}
              vocab={P}
              onPractice={ra}
              updateRhythm={Al}
              onOpen={(R) => ge(R)}
              onCreate={Ra}
              onDuplicate={nl}
              onDelete={al}
              onAssign={ia}
              onUnassign={Wn}
              onOpenBlock={(R, L) =>
                Rt(R, {
                  blockId: L,
                  clipId: `m-${L}`,
                  focus: "map",
                })
              }
              onBack={rn}
            />
          ) : Pe ? (
            <CTb
              choreo={Pe}
              derived={ht[Pe.id]}
              sel={Y[Pe.id] || {}}
              mode={t}
              me={a}
              view={s}
              setView={i}
              prefs={u}
              setPrefs={p}
              vocab={P}
              seen={f[a] || []}
              song={Se[Pe.id] || null}
              sync={
                $[Pe.id] || {
                  bpm: Pe.bpm,
                  offset: 0,
                  synced: !1,
                }
              }
              playReq={gn}
              playerRef={Qn}
              mapRef={Qe}
              onBack={rn}
              rhythms={Z}
              onOpenRhythm={vn}
              bank={Nt}
              hard={_}
              onPractice={ra}
              actions={{
                toggleHard: (R) =>
                  B((L) => {
                    let j = L[a] || [];
                    return {
                      ...L,
                      [a]: j.includes(R)
                        ? j.filter((ne) => ne !== R)
                        : [...j, R],
                    };
                  }),
                setShow: (R, L) =>
                  dt(Pe.id, (j) => ({
                    ...j,
                    show: R,
                    week: L,
                  })),
                setLogistics: (R) =>
                  dt(Pe.id, (L) => ({
                    ...L,
                    logistics: R,
                  })),
                setFormation: (R, L, j) =>
                  dt(Pe.id, (ne) => ({
                    ...ne,
                    formations: {
                      ...ne.formations,
                      [R]: L,
                    },
                    blocks: ne.blocks.map((ye) =>
                      ye.id === R && j
                        ? {
                            ...ye,
                            formation: j,
                          }
                        : ye,
                    ),
                  })),
                addLink: (R, L) =>
                  dt(Pe.id, (j) => ({
                    ...j,
                    links: [
                      ...(j.links || []),
                      {
                        id: `k${Date.now().toString(36)}`,
                        src: L,
                        block: R,
                        rel: 1,
                      },
                    ],
                  })),
                removeLink: (R) =>
                  dt(Pe.id, (L) => ({
                    ...L,
                    links: (L.links || []).filter((j) => j.id !== R),
                  })),
                markSeen: zn,
                playClip: ll,
                focusBlock: ol,
                setBlockId: Gt,
                setPos: yn,
                copyPrev: So,
                updateBlock: rl,
                addBlock: bn,
                toggleNew: il,
                setAngle: E,
                onUpload: Q,
                removeUpload: oe,
                onSongUpload: Ce,
                saveSync: (R) =>
                  A((L) => ({
                    ...L,
                    [Pe.id]: R,
                  })),
                setStatus: (R) =>
                  dt(Pe.id, (L) => ({
                    ...L,
                    status: R,
                  })),
              }}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="f-label">
                    {it
                      ? "Tu grupo de claqu\xE9 \xB7 6 bailarinas"
                      : "Estudio en casa"}
                  </p>
                  <h1 className="f-display mt-1 text-[2.6rem] uppercase leading-[0.9] [text-wrap:balance] sm:text-[3.2rem]">
                    {it ? "Hola, profe" : `Hola, ${Et(a).name}`}
                  </h1>
                </div>
              </div>
              {it ? (
                <>
                  <CPd
                    choreos={d}
                    clipsById={$t}
                    mode={t}
                    me={a}
                    onOpen={(R) => Rt(R)}
                    onCreate={sl}
                  />
                  <CYd rhythms={Z} instruments={ie} onOpen={vn} />
                  <div className="home-grid">
                    <Mh
                      choreos={d}
                      clipsById={$t}
                      lastClass={y}
                      setLastClass={M}
                    />
                    <Eh codes={v} setCodes={w} />
                  </div>
                  <Ph
                    choreos={d}
                    clipsById={$t}
                    lastClass={y}
                    seen={f}
                    hard={_}
                    onOpenClip={(R, L) =>
                      Rt(R, {
                        blockId: L.block,
                        clipId: L.id,
                        focus: "player",
                      })
                    }
                  />
                  <Th
                    bank={Nt}
                    onOpenUse={(R, L) =>
                      Rt(R, {
                        blockId: L,
                        focus: "map",
                      })
                    }
                  />
                  <div className="home-grid">
                    <Nd
                      warmup={G}
                      setWarmup={ee}
                      mode={t}
                      onStart={() => H(!0)}
                    />
                    <CWd vocab={P} onStart={bt} />
                  </div>
                  <CH vocab={P} setVocab={T} />
                  <Yh getState={kn} onImport={gt} />
                </>
              ) : (
                <>
                  <Ch
                    me={a}
                    choreos={d}
                    clipsById={$t}
                    lastClass={y}
                    seen={f}
                    onPlay={(R, L) =>
                      Rt(R, {
                        blockId: L.block,
                        clipId: L.id,
                        play: !0,
                      })
                    }
                    onNote={(R, L, j) => {
                      (zn(j),
                        Rt(R, {
                          blockId: L,
                          focus: "map",
                        }));
                    }}
                  />
                  <Rh
                    choreos={d}
                    onFull={(R) =>
                      Rt(R, {
                        clipId: `full-${R}`,
                        play: !0,
                      })
                    }
                  />
                  <div className="home-grid">
                    <Nd
                      warmup={G}
                      setWarmup={ee}
                      mode={t}
                      onStart={() => H(!0)}
                    />
                    <Kh log={me[a]} />
                  </div>
                  <CPd
                    choreos={d}
                    clipsById={$t}
                    mode={t}
                    me={a}
                    onOpen={(R) => Rt(R)}
                    onCreate={sl}
                  />
                  <CYd rhythms={Z} instruments={ie} onOpen={vn} />
                  <CWd vocab={P} onStart={bt} />
                </>
              )}
            </>
          )
        ) : (
          <Sh
            codes={v}
            onLogin={(R) => {
              (l(R), r(null));
            }}
          />
        )}
        {kt && <CBh onClose={() => $e(!1)} />}
        {et && (
          <Xh
            settings={et}
            vocab={P}
            voice={at}
            onPractice={ra}
            onClose={() => bt(null)}
          />
        )}
        {ke && (
          <Gh warmup={G} voice={at} onPractice={ra} onClose={() => H(!1)} />
        )}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-[13px] text-muted">
          <p className="max-w-[65ch]">
            Demo con datos de ejemplo. Los cambios se guardan solo en este
            navegador; los vídeos y canciones subidos, solo mientras la pestaña
            esté abierta.
          </p>
          <button
            type="button"
            className={`btn ${we ? "btn-warn" : ""}`}
            onClick={Dt}
          >
            {we
              ? "Pulsa otra vez para restaurar"
              : "Restaurar datos de ejemplo"}
          </button>
        </footer>
      </main>
    </div>
  );
}
function CTb({
  choreo,
  derived,
  sel,
  mode,
  me,
  view,
  setView,
  prefs,
  setPrefs,
  vocab,
  seen,
  song,
  sync,
  playReq,
  playerRef,
  mapRef,
  onBack,
  rhythms,
  onOpenRhythm,
  bank,
  hard,
  onPractice,
  actions,
}) {
  let $ = {};
  for (let B of Object.values(hard || {}))
    for (let G of B) $[G] = ($[G] || 0) + 1;
  let A = mode === "coreo",
    { ranges, clips, music, full } = derived,
    de = ranges[sel.blockId] ? sel.blockId : choreo.blocks[0].id,
    ie =
      [...clips, ...music, full].find((B) => B.id === sel.clipId) ||
      music.find((B) => B.block === de) ||
      music[0],
    D = choreo.blocks.find((B) => B.id === ie.block),
    _ = ie.full ? clips : clips.filter((B) => B.block === ie.block);
  return (
    <>
      <div className="flex flex-col gap-2">
        <button type="button" className="back" onClick={onBack}>
          <span aria-hidden="true">←</span>
          {" Repertorio"}
        </button>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="f-label">
              {choreo.status}
              {" \xB7 "}
              {choreo.bpm}
              {" bpm \xB7 "}
              {Ca(choreo.blocks)}
              {" ochos"}
            </p>
            <h1 className="f-display mt-1 text-[2.6rem] uppercase leading-[0.9] [text-wrap:balance] sm:text-[3.2rem]">
              {choreo.title}
            </h1>
          </div>
          {A && (
            <div
              className="seg seg-sm"
              role="radiogroup"
              aria-label="Quién la ve"
            >
              {[
                ["Borrador", "Borrador"],
                ["En ensayo", "Publicada"],
              ].map(([B, G]) => (
                <button
                  key={B}
                  type="button"
                  role="radio"
                  aria-checked={choreo.status === B}
                  className="seg-btn"
                  onClick={() => actions.setStatus(B)}
                >
                  {G}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Dh
        choreo={choreo}
        mode={mode}
        me={me}
        onSave={actions.setShow}
        onSaveLogistics={actions.setLogistics}
        onFull={() => actions.playClip(full.id)}
        onClass={() =>
          actions.playClip(full.id, {
            big: !0,
          })
        }
        playingFull={ie.id === full.id}
        countSheet={() => Hh(choreo, derived, rhythms, vocab)}
      />
      {A && (
        <Ih
          choreo={choreo}
          song={song}
          sync={sync}
          onUpload={actions.onSongUpload}
          onSaveSync={actions.saveSync}
        />
      )}
      <div className="layout">
        <section
          ref={playerRef}
          className="area-player"
          aria-label="Reproductor de práctica"
        >
          <CDd
            clip={ie}
            block={D}
            blockClips={_}
            prefs={prefs}
            setPrefs={setPrefs}
            me={me}
            mode={mode}
            formations={choreo.formations}
            playReq={playReq}
            onSeen={actions.markSeen}
            onPractice={onPractice}
            title={choreo.title}
            vocab={vocab}
            song={song && sync ? song : null}
            sync={sync}
          />
        </section>
        <aside
          ref={mapRef}
          className="area-map"
          aria-label="Mapa del escenario"
        >
          <CH2
            choreo={choreo}
            ranges={ranges}
            blockId={de}
            setBlockId={actions.setBlockId}
            setPos={actions.setPos}
            setFormation={actions.setFormation}
            copyPrev={actions.copyPrev}
            mode={mode}
            me={me}
            view={view}
            setView={setView}
          />
        </aside>
        <section className="area-blocks" aria-label="Desglose por bloques">
          <Fh
            choreo={choreo}
            ranges={ranges}
            clips={clips}
            music={music}
            clipId={ie.id}
            blockId={de}
            onPlay={actions.playClip}
            onSelect={actions.focusBlock}
            mode={mode}
            me={me}
            seen={seen}
            updateBlock={actions.updateBlock}
            toggleNew={actions.toggleNew}
            setAngle={actions.setAngle}
            onUpload={actions.onUpload}
            removeUpload={actions.removeUpload}
            onAddBlock={actions.addBlock}
            rhythms={rhythms}
            onOpenRhythm={onOpenRhythm}
            bank={bank}
            onAddLink={actions.addLink}
            onRemoveLink={actions.removeLink}
            hardMine={(hard || {})[me] || []}
            hardCount={$}
            onToggleHard={actions.toggleHard}
          />
        </section>
      </div>
      {!A && (
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <O name="check" size={14} />
          Los vídeos que ya has reproducido llevan una marca verde.
        </p>
      )}
      <Qh key={choreo.id} choreo={choreo} derived={derived} vocab={vocab} />
    </>
  );
}

export default Sd;
