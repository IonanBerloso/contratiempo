// Two-step button for destructive actions: the first press arms it (red, new label) for 4 s,
// the second press confirms.
import { useEffect, useState } from "react";

export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  className = "",
  children,
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return undefined;
    const timer = setTimeout(() => setArmed(false), 4e3);
    return () => clearTimeout(timer);
  }, [armed]);
  return (
    <button
      type="button"
      className={`btn ${armed ? "btn-warn" : ""} ${className}`}
      onClick={() => {
        setArmed(!armed);
        if (armed) onConfirm();
      }}
    >
      {children}
      {armed ? confirmLabel : label}
    </button>
  );
}
