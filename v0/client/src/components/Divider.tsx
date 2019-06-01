import React, { Component } from "react";
import { border } from "../colors";

class Divider extends Component {
  render() {
    const bg = border;
    const verticalBar = <div style={{ width: 1, height: 8, background: bg }} />;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {verticalBar}
        <div style={{ flexGrow: 1, height: 0.8, background: bg }} />
        {verticalBar}
      </div>
    );
  }
}

export default Divider;
