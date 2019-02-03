import React, { Component, Fragment } from "react";
import { css } from "emotion";
import Text from "./Text";
import Divider from "./Divider";

interface TileProps {
  leading?: any;
  title: string;
  children?: any;
  rawContent?: boolean;
  divider?: boolean;
  actions?: any;
  collapsed?: boolean;
  cillapsible?: boolean;

  [key: string]: any;
}

const styles = {
  root: css`
    padding: 2px 8px;
    text-overflow: clip;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  `,
  content: css`
    padding: 4px 6px;
  `,
  toolbar: css`
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  titleGroup: css`
    display: flex;
    align-items: center;
  `,
};

class Tile extends Component<TileProps> {
  static defaultProps = {
    divider: true,
    collapsible: true
  };

  state = {
    collapsed: false
  };

  componentDidMount() {
    this.setState({ collapsed: this.props.collapsed });
  }

  toggle = () => {
    console.log(this.state.collapsed);
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const {
      title,
      children,
      rawContent,
      divider,
      actions,
      collapsible,
      leading,
      ...other
    } = this.props;

    const { collapsed } = this.state;

    return (
      <Fragment>
        {divider && <Divider />}
        <div className={styles.root} {...other}>
          <div className={styles.toolbar}>
            <div className={styles.titleGroup}>
              {leading && leading}
              <Text
                onClick={collapsible ? this.toggle : null}
                weight={500}
                size="15px"
                style={{ cursor: "pointer" }}
              >
                {title}
              </Text>
            </div>
            {actions && actions}
          </div>
          {(!collapsed || !collapsible) &&
            (rawContent ? (
              children
            ) : (
              <div className={styles.content}>{children}</div>
            ))}
        </div>
      </Fragment>
    );
  }
}

export default Tile;
