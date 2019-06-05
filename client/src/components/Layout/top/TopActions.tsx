import React from "react";
import State, { ConnectionState } from "containers/State";
import { IconButton } from "@material-ui/core";

import FullscreenIcon from "@material-ui/icons/Fullscreen";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

const actions = [
  {
    name: "SCREENSHOT",
    action: () => ({ type: "SCREENSHOT" }),
    icon: <FullscreenIcon />
  },
  {
    name: "WEBCAM_SNAP",
    action: () => ({ type: "WEBCAM_SNAP" }),
    icon: <PhotoCameraIcon />
  }
];

export default function TopActions() {
  const state = State.use();

  const supported = (action: any): boolean =>
    state.target.features.indexOf(action.name) > -1;

  if (state.connectionState !== ConnectionState.TargetConnected) {
    return <div />;
  }

  const onClick = (action: any) => {
    state.send(action.action());
  };

  console.log(state.target);

  return (
    <div style={{ display: "flex" }} className="text-darker">
      {actions.filter(supported).map(a => (
        <IconButton
          color="inherit"
          size="small"
          onClick={() => onClick(a)}
          key={a.name}
        >
          {a.icon}
        </IconButton>
      ))}
    </div>
  );
}
