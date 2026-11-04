// "Tu práctica": last-7-days minutes bar chart and streak.
import { localDateKey } from "../lib/time.js";
const WEEKDAY_INITIALS = ["D", "L", "M", "X", "J", "V", "S"];
export function PracticeStatsPanel({ log }) {
  const days = [];
  const today = new Date();
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - daysAgo,
    );
    days.push({
      d: day,
      key: localDateKey(day),
      secs: (log || {})[localDateKey(day)] || 0,
    });
  }
  const weekSecs = days.reduce((sum, dayEntry) => sum + dayEntry.secs, 0);
  const maxSecs = Math.max(600, ...days.map((entry) => entry.secs));
  let streak = 0;
  for (let dayIdx = days.length - 1; dayIdx >= 0; dayIdx--)
    if (days[dayIdx].secs >= 60) streak++;
    else {
      if (dayIdx === days.length - 1) continue;
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
            {Math.round(weekSecs / 60)}
            {" min"}
          </b>
          {streak > 1 ? ` · ${streak} días seguidos` : ""}
        </p>
      </div>
      <div
        className="pr-chart"
        role="img"
        aria-label={`Minutos practicados los últimos 7 días: ${days.map((dayItem) => Math.round(dayItem.secs / 60)).join(", ")}`}
      >
        {days.map((dayCol, colIdx) => (
          <div
            key={dayCol.key}
            className={`pr-day ${colIdx === days.length - 1 ? "is-today" : ""}`}
          >
            <span className="pr-val tabular-nums">
              {dayCol.secs >= 60 ? Math.round(dayCol.secs / 60) : ""}
            </span>
            <span
              className="pr-bar"
              style={{
                height: `${Math.max(dayCol.secs ? 4 : 0, (dayCol.secs / maxSecs) * 100)}%`,
              }}
            />
            <span className="pr-lab">
              {colIdx === days.length - 1
                ? "hoy"
                : WEEKDAY_INITIALS[dayCol.d.getDay()]}
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
