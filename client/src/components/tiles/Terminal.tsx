import React, { FormEvent } from "react";
import Api from "containers/Api";
import { useString } from "@hook-state/core";

export default function Terminal() {
  const api = Api.use();
  const input = useString("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    api.send({ type: "EXEC", payload: input.value });
    input.set("");
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        alignItems: "center",
        userSelect: "initial"
      }}
      className="fullflex"
    >
      <input
        spellCheck={false}
        className="terminal-input nodrag"
        type="text"
        {...input.bindToInput}
      />
    </form>
  );
}
