import React from "react";
import Section from "components/Section";
import { useString } from "@hook-state/core";
import Api from "containers/Api";

export default function ManualAction() {
  const typeInput = useString();
  const payloadInput = useString();

  const api = Api.use();

  const submitManual = () => {
    api.send({ type: typeInput.value, payload: payloadInput.value });
  };

  return (
    <Section title="Manual Action">
      <input
        placeholder="Type"
        className="bg-transparent text-darker w-full"
        {...typeInput.bindToInput}
      />
      <input
        placeholder="Payload"
        className="bg-transparent text-darker w-full"
        {...payloadInput.bindToInput}
      />
      <button className="p-1" onClick={submitManual}>
        Submit
      </button>
    </Section>
  );
}
