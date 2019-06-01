import React, { Component, CSSProperties } from "react";
import { css } from "emotion";
import { FontWeightProperty, FontSizeProperty } from "csstype";
import { accentLight, accent } from "../colors";

interface TextProps {
  color?: "default" | "darker";
  weight?: FontWeightProperty;
  size?: FontSizeProperty<0>;
  type?: "text";
  font?: string;
  block?: boolean;

  style?: CSSProperties;
  [key: string]: any;
}

class Text extends Component<TextProps> {
  static defaultProps = {
    color: "default",
    type: "text"
  };

  render() {
    const { color, weight, type, font, size, block, ...other } = this.props;
    let c = accent;
    if (color == "darker") c = accentLight;

    const style = css`
      display: ${block ? "block" : "inline-block"};
      color: ${c};
      font-weight: ${weight};
      font-family: ${font};
      font-size: ${size};
    `;
    return <div className={style} {...other} />;
  }
}

export default Text;