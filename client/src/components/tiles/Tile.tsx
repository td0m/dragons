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
        className="w-full flex items-center bg-clay-950 p-2"
        style={{ height: 25 }}
      >
        {title}
      </div>
      <div
        className="overflow-auto w-full"
        style={{ height: "calc(100% - 25px)" }}
      >
        {children}
      </div>
    </div>
  );
}
