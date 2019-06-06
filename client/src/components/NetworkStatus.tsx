import React from "react";
import Table from "./Table";
import Section from "./Section";
import { useOnline } from "@hook-state/core";
import Api, { ConnectionState } from "containers/Api";

export default function NetworkStatus() {
  const online = useOnline();
  const api = Api.use();

  const netstate = (
    <div className="flex -align-c">
      <div>{online ? "ONLINE" : "OFFLINE"}</div>
      <div className={`dot -margin ${online ? "-green" : "-red"}`} />
    </div>
  );

  let connectionColor = "red";
  switch (api.connectionState) {
    case ConnectionState.Connected:
      connectionColor = "yellow";
      break;
    case ConnectionState.TargetConnected:
      connectionColor = "green";
      break;
  }

  const connectionState = (
    <div className="flex -align-c">
      <div>{api.connectionState}</div>
      <div className={`dot -margin -${connectionColor}`} />
    </div>
  );

  return (
    <div>
      <Section title="NETWORK">
        <Table
          data={{
            STATE: netstate,
            SERVER: connectionState,
            CLIENTS: api.state.clients.length
          }}
        />
      </Section>
    </div>
  );
}
