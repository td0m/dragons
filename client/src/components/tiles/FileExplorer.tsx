import React, { useEffect, FormEvent } from "react";
import Files from "containers/Files";
import FileOrDirectory from "models/FileOrDirectory";

import FileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { IconButton } from "@material-ui/core";
import { useString } from "@hook-state/core";

import { useDropzone, DropEvent } from "react-dropzone";

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
      <div
        className="text-darker file-item"
        key={file.name}
        onClick={() => (file.isFile ? download(path) : cd(path))}
      >
        {file.isFile ? <FileIcon /> : <FolderIcon />}
        {file.name}
      </div>
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
    <div
      className={
        "full scrollable droppable " + (isDragActive ? "dropping" : "")
      }
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="file-explorer-nav">
          <IconButton onClick={goBack} color="inherit" size="small">
            <ArrowBackIcon />
          </IconButton>
          <form className="spacer" onSubmit={handleSubmit}>
            <input
              type="text"
              className="terminal-input"
              {...input.bindToInput}
            />
          </form>
        </div>
        <div className="file-explorer-content">
          {currentDir.files && currentDir.files!.map(renderFile)}
        </div>
      </div>
    </div>
  );
}
