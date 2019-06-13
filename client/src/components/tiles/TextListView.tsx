import React, { useEffect, useState, useRef } from "react";
import Events from "containers/Events";
import Tile from "./Tile";
import RefreshIcon from "@material-ui/icons/Refresh";
import Api from "containers/Api";

export default function TextListView({
  event,
  name
}: {
  event: string;
  name: string;
}) {
  const events = Events.use();
  const api = Api.use();
  const [items, setItems] = useState<string[]>([]);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (events.action.type === event) {
      setItems(events.action.payload);
    }
  }, [events.action]);

  const refresh = () => {
    api.send({ type: event });
  };

  useEffect(() => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [items]);

  const actions = (
    <>
      <button
        className="rounded-full hover:bg-clay-500"
        style={{ padding: "3px" }}
      >
        <RefreshIcon onClick={refresh} style={{ fontSize: "1.1rem" }} />
      </button>
    </>
  );

  return (
    <Tile title={name} actions={actions}>
      {items.map((it, i) => (
        <div key={i}>{it}</div>
      ))}
      <div ref={bottom} />
    </Tile>
  );
}
