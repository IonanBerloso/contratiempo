export var SAMPLE_CHOREOS = [
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
