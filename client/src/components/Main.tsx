import React from "react";
import Api from "containers/Api";
import ByteImg from "./ByteImg";

export default function Main() {
  const api = Api.use();
  return (
    <div>{api.screenshot && false && <ByteImg data={api.screenshot} />}</div>
  );
}
