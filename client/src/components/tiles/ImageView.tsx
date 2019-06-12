import React, { useEffect } from "react";
import Api from "containers/Api";
import Events from "containers/Events";
import { useState } from "@hook-state/core";
import ByteImg from "components/ByteImg";

export default function ImageView({ event }: { event: string }) {
  const events = Events.use();
  const [img, setImg] = useState("");

  useEffect(() => {
    if (events.action.type === event) {
      setImg(events.action.payload);
    }
  }, [events.action]);

  return <div>{img && <ByteImg data={img} className="w-full" />}</div>;
}
