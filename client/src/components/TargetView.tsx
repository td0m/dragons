import React, { useState } from "react";
import Tile from "./Tile";
import State from "../containers/State";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";

export default function TargetView() {
  const state = State.use();
  const [selected, setSelected] = useState("");

  const onClick = (t: string) => {
    setSelected(t);
  };

  const connect = () => {
    state.connectTo(selected);
    setSelected("");
  };

  const targets = state.targets.map(t => (
    <div className="target-item text-darker" onClick={() => onClick(t)} key={t}>
      {t}
    </div>
  ));

  return (
    <>
      <Tile title="TARGETS">
        {state.targets.length > 0 ? (
          targets
        ) : (
          <div className="text-darker">No targets found.</div>
        )}
      </Tile>
      {state.targets.length > 0 && (
        <Dialog open={selected.length > 0}>
          <DialogTitle>Input password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Password"
              {...state.password.bindToInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelected("")}>Cancel</Button>
            <Button onClick={connect}>Connect</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
