// 'Quién está al día': hardest steps for the group and per-dancer review progress/'Me cuesta' list (choreographer only).
import { DANCERS } from "../data/dancers.js";
import { listNewForDancer } from "../lib/choreography.js";
import { findDancerById } from "../lib/dancers.js";
import { Icon } from "./ui/Icon.jsx";
export function DancerFollowUp({
  choreos,
  clipsById,
  lastClass,
  seen,
  hard,
  onOpenClip,
}) {
  const allClips = [];
  for (let choreo of choreos)
    for (let clip of clipsById[choreo.id] || [])
      allClips.push({
        choreo,
        clip,
      });
  const findClipEntry = (clipId) =>
    allClips.find((entry) => entry.clip.id === clipId);
  const workedChoreos = choreos.filter(
    (candidate) =>
      lastClass.worked.includes(candidate.id) &&
      candidate.status !== "Borrador",
  );
  const hardCounts = {};
  for (let hardList of Object.values(hard))
    for (let hardClipId of hardList)
      hardCounts[hardClipId] = (hardCounts[hardClipId] || 0) + 1;
  const hardest = Object.entries(hardCounts)
    .sort((entryA, entryB) => entryB[1] - entryA[1])
    .map(([hardId, hardTotal]) => ({
      found: findClipEntry(hardId),
      n: hardTotal,
      who: Object.keys(hard).filter((dancerKey) =>
        hard[dancerKey].includes(hardId),
      ),
    }))
    .filter((row) => row.found)
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
      {hardest.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="f-label">Lo que más cuesta al grupo</p>
          <ul className="flex flex-col gap-1.5">
            {hardest.map(({ found, n, who }) => (
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
                      {" · "}
                      {who
                        .map((whoId) => findDancerById(whoId).name)
                        .join(", ")}
                    </span>
                  </span>
                  <Icon name="arrow" size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="follow-grid">
        {DANCERS.map((dancer) => {
          const wasAbsent = lastClass.absent.includes(dancer.id);
          const catchItems = workedChoreos.flatMap((workedChoreo) =>
            listNewForDancer(
              workedChoreo,
              clipsById[workedChoreo.id] || [],
              dancer.id,
            ),
          );
          const seenCount = catchItems.filter((catchItem) =>
            (seen[dancer.id] || []).includes(catchItem.id),
          ).length;
          const hardClips = (hard[dancer.id] || [])
            .map(findClipEntry)
            .filter(Boolean);
          return (
            <div key={dancer.id} className="follow-row">
              <span
                className="tape-dot"
                style={{
                  background: dancer.tape,
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <b className="text-[14px] font-semibold text-ink">
                    {dancer.name}
                  </b>
                  {wasAbsent ? (
                    <span
                      className={`follow-state ${seenCount >= catchItems.length && catchItems.length ? "is-ok" : "is-todo"}`}
                    >
                      {"Faltó · ha repasado "}
                      {seenCount}
                      {" de "}
                      {catchItems.length}
                    </span>
                  ) : (
                    <span className="follow-state is-ok">Vino a clase</span>
                  )}
                </span>
                {hardClips.length > 0 && (
                  <span className="mt-0.5 block text-[12px] text-muted">
                    {"Le cuesta: "}
                    {hardClips
                      .map((hardEntry) => hardEntry.clip.title)
                      .join(" · ")}
                  </span>
                )}
              </span>
              {wasAbsent && catchItems.length > 0 && (
                <span className="follow-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${(seenCount / catchItems.length) * 100}%`,
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
