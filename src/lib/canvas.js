import { DANCERS } from "../data/dancers.js";
import { createSeededRandom, easeInOutQuad, rotatePoint } from "./math.js";
const CANVAS_FOOT_COLORS = {
  R: "#EE8B26",
  L: "#1AA2B2",
};
const FLOOR_PLANK_COLORS = [
  "#CFA877",
  "#C79F6D",
  "#D3AE7E",
  "#C49A69",
  "#CCA473",
];
const CANVAS_MONO_FONT = '"IBM Plex Mono", ui-monospace, monospace';
const CANVAS_SANS_FONT = "Archivo, system-ui, sans-serif";
let floorTextureCache = {
  key: "",
  c: null,
};
function drawWoodFloor(ctx, width, height) {
  const cacheKey = `${width}x${height}`;
  if (floorTextureCache.key !== cacheKey) {
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext("2d");
    const random = createSeededRandom(42);
    const plankHeight = Math.max(12, Math.round(height / 10));
    const seamWidth = Math.max(1, height / 360);
    for (
      let plankTop = 0, plankIndex = 0;
      plankTop < height;
      plankTop += plankHeight, plankIndex++
    ) {
      offCtx.fillStyle =
        FLOOR_PLANK_COLORS[plankIndex % FLOOR_PLANK_COLORS.length];
      offCtx.fillRect(0, plankTop, width, plankHeight);
      offCtx.strokeStyle = "rgba(110,70,30,0.10)";
      offCtx.lineWidth = Math.max(1, height / 500);
      for (let grainIndex = 0; grainIndex < 4; grainIndex++) {
        const grainY = plankTop + random() * plankHeight;
        offCtx.beginPath();
        offCtx.moveTo(0, grainY);
        offCtx.bezierCurveTo(
          width * 0.33,
          grainY + (random() - 0.5) * plankHeight * 0.5,
          width * 0.66,
          grainY + (random() - 0.5) * plankHeight * 0.5,
          width,
          grainY + (random() - 0.5) * plankHeight * 0.3,
        );
        offCtx.stroke();
      }
      offCtx.fillStyle = "rgba(70,40,15,0.45)";
      offCtx.fillRect(0, plankTop + plankHeight - seamWidth, width, seamWidth);
      let jointX = random() * width * 0.6;
      for (; jointX < width;) {
        offCtx.fillRect(jointX, plankTop, seamWidth, plankHeight);
        jointX += width * (0.4 + random() * 0.5);
      }
    }
    floorTextureCache = {
      key: cacheKey,
      c: offscreen,
    };
  }
  ctx.drawImage(floorTextureCache.c, 0, 0);
}
function drawVignette(ctx, width, height) {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height * 0.55,
    Math.min(width, height) * 0.25,
    width / 2,
    height * 0.55,
    Math.max(width, height) * 0.75,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(10,6,2,0.55)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
function drawCanvasLabel(
  ctx,
  text,
  x,
  y,
  mirrored,
  fontSize,
  color,
  weight = 700,
  fontFamily = CANVAS_SANS_FONT,
) {
  ctx.save();
  ctx.translate(x, y);
  if (mirrored) {
    ctx.scale(-1, 1);
  }
  ctx.font = `${weight} ${Math.max(8, Math.round(fontSize))}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
const soundNameFromVocab = (vocab, soundKey) =>
  vocab && vocab.sounds[soundKey] ? vocab.sounds[soundKey].name : soundKey;
function traceShoeOutline(ctx, t, toeWidth, heelWidth) {
  ctx.beginPath();
  ctx.moveTo(0, -0.5 * t);
  ctx.bezierCurveTo(
    heelWidth * 0.55,
    -0.5 * t,
    heelWidth * 0.55,
    -0.32 * t,
    heelWidth * 0.5,
    -0.2 * t,
  );
  ctx.bezierCurveTo(
    heelWidth * 0.45,
    -0.05 * t,
    toeWidth * 0.5,
    0.05 * t,
    toeWidth * 0.5,
    0.2 * t,
  );
  ctx.bezierCurveTo(
    toeWidth * 0.5,
    0.42 * t,
    toeWidth * 0.2,
    0.5 * t,
    0,
    0.5 * t,
  );
  ctx.bezierCurveTo(
    -toeWidth * 0.2,
    0.5 * t,
    -toeWidth * 0.5,
    0.42 * t,
    -toeWidth * 0.5,
    0.2 * t,
  );
  ctx.bezierCurveTo(
    -toeWidth * 0.5,
    0.05 * t,
    -heelWidth * 0.45,
    -0.05 * t,
    -heelWidth * 0.5,
    -0.2 * t,
  );
  ctx.bezierCurveTo(
    -heelWidth * 0.55,
    -0.32 * t,
    -heelWidth * 0.55,
    -0.5 * t,
    0,
    -0.5 * t,
  );
  ctx.closePath();
}
function drawShoeFromAbove(
  ctx,
  x,
  y,
  slideDy,
  unit,
  rotation,
  lift,
  accentColor,
) {
  const shoeLength = 30 * unit;
  const toeWidth = 11.5 * unit;
  const heelWidth = 8.5 * unit;
  ctx.save();
  ctx.translate(x + lift * 1.6 * unit, y + slideDy + 1.6 * unit);
  ctx.rotate(rotation);
  ctx.fillStyle = `rgba(40,22,5,${0.4 - lift * 0.2})`;
  ctx.beginPath();
  ctx.ellipse(
    0,
    0,
    toeWidth * 0.62 * (1 + lift * 0.18),
    shoeLength * 0.54 * (1 + lift * 0.08),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(x, y + slideDy - lift * 2.6 * unit);
  ctx.rotate(rotation);
  const liftScale = 1 + lift * 0.05;
  ctx.scale(liftScale, liftScale);
  const leatherGradient = ctx.createLinearGradient(
    -toeWidth / 2,
    0,
    toeWidth / 2,
    0,
  );
  leatherGradient.addColorStop(0, "#2B2A33");
  leatherGradient.addColorStop(0.45, "#17161C");
  leatherGradient.addColorStop(1, "#0B0B0F");
  traceShoeOutline(ctx, shoeLength, toeWidth, heelWidth);
  ctx.fillStyle = leatherGradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 0.5 * unit;
  ctx.stroke();
  ctx.fillStyle = "#060608";
  ctx.beginPath();
  ctx.ellipse(
    0,
    -0.24 * shoeLength,
    heelWidth * 0.34,
    0.15 * shoeLength,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.3 * unit;
  ctx.lineCap = "round";
  for (let laceIndex = 0; laceIndex < 3; laceIndex++) {
    const laceY = -0.04 * shoeLength + laceIndex * 0.065 * shoeLength;
    ctx.beginPath();
    ctx.moveTo(-toeWidth * 0.22, laceY);
    ctx.lineTo(toeWidth * 0.22, laceY + 0.02 * shoeLength);
    ctx.stroke();
  }
  ctx.strokeStyle = "#D9DDE3";
  ctx.lineWidth = 1.2 * unit;
  ctx.beginPath();
  ctx.ellipse(
    0,
    0.33 * shoeLength,
    toeWidth * 0.47,
    0.17 * shoeLength,
    0,
    0.12 * Math.PI,
    0.88 * Math.PI,
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(
    0,
    -0.36 * shoeLength,
    heelWidth * 0.5,
    0.14 * shoeLength,
    0,
    1.15 * Math.PI,
    1.85 * Math.PI,
  );
  ctx.stroke();
  ctx.restore();
}
export function drawFeetFrontView(
  ctx,
  width,
  height,
  clip,
  beat,
  mirrored,
  vocab,
) {
  drawWoodFloor(ctx, width, height);
  drawVignette(ctx, width, height);
  const unit = height / 100;
  const footAnchors = {
    R: {
      x: width / 2 - 11 * unit,
      y: height * 0.52,
      rot: 0.12,
    },
    L: {
      x: width / 2 + 11 * unit,
      y: height * 0.52,
      rot: -0.12,
    },
  };
  const footStates = {};
  for (let foot of ["R", "L"]) {
    let lastHit = null;
    let nextHit = null;
    for (let footEvent of clip.events)
      if (footEvent.f === foot)
        if (footEvent.b <= beat + 1e-6) lastHit = footEvent;
        else {
          nextHit = footEvent;
          break;
        }
    let slideDy = 0;
    let lift = 0;
    if (lastHit && (lastHit.s === "brush" || lastHit.s === "scuff")) {
      const brushFade = Math.max(0, 1 - (beat - lastHit.b) / 0.6);
      slideDy += 8 * unit * brushFade;
      lift = Math.max(lift, brushFade);
    }
    if (lastHit && lastHit.s === "spank") {
      const spankFade = Math.max(0, 1 - (beat - lastHit.b) / 0.6);
      slideDy -= 6 * unit * spankFade;
      lift = Math.max(lift, spankFade);
    }
    if (nextHit && nextHit.b - beat < 0.3 && nextHit.s !== "heel") {
      lift = Math.max(lift, 1 - (nextHit.b - beat) / 0.3);
    }
    footStates[foot] = {
      dy: slideDy,
      lift,
    };
    drawShoeFromAbove(
      ctx,
      footAnchors[foot].x,
      footAnchors[foot].y,
      slideDy,
      unit,
      footAnchors[foot].rot,
      lift,
      CANVAS_FOOT_COLORS[foot],
    );
    drawCanvasLabel(
      ctx,
      foot === "R" ? "D" : "I",
      footAnchors[foot].x,
      footAnchors[foot].y - 24 * unit,
      mirrored,
      5 * unit,
      CANVAS_FOOT_COLORS[foot],
      800,
    );
  }
  for (let hit of clip.events) {
    const age = beat - hit.b;
    if (age < 0 || age > 0.55) continue;
    const progress = age / 0.55;
    const shoeLength = 30 * unit;
    const contacts =
      hit.s === "stamp"
        ? ["toe", "heel"]
        : ["heel", "dig", "scuff"].includes(hit.s)
          ? ["heel"]
          : ["toe"];
    const anchor = footAnchors[hit.f];
    const footState = footStates[hit.f];
    for (let contact of contacts) {
      const [offsetX, offsetY] = rotatePoint(
        0,
        contact === "toe" ? 0.38 * shoeLength : -0.4 * shoeLength,
        anchor.rot,
      );
      const ringX = anchor.x + offsetX;
      const ringY = anchor.y + footState.dy + offsetY;
      ctx.strokeStyle = `rgba(255,236,190,${(1 - progress) * 0.95})`;
      ctx.lineWidth = (1 - progress) * 1.1 * unit + 0.3 * unit;
      ctx.beginPath();
      ctx.arc(ringX, ringY, (2.5 + progress * 11) * unit, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (age < 0.45) {
      const [labelOffsetX, labelOffsetY] = rotatePoint(
        0,
        contacts[0] === "toe" ? 0.38 * shoeLength : -0.4 * shoeLength,
        anchor.rot,
      );
      const labelY =
        anchor.y +
        footState.dy +
        labelOffsetY +
        (contacts[0] === "toe" ? 1 : -1) * (9 + progress * 5) * unit;
      drawCanvasLabel(
        ctx,
        soundNameFromVocab(vocab, hit.s),
        anchor.x + labelOffsetX + (hit.f === "R" ? -9 : 9) * unit,
        labelY,
        mirrored,
        3.8 * unit,
        `rgba(255,248,232,${1 - progress})`,
        600,
        CANVAS_MONO_FONT,
      );
    }
  }
}
function dancerPositionAt(clip, beat, formations, dancerId) {
  const target = formations[clip.to][dancerId];
  const o =
    clip.from === "entrada" ? [-8, target[1]] : formations[clip.from][dancerId];
  const delay = clip.order ? clip.order.indexOf(dancerId) * clip.stagger : 0;
  const progress = Math.max(0, Math.min(1, (beat - delay) / clip.move));
  const eased = easeInOutQuad(progress);
  return {
    x: o[0] + (target[0] - o[0]) * eased,
    y: o[1] + (target[1] - o[1]) * eased,
    p: progress,
  };
}
export function drawStageView(
  ctx,
  width,
  height,
  clip,
  beat,
  formations,
  myDancerId,
  mirrored,
) {
  drawWoodFloor(ctx, width, height);
  const apronHeight = height * 0.13;
  const wingWidth = width * 0.07;
  const stageLeft = wingWidth;
  const stageWidth = width - 2 * wingWidth;
  const stageHeight = height - apronHeight;
  ctx.fillStyle = "#16120E";
  ctx.fillRect(0, 0, wingWidth, stageHeight);
  ctx.fillRect(width - wingWidth, 0, wingWidth, stageHeight);
  ctx.fillStyle = "rgba(255,240,220,0.06)";
  for (let foldIndex = 1; foldIndex < 4; foldIndex++) {
    ctx.fillRect(
      wingWidth * (foldIndex / 4),
      0,
      Math.max(1, width / 900),
      stageHeight,
    );
    ctx.fillRect(
      width - wingWidth * (foldIndex / 4),
      0,
      Math.max(1, width / 900),
      stageHeight,
    );
  }
  ctx.fillStyle = "#0D0B09";
  ctx.fillRect(0, stageHeight, width, apronHeight);
  const edgeHeight = Math.max(2, height / 180);
  ctx.fillStyle = "#EDE3D2";
  ctx.fillRect(stageLeft, stageHeight - edgeHeight, stageWidth, edgeHeight);
  ctx.save();
  ctx.strokeStyle = "rgba(255,248,235,0.45)";
  ctx.setLineDash([height / 60, height / 60]);
  ctx.lineWidth = Math.max(1, height / 300);
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, stageHeight);
  ctx.stroke();
  ctx.restore();
  [8, 6, 4, 2, 0, 2, 4, 6, 8].forEach((markNumber, markIndex) => {
    const markX = stageLeft + (stageWidth * markIndex) / 8;
    ctx.fillStyle = markNumber === 0 ? "#FFD86B" : "rgba(245,238,225,0.8)";
    ctx.fillRect(
      markX - edgeHeight / 2,
      stageHeight - height * 0.03,
      edgeHeight,
      height * 0.03,
    );
    drawCanvasLabel(
      ctx,
      String(markNumber),
      markX,
      stageHeight + apronHeight * 0.33,
      mirrored,
      apronHeight * 0.27,
      markNumber === 0 ? "#FFD86B" : "rgba(240,230,215,0.8)",
      500,
      CANVAS_MONO_FONT,
    );
  });
  drawCanvasLabel(
    ctx,
    "PÚBLICO",
    width / 2,
    stageHeight + apronHeight * 0.75,
    mirrored,
    apronHeight * 0.2,
    "rgba(240,230,215,0.5)",
    700,
  );
  drawCanvasLabel(
    ctx,
    "FONDO",
    width / 2,
    height * 0.04,
    mirrored,
    apronHeight * 0.18,
    "rgba(60,35,12,0.55)",
    700,
  );
  const dotRadius = Math.min(stageWidth, stageHeight) * 0.055;
  const toCanvas = (pctX, pctY) => [
    stageLeft + (stageWidth * pctX) / 100,
    (stageHeight * pctY) / 100,
  ];
  const drawOrder = [...DANCERS].sort(
    (dancerA, dancerB) =>
      (dancerA.id === myDancerId) - (dancerB.id === myDancerId),
  );
  for (let dancer of drawOrder) {
    const stagePos = dancerPositionAt(clip, beat, formations, dancer.id);
    const [dotX, dotY] = toCanvas(stagePos.x, stagePos.y);
    const isMe = myDancerId === dancer.id;
    const isDimmed = myDancerId && !isMe;
    const isOffstage = stagePos.x < 0;
    ctx.globalAlpha = isOffstage || isDimmed ? 0.55 : 1;
    ctx.fillStyle = "rgba(30,15,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(
      dotX + dotRadius * 0.15,
      dotY + dotRadius * 0.35,
      dotRadius * 1.05,
      dotRadius * 0.7,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    if (isMe) {
      ctx.strokeStyle = "#FF3D8F";
      ctx.lineWidth = dotRadius * 0.32;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius * 1.38, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = dancer.tape;
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(20,12,4,0.5)";
    ctx.lineWidth = Math.max(1, dotRadius * 0.08);
    ctx.stroke();
    drawCanvasLabel(
      ctx,
      dancer.name[0],
      dotX,
      dotY + dotRadius * 0.04,
      mirrored,
      dotRadius * 1.05,
      dancer.ink,
      800,
    );
    if (isMe) {
      drawCanvasLabel(
        ctx,
        "TÚ",
        dotX,
        dotY - dotRadius * 2.1,
        mirrored,
        dotRadius * 0.75,
        "#FF3D8F",
        800,
      );
    }
    ctx.globalAlpha = 1;
  }
}
function footPoseAt(clip, foot, beat) {
  let lastHit = null;
  let nextHit = null;
  for (let footEvent of clip.events)
    if (footEvent.f === foot)
      if (footEvent.b <= beat + 1e-6) lastHit = footEvent;
      else {
        nextHit = footEvent;
        break;
      }
  const pose = {
    lift: 0,
    dx: 0,
    heelUp: 0,
    toeUp: 0,
  };
  if (lastHit) {
    const fadeOut = Math.max(0, 1 - (beat - lastHit.b) / 0.6);
    if (lastHit.s === "brush" || lastHit.s === "scuff") {
      pose.dx += 9 * fadeOut;
      pose.lift = Math.max(pose.lift, 0.5 * fadeOut);
    } else if (lastHit.s === "spank") {
      pose.dx -= 7 * fadeOut;
      pose.lift = Math.max(pose.lift, 0.5 * fadeOut);
    } else if (lastHit.s === "dig") {
      pose.toeUp = Math.max(pose.toeUp, fadeOut);
    }
  }
  if (nextHit) {
    const anticipation = Math.max(0, 1 - (nextHit.b - beat) / 0.3);
    if (nextHit.s === "heel") {
      pose.heelUp = Math.max(pose.heelUp, anticipation);
    } else if (nextHit.s === "toe") {
      pose.toeUp = Math.max(pose.toeUp, anticipation);
    } else if (nextHit.s === "dig") {
      pose.toeUp = Math.max(pose.toeUp, anticipation);
      pose.lift = Math.max(pose.lift, anticipation * 0.6);
    } else {
      pose.lift = Math.max(pose.lift, anticipation);
    }
  }
  return pose;
}
function drawShoeProfile(
  ctx,
  x,
  y,
  unit,
  sizeScale,
  pose,
  accentColor,
  isBackFoot,
) {
  const shoeLength = 34 * unit * sizeScale;
  ctx.save();
  ctx.translate(x + pose.dx * unit, y - pose.lift * 5 * unit);
  if (pose.heelUp > 0) {
    ctx.translate(0.45 * shoeLength, 0);
    ctx.rotate(0.32 * pose.heelUp);
    ctx.translate(-0.45 * shoeLength, 0);
  }
  if (pose.toeUp > 0) {
    ctx.translate(-0.45 * shoeLength, 0);
    ctx.rotate(-0.36 * pose.toeUp);
    ctx.translate(0.45 * shoeLength, 0);
  }
  ctx.fillStyle = isBackFoot ? "#1f1a24" : "#2c2533";
  ctx.beginPath();
  ctx.moveTo(-0.42 * shoeLength, -0.36 * shoeLength);
  ctx.lineTo(-0.16 * shoeLength, -0.4 * shoeLength);
  ctx.lineTo(-0.1 * shoeLength, -3 * shoeLength);
  ctx.lineTo(-0.44 * shoeLength, -3 * shoeLength);
  ctx.closePath();
  ctx.fill();
  const soleGradient = ctx.createLinearGradient(0, -0.42 * shoeLength, 0, 0);
  soleGradient.addColorStop(0, isBackFoot ? "#1b1a20" : "#34333d");
  soleGradient.addColorStop(1, isBackFoot ? "#08080b" : "#0d0d11");
  ctx.fillStyle = soleGradient;
  ctx.beginPath();
  ctx.moveTo(-0.5 * shoeLength, 0);
  ctx.lineTo(0.47 * shoeLength, 0);
  ctx.quadraticCurveTo(
    0.54 * shoeLength,
    -0.02 * shoeLength,
    0.5 * shoeLength,
    -0.1 * shoeLength,
  );
  ctx.quadraticCurveTo(
    0.44 * shoeLength,
    -0.2 * shoeLength,
    0.25 * shoeLength,
    -0.24 * shoeLength,
  );
  ctx.lineTo(0, -0.33 * shoeLength);
  ctx.lineTo(-0.2 * shoeLength, -0.42 * shoeLength);
  ctx.lineTo(-0.44 * shoeLength, -0.38 * shoeLength);
  ctx.quadraticCurveTo(
    -0.54 * shoeLength,
    -0.3 * shoeLength,
    -0.5 * shoeLength,
    0,
  );
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 0.4 * unit;
  ctx.stroke();
  ctx.fillStyle = "#060608";
  ctx.fillRect(
    -0.5 * shoeLength,
    -0.08 * shoeLength,
    0.21 * shoeLength,
    0.08 * shoeLength,
  );
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.1 * unit * sizeScale;
  ctx.lineCap = "round";
  for (let laceIndex = 0; laceIndex < 3; laceIndex++) {
    const laceT = laceIndex / 2;
    const laceX = 0.02 * shoeLength + laceT * 0.16 * shoeLength;
    const laceY = -0.32 * shoeLength + laceT * 0.07 * shoeLength;
    ctx.beginPath();
    ctx.moveTo(laceX - 0.03 * shoeLength, laceY - 0.03 * shoeLength);
    ctx.lineTo(laceX + 0.03 * shoeLength, laceY + 0.02 * shoeLength);
    ctx.stroke();
  }
  ctx.fillStyle = isBackFoot ? "#9aa0a8" : "#D9DDE3";
  ctx.fillRect(
    0.1 * shoeLength,
    -0.005 * shoeLength,
    0.37 * shoeLength,
    0.035 * shoeLength,
  );
  ctx.fillRect(
    -0.49 * shoeLength,
    -0.005 * shoeLength,
    0.19 * shoeLength,
    0.035 * shoeLength,
  );
  ctx.restore();
}
export function drawFeetSideView(
  ctx,
  width,
  height,
  clip,
  beat,
  mirrored,
  vocab,
) {
  const unit = height / 100;
  const floorTop = height * 0.56;
  const wallGradient = ctx.createLinearGradient(0, 0, 0, floorTop);
  wallGradient.addColorStop(0, "#2a2830");
  wallGradient.addColorStop(1, "#3b3742");
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, width, floorTop);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, floorTop * 0.18, width, floorTop * 0.5);
  ctx.fillStyle = "#18161c";
  ctx.fillRect(0, floorTop - 1.6 * unit, width, 1.6 * unit);
  const plankRows = 9;
  for (let row = 0; row < plankRows; row++) {
    const rowTop =
      floorTop + (height - floorTop) * Math.pow(row / plankRows, 1.7);
    const rowBottom =
      floorTop + (height - floorTop) * Math.pow((row + 1) / plankRows, 1.7);
    ctx.fillStyle = FLOOR_PLANK_COLORS[row % FLOOR_PLANK_COLORS.length];
    ctx.fillRect(0, rowTop, width, rowBottom - rowTop + 1);
    ctx.fillStyle = "rgba(70,40,15,0.35)";
    ctx.fillRect(0, rowBottom, width, Math.max(1, height / 400));
  }
  drawVignette(ctx, width, height);
  const feetLayout = [
    {
      f: "L",
      x: width * 0.47,
      y: floorTop + 15 * unit,
      s: 0.88,
      back: true,
    },
    {
      f: "R",
      x: width * 0.53,
      y: floorTop + 27 * unit,
      s: 1,
      back: false,
    },
  ];
  const poses = {};
  for (let footDef of feetLayout) {
    const pose = footPoseAt(clip, footDef.f, beat);
    poses[footDef.f] = pose;
    ctx.fillStyle = `rgba(30,15,0,${0.38 - pose.lift * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(
      footDef.x + pose.dx * unit,
      footDef.y + 0.8 * unit,
      17 * unit * footDef.s * (1 + pose.lift * 0.1),
      2.2 * unit * footDef.s,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    drawShoeProfile(
      ctx,
      footDef.x,
      footDef.y,
      unit,
      footDef.s,
      pose,
      CANVAS_FOOT_COLORS[footDef.f],
      footDef.back,
    );
    drawCanvasLabel(
      ctx,
      footDef.f === "R" ? "D" : "I",
      footDef.x - 24 * unit * footDef.s,
      footDef.y - 4 * unit,
      mirrored,
      4.6 * unit,
      CANVAS_FOOT_COLORS[footDef.f],
      800,
    );
  }
  for (let hit of clip.events) {
    const age = beat - hit.b;
    if (age < 0 || age > 0.55) continue;
    const progress = age / 0.55;
    const hitFoot = feetLayout.find((candidate) => candidate.f === hit.f);
    const hitPose = poses[hit.f];
    const shoeLength = 34 * unit * hitFoot.s;
    const contactOffsets =
      hit.s === "stamp"
        ? [0.3, -0.4]
        : ["heel", "dig", "scuff"].includes(hit.s)
          ? [-0.4]
          : [0.36];
    for (let contactOffset of contactOffsets) {
      const ringX = hitFoot.x + hitPose.dx * unit + contactOffset * shoeLength;
      ctx.strokeStyle = `rgba(255,236,190,${(1 - progress) * 0.95})`;
      ctx.lineWidth = (1 - progress) * 1.1 * unit + 0.3 * unit;
      ctx.beginPath();
      ctx.ellipse(
        ringX,
        hitFoot.y,
        (2.5 + progress * 12) * unit,
        (1 + progress * 4) * unit,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    if (age < 0.45) {
      const labelX =
        hitFoot.x + hitPose.dx * unit + contactOffsets[0] * shoeLength;
      const labelY = hitFoot.back
        ? hitFoot.y - 20 * unit - progress * 4 * unit
        : hitFoot.y + 9 * unit + progress * 3 * unit;
      drawCanvasLabel(
        ctx,
        soundNameFromVocab(vocab, hit.s),
        labelX,
        Math.min(labelY, height - 4 * unit),
        mirrored,
        3.8 * unit,
        `rgba(255,248,232,${1 - progress})`,
        600,
        CANVAS_MONO_FONT,
      );
    }
  }
}
