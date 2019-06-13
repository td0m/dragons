import React from "react";

import Clock from "components/Clock";
import Divider from "components/Divider";
import NetworkStatus from "components/NetworkStatus";
import TargetView from "components/TargetView";
import Main from "components/Main";
import TopActions from "components/Layout/top/TopActions";
import Api, { ConnectionState } from "containers/Api";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button
} from "@material-ui/core";
import LeftLayout from "components/Layout/left";

const App: React.FC = () => {
  const api = Api.use();

  const connected = api.connectionState === ConnectionState.TargetConnected;

  return (
    <div className="w-full min-h-screen h-full bg-clay-500 text-clay-100 font-mono relative flex flex-col">
      <div
        className="flex items-center pl-4 pr-4 border-b border-clay-400 fixed left-0 top-0 w-full bg-clay-500"
        style={{ height: 56, zIndex: 1000 }}
      >
        <div className="font-display text-lg">DRAGons</div>
        <div className="flex-1" />
        {connected && <TopActions />}
      </div>
      <div
        className="flex flex-col md:flex-row flex-1"
        style={{ marginTop: 56 }}
      >
        <div className="w-full md:h-full md:w-64 xs:border-b md:border-r border-clay-400 p-2">
          <Clock />
          <Divider />
          <NetworkStatus />
          <Divider />
          <TargetView />
          {connected && (
            <>
              <LeftLayout />
            </>
          )}
        </div>
        <div className="w-full md:h-full p-2 text-xs">
          {connected && <Main />}
        </div>
      </div>
    </div>
  );
};

export default App;
