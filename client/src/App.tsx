import React, { useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useEventListener } from "@hook-state/core";

class Action {
  constructor(public type: string, public payload?: any) {}
}

const App: React.FC = () => {
  const websocket = useMemo(() => new WebSocket("ws://localhost/ws"), []);
  const [img, setImg] = useState("");

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
    if (type === "UPDATE_STATE") {
    } else if (type === "TARGET_CONNECTED") {
    }
    switch (type) {
      case "UPDATE_STATE":
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

  useEventListener("open", onOpen, websocket);
  useEventListener("message", onMessage as any, websocket);

  return (
    <div className="App">
      <header className="App-header">
        <img width={200} src={`data:image/png;base64, ${img}`} alt="Red dot" />
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
