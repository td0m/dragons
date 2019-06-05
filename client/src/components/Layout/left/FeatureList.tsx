import React from "react";
import Api, { ConnectionState } from "containers/Api";
import Tile from "components/Tile";
import Divider from "components/Divider";

export default function FeatureList() {
  const { target, connectionState } = Api.use();

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
