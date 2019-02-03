import { css } from "emotion";

import { border, a, accent, bg } from "./colors";

export const grid = css`
  font-size: 13px;
  background: ${bg};
  color: ${accent};
  height: 100vh;
  display: grid;
  grid-template-columns: 300px auto 300px;
  grid-template-rows: 30px auto 300px;
  grid-template-areas:
    "topbar topbar topbar"
    "left main right"
    "bottom bottom bottom";
`;

export const top = css`
  grid-area: topbar;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
`;

export const main = css`
  grid-area: main;
  border: solid 1px ${border};
  border-radius: 3px;
  overflow: auto;
`;

export const left = css`
  grid-area: left;
  padding: 0 10px;
  overflow: auto;
  border-bottom: solid 1px ${border};
`;

export const right = css`
  grid-area: right;
  padding: 0 10px;
  overflow: auto;
  border-bottom: solid 1px ${border};
`;

export const bottom = css`
  grid-area: bottom;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 100%;
  grid-template-areas: "keylogger applogger clipboardlogger files files";
`;
