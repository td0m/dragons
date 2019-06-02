import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useEventListener } from "@hook-state/core";

class Action {
  constructor(public type: string, public payload?: any) {}
}

setTimeout(() => {
  const target = new WebSocket("ws://localhost/ws");
  target.onopen = () => {
    target.send(JSON.stringify({ type: "CONNECT_TARGET" }));
  };
  target.onmessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    console.log(data);
    const { type, payload } = data;
    if (type === "YO_YOU_THERE")
      target.send(JSON.stringify({ type: "YEAH_MAN_WHATS_UP" }));
  };
}, 2000);

const App: React.FC = () => {
  const websocket = useMemo(() => new WebSocket("ws://localhost/ws"), []);

  const send = (action: Action) => {
    websocket.send(JSON.stringify(action));
  };

  const onOpen = () => {
    send({ type: "CONNECT_CLIENT" });
  };

  const onMessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    const { type, payload } = data;
    console.log(type);
    console.log(payload);
    if (type === "UPDATE_STATE") {
      send({ type: "CONNECT_TO_TARGET", payload: payload.targets[0] });
    } else if (type === "TARGET_CONNECTED") {
      send({ type: "YO_YOU_THERE", payload: "Just checking" });
    }
  };

  useEventListener("open", onOpen, websocket);
  useEventListener("message", onMessage as any, websocket);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
