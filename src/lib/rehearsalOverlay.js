const overlayStepName = (vocab, stepKey) =>
  vocab.steps[stepKey] ? vocab.steps[stepKey].name : stepKey;
export const medianOf = (values) => {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
};
export function countOverlayAtTime(time, timing, choreo, ranges, clips, vocab) {
  if (timing.offset == null) return null;
  const beatPos = ((time - timing.offset) * timing.bpm) / 60;
  if (beatPos < -4) return null;
  if (beatPos < 0)
    return {
      pre: true,
      count: Math.floor(beatPos) + 9,
    };
  const eightIdx = Math.floor(beatPos / 8);
  const totalEights = choreo.blocks.reduce((sum, blk) => sum + blk.len, 0);
  if (eightIdx >= totalEights)
    return {
      end: true,
    };
  const currentBlock = choreo.blocks.find((candidateBlock) => {
    const blockRange = ranges[candidateBlock.id];
    return (
      blockRange &&
      eightIdx >= blockRange.start - 1 &&
      eightIdx < blockRange.end
    );
  });
  const currentRange = currentBlock ? ranges[currentBlock.id] : null;
  const countNum = (Math.floor(beatPos + 1e-6) % 8) + 1;
  const isHalf = beatPos - Math.floor(beatPos) >= 0.5;
  let stepName = null;
  const feetClip = clips
    .filter(
      (clip) =>
        clip.type === "feet" &&
        eightIdx >= clip.eight &&
        eightIdx < clip.eight + Math.ceil(clip.counts / 8),
    )
    .sort((clipA, clipB) => clipB.bpm - clipA.bpm)[0];
  if (feetClip) {
    const beatInClip = beatPos - feetClip.eight * 8;
    const lastSpan = feetClip.spans
      .filter((span) => span.from <= beatInClip + 0.05)
      .pop();
    if (lastSpan && beatInClip - lastSpan.to < 1.5) {
      stepName = overlayStepName(vocab, lastSpan.key);
    }
  }
  return {
    count: countNum,
    half: isHalf,
    eight: eightIdx + 1,
    total: totalEights,
    block: currentBlock ? currentBlock.name : "",
    inBlock: currentRange
      ? `${eightIdx - (currentRange.start - 1) + 1} de ${currentRange.end - currentRange.start + 1}`
      : "",
    formation: currentBlock ? currentBlock.formation : "",
    step: stepName,
  };
}
function traceRoundRect(ctx, rectX, rectY, rectW, rectH, radius) {
  ctx.beginPath();
  ctx.moveTo(rectX + radius, rectY);
  ctx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + rectH, radius);
  ctx.arcTo(rectX + rectW, rectY + rectH, rectX, rectY + rectH, radius);
  ctx.arcTo(rectX, rectY + rectH, rectX, rectY, radius);
  ctx.arcTo(rectX, rectY, rectX + rectW, rectY, radius);
  ctx.closePath();
}
export function drawCountOverlay(ctx, canvasW, canvasH, info) {
  if (!info) return;
  const unit = Math.max(canvasW, canvasH) / 100;
  ctx.save();
  ctx.textBaseline = "middle";
  const fontSpec = (weight, px) =>
    `${weight} ${Math.round(px)}px Archivo, "Arial Narrow", system-ui, sans-serif`;
  if (info.end) {
    ctx.restore();
    return;
  }
  const badgeW = unit * 13;
  const badgeH = unit * 13;
  const badgeX = canvasW - badgeW - unit * 2;
  const badgeY = canvasH - badgeH - unit * 2;
  if (
    ((ctx.fillStyle = info.pre ? "rgba(20,22,28,0.72)" : "rgba(43,63,207,0.9)"),
    traceRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, unit * 1.6),
    ctx.fill(),
    (ctx.fillStyle = "#fff"),
    (ctx.textAlign = "center"),
    (ctx.font = fontSpec(800, badgeH * 0.72)),
    ctx.fillText(
      String(info.count),
      badgeX + badgeW / 2,
      badgeY + badgeH * 0.53,
    ),
    info.half &&
      !info.pre &&
      ((ctx.font = fontSpec(700, badgeH * 0.2)),
      ctx.fillText("y", badgeX + badgeW * 0.86, badgeY + badgeH * 0.2)),
    !info.pre)
  ) {
    const dotStep = badgeW / 8;
    ctx.fillStyle = "rgba(20,22,28,0.72)";
    traceRoundRect(
      ctx,
      badgeX,
      badgeY - unit * 2.4,
      badgeW,
      unit * 2.4 - unit * 0.4,
      unit * 1,
    );
    ctx.fill();
    for (let dotIdx = 0; dotIdx < 8; dotIdx++) {
      ctx.fillStyle = dotIdx < info.count ? "#fff" : "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(
        badgeX + dotStep * (dotIdx + 0.5),
        badgeY - unit * 1.4,
        unit * 0.42,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  ctx.textAlign = "left";
  const headline = info.pre ? "Preparadas…" : info.block;
  const subline = info.pre
    ? ""
    : `Ocho ${info.inBlock}${info.formation ? ` · ${info.formation}` : ""}`;
  ctx.font = fontSpec(800, unit * 3.4);
  const headlineW = ctx.measureText(headline.toUpperCase()).width;
  ctx.font = fontSpec(500, unit * 2);
  const sublineW = subline ? ctx.measureText(subline).width : 0;
  const labelBoxW = Math.max(headlineW, sublineW) + unit * 3;
  const labelBoxH = subline ? unit * 8.2 : unit * 5.4;
  if (
    ((ctx.fillStyle = "rgba(20,22,28,0.72)"),
    traceRoundRect(ctx, unit * 2, unit * 2, labelBoxW, labelBoxH, unit * 1.2),
    ctx.fill(),
    (ctx.fillStyle = "#fff"),
    (ctx.font = fontSpec(800, unit * 3.4)),
    ctx.fillText(headline.toUpperCase(), unit * 3.5, unit * 2 + unit * 2.8),
    subline &&
      ((ctx.fillStyle = "rgba(255,255,255,0.82)"),
      (ctx.font = fontSpec(500, unit * 2)),
      ctx.fillText(subline, unit * 3.5, unit * 2 + unit * 6.1)),
    info.step && !info.pre)
  ) {
    ctx.font = fontSpec(700, unit * 2.8);
    const stepPillW = ctx.measureText(info.step).width + unit * 3;
    ctx.fillStyle = "rgba(228,238,50,0.95)";
    traceRoundRect(
      ctx,
      unit * 2,
      canvasH - unit * 2 - unit * 5,
      stepPillW,
      unit * 5,
      unit * 1.2,
    );
    ctx.fill();
    ctx.fillStyle = "#1a1c0e";
    ctx.fillText(info.step, unit * 3.5, canvasH - unit * 2 - unit * 2.5);
  }
  ctx.restore();
}
export function pickRecorderMimeType() {
  return typeof MediaRecorder == "undefined"
    ? null
    : [
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ].find(
        (mime) =>
          MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mime),
      ) || "";
}
