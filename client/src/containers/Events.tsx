import React from "react";
import createContainer, { useState } from "@hook-state/core";
import { useSnackbar } from "notistack";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import DownloadIcon from "@material-ui/icons/VerticalAlignBottomRounded";
import { Action } from "./Api";
import { base64ToBytes, downloadBytes } from "../services/encoding";

const defaults = ["UPDATE_STATE"];

const getVariant = (type: string): "default" | "info" | "error" | "success" => {
  if (type === "TARGET_DISCONNECTED") return "error";
  if (type === "TARGET_CONNECTED") return "success";
  if (defaults.indexOf(type) > -1) return "default";
  return "info";
};

const useEvents = () => {
  const snackbar = useSnackbar();
  const [action, setAction] = useState<Action>({ type: "" });

  const createAction = (action: Action) => (key: string) => {
    const download = (
      <IconButton
        size="small"
        color="inherit"
        onClick={() =>
          downloadBytes([base64ToBytes(action.payload)], "frame.jpg")
        }
      >
        <DownloadIcon />
      </IconButton>
    );
    const screenshotFullscreen = (
      <IconButton size="small" color="inherit">
        <FullscreenIcon />
      </IconButton>
    );

    return (
      <>
        {action.type === "SCREENSHOT" && screenshotFullscreen}
        {(action.type === "SCREENSHOT" || action.type === "WEBCAM_SNAP") &&
          download}
        <IconButton
          size="small"
          color="inherit"
          onClick={() => snackbar.closeSnackbar(key)}
        >
          <CloseIcon />
        </IconButton>
      </>
    );
  };

  const add = (action: Action) => {
    setAction(action);
    if (action.type !== "PING" && action.type !== "UPDATE_STATE") {
      snackbar.enqueueSnackbar(action.type, {
        variant: getVariant(action.type),
        action: createAction(action),
        autoHideDuration: 4000
      });
    }
  };

  return {
    add,
    action
  };
};

export default createContainer(useEvents);
