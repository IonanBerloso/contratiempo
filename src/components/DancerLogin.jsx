// 'Entra con tu código' login form with demo code chips for each dancer.
import { useState } from "react";
import { DANCERS } from "../data/dancers.js";
export function DancerLogin({ codes, onLogin }) {
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const tryLogin = (rawCode) => {
    const dancerId = Object.keys(codes).find(
      (candidateId) => codes[candidateId] === rawCode.trim().toUpperCase(),
    );
    if (dancerId) {
      onLogin(dancerId);
    } else {
      setInvalid(true);
    }
  };
  return (
    <section className="panel login">
      <p className="f-label">Estudio en casa · grupo de claqué</p>
      <h1 className="f-display mt-1 text-[2.6rem] uppercase leading-[0.9]">
        Entra con tu código
      </h1>
      <p className="mt-2 text-sm text-muted">
        Te lo da tu profe en clase. Son cuatro letras o números, sin correo ni
        contraseña.
      </p>
      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          tryLogin(code);
        }}
      >
        <label htmlFor="code" className="sr-only">
          Tu código
        </label>
        <input
          id="code"
          className="code-input"
          value={code}
          maxLength={4}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="····"
          onChange={(changeEvent) => {
            setCode(changeEvent.target.value.toUpperCase());
            setInvalid(false);
          }}
        />
        <button type="submit" className="btn btn-primary btn-lg">
          Entrar
        </button>
      </form>
      {invalid && (
        <p
          role="alert"
          className="mt-2 text-[13px] font-semibold text-[color:var(--warn)]"
        >
          Ese código no existe. Revisa las letras o pídeselo a tu profe.
        </p>
      )}
      <div className="demo-hint">
        <p className="f-label">Solo en la demo · códigos de prueba</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DANCERS.map((dancer) => (
            <button
              key={dancer.id}
              type="button"
              className="chip"
              onClick={() => tryLogin(codes[dancer.id])}
            >
              <span
                className="tape-dot"
                style={{
                  background: dancer.tape,
                }}
              />
              {dancer.name}
              <span className="font-mono text-[12px] text-muted">
                {codes[dancer.id]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
