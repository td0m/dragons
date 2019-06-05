import React from "react";
import State, { ConnectionState } from "../../../containers/State";
import Tile from "../../Tile";
import Divider from "../../Divider";

export default function FeatureList() {
  const { target, connectionState } = State.use();

  if (connectionState !== ConnectionState.TargetConnected) {
    return <div />;
  }

  return (
    <>
      <Divider />
      <Tile title="FEATURES">
        {target.features.map(name => (
          <div className="text-darker" key={name}>
            {name}
          </div>
        ))}
      </Tile>
    </>
  );
}
