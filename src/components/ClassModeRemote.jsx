// The phone "Mando": finds class screens via presence and sends play/pause/restart/rate/flip/block/loop commands on clase.cmd.
import { useEffect, useState } from "react";
import { REMOTE_RATE_OPTIONS } from "../data/playback.js";
import { useClaudeHook } from "../lib/claude.js";
import { Icon } from "./ui/Icon.jsx";
export function ClassModeRemote({ onClose }) {
  const room = useClaudeHook("room");
  const [classScreens, setClassScreens] = useState([]);
  const [pickedPeer, setPickedPeer] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [searchDone, setSearchDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSearchDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (room)
      return room.onPeers((peersInfo) =>
        setClassScreens(
          peersInfo.peers.filter(
            (peer) => !peer.sameTab && peer.presence && peer.presence.tv,
          ),
        ),
      );
  }, [room]);
  const targetScreen =
    classScreens.find((candidate) => candidate.peer === pickedPeer) ||
    (classScreens.length === 1 ? classScreens[0] : null);
  useEffect(() => {
    if (room) {
      room
        .presence({
          remote: targetScreen
            ? {
                to: targetScreen.peer,
              }
            : null,
        })
        .catch(() => {});
    }
  }, [room, targetScreen ? targetScreen.peer : null]);
  useEffect(
    () => () => {
      if (room) {
        room
          .presence({
            remote: null,
          })
          .catch(() => {});
      }
    },
    [room],
  );
  const tvState = targetScreen ? targetScreen.presence.tv : null;
  const sendCommand = (cmd, arg) => {
    if (!(!room || !targetScreen)) {
      setSendError(null);
      room
        .emit("clase.cmd", {
          to: targetScreen.peer,
          cmd,
          arg,
        })
        .catch((err) =>
          setSendError(
            err && err.code === "not_permitted"
              ? "Este aparato no puede mandar órdenes: hace falta permiso de edición en la demo."
              : "No llega la orden. Revisa la conexión.",
          ),
        );
    }
  };
  return (
    <div
      className="rm"
      role="dialog"
      aria-modal="true"
      aria-label="Mando del modo clase"
    >
      <div className="rm-top">
        <div>
          <p className="f-label">Mando</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            {tvState ? tvState.title : "Modo clase"}
          </h2>
        </div>
        <button type="button" className="btn" onClick={onClose}>
          <Icon name="x" />
          Cerrar
        </button>
      </div>
      {room ? (
        targetScreen ? (
          <div className="rm-body">
            <p className="rm-now">
              {tvState.playing ? "Sonando" : "En pausa"}
              {tvState.seg ? ` · ${tvState.seg}` : ""}
              {" · "}
              {String(tvState.rate).replace(".", ",")}×
            </p>
            <div className="rm-main">
              <button
                type="button"
                className="btn btn-icon rm-small"
                onClick={() => sendCommand("restart")}
                aria-label="Desde el principio"
              >
                <Icon name="restart" size={22} />
              </button>
              <button
                type="button"
                className="btn btn-primary rm-play"
                onClick={() => sendCommand(tvState.playing ? "pause" : "play")}
              >
                <Icon name={tvState.playing ? "pause" : "play"} size={30} />
                {tvState.playing ? "Pausa" : "Play"}
              </button>
              <button
                type="button"
                className="btn btn-icon rm-small"
                aria-pressed={!!tvState.flip}
                onClick={() => sendCommand("flip")}
                aria-label="Vista desde el escenario"
              >
                <Icon name="mirror" size={22} />
              </button>
            </div>
            <div className="seg" role="radiogroup" aria-label="Velocidad">
              {REMOTE_RATE_OPTIONS.map(([rate, rateLabel]) => (
                <button
                  key={rate}
                  type="button"
                  role="radio"
                  aria-checked={tvState.rate === rate}
                  className="seg-btn"
                  onClick={() => sendCommand("rate", rate)}
                >
                  {rateLabel}
                </button>
              ))}
            </div>
            {Array.isArray(tvState.segs) && tvState.segs.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="f-label">Ir a un bloque</p>
                {tvState.segs.map((seg) => (
                  <div
                    key={seg.id}
                    className={`rm-seg ${tvState.seg === seg.name ? "is-on" : ""}`}
                  >
                    <button
                      type="button"
                      className="rm-seg-go"
                      onClick={() => sendCommand("block", seg.id)}
                    >
                      {seg.name}
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs"
                      aria-pressed={tvState.loop === seg.id}
                      onClick={() => sendCommand("loop", seg.id)}
                    >
                      <Icon name="loop" size={13} />
                      Repetir
                    </button>
                  </div>
                ))}
              </div>
            )}
            {sendError && (
              <p
                className="text-[13px] font-semibold text-[color:var(--warn)]"
                role="status"
              >
                {sendError}
              </p>
            )}
          </div>
        ) : (
          <div className="rm-empty">
            {classScreens.length > 1 ? (
              <>
                <p>
                  Hay varias pantallas en modo clase. ¿Cuál quieres manejar?
                </p>
                <div className="flex flex-col gap-2">
                  {classScreens.map((tvPeer, idx) => (
                    <button
                      key={tvPeer.peer}
                      type="button"
                      className="btn"
                      onClick={() => setPickedPeer(tvPeer.peer)}
                    >
                      {"Pantalla "}
                      {idx + 1}
                      {": "}
                      {tvPeer.presence.tv.title}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p>
                {searchDone
                  ? "En la tele u ordenador, abre la coreografía y pulsa «Modo clase». Aparecerá aquí sola."
                  : "Buscando pantallas…"}
              </p>
            )}
          </div>
        )
      ) : (
        <p className="rm-empty">
          El mando funciona cuando la demo está abierta desde claude.ai en los
          dos aparatos (este móvil y la tele u ordenador), con la misma cuenta.
        </p>
      )}
    </div>
  );
}
