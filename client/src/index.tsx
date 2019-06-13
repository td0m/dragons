import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles.bundle.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import Api from "containers/Api";
import Events from "containers/Events";
import Stdout from "containers/Stdout";
import Files from "containers/Files";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1c222c"
    }
  },
  typography: {
    fontFamily: "Roboto Mono"
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={5} dense>
      <Events.Provider>
        <Stdout.Provider>
          <Api.Provider>
            <Files.Provider>
              <App />
            </Files.Provider>
          </Api.Provider>
        </Stdout.Provider>
      </Events.Provider>
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
