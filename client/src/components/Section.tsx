import React from "react";
import { useBoolean } from "@hook-state/core";
import ArrowIcon from "@material-ui/icons/ArrowDropDown";

interface SectionProps {
  title: string;
  children: any;
}

export default function Section({ title, children }: SectionProps) {
  const { value, toggle } = useBoolean(true, { persist: title });
  return (
    <div className="section">
      <div className="flex items-center text-sm" onClick={toggle}>
        <ArrowIcon className={`section-icon mr-1 ${value ? "-closed" : ""}`} />
        <div className="section-title">{title}</div>
      </div>
      {value && <div className="section-content text-xs p-2">{children}</div>}
    </div>
  );
}
