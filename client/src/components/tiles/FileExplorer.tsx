import React, { useEffect, FormEvent } from "react";
import Files from "containers/Files";
import FileOrDirectory from "models/FileOrDirectory";

import FileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { IconButton } from "@material-ui/core";
import { useString } from "@hook-state/core";

import { useDropzone, DropEvent } from "react-dropzone";
import Tile from "./Tile";

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      resolve(reader.result as any);
    };
    reader.onerror = reject;
  });
}

function base64ToArrayBuffer(base64: string) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function FileExplorer() {
  const { currentDir, cd, download, upload } = Files.use();
  const input = useString("");

  const getFullPath = (name: string) => currentDir.path! + "/" + name;

  const onDrop = async (files: File[], event: any) => {
    for (let file of files) {
      const str = await getBase64(file);
      const start = str.indexOf(",");
      const base64 = str.slice(start + 1);
      console.log(base64);
      upload(getFullPath(file.name), base64);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onDrop,
    noClick: true
  });

  const renderFile = (file: FileOrDirectory) => {
    const path = getFullPath(file.name);
    return (
      <button
        className="text-darker flex items-center w-full hover:bg-clay-950"
        key={file.name}
        onClick={() => (file.isFile ? download(path) : cd(path))}
      >
        <div className="mr-2">
          {file.isFile ? <FileIcon /> : <FolderIcon />}
        </div>
        {file.name}
      </button>
    );
  };

  useEffect(() => {
    input.set(currentDir.path!);
  }, [currentDir]);

  const goBack = () => {
    let lastIndex = currentDir.path!.lastIndexOf("/");
    if (lastIndex < 0) lastIndex = currentDir.path!.lastIndexOf("\\");
    let newPath = currentDir.path!.slice(0, lastIndex);
    if (newPath.length === 2 && newPath[1] === ":") newPath += "/";
    cd(newPath);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    cd(input.value);
  };

  return (
    <Tile title="File Explorer">
      <div
        className={
          "w-full h-full overflow-auto droppable " +
          (isDragActive ? "dropping" : "")
        }
      >
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="flex items-center bg-clay-950">
            <IconButton onClick={goBack} color="inherit" size="small">
              <ArrowBackIcon />
            </IconButton>
            <form className="w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                className="bg-transparent w-full nodrag"
                {...input.bindToInput}
              />
            </form>
          </div>
          <div className="m-2">
            {currentDir.files && currentDir.files!.map(renderFile)}
          </div>
        </div>
      </div>
    </Tile>
  );
}
