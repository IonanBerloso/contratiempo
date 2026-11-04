// "Próxima función" card on the home screen: countdown to the nearest show.
import { daysLeftLabel, daysUntil, formatShortDate } from "../lib/time.js";
import { Icon } from "./ui/Icon.jsx";
export function UpcomingShowCard({ choreos, onFull }) {
  const upcoming = choreos
    .filter(
      (withShow) =>
        withShow.status !== "Borrador" &&
        withShow.show &&
        daysUntil(withShow.show.date) >= 0,
    )
    .sort(
      (showA, showB) => daysUntil(showA.show.date) - daysUntil(showB.show.date),
    );
  if (!upcoming.length) return null;
  const nextChoreo = upcoming[0];
  const daysLeft = daysUntil(nextChoreo.show.date);
  return (
    <section className="panel show-panel" aria-label="Próxima función">
      <div className="show-main">
        <div
          className={`show-days ${daysLeft <= 14 ? "is-soon" : ""}`}
          aria-hidden="true"
        >
          <span className="f-display">{daysLeft}</span>
          <span className="show-unit">{daysLeft === 1 ? "día" : "días"}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="f-label">
            {"Próxima función · "}
            {nextChoreo.show.name}
            {" · "}
            {formatShortDate(nextChoreo.show.date)}
          </p>
          <p className="mt-1 text-[16px] font-semibold leading-snug text-ink">
            {nextChoreo.title}
            {": "}
            {daysLeftLabel(daysLeft)}.
          </p>
          {upcoming.length > 1 && (
            <p className="mt-1 text-[13px] text-muted">
              {"Después: "}
              {upcoming
                .slice(1)
                .map(
                  (laterChoreo) =>
                    `${laterChoreo.title} (${daysLeftLabel(daysUntil(laterChoreo.show.date))})`,
                )
                .join(" · ")}
            </p>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg show-cta"
          onClick={() => onFull(nextChoreo.id)}
        >
          <Icon name="play" />
          Ensayar entera
        </button>
      </div>
      {nextChoreo.week && (
        <p className="show-week">
          <span className="f-label">Esta semana</span>
          <span>{nextChoreo.week}</span>
        </p>
      )}
    </section>
  );
}
