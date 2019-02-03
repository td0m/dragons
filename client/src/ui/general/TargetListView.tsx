import React, { Component, Fragment } from "react";
import { css } from "emotion";

import Tile from "../../components/Tile";
import Text from "../../components/Text";
import { Target } from "../../models/target";
import DotIndicator from "../../components/DotIndicator";
import { accent, a } from "../../colors";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const targetListItem = css`
  width: 100%;
  user-select: none;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.1s ease;
  padding: 4px 2px;
  border-radius: 2px;
  margin-bottom: 2px;
  :hover {
    background: rgba(${a.r}, ${a.g}, ${a.b}, 0.1);
  }
  :active {
    background: rgba(${a.r}, ${a.g}, ${a.b}, 0.2);
  }
`;

const styles = {
  contextMenu: css`
    min-width: 180px;
    padding: 6px 0;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 4px;
    box-shadow: 0px 0px 8px 2px rgba(255, 255, 255, 0.1);
  `,
  menuItem: css`
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 8px 12px;
    transition: all 0.2s ease;
    :hover {
      background: rgba(255, 255, 255, 0.05);
    }
    :active {
      background: rgba(255, 255, 255, 0.1);
    }
  `,
  menuItemIcon: css`
    margin-right: 8px;
  `
};

const TargetListItem = ({
  target,
  value,
  ...other
}: {
  target?: Target;
  value: string;
  [key: string]: any;
}) => (
  <div
    className={targetListItem}
    style={{ display: "flex", alignItems: "center" }}
    {...other}
  >
    <DotIndicator
      value={target && value === target!.key}
      activeColor={accent}
      inactiveColor="rgba(255,255,255,0.2)"
    />
    <Text>{value}</Text>
  </div>
);

const items = [
  { icon: "fullscreen", name: "SCREENSHOT" },
  { icon: "camera", name: "WEBCAM SNAPSHOT" },
  { icon: "refresh", name: "FORCE RESET" },
];

interface TriggerContextMenuProps {
  onMenu: (action: string) => void;
  id: string;
  [key: string]: any;
}

const TriggerContextMenu = ({
  onMenu,
  id,
  ...props
}: TriggerContextMenuProps) => (
  <ContextMenu id={id} className={styles.contextMenu} {...props}>
    {items.map((item, i) => (
      <MenuItem
        key={i}
        onClick={() => onMenu(item.name)}
        attributes={{ className: styles.menuItem }}
      >
        <i className={`material-icons ${styles.menuItemIcon}`}>{item.icon}</i>
        <Text size="12px">{item.name}</Text>
      </MenuItem>
    ))}
  </ContextMenu>
);

interface TargetListViewState {
  targets: string[];
  target?: Target;
  onMenu: (key: string, action: string) => void;
  onSelect: (key: string) => void;
}

class TargetListView extends Component<TargetListViewState> {
  render() {
    const { targets, target, onSelect, onMenu } = this.props;

    return (
      <Tile title="TARGETS">
        {targets.map((v, i) => (
          <Fragment key={i}>
            <ContextMenuTrigger id={`menu-${i}`}>
              <TargetListItem
                target={target}
                value={v}
                onClick={() => onSelect(v)}
              />
            </ContextMenuTrigger>
            <TriggerContextMenu
              onMenu={action => onMenu(v, action)}
              id={`menu-${i}`}
            />
          </Fragment>
        ))}
      </Tile>
    );
  }
}

export default TargetListView;
