// The 5-6-7-8 count-in row (lights the current pickup beat), shared by the video HUD and the music board.
export function CountInBeats({ beat }) {
  const activeSlot = Math.floor(beat + 1e-6) + 4;
  return (
    <div className="hud-countin">
      {[5, 6, 7, 8].map((countNumber, slotIdx) => (
        <span
          key={countNumber}
          className={slotIdx === activeSlot ? "is-on" : ""}
        >
          {countNumber}
        </span>
      ))}
    </div>
  );
}
