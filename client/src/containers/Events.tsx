import React from "react";
import createContainer, { useState } from "@hook-state/core";
import { useSnackbar } from "notistack";
import { IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DownloadIcon from "@material-ui/icons/VerticalAlignBottomRounded";
import { Action } from "./Api";
import { base64ToBytes, downloadBytes } from "../services/encoding";

const defaults = ["UPDATE_STATE"];
const ignored = ["UPDATE_STATE", "LS"];

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
    const buttons = [
      {
        name: "Save Photo",
        icon: <DownloadIcon />,
        types: ["SCREENSHOT", "WEBCAM_SNAP"],
        onClick: () =>
          downloadBytes([base64ToBytes(action.payload)], action.type + ".jpg")
      },
      {
        name: "Save File",
        icon: <DownloadIcon />,
        types: ["FILE"],
        onClick: () =>
          downloadBytes(
            [base64ToBytes((action.payload as any).bytes)],
            (action.payload as any).path
          )
      }
    ];

    return (
      <>
        {buttons
          .filter(b => b.types.indexOf(action.type) > -1)
          .map(b => (
            <Tooltip key={b.name} title={b.name}>
              <IconButton
                onClick={b.onClick}
                key={b.name}
                color="inherit"
                size="small"
              >
                {b.icon}
              </IconButton>
            </Tooltip>
          ))}
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
    if (action.type !== "PING" && ignored.indexOf(action.type) === -1) {
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
