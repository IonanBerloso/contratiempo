// 'Bailarinas y códigos': list of dancers with their access code and a button to regenerate it.
import { DANCERS } from "../data/dancers.js";
import { generateAccessCode } from "../lib/accessCodes.js";
export function DancerCodesPanel({ codes, setCodes }) {
  return (
    <section className="panel flex flex-col gap-3 p-4">
      <div>
        <p className="f-label">Acceso de las alumnas</p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Bailarinas y códigos
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">
          Cada una entra solo con su código: sin correo ni datos personales. Así
          sus notas personales solo las ve ella.
        </p>
      </div>
      <ul className="flex flex-col">
        {DANCERS.map((dancer) => (
          <li key={dancer.id} className="code-row">
            <span
              className="tape-dot"
              style={{
                background: dancer.tape,
              }}
            />
            <span className="min-w-0 flex-1 font-semibold text-ink">
              {dancer.name}
            </span>
            <span className="code-chip">{codes[dancer.id]}</span>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() =>
                setCodes((prevCodes) => ({
                  ...prevCodes,
                  [dancer.id]: generateAccessCode(Object.values(prevCodes)),
                }))
              }
              title="El código anterior deja de funcionar"
            >
              Nuevo código
            </button>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-muted">
        Si alguna pierde su código o lo comparte, dale uno nuevo: el anterior
        deja de funcionar.
      </p>
    </section>
  );
}
