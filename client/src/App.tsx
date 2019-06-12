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
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button
} from "@material-ui/core";
import Preview from "containers/Preview";
import ManualAction from "components/Layout/left/ManualAction";

const App: React.FC = () => {
  const api = Api.use();
  const preview = Preview.use();

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
        <ManualAction />
      </div>
      <div className="main">
        {api.connectionState === ConnectionState.TargetConnected && <Main />}
      </div>
      <Dialog
        fullWidth
        maxWidth={"xl"}
        open={!!preview.content}
        onClose={() => preview.setContent(null)}
      >
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>{preview.content}</DialogContent>
        <DialogActions>
          <Button onClick={() => preview.setContent(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
