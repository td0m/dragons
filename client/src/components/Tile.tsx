import React from "react";

interface TileProps {
  title: string;
  children: any;
}

export default function Tile({ title, children }: TileProps) {
  return (
    <div className="tile">
      <div className="tile-title">{title}</div>
      <div className="tile-content">{children}</div>
    </div>
  );
}
