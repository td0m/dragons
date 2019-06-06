import React, { FormEvent } from "react";
import Api from "containers/Api";
import { useString } from "@hook-state/core";
import Stdout from "containers/Stdout";

export default function Terminal() {
  const api = Api.use();
  const stdout = Stdout.use();
  const input = useString("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    switch (input.value) {
      case "clear":
      case "clean":
      case "cls":
        stdout.set([]);
        break;
      default:
        api.send({ type: "EXEC", payload: input.value });
        break;
    }
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
