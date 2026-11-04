// One row of a "to review" list: optional number, title, detail line and a state icon.
import { Icon } from "./Icon.jsx";

export function CatchItem({
  num,
  title,
  detail,
  icon = "play",
  seen = false,
  onClick,
}) {
  return (
    <li>
      <button
        type="button"
        className={`catch-item ${seen ? "is-seen" : ""}`}
        onClick={onClick}
      >
        {num != null && <span className="catch-num f-display">{num}</span>}
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-snug text-ink">
            {title}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-muted">
            {detail}
          </span>
        </span>
        <span className="catch-state">
          {seen ? (
            <Icon name="check" size={16} />
          ) : (
            <Icon name={icon} size={14} />
          )}
        </span>
      </button>
    </li>
  );
}
