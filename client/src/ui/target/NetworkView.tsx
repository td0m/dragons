import React, { Component } from "react";
import { Target } from "../../models/target";
import Tile from "../../components/Tile";
import Table from "../../components/Table";

export interface NetworkViewProps {
  target: Target;
}

class NetworkView extends Component<NetworkViewProps> {
  render() {
    const { target } = this.props;

    return (
      <Tile title="NETWORK">
        <Table
          data={{
            IP: target.net.publicIP,
            "PRIVATE IP": target.net.privateIP,
            HOSTNAME: target.net.host
          }}
        />
      </Tile>
    );
  }
}

export default NetworkView;
