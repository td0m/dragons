import React, {Component} from 'react';
import Tile from '../../components/Tile';
import Text from '../../components/Text';
import Table from '../../components/Table';
import DotIndicator from '../../components/DotIndicator';

class NetworkStatus extends Component<{online: boolean, targetConnected: boolean}> {
  render() {
    const {online, targetConnected} = this.props;

    return <Tile title="NETWORK STATUS">
    <Table
      flipped
      data={{
        STATE: (
          <div>
            <Text>{online ? "ONLINE" : "OFFLINE"}</Text>
            <DotIndicator value={online} />
          </div>
        ),
        TARGET: (
          <div>
            <Text>
              {targetConnected ? "CONNECTED" : "DISCONNECTED"}
            </Text>
            <DotIndicator value={targetConnected} />
          </div>
        )
      }}
    />
  </Tile>;
  }
}

export default NetworkStatus;