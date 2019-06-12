import React from "react";
import Api, { ConnectionState } from "containers/Api";
import Section from "components/Section";

export default function FeatureList() {
  const { target, connectionState } = Api.use();

  if (connectionState !== ConnectionState.TargetConnected) {
    return <div />;
  }

  return (
    <>
      <Section title="FEATURES">
        {target.features.map(name => (
          <div className="text-darker" key={name}>
            {name}
          </div>
        ))}
      </Section>
    </>
  );
}
