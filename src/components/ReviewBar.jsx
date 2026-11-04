// Bottom bar for a dancer going through "Faltaste…": shows where she is in the list and opens
// the next item, so she does not have to go back to the home screen after every video.
import { reviewItemTitle } from "../lib/choreography.js";
import { Icon } from "./ui/Icon.jsx";

export function ReviewBar({ items, pos, onGo, onClose }) {
  if (pos == null || !items[pos]) return null;
  const next = items[pos + 1];
  return (
    <div
      className="review-bar"
      role="region"
      aria-label="Repaso de la última clase"
    >
      <div className="wrap review-bar-row">
        <div className="min-w-0 flex-1">
          <p className="f-label">
            Repaso de la clase · {pos + 1} de {items.length}
          </p>
          <p className="truncate text-[13px] text-ink">
            {next ? (
              <>
                <span className="text-muted">Siguiente: </span>
                {reviewItemTitle(next.item)}
              </>
            ) : (
              "Es lo último que se hizo nuevo."
            )}
          </p>
        </div>
        {next ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onGo(pos + 1)}
          >
            Siguiente
            <Icon name="arrow" size={14} />
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onClose}>
            <Icon name="check" size={14} />
            Terminar
          </button>
        )}
        <button
          type="button"
          className="btn review-bar-close"
          aria-label="Cerrar el repaso"
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}
