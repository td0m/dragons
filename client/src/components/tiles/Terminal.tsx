import React, { FormEvent } from "react";
import Api from "containers/Api";
import { useString } from "@hook-state/core";

export default function Terminal() {
  const api = Api.use();
  const input = useString("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    api.send({ type: "EXEC", payload: input.value });
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        alignItems: "center"
      }}
      className="fullflex"
    >
      <input className="terminal-input" type="text" {...input.bindToInput} />
    </form>
  );
}
