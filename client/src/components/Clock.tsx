import React, { Component, Fragment } from "react";
import { css } from "emotion";
import { bg, border } from "../colors";
import Divider from "./Divider";

const dottedBackground = (
  bg: string,
  dot: string,
  space: number,
  size: number
) => css`
  background: linear-gradient(90deg, ${bg} ${space - size}px, transparent 1%)
      center,
    linear-gradient(${bg} ${space - size}px, transparent 1%) center, ${dot};
  background-size: ${space}px ${space}px;
`;

const style = css`
  user-select: none;
  display: flex;
  justify-content: center;
  padding: 15px 0 8px;
  font-size: 40px;
  ${dottedBackground(bg, border, 20, 2)}
`;

class Clock extends Component {
  componentDidMount() {
    setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  render() {
    const now = new Date();
    let h = `${now.getHours()}`;
    let m = `${now.getMinutes()}`;
    let s = `${now.getSeconds()}`;
    h = h.length == 1 ? "0" + h : h;
    m = m.length == 1 ? "0" + m : m;
    s = s.length == 1 ? "0" + s : s;

    return (
      <Fragment>
        <Divider />
        <div className={style}>
          <div>
            {h}:{m}:{s}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Clock;
