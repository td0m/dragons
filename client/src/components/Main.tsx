import React from "react";
import State from "containers/State";
import ByteImg from "./ByteImg";

export default function Main() {
  const state = State.use();
  return (
    <div>
      {state.screenshot && false && <ByteImg data={state.screenshot} />}
    </div>
  );
}
