import createContainer, {
  useState,
  useString,
  useObject
} from "@hook-state/core";
import { useMemo } from "react";
import Events from "./Events";

export enum ConnectionState {
  Connected = "CONNECTED",
  Disconnected = "DISCONNECTED",
  TargetConnected = "TARGET CONNECTED"
}

export class State {
  public constructor(
    public targets: string[] = [],
    public clients: string[] = []
  ) {}
}

export class Action {
  constructor(public type: string, public payload?: any) {}
}

export class TargetDetails {
  public constructor(
    public name: string = "",
    public localIp: string = "",
    public features: string[] = []
  ) {}
}

const useApi = () => {
  const websocket = useMemo(
    // () => new WebSocket("ws://localhost/v1"),
    () => new WebSocket("ws://dragons-cloud.herokuapp.com/v1"),
    []
  );
  const state = useObject<State>(new State());

  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  );
  const [screenshot, setScreenshot] = useState("");
  const [target, setTarget] = useState<TargetDetails>(new TargetDetails());
  const password = useString("");
  const events = Events.use();

  const send = (action: Action) => websocket.send(JSON.stringify(action));

  (window as any).websocket = websocket;

  const onOpen = () => {
    console.log("OPEN");
    setConnectionState(ConnectionState.Connected);
    send({ type: "CONNECT_CLIENT" });
  };

  const onClose = () => {
    setConnectionState(ConnectionState.Disconnected);
    state.set(new State());
  };
  const onMessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    const { type, payload } = data;
    events.add(data);
    switch (type) {
      case "UPDATE_STATE":
        console.log(payload);
        if (Object.keys(payload).length > 0) state.set(payload);
        setConnectionState(ConnectionState.Connected);
        break;
      case "TARGET_CONNECTED":
        setTarget(payload);
        console.log(payload);
        setConnectionState(ConnectionState.TargetConnected);
        break;
      case "TARGET_DISCONNECTED":
        setTarget(new TargetDetails());
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
    send({
      type: "CONNECT_TO_TARGET",
      payload: { id: target, password: password.value }
    });
  };

  return {
    state: state.value,
    connectionState,
    screenshot,
    connectTo,
    send,
    events,
    password,
    target
  };
};

export default createContainer(useApi);
