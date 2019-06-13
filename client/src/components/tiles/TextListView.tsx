import React, { useEffect, useState } from "react";
import Events from "containers/Events";
import Tile from "./Tile";

export default function TextListView({
  event,
  name
}: {
  event: string;
  name: string;
}) {
  const events = Events.use();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (events.action.type === event) {
      setItems(events.action.payload);
    }
  }, [events.action]);

  return (
    <Tile title={name}>
      {items.map((it, i) => (
        <div key={i}>{it}</div>
      ))}
    </Tile>
  );
}
