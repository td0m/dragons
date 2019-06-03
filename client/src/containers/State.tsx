import createContainer, { useState } from "@hook-state/core";
import { useMemo } from "react";

export enum ConnectionState {
  Connected = "CONNECTED",
  Disconnected = "DISCONNECTED",
  TargetConnected = "TARGET CONNECTED"
}

export class Action {
  constructor(public type: string, public payload?: any) {}
}

const useDragonsState = () => {
  const websocket = useMemo(
    () => new WebSocket("ws://dragons-cloud.herokuapp.com/v1"),
    []
  );
  const [targets, setTargets] = useState([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  );
  const [screenshot, setScreenshot] = useState("");

  const send = (action: Action) => websocket.send(JSON.stringify(action));

  const onOpen = () => {
    console.log("OPEN");
    setConnectionState(ConnectionState.Connected);
    send({ type: "CONNECT_CLIENT" });
  };

  const onClose = () => {
    setConnectionState(ConnectionState.Disconnected);
    setTargets([]);
  };

  const onMessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    const { type, payload } = data;
    console.log(type);
    switch (type) {
      case "UPDATE_STATE":
        setTargets(payload.targets);
        setConnectionState(ConnectionState.Connected);
        break;
      case "TARGET_CONNECTED":
        setConnectionState(ConnectionState.TargetConnected);
        break;
      case "TARGET_DISCONNECTED":
        setConnectionState(ConnectionState.Connected);
        break;
      case "SCREENSHOT":
        setScreenshot(payload);
        break;
      case "WEBCAM_SNAP":
        setScreenshot(payload);
        break;
      case "FILE":
        setScreenshot(payload.bytes);
        break;
    }
  };

  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
  websocket.onerror = console.log;

  const connectTo = (target: string) => {
    send({ type: "CONNECT_TO_TARGET", payload: target });
  };

  return {
    targets,
    connectionState,
    screenshot,
    connectTo,
    send
  };
};

export default createContainer(useDragonsState);
