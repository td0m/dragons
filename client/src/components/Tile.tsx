import React from "react";
import { useBoolean } from "@hook-state/core";
import ArrowIcon from "@material-ui/icons/ArrowDropDown";

interface TileProps {
  title: string;
  children: any;
}

export default function Tile({ title, children }: TileProps) {
  const { value, toggle } = useBoolean(true, { persist: title });
  return (
    <div className="tile">
      <div className="tile-titlenav" onClick={toggle}>
        <ArrowIcon className={`tile-icon ${value ? "-closed" : ""}`} />
        <div className="tile-title">{title}</div>
      </div>
      {value && <div className="tile-content">{children}</div>}
    </div>
  );
}
