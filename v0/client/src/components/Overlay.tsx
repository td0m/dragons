import React, { Component } from "react";
import styled from "@emotion/styled";

const OverlayRoot = styled("div")`
  position: fixed;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3px);
  transition: all 0.2s ease;
`;

class Overlay extends Component {
  render() {
    return <OverlayRoot {...this.props} />;
  }
}

export default Overlay;
