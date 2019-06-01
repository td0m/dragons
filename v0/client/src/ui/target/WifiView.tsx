import React, { Component } from "react";
import { Target } from "../../models/target";
import Tile from "../../components/Tile";
import Table from "../../components/Table";

export interface WifiViewProps {
  target: Target;
}

class WifiView extends Component<WifiViewProps> {
  render() {
    const { target } = this.props;
    const data = Object.keys(target.wifi!)
      .map(name => ({
        [name]: target.wifi![name]
      }))
      .reduce((a, b) => ({ ...a, ...b }), {});

    return (
      <Tile title="WIFI PASSWORDS">
        <Table data={data} />
      </Tile>
    );
  }
}

export default WifiView;
