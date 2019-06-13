import React, { FormEvent } from "react";
import Api from "containers/Api";
import { useString } from "@hook-state/core";
import Stdout from "containers/Stdout";
import Tile from "./Tile";

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
    <Tile title="Terminal">
      <form onSubmit={onSubmit} className="flex w-full h-full items-center">
        <input
          spellCheck={false}
          className="w-full bg-transparent nodrag"
          type="text"
          {...input.bindToInput}
        />
      </form>
    </Tile>
  );
}
