import React from "react";
import State, { ConnectionState } from "containers/State";
import Divider from "components/Divider";
import Tile from "components/Tile";
import Table from "components/Table";

export default function TargetDetailsView() {
  const { target, connectionState } = State.use();

  if (connectionState !== ConnectionState.TargetConnected) return <div />;

  return (
    <>
      <Divider />
      <Tile title="TARGET DETAILS">
        <Table
          data={{
            NAME: target.name,
            "LOCAL IP": target.localIp
          }}
        />
      </Tile>
    </>
  );
}
