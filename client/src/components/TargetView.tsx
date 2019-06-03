import React from "react";
import Tile from "./Tile";
import State from "../containers/State";

export default function TargetView() {
  const state = State.use();

  const onClick = (t: string) => {
    state.connectTo(t);
  };

  const targets = state.targets.map(t => (
    <div className="target-item text-darker" onClick={() => onClick(t)} key={t}>
      {t}
    </div>
  ));  

  return (
    <Tile title="TARGETS">
      {state.targets.length > 0 ? targets : <div className="text-darker">No targets found.</div>}
    </Tile>
  );
}
