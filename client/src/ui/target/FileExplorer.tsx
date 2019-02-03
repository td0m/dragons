import React, { Component } from "react";
import { DirectoryInfo } from "../../models/directoryInfo";
import Tile from "../../components/Tile";
import Text from "../../components/Text";
import { css } from "emotion";
import IconButton from "../../components/IconButton";

const styles = {
  file: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 5px;
    transition: all 0.2s ease;
    :hover {
      background: rgba(255, 255, 255, 0.1);
    }
    :active {
      background: rgba(255, 255, 255, 0.2);
    }
  `,
  fileIcon: css`
    user-select: none;
    font-size: 18px;
    padding: 0 8px;
  `
};

interface FileExplorerProps {
  directory: DirectoryInfo;
  onNavigate: (path: string) => void;
}

class FileExplorer extends Component<FileExplorerProps> {
  state = {
    showDrives: false
  };

  onBack = () => {
    if (this.props.directory.type !== "ROOT") {
      const parts = this.props.directory.path.split(/\\/g);
      this.props.onNavigate(parts.slice(0, parts.length - 1).join("\\"));
    } else {
      this.setState({ showDrives: true });
    }
  };

  onChangeDrive = (path: string) => {
    this.setState({ showDrives: false });
    this.props.onNavigate(path);
  };

  render() {
    const { directory, onNavigate } = this.props;

    const fileView = directory.files.map((f, i) => (
      <div
        className={styles.file}
        key={i}
        onClick={() => onNavigate(directory.path + "\\" + f.name)}
      >
        <i className={`material-icons ${styles.fileIcon}`}>
          {f.type === "FILE" ? "insert_drive_file" : "folder"}
        </i>
        <Text color="darker">{f.name}</Text>
      </div>
    ));

    const driveView = directory.drives.map((path, i) => (
      <div className={styles.file} key={i} onClick={() => this.onChangeDrive(path)}>
        <i className={`material-icons ${styles.fileIcon}`}>devices</i>
        <Text color="darker" style={{ userSelect: "none" }}>
          {path.split(":")[0]}
        </Text>
      </div>
    ));

    const content = this.state.showDrives ? driveView : fileView;

    return (
      <Tile
        collapsible={false}
        divider={false}
        rawContent={true}
        title={directory.path}
        style={{ gridArea: "files", overflow: "auto" }}
        leading={
          <IconButton onClick={this.onBack} style={{ marginRight: 10 }}>
            <i className="material-icons" style={{ fontSize: 17 }}>
              arrow_back
            </i>
          </IconButton>
        }
      >
        <div style={{ margin: "8px" }}>{content}</div>
      </Tile>
    );
  }
}

export default FileExplorer;
