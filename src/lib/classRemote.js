import { useEffect, useRef, useState } from "react";
import { useClaudeHook } from "./claude.js";
export function useClassScreenRemote(enabled, screenState, onCommand) {
  const room = useClaudeHook("room");
  const myPeerRef = useRef(null);
  const onCommandRef = useRef(onCommand);
  onCommandRef.current = onCommand;
  const [remoteCount, setRemoteCount] = useState(0);
  useEffect(() => {
    if (!room || !enabled) return;
    const offPeers = room.onPeers((peersInfo) => {
      const ownPeer = peersInfo.peers.find((peer) => peer.sameTab);
      if (ownPeer) {
        myPeerRef.current = ownPeer.peer;
      }
      setRemoteCount(
        peersInfo.peers.filter(
          (peer) =>
            !peer.sameTab &&
            peer.presence &&
            peer.presence.remote &&
            peer.presence.remote.to === myPeerRef.current,
        ).length,
      );
    });
    const offCmd = room.on("clase.cmd", (msg) => {
      if (!(!msg.data || msg.data.to !== myPeerRef.current || msg.sameTab)) {
        onCommandRef.current(msg.data);
      }
    });
    return () => {
      offCmd();
      offPeers();
      room
        .presence({
          tv: null,
        })
        .catch(() => {});
      setRemoteCount(0);
    };
  }, [room, enabled]);
  const stateKey = JSON.stringify(screenState);
  useEffect(() => {
    if (room && enabled) {
      room
        .presence({
          tv: screenState,
        })
        .catch(() => {});
    }
  }, [room, enabled, stateKey]);
  return {
    available: !!room,
    remotes: remoteCount,
  };
}
