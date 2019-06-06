import React from "react";
import Api from "containers/Api";
import ByteImg from "./ByteImg";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useState } from "@hook-state/core";
import Terminal from "./tiles/Terminal";
import TerminalOutput from "./tiles/TerminalOutput";
import FileExplorer from "./tiles/FileExplorer";
const GridLayout = WidthProvider(Responsive);

export default function Main() {
  const api = Api.use();

  const features = (features: string[]) => {
    for (let f of features) {
      if (api.target.features.indexOf(f) === -1) return false;
    }
    return true;
  };

  const [layouts, setLayouts] = useState<Layout[]>(
    [
      { i: "terminal", x: 1, y: 0, w: 8, h: 1 },
      { i: "terminal-output", x: 1, y: 2, w: 8, h: 3 },
      { i: "file-explorer", x: 1, y: 6, w: 4, h: 8 }
    ]
    // { persist: "layouts" }
  );
  const tiles = [
    { component: <Terminal />, features: ["EXEC"], key: "terminal" },
    {
      component: <TerminalOutput />,
      features: ["EXEC"],
      key: "terminal-output"
    },
    {
      component: <FileExplorer />,
      features: ["FILE", "LS", "REQUEST_FILE"],
      key: "file-explorer"
    }
  ];

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
          {tiles
            .filter(t => features(t.features))
            .map(tile => (
              <div key={tile.key}>{tile.component}</div>
            ))}
        </GridLayout>
      </div>
    </div>
  );
}
