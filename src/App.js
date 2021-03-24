import React from "react";
import SignIn from "./component/SignIn";
import Transaction from "./component/Transaction";
import Settings from "./component/Settings";

import { useHistory } from "react-router-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import ShowSnipperOnRootComp from "./component/ShowSnipperOnRootComp";
const { ipcRenderer } = window.require("electron");

function getSession() {
  const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));

  try {
  } catch (error) {
    console.log("Error in getting password from keytar");
  }

  if (sessionData) {
    return sessionData.token;
  } else {
    return null;
  }
}

function App() {
  const history = useHistory();
  React.useEffect(() => {
    ipcRenderer.on("hot-key-screen-shot", (event, message) => {
      history.push("/test");
    });

    ipcRenderer.on("tray-screen-shot", (event, message) => {
      history.push("/test");
    });
  });

  return (
    <React.Fragment className="App">
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route
          exact
          path="/settings"
          render={() => (getSession() ? <Settings /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/transaction"
          render={() => (getSession() ? <Transaction /> : <Redirect to="/" />)}
        />

        <Route
          exact
          path="/test"
          render={() => (getSession() ? <ShowSnipperOnRootComp /> : <Redirect to="/sniper" />)}
        />
      </Switch>
    </React.Fragment>
  );
}

export default App;
