import React from "react";
import "./App.css";

import Clock from "./components/Clock";
import Divider from "./components/Divider";
import NetworkStatus from "./components/NetworkStatus";
import TargetView from "./components/TargetView";
import TargetActions from "./components/TargetActions";
import Main from "./components/Main";

const App: React.FC = () => {
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
        <TargetActions />
      </div>
      <div className="main">
        <Main />
      </div>
    </div>
  );
};

export default App;
