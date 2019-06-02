import React from "react";
import Table from "./Table";
import Tile from "./Tile";
import { useOnline } from "@hook-state/core";
import State from "../containers/State";

export default function NetworkStatus() {
  const online = useOnline();
  const state = State.use();

  return (
    <div>
      <Tile title="NETWORK">
        <Table
          data={{
            STATE: online ? "ONLINE" : "OFFLINE",
            SERVER: state.connected ? "CONNECTED" : "DISCONNECTED",
            TARGET: state.targetConnected ? "CONNECTED" : "DISCONNECTED"
          }}
        />
      </Tile>
    </div>
  );
}
