import React from "react";
import Table from "./Table";
import Section from "./Section";
import { useOnline } from "@hook-state/core";
import Api from "containers/Api";

export default function NetworkStatus() {
  const online = useOnline();
  const api = Api.use();

  return (
    <div>
      <Section title="NETWORK">
        <Table
          data={{
            STATE: online ? "ONLINE" : "OFFLINE",
            SERVER: api.connectionState,
            CLIENTS: api.state.clients.length
          }}
        />
      </Section>
    </div>
  );
}
