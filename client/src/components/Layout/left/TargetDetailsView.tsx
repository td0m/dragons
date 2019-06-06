import React from "react";
import Api, { ConnectionState } from "containers/Api";
import Divider from "components/Divider";
import Section from "components/Section";
import Table from "components/Table";

export default function TargetDetailsView() {
  const { target, connectionState } = Api.use();

  if (connectionState !== ConnectionState.TargetConnected) return <div />;

  return (
    <>
      <Divider />
      <Section title="TARGET DETAILS">
        <Table
          data={{
            NAME: target.name,
            "LOCAL IP": target.localIp,
            IP: target.ip
          }}
        />
      </Section>
    </>
  );
}
