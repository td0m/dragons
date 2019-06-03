import React from "react";
import { useBoolean } from "@hook-state/core";

interface TileProps {
  title: string;
  children: any;
}

export default function Tile({ title, children }: TileProps) {
  const { value, toggle } = useBoolean(true);
  return (
    <div className="tile">
      <div className="tile-title" onClick={toggle}>
        {title}
      </div>
      {value && <div className="tile-content">{children}</div>}
    </div>
  );
}
