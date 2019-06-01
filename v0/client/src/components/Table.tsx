import React, { Component } from "react";
import Text from "./Text";

interface TableProps {
  data: { [key: string]: any };
  flipped?: boolean;
}

class Table extends Component<TableProps> {
  render() {
    const { data, flipped } = this.props;

    if (flipped)
      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {Object.keys(data).map(key => (
            <div key={key} style={{ display: "flex", flexDirection: "column" }}>
              <Text color="darker" weight={300}>
                {key}
              </Text>
              <Text>{data[key]}</Text>
            </div>
          ))}
        </div>
      );

    return (
      <div>
        {Object.keys(data).map(key => (
          <div
            key={key}
            style={{
              padding: "2px 2px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Text color="darker" weight={300} style={{userSelect: "none"}}>
              {key}
            </Text>
            <Text>{data[key]}</Text>
          </div>
        ))}
      </div>
    );
  }
}

export default Table;