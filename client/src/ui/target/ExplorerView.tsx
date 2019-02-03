import React, { Component } from "react";
import ReactJson from "react-json-view";

import Tile from "../../components/Tile";
import { Target } from "../../models/target";

class ExplorerView extends Component<{ target: Target }> {
  render() {
    const { target } = this.props;
    return (
      <Tile title="EXPLORER">
        <ReactJson
          style={{ background: "transparent", fontFamily: "inherit" }}
          displayDataTypes={false}
          src={target}
          indentWidth={2}
          collapseStringsAfterLength={20}
          theme="grayscale"
        />
      </Tile>
    );
  }
}

export default ExplorerView;
