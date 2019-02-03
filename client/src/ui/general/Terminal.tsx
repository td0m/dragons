import React, { Component, ChangeEvent, KeyboardEvent, RefObject } from "react";
import { css } from "emotion";

import Text from "../../components/Text";
import { StdoutLine } from "../../models/stdoutLine";

const root = css`
  height: calc(100% - 20px);
  margin: 8px 10px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 13px;
  word-wrap: break-word;
  text-overflow: clip;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const input = css`
  font-family: inherit !important;
  font-size: inherit;
  color: inherit;
  background: transparent;
  border: none;
  outline: none;
  flex: 1 1;
`;

interface TerminalProps {
  onEnter: (value: string) => void;
  stdout: StdoutLine[];
  inputRef: RefObject<HTMLInputElement>;
}

class TerminalState {
  value: string = "";
  history: string[] = [];
  historyIndex: number = -1;
}

class Terminal extends Component<TerminalProps, TerminalState> {
  state = new TerminalState();

  componentDidMount() {
    const local = localStorage.getItem("commandHistory");
    if (local) {
      this.setState({
        history: JSON.parse(local)
      });
    }
  }

  saveHistory = (history: string[]) => {
    localStorage.setItem("commandHistory", JSON.stringify(history));
  };

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value, historyIndex: -1 });
  };

  handleArrow = (isUp: boolean) => {
    let { history, historyIndex } = this.state;
    historyIndex += isUp ? 1 : -1;
    const i = history.length - 1 - historyIndex;
    if (i in history) {
      this.setState(
        {
          value: history[i],
          historyIndex
        },
        () => {
          this.props.inputRef.current!.scrollIntoView(false);
        }
      );
    }
  };

  onKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    const { value } = this.state;
    if (ev.key === "Enter" && value.length > 0) {
      this.props.onEnter(value);
      const { history } = this.state;
      const newHistory = [...history, value];
      this.setState({ value: "", history: newHistory });
      this.saveHistory(newHistory);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      this.handleArrow(true);
    } else if (ev.key === "ArrowDown") {
      ev.preventDefault();
      this.handleArrow(false);
    }
  };

  onClick = (e: any) => {
    if (e.target.id === "terminal") this.props.inputRef.current!.focus();
  };

  render() {
    const { inputRef, stdout } = this.props;
    const { value } = this.state;

    return (
      <pre id="terminal" onClick={this.onClick} className={root}>
        <code>
          {stdout.map((line, i) => (
            <Text
              block
              key={i}
              weight={300}
              color="darker"
              style={line.error ? { color: "#F44336" } : {}}
            >
              {line.value}
            </Text>
          ))}
          <div style={{ display: "flex", width: "100%" }}>
            <Text weight={300}>> </Text>
            <input
              ref={inputRef}
              className={input}
              value={value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              autoCapitalize="false"
              autoCorrect="false"
              spellCheck={false}
            />
          </div>
        </code>
      </pre>
    );
  }
}

export default Terminal;
