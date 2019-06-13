import React, { useEffect } from "react";
import Events from "containers/Events";
import { useState } from "@hook-state/core";
import ByteImg from "components/ByteImg";
import Tile from "./Tile";

export default function ImageView({
  event,
  name
}: {
  event: string;
  name: string;
}) {
  const events = Events.use();
  const [img, setImg] = useState("");

  useEffect(() => {
    if (events.action.type === event) {
      setImg(events.action.payload);
    }
  }, [events.action]);

  return (
    <Tile title={name}>{img && <ByteImg data={img} className="w-full" />}</Tile>
  );
}
