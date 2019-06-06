import React, { useRef, useEffect } from "react";
import Stdout from "containers/Stdout";

export default function TerminalOutput() {
  const stdout = Stdout.use();
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [stdout.value]);

  return (
    <div className="full scrollable">
      {stdout.value.map((cmd, i) => (
        <div key={i}>
          <div>> {cmd.command}</div>
          <div className={`text-${cmd.success ? "darker" : "error"}`}>
            {cmd.output.map((line, j) => (
              <div key={j}>{line}</div>
            ))}
          </div>
          <div ref={bottom} />
        </div>
      ))}
    </div>
  );
}
