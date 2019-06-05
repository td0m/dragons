import React from "react";

import Clock from "components/Clock";
import Divider from "components/Divider";
import NetworkStatus from "components/NetworkStatus";
import TargetView from "components/TargetView";
import Main from "components/Main";
import TopActions from "components/Layout/top/TopActions";
import FeatureList from "components/Layout/left/FeatureList";

const App: React.FC = () => {
  return (
    <div className="grid">
      <div className="top">
        <div className="app-title font-display">DRAGons</div>
        <TopActions />
      </div>
      <div className="left">
        <Clock />
        <Divider />
        <NetworkStatus />
        <Divider />
        <TargetView />
        <FeatureList />
      </div>
      <div className="main">
        <Main />
      </div>
    </div>
  );
};

export default App;
