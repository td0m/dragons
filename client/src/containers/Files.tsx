import createContainer, { useState } from "@hook-state/core";
import FileOrDirectory from "models/FileOrDirectory";
import { useEffect } from "react";
import Events from "./Events";
import Api, { ConnectionState } from "./Api";

export interface LsResult {
  path?: string;
  files?: FileOrDirectory[];
  valid?: boolean;
}

const useFiles = () => {
  const [files, setFiles] = useState<LsResult>(
    {},
    {
      persist: "files"
    }
  );
  const { action } = Events.use();
  const api = Api.use();

  const cd = (path: string) => api.send({ type: "LS", payload: path });
  const download = (path: string) =>
    api.send({ type: "REQUEST_FILE", payload: path });
  const upload = (path: string, bytes: string) =>
    api.send({ type: "FILE", payload: { path, bytes } });

  useEffect(() => {
    if (action.type === "LS") {
      setFiles(action.payload);
    }
  }, [action]);

  useEffect(() => {
    if (api.connectionState === ConnectionState.TargetConnected) {
      cd("C:/");
    }
  }, [api.connectionState]);

  return { currentDir: files, cd, download, upload };
};

export default createContainer(useFiles);
