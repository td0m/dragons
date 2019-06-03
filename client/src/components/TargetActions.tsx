import React from "react";
import State, { ConnectionState } from "../containers/State";
import Tile from "./Tile";
import Divider from "./Divider";

const actions = [
  { name: "Screenshot", action: () => ({ type: "SCREENSHOT" }) },
  { name: "Webcam Picture", action: () => ({ type: "WEBCAM_SNAP" }) },
  { name: "Request file", action: () => ({ type: "SCREENSHOT" }) }
];

export default function TargetActions() {
  const state = State.use();

  if (state.connectionState !== ConnectionState.TargetConnected) {
    return <div />;
  }

  const onClick = (action: any) => {
    state.send(action.action());
  };

  return (
    <>
      <Divider />
      <Tile title="ACTIONS">
        {actions.map(a => (
          <div className="target-item text-darker" onClick={() => onClick(a)} key={a.name}>
            {a.name}
          </div>
        ))}
      </Tile>
    </>
  );
}
