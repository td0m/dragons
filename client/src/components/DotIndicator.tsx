import React, { Component } from "react";
import { css } from "emotion";

class DotIndicatorProps {
  value: boolean = false;
  activeColor?: string = "#5eff86";
  inactiveColor?: string = "#f72222";
}

class DotIndicator extends Component<DotIndicatorProps> {
  static defaultProps = new DotIndicatorProps();

  render() {
    const { value, activeColor, inactiveColor, ...other } = this.props;
    const size = 7;
    const style = css`
      margin: 1px 5px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: inline-block;
      background: ${value ? activeColor : inactiveColor};
    `;
    return <div className={style} {...other} />;
  }
}

export default DotIndicator;
