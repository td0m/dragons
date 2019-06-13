import React from "react";

interface TileProps {
  children: any;
  actions?: any;
  title: string;
}

export default function Tile({ children, actions, title }: TileProps) {
  return (
    <div className="w-full h-full relative">
      <div
        className="w-full flex items-center bg-clay-950 p-2 select-none"
        style={{ height: 25 }}
      >
        <div>{title}</div>
        <div className="flex-1" />
        <div className="nodrag">{actions}</div>
      </div>
      <div
        className="overflow-auto w-full nodrag"
        style={{ height: "calc(100% - 25px)" }}
      >
        {children}
      </div>
    </div>
  );
}
