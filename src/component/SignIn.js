import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import logo from "../icon.jpg";
import { Alert } from "@material-ui/lab";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Card,
  CardContent,
  makeStyles,
  Container,
} from "@material-ui/core";
import Snipper from "./Snipper";
import Spinner from "./Spinner";

const remote = window.require("electron").remote;
const settings = remote.require("electron-settings");
// const { ipcRenderer } = window.require('electron')
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(7),
    paddingBottom: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.grey,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    height: theme.spacing(6),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),

    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
      borderColor: "#121212",
    },
  },
  top: {
    marginTop: theme.spacing(6),
  },
  card: {
    maxHeight: "450px",
  },
  spinner: {
    padding: "40%",
  },
}));

export default function SignIn() {
  // states
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);

  const [savedEmail, setSavedEmail] = useState("email");
  const [savedPassword, setSavedPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isloggedIn, setIsLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // shall be used for validation
  const [disable, setDisable] = useState(true);
  const [warn, changeWarn] = useState(false);
  const [validate, setValidate] = useState(false);
  const [view, setView] = useState();
  //handlers
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  // api assets
  const url = "https://cloud.so.ai:8443/API/token";

  React.useEffect(() => {
    if (settings.getSync("user-login-data") && settings.getSync("user-login-data").userEmail) {
      setSavedPassword(settings.getSync("user-login-data").userPassword);
      setSavedEmail(settings.getSync("user-login-data").userEmail);
    } else {
      console.log("No user Found");
    }
    setView(getContext);
  }, []);

  React.useEffect(() => {
    if (savedEmail && savedPassword) {
      loginFromSavedData();
    }
  }, [savedEmail, savedPassword]);

  const getContext = () => {
    const context = global.location.search;
    return context.substr(1, context.length - 1);
  };
  const loginFromSavedData = async () => {
    console.log("email", email, "password ", password);

    await fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json, text/plain, */*",
        DNT: "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "no-cors",
      method: "Post",
      body: `grant_type=password&username=${savedEmail}&password=${savedPassword}&client_id=SO.Ai UI`,
    })
      .then((res) => res.json())
      .then((jsonResponse) => {
        if (jsonResponse.error) {
          console.log(jsonResponse.error);
          setShowAlert(true);
        } else {
          var tenants = JSON.parse(jsonResponse.tenants);
          let data = jsonResponse;
          sessionStorage.setItem(
            "userAuthData",
            JSON.stringify({
              userId: data.id,
              token: data.access_token,
              expires: data[".expires"],
              refreshToken: data.refresh_token,
              tenantId: tenants[2].id,
              roles: tenants[2].roles,
            })
          );
          sessionStorage.setItem(
            "userSessionData",
            JSON.stringify({
              isHostMode: false,
              userId: data.id,
              userName: data.userName,
              profilePicUrl: "",
              languagePref: "",
              firstName: "",
              lastName: "",
              tenant: {
                id: tenants[2].id,
                businessName: tenants[2].businessName,
              },
            })
          );
          setLoggedIn(true);
          // ipcRenderer.sendSync('set-password', 'haseeb', 'Foo')
        }
      });
  };
  // call a fetch
  const logIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (email && password) {
      await fetch(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json, text/plain, */*",
          DNT: "1",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: "no-cors",
        method: "Post",
        body: `grant_type=password&username=${email}&password=${password}&client_id=SO.Ai UI`,
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          if (jsonResponse.error) {
            setShowAlert(true);
            setIsLoading(false);
          } else {
            var tenants = JSON.parse(jsonResponse.tenants);
            localStorage.setItem("tenants", JSON.stringify(tenants));
            let data = jsonResponse;
            tenants.forEach((value) => {
              if (value.roles.length) {
                setRoles(value.roles);
              }
            });

            sessionStorage.setItem(
              "userAuthData",
              JSON.stringify({
                userId: data.id,
                token: data.access_token,
                expires: data[".expires"],
                refreshToken: data.refresh_token,
                tenantId: tenants[2].id,
                roles: tenants[2].roles,
              })
            );
            sessionStorage.setItem(
              "userSessionData",
              JSON.stringify({
                isHostMode: false,
                userId: data.id,
                userName: data.userName,
                profilePicUrl: "",
                languagePref: "",
                firstName: "",
                lastName: "",
                tenant: {
                  id: tenants[2].id,
                  businessName: tenants[2].businessName,
                },
              })
            );
            setLoggedIn(!isloggedIn);
            setIsLoggedIn(true);
            setIsLoading(false);
            settings.setSync("user-login-data", {
              userEmail: email,
              userPassword: password,
            });
            // ipcRenderer.sendSync('set-password', 'haseeb', 'Foo')
          }
        });
    }
  };
  //enable Button
  const enableButton = () => {
    if (validate) {
      // console.log("can be enabled password is ", password);
      setDisable(false);
    } else {
      console.log("can not be enabled password is ", password);
      setDisable(true);
    }
  };
  //email validator
  const checkValidation = () => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if(!email){
    //   changeWarn(false)
    //   setValidate(false)
    //   setDisable(true)
    //   return
    // }

    if (re.test(email)) {
      changeWarn(false);
      setValidate(true);
      setDisable(false);
    } else {
      changeWarn(true);
      setValidate(false);
    }
  };
  // rendering JSX
  return (
    <>
      {view === "snip" ? (
        <Snipper />
      ) : (
        <React.Fragment>
          {loggedIn && <Redirect to="/transaction" />}
          <div className={classes.top}></div>
          <CssBaseline />
          <Container maxWidth="xs">
            {showAlert && (
              <Alert severity="error">
                Invalid email or password. Please re-try with the correct login information.
              </Alert>
            )}

            {savedEmail ? (
              <Card className={classes.card}>
                <CardContent>
                  <div className={classes.paper}>
                    <img style={{ height: "80px" }} src={logo} />

                    <div className={classes.form}>
                      <form onSubmit={logIn}>
                        <TextField
                          variant="outlined"
                          style={{ backgroundColor: "#121212" }}
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          value={email}
                          onChange={handleEmail}
                          error={warn}
                          onBlur={checkValidation}
                        />
                        <TextField
                          variant="outlined"
                          style={{ backgroundColor: "#121212" }}
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          onChange={handlePassword}
                          onBlur={enableButton}
                        />
                        <Grid container></Grid>
                        <Button
                          type="submit"
                          fullWidth
                          color="primary"
                          disabled={disable}
                          className={classes.submit}
                          onClick={(e) => logIn(e)}
                        >
                          {isLoading ? <Spinner /> : "Sign In"}
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={classes.spinner}>{<Spinner size={40} />}</div>
            )}
          </Container>
        </React.Fragment>
      )}
    </>
  );
}
