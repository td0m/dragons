import React, { Component } from "react";
import { Target } from "../../models/target";
import Tile from "../../components/Tile";
import Table from "../../components/Table";

export interface DeviceViewProps {
  target: Target;
}

class DeviceView extends Component<DeviceViewProps> {
  render() {
    const { target } = this.props;

    return (
      <Tile title="DEVICE">
        <Table data={{ CPU: target.hardware!.cpu }} />
      </Tile>
    );
  }
}

export default DeviceView;
