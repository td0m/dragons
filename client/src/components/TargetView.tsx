import React from "react";
import Tile from "./Tile";
import State from "../containers/State";

export default function TargetView() {
  const state = State.use();
  return (
    <Tile title="TARGETS">
      {state.targets.map(t => (
        <div key={t}>{t}</div>
      ))}
    </Tile>
  );
}
