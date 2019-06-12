import React from "react";

interface TableProps {
  data: { [key: string]: any };
  flipped?: boolean;
}

export default function Table({ data, flipped }: TableProps) {
  if (flipped) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Object.keys(data).map(key => (
          <div key={key} style={{ display: "flex", flexDirection: "column" }}>
            <div className="font-thin text-darker">{key}</div>
            <div>{data[key]}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {Object.keys(data).map(key => (
        <div key={key} className="flex justify-between items-center">
          <div className="text-darker font-thin select-none">{key}</div>
          <div>{data[key]}</div>
        </div>
      ))}
    </div>
  );
}
