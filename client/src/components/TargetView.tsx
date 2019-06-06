import React, { useState } from "react";
import Section from "./Section";
import Api from "containers/Api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";

export default function TargetView() {
  const api = Api.use();
  const [selected, setSelected] = useState("");

  const onClick = (t: string) => {
    setSelected(t);
  };

  const close = () => setSelected("");

  const connect = () => {
    api.connectTo(selected);
    close();
  };

  const targets = api.state.targets.map(t => (
    <div className="target-item text-darker" onClick={() => onClick(t)} key={t}>
      {t}
    </div>
  ));

  return (
    <>
      <Section title="TARGETS">
        {api.state.targets.length > 0 ? (
          targets
        ) : (
          <div className="text-darker">No targets found.</div>
        )}
      </Section>
      {api.state.targets.length > 0 && (
        <Dialog open={selected.length > 0} onClose={close}>
          <form
            onSubmit={e => {
              e.preventDefault();
              connect();
            }}
          >
            <DialogTitle>Authenticate</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                label="Password"
                type="password"
                {...api.password.bindToInput}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={close}>Cancel</Button>
              <Button variant="contained" color="primary" type="submit">
                Connect
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
}
