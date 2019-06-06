import React from "react";

import Clock from "components/Clock";
import Divider from "components/Divider";
import NetworkStatus from "components/NetworkStatus";
import TargetView from "components/TargetView";
import Main from "components/Main";
import TopActions from "components/Layout/top/TopActions";
import FeatureList from "components/Layout/left/FeatureList";
import TargetDetailsView from "components/Layout/left/TargetDetailsView";
import Api, { ConnectionState } from "containers/Api";

const App: React.FC = () => {
  const api = Api.use();

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
        <TargetDetailsView />
        <FeatureList />
      </div>
      <div className="main">
        {api.connectionState === ConnectionState.TargetConnected && <Main />}
      </div>
    </div>
  );
};

export default App;
