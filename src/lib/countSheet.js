import { DANCERS } from "../data/dancers.js";
import { countEights } from "./choreography.js";
import { stageDepthLabel, stageNumberLabel } from "./stage.js";
import { formatShortDate } from "./time.js";
const escapeHtml = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const sheetStepName = (vocab, stepKey) =>
  vocab && vocab.steps[stepKey] ? vocab.steps[stepKey].name : stepKey;
function feetClipForEight(clips, eight) {
  return clips
    .filter(
      (clip) =>
        clip.type === "feet" &&
        eight >= clip.eight &&
        eight < clip.eight + Math.ceil(clip.counts / 8),
    )
    .sort((clipA, clipB) => clipB.bpm - clipA.bpm)[0];
}
export function buildCountSheet(choreo, derived, rhythms, vocab) {
  const { ranges, clips, music } = derived;
  const blockSections = [];
  for (let block of choreo.blocks) {
    const range = ranges[block.id];
    const blockMusic = music.find((musicClip) => musicClip.block === block.id);
    const blockRhythm = blockMusic && blockMusic.rhythm;
    const rows = [];
    for (let eightIdx = 0; eightIdx < block.len; eightIdx++) {
      const eightNum = range.start + eightIdx;
      const countCells = Array.from(
        {
          length: 8,
        },
        () => [],
      );
      const feetClip = feetClipForEight(clips, eightNum);
      if (feetClip) {
        const countOffset = (eightNum - feetClip.eight) * 8;
        for (let span of feetClip.spans) {
          if (
            span.from < countOffset - 1e-6 ||
            span.from >= countOffset + 8 - 1e-6
          )
            continue;
          const relCount = span.from - countOffset;
          const countSlot = Math.floor(relCount + 1e-6);
          const fraction = relCount - countSlot;
          countCells[countSlot].push(
            `${fraction > 0.4 && fraction < 0.6 ? "y " : fraction > 1e-6 ? "· " : ""}${sheetStepName(vocab, span.key)}`,
          );
        }
      } else if (blockRhythm && blockRhythm.moves.some(Boolean))
        for (let beatIdx = 0; beatIdx < 8; beatIdx++) {
          const move =
            blockRhythm.moves[(eightIdx * 8 + beatIdx) % blockRhythm.loopBeats];
          if (move) {
            countCells[beatIdx].push(move);
          }
        }
      const stageClip = clips.find(
        (stageCandidate) =>
          stageCandidate.type === "stage" &&
          eightNum >= stageCandidate.eight &&
          eightNum <
            stageCandidate.eight + Math.ceil(stageCandidate.counts / 8),
      );
      rows.push(
        `<tr><th scope="row">${eightNum}</th>${countCells.map((cellSteps) => `<td>${escapeHtml(cellSteps.join(", "))}</td>`).join("")}<td class="note">${stageClip ? escapeHtml(stageClip.title) : ""}</td></tr>`,
      );
    }
    const marks = choreo.formations[block.id] || {};
    const marksText = DANCERS.filter((dancer) => marks[dancer.id])
      .map(
        (markedDancer) =>
          `${escapeHtml(markedDancer.name)}: ${escapeHtml(stageNumberLabel(marks[markedDancer.id]))}, ${escapeHtml(stageDepthLabel(marks[markedDancer.id][1]))}`,
      )
      .join(" · ");
    blockSections.push(`
<section class="block">
  <h2>${range.n}. ${escapeHtml(block.name)} <small>${range.start === range.end ? `Ocho ${range.start}` : `Ochos ${range.start}–${range.end}`} · ${escapeHtml(block.formation)}${blockRhythm ? ` · txalaparta «${escapeHtml(blockRhythm.name)}»` : ""}</small></h2>
  ${block.notes ? `<p class="notes">${escapeHtml(block.notes)}</p>` : ""}
  <table>
    <thead><tr><th>Ocho</th>${[1, 2, 3, 4, 5, 6, 7, 8].map((countNum) => `<th>${countNum}</th>`).join("")}<th>Desplazamiento</th></tr></thead>
    <tbody>${rows.join("")}</tbody>
  </table>
  <p class="marks"><b>Marcas:</b> ${marksText}</p>
</section>`);
  }
  const showLine = choreo.show
    ? `${escapeHtml(choreo.show.name)} · ${escapeHtml(formatShortDate(choreo.show.date))} · `
    : "";
  const documentHtml = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hoja de cuentas · ${escapeHtml(choreo.title)}</title>
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
<h1>${escapeHtml(choreo.title)}</h1>
<p class="meta">${showLine}${choreo.bpm} bpm · ${countEights(choreo.blocks)} ochos · hoja de cuentas generada con Contratiempo</p>
${blockSections.join(`
`)}
</body>
</html>`;
  return {
    filename: `hoja-de-cuentas-${(choreo.title || "coreografia")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase()}.html`,
    html: documentHtml,
  };
}
