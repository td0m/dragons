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
import Preview from "containers/Preview";
import LeftLayout from "components/Layout/left";

const App: React.FC = () => {
  const api = Api.use();
  const preview = Preview.use();

  const connected = api.connectionState === ConnectionState.TargetConnected;

  return (
    <div className="w-screen h-screen bg-clay-500 text-clay-100 font-mono overflow-auto">
      <div
        className="flex items-center pl-4 pr-4 border-b border-clay-400"
        style={{ height: 56 }}
      >
        <div className="font-display text-lg">DRAGons</div>
        <div className="flex-1" />
        {connected && <TopActions />}
      </div>
      <div
        className="flex flex-col md:flex-row"
        style={{ height: "calc(100% - 56px)" }}
      >
        <div className="w-full md:w-64 xs:border-b md:border-r border-clay-400 p-2 md:overflow-auto">
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
