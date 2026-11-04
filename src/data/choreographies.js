export const SAMPLE_CHOREOS = [
  {
    id: "otono",
    title: "Otoño en swing",
    bpm: 132,
    swing: true,
    status: "En ensayo",
    show: {
      name: "Festival de Navidad",
      date: "2026-12-19",
    },
    week: "Limpiar el canon del estribillo. Repasad el vídeo despacio antes del jueves.",
    blocks: [
      {
        id: "o1",
        done: true,
        name: "Intro",
        len: 3,
        formation: "Fila",
        isNew: false,
        notes:
          "Ocho 1: entramos por el hombro derecho de una en una, cada media cuenta. Ochos 2 y 3: paso básico de tiempo a derecha e izquierda. Peso adelante y rodillas sueltas: que suene limpio, no fuerte.",
        personal: {
          ane: "Sales la primera: arranca en el «y» del 8, no esperes al 1.",
          sofia:
            "Cuando llegues a tu marca, para en seco. Nada de pasitos de ajuste.",
        },
      },
      {
        id: "o2",
        done: true,
        name: "Estrofa",
        len: 4,
        formation: "Cuña",
        isNew: false,
        notes:
          "En el ocho 4 pasamos de la fila a la cuña en cuatro tiempos, andando sobre la punta. Después, cepillado doble y cambio de peso a cada lado, y rueda de talón. La rueda son cuatro sonidos iguales, sin acentos.",
        personal: {
          irati:
            "Tu rueda de talón corre. Practícala a 0,75× con el metrónomo hasta que suene pareja.",
          laura: "En la cuña vas delante: tú marcas el pulso, que se te oiga.",
        },
      },
      {
        id: "o3",
        done: true,
        name: "Estribillo",
        len: 4,
        formation: "Diagonal en canon",
        isNew: true,
        notes:
          "La diagonal entra en canon en el ocho 8: cada una sale una cuenta después de la anterior, empezando por Ane al fondo. Luego dos rozados, redoble y golpe, primero a la derecha y después a la izquierda. Mirada al público desde el primer rozado.",
        personal: {
          laura:
            "Te he cambiado de sitio: ahora vas la tercera de la diagonal, entre Irati y Maialen.",
          nerea:
            "Eres la quinta del canon: sales en el 5 y llegas a tu sitio en el 7.",
          maialen:
            "Cuidado con el redoble a la izquierda: el último talón se te come.",
        },
      },
      {
        id: "o4",
        name: "Break y final",
        len: 3,
        formation: "Semicírculo y solo",
        isNew: false,
        acapella: [2, 3],
        notes:
          "Ocho 12: vamos al semicírculo en seis tiempos y Nerea se queda delante. Ochos 13 y 14: break a capella, sin música. Paradiddles alternando pies y tres golpes; el resto marca el pulso con talones. Pose final en el 8 y aguantamos dos tiempos.",
        personal: {
          nerea:
            "El break delante es tuyo. Si te pierdes, vuelve al talón en el 1.",
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
    swing: false,
    status: "En ensayo",
    show: {
      name: "Festival de Navidad",
      date: "2026-12-19",
    },
    week: "",
    blocks: [
      {
        id: "t1",
        done: true,
        name: "La salida",
        len: 2,
        formation: "Columna",
        isNew: false,
        notes:
          "Empezamos en columna, como vagones. Golpes lentos que arrancan el tren y luego cepillado y paso cada vez más ligero. Brazos de biela pegados al cuerpo.",
        personal: {
          laura:
            "Eres la locomotora: vas la primera de la columna y marcas la velocidad.",
        },
      },
      {
        id: "t2",
        done: true,
        name: "El traqueteo",
        len: 4,
        formation: "Dos vías",
        isNew: true,
        notes:
          "Nuevo: la columna se abre en dos vías de tres. El traqueteo es cepillado doble y paso, sin parar, «ta-ca-TA». Que no se acelere: el tren va constante.",
        personal: {
          nerea:
            "Vas en la vía de tu izquierda, en medio. Maialen va delante de ti: id a la vez.",
          laura: "En las dos vías vas la primera de la vía de tu derecha.",
        },
      },
      {
        id: "t3",
        name: "Llegada al andén",
        len: 2,
        formation: "Andén",
        isNew: false,
        notes:
          "Frenamos poco a poco: cada ocho más lento con talones. Terminamos en línea delante, como en el andén.",
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
    swing: false,
    status: "Borrador",
    blocks: [
      {
        id: "f1",
        name: "Idea de inicio",
        len: 2,
        formation: "Por decidir",
        isNew: false,
        notes:
          "Idea: empezar a oscuras, solo con el sonido de los pies. Falta elegir canción.",
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
    swing: false,
    status: "En ensayo",
    show: {
      name: "Fiesta de la escuela",
      date: "2026-11-27",
    },
    week: "Cada una aprende su papel del Diálogo en el taller de txalaparta, con «Practicar mi papel».",
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
          what: "Actuación",
        },
      ],
      costume:
        "Camiseta blanca, pantalón negro y zapatos de claqué. Pelo recogido.",
      notes: {
        nerea: "Llevas el pañuelo rojo del solo del break.",
      },
      auth: {
        laura: true,
        irati: true,
        nerea: false,
        maialen: true,
        sofia: false,
        ane: true,
      },
    },
    blocks: [
      {
        id: "x1",
        done: true,
        name: "Entrada",
        len: 2,
        formation: "Dos filas enfrentadas",
        isNew: false,
        notes:
          "Dos filas enfrentadas, como los dos lados de la txalaparta: la fila de delante es ttakun y la del fondo, herren. Entramos marcando el pulso con talones.",
        personal: {},
      },
      {
        id: "x2",
        name: "Diálogo",
        len: 2,
        formation: "Pregunta y respuesta",
        isNew: false,
        rhythmId: "rx1",
        notes:
          "Sobre el ritmo que creamos en el taller. La fila ttakun marca el pulso y la fila herren contesta en los huecos. Los pasos de cada cuenta están apuntados en el taller.",
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
