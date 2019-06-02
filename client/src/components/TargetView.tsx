import React from "react";
import Tile from "./Tile";
import State from "../containers/State";

export default function TargetView() {
  const state = State.use();

  const onClick = (t: string) => {
    state.connectTo(t);
  };

  return (
    <Tile title="TARGETS">
      {state.targets.map(t => (
        <div className="target-item" onClick={() => onClick(t)} key={t}>
          {t}
        </div>
      ))}
    </Tile>
  );
}
