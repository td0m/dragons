import React from "react";
import Stdout from "containers/Stdout";

export default function TerminalOutput() {
  const stdout = Stdout.use();
  return (
    <div className="full scrollable">
      {stdout.value.map((cmd, i) => (
        <div key={i}>
          <div>{cmd.command}</div>
          {cmd.output.map((line, j) => (
            <div key={j}>{line}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
