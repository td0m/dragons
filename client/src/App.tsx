import React, { useMemo, useState } from "react";
import "./App.css";

import Clock from "./components/Clock";
import Divider from "./components/Divider";
import NetworkStatus from "./components/NetworkStatus";
import TargetView from "./components/TargetView";
import State, { ConnectionState } from "./containers/State";

const App: React.FC = () => {
  const { screenshot } = State.use();

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
        {screenshot && (
          <img
            width={200}
            src={`data:image/png;base64, ${screenshot}`}
            alt=""
          />
        )}
      </div>
      <div className="main">main</div>
    </div>
  );
};

export default App;
