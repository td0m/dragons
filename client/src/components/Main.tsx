import React from "react";
import Api from "containers/Api";
import ByteImg from "./ByteImg";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useState } from "@hook-state/core";
import Terminal from "./tiles/Terminal";
import TerminalOutput from "./tiles/TerminalOutput";
const GridLayout = WidthProvider(Responsive);

export default function Main() {
  const api = Api.use();
  var [layouts, setLayouts] = useState<Layout[]>(
    [
      { i: "terminal", x: 1, y: 0, w: 8, h: 1 },
      { i: "terminal-output", x: 1, y: 2, w: 8, h: 3 }
    ]
    // { persist: "layouts" }
  );

  return (
    <div style={{ margin: 20 }}>
      <div>
        <GridLayout
          draggableCancel=".nodrag"
          isDraggable
          isRearrangeable
          isResizable
          className="layout"
          onLayoutChange={a => setLayouts(a)}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={50}
          layouts={{
            lg: layouts
          }}
        >
          <div key="terminal">
            <Terminal />
          </div>
          <div key="terminal-output">
            <TerminalOutput />
          </div>
        </GridLayout>
      </div>
    </div>
  );
}
