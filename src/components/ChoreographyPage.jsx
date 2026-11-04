// Choreography detail page: player, stage map, block breakdown, show info.
import { countEights } from "../lib/choreography.js";
import { buildCountSheet } from "../lib/countSheet.js";
import { BlockBreakdown } from "./BlockBreakdown.jsx";
import { NextShowPanel } from "./NextShowPanel.jsx";
import { PracticePlayer } from "./player/PracticePlayer.jsx";
import { RehearsalCountsVideo } from "./RehearsalVideo.jsx";
import { SongSyncPanel } from "./SongSyncPanel.jsx";
import { StageMap } from "./StageMap.jsx";
import { Icon } from "./ui/Icon.jsx";
export function ChoreographyPage({
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
  const hardCount = {};
  for (let dancerHardList of Object.values(hard || {}))
    for (let hardClipId of dancerHardList)
      hardCount[hardClipId] = (hardCount[hardClipId] || 0) + 1;
  const isChoreographer = mode === "coreo";
  const { ranges, clips, music, full } = derived;
  const activeBlockId = ranges[sel.blockId] ? sel.blockId : choreo.blocks[0].id;
  const activeClip =
    [...clips, ...music, full].find((clipOpt) => clipOpt.id === sel.clipId) ||
    music.find((musicOpt) => musicOpt.block === activeBlockId) ||
    music[0];
  const activeBlock = choreo.blocks.find(
    (blockOpt) => blockOpt.id === activeClip.block,
  );
  const blockClips = activeClip.full
    ? clips
    : clips.filter((blockClip) => blockClip.block === activeClip.block);
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
              {" · "}
              {choreo.bpm}
              {" bpm · "}
              {countEights(choreo.blocks)}
              {" ochos"}
            </p>
            <h1 className="f-display mt-1 text-[2.6rem] uppercase leading-[0.9] [text-wrap:balance] sm:text-[3.2rem]">
              {choreo.title}
            </h1>
          </div>
          {isChoreographer && (
            <div
              className="seg seg-sm"
              role="radiogroup"
              aria-label="Quién la ve"
            >
              {[
                ["Borrador", "Borrador"],
                ["En ensayo", "Publicada"],
              ].map(([statusValue, statusLabel]) => (
                <button
                  key={statusValue}
                  type="button"
                  role="radio"
                  aria-checked={choreo.status === statusValue}
                  className="seg-btn"
                  onClick={() => actions.setStatus(statusValue)}
                >
                  {statusLabel}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <NextShowPanel
        choreo={choreo}
        mode={mode}
        me={me}
        onSave={actions.setShow}
        onSaveLogistics={actions.setLogistics}
        onFull={() => actions.playClip(full.id)}
        onClass={() =>
          actions.playClip(full.id, {
            big: true,
          })
        }
        playingFull={activeClip.id === full.id}
        countSheet={() => buildCountSheet(choreo, derived, rhythms, vocab)}
      />
      {isChoreographer && (
        <SongSyncPanel
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
          <PracticePlayer
            clip={activeClip}
            block={activeBlock}
            blockClips={blockClips}
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
          <StageMap
            choreo={choreo}
            ranges={ranges}
            blockId={activeBlockId}
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
          <BlockBreakdown
            choreo={choreo}
            ranges={ranges}
            clips={clips}
            music={music}
            clipId={activeClip.id}
            blockId={activeBlockId}
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
            hardCount={hardCount}
            onToggleHard={actions.toggleHard}
          />
        </section>
      </div>
      {!isChoreographer && (
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <Icon name="check" size={14} />
          Los vídeos que ya has reproducido llevan una marca verde.
        </p>
      )}
      <RehearsalCountsVideo
        key={choreo.id}
        choreo={choreo}
        derived={derived}
        vocab={vocab}
      />
    </>
  );
}
