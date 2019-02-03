import React, { Component, Fragment } from "react";
import { Target } from "../../models/target";
import Tile from "../../components/Tile";
import Text from "../../components/Text";
import { border, accentLight } from "../../colors";
import IconButton from "../../components/IconButton";

class LoggerView extends Component<{
  log: string[];
  style?: any;
  title: string;
  onClear: () => void;
}> {
  endOfLog = React.createRef<HTMLDivElement>();

  componentDidUpdate() {
    this.endOfLog.current!.scrollIntoView(false);
  }

  render() {
    const { log, style, title, onClear } = this.props;

    return (
      <Tile
        divider={false}
        rawContent={true}
        title={title}
        style={{
          borderRight: `solid 1px ${border}`,
          overflow: "auto",
          color: accentLight,
          padding: "4px 5px",
          ...style
        }}
        actions={
          <Fragment>
            <IconButton onClick={onClear}>
              <i className="material-icons">clear</i>
            </IconButton>
          </Fragment>
        }
      >
        {log.map((l, i) => (
          <Text color="darker" key={i} block>
            {l}
          </Text>
        ))}
        <div ref={this.endOfLog} />
      </Tile>
    );
  }
}

export default LoggerView;
