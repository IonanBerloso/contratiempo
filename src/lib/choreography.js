import { SAMPLE_CLIPS } from "../data/clips.js";
import { LAST_CLASS_DATE } from "../data/lastClass.js";
import { joinSpanishList, pluralizeCount } from "./format.js";
import { rhythmToLoop } from "./txalaparta.js";
function computeBlockRanges(blocks) {
  const ranges = {};
  let nextEight = 1;
  blocks.forEach((block, index) => {
    ranges[block.id] = {
      start: nextEight,
      end: nextEight + block.len - 1,
      n: index + 1,
    };
    nextEight += block.len;
  });
  return ranges;
}
export function countEights(blocks) {
  return blocks.reduce((sum, block) => sum + block.len, 0);
}
function buildFullChoreoMusic(choreo, ranges, rhythms, instruments) {
  const totalEights = choreo.blocks.reduce((sum, blk) => sum + blk.len, 0);
  return {
    id: `full-${choreo.id}`,
    type: "music",
    full: true,
    block: choreo.blocks[0].id,
    title: `${choreo.title}, entera`,
    angle: "musica",
    bpm: choreo.bpm,
    swing: choreo.swing,
    counts: totalEights * 8,
    eight: 1,
    acapella: [],
    rhythm: null,
    segments: choreo.blocks.map((block) => {
      const blockRhythm =
        block.rhythmId && rhythms
          ? rhythms.find((candidate) => candidate.id === block.rhythmId)
          : null;
      return {
        id: block.id,
        name: block.name,
        start: ranges[block.id].start,
        len: block.len,
        acapella: block.acapella || [],
        rhythm: blockRhythm ? rhythmToLoop(blockRhythm, instruments) : null,
      };
    }),
    events: [],
    spans: [],
    isNew: false,
  };
}
function buildBlockMusic(choreo, block, ranges, rhythms, instruments) {
  const blockRhythm =
    block.rhythmId && rhythms
      ? rhythms.find((candidate) => candidate.id === block.rhythmId)
      : null;
  return {
    id: `m-${block.id}`,
    type: "music",
    block: block.id,
    title: blockRhythm
      ? `${block.name} con el ritmo «${blockRhythm.name}»`
      : `${block.name} con música`,
    angle: "musica",
    bpm: blockRhythm ? blockRhythm.bpm : choreo.bpm,
    swing: blockRhythm ? false : choreo.swing,
    counts: block.len * 8,
    eight: ranges[block.id].start,
    acapella: block.acapella || [],
    rhythm: blockRhythm ? rhythmToLoop(blockRhythm, instruments) : null,
    events: [],
    spans: [],
    isNew: false,
  };
}
export function buildChoreoMedia(
  choreo,
  userClips,
  clipMeta,
  rhythms,
  instruments,
) {
  const ranges = computeBlockRanges(choreo.blocks);
  const allClips = [...SAMPLE_CLIPS, ...userClips];
  const clips = allClips.filter((clip) => ranges[clip.block]);
  for (let link of choreo.links || []) {
    const sourceClip = allClips.find((candidate) => candidate.id === link.src);
    if (sourceClip && ranges[link.block]) {
      clips.push({
        ...sourceClip,
        id: link.id,
        srcId: sourceClip.id,
        block: link.block,
        rel: link.rel || 1,
        isNew: false,
        linked: true,
      });
    }
  }
  const resolvedClips = clips.map((entry) => {
    const meta = clipMeta[entry.id] || {};
    const sourceMeta = entry.srcId ? clipMeta[entry.srcId] || {} : meta;
    return {
      ...entry,
      isNew: meta.isNew != null ? meta.isNew : !!entry.isNew,
      angle: sourceMeta.angle != null ? sourceMeta.angle : entry.angle,
      eight: ranges[entry.block].start + (entry.rel || 1) - 1,
    };
  });
  const music = choreo.blocks.map((block) =>
    buildBlockMusic(choreo, block, ranges, rhythms, instruments),
  );
  return {
    ranges,
    clips: resolvedClips,
    music,
    full: buildFullChoreoMusic(choreo, ranges, rhythms, instruments),
  };
}
export function listNewForDancer(choreo, clips, dancerId) {
  const items = [];
  for (let block of choreo.blocks) {
    if (block.isNew && dancerId && block.personal && block.personal[dancerId]) {
      items.push({
        kind: "note",
        id: `n-${block.id}`,
        block,
        text: block.personal[dancerId],
      });
    }
    for (let clip of clips.filter(
      (candidate) => candidate.block === block.id && candidate.isNew,
    ))
      items.push({
        kind: "clip",
        id: clip.id,
        block,
        clip,
      });
  }
  return items;
}
// What a dancer who missed the last class should review, grouped by choreography and in study
// order. Shared by the "Faltaste…" list and the review bar so both number items the same way.
export function missedClassGroups(choreos, clipsById, lastClass, dancerId) {
  return choreos
    .filter(
      (choreo) =>
        lastClass.worked.includes(choreo.id) && choreo.status !== "Borrador",
    )
    .map((choreo) => ({
      choreo,
      items: listNewForDancer(choreo, clipsById[choreo.id] || [], dancerId),
    }))
    .filter((group) => group.items.length);
}
export function buildClassSummaryMessage(choreos, clipsById, lastClass) {
  const worked = choreos.filter((candidate) =>
    lastClass.worked.includes(candidate.id),
  );
  const lines = [`*Clase ${LAST_CLASS_DATE.long.replace(/^el /, "del ")}*`, ""];
  if (worked.length) {
    lines.push("Hemos trabajado:");
    for (let choreo of worked) {
      const changedBlocks = choreo.blocks
        .filter((u) => u.isNew)
        .map((u) => u.name);
      const newVideoCount = (clipsById[choreo.id] || []).filter(
        (clip) => clip.isNew,
      ).length;
      let line = `• *${choreo.title}*: `;
      line += changedBlocks.length
        ? `hemos cambiado ${joinSpanishList(changedBlocks)}`
        : "repaso, sin cambios";
      if (newVideoCount) {
        line += `. ${pluralizeCount(newVideoCount, "vídeo nuevo", "vídeos nuevos")}`;
      }
      lines.push(`${line}.`);
    }
    lines.push("");
  }
  lines.push(
    "Si faltaste, entra con tu código: verás la lista de lo nuevo en el orden en que conviene estudiarlo.",
  );
  lines.push("Para practicar: con espejo y a 0,75× hasta que salga limpio.");
  lines.push("");
  lines.push("[enlace de la app]");
  return lines.join(`
`);
}
export function buildStepBankIndex(choreos, userClips) {
  const blockIndex = {};
  for (let choreo of choreos)
    for (let block of choreo.blocks)
      blockIndex[block.id] = {
        choreo,
        block,
      };
  return [...SAMPLE_CLIPS, ...userClips]
    .filter((item) => item.type === "feet" || item.type === "upload")
    .filter((entry) => blockIndex[entry.block])
    .map((clip) => {
      const uses = [blockIndex[clip.block]];
      for (let otherChoreo of choreos)
        for (let link of otherChoreo.links || []) {
          if (link.src === clip.id && blockIndex[link.block]) {
            uses.push(blockIndex[link.block]);
          }
        }
      return {
        clip,
        origin: blockIndex[clip.block],
        uses,
      };
    });
}
