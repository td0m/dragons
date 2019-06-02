import React, { useMemo, useState } from "react";
import "./App.css";

import Clock from "./components/Clock";
import Divider from "./components/Divider";
import NetworkStatus from "./components/NetworkStatus";
import TargetView from "./components/TargetView";
import State from "./containers/State";

class Action {
  constructor(public type: string, public payload?: any) {}
}

const App: React.FC = () => {
  const websocket = useMemo(() => new WebSocket("ws://localhost/ws"), []);
  const [img, setImg] = useState("");

  const state = State.use();

  const send = (action: Action) => {
    websocket.send(JSON.stringify(action));
  };

  const onOpen = () => {
    console.log("OPEN");
    state.setConnected(true);
    send({ type: "CONNECT_CLIENT" });
  };

  const onClose = () => {
    state.setTargetConnected(false);
    state.setConnected(false);
    state.setTargets([]);
  };

  const onMessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    const { type, payload } = data;
    console.log(type);
    switch (type) {
      case "UPDATE_STATE":
        state.setTargets(payload.targets);
        state.setTargetConnected(true);
        send({ type: "CONNECT_TO_TARGET", payload: payload.targets[0] });
        break;
      case "TARGET_CONNECTED":
        send({ type: "SCREENSHOT", payload: "" });
        break;
      case "SCREENSHOT":
        setImg(payload);
        break;
    }
  };

  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;

  return (
    <div className="grid">
      <div className="top">
        <div className="app-title font-display">DRAGons</div>
      </div>
      <div className="left">
        <Clock />
        <Divider />
        <NetworkStatus />
        <Divider />
        <TargetView />
        {img && (
          <img width={200} src={`data:image/png;base64, ${img}`} alt="" />
        )}
      </div>
      <div className="main">main</div>
    </div>
  );
};

export default App;
