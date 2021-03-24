import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import SideBar from "./SideBar";
import Header from "./Header";
import {
  Grid,
  Box,
  makeStyles,
  Typography,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
const { ipcRenderer } = window.require("electron");

const fs = window.require("fs").promises;

const filePath = window.require("os").homedir() + "/soai/hotKeys.json";

let hotKeys = {};

const readFile = async () => {
  hotKeys = await fs.readFile(filePath, "utf8");
  hotKeys = JSON.parse(hotKeys);
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  box: {
    paddingLeft: theme.spacing(6),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(8),
    lineHeight: "3px",
    border: "0.5px solid transparent",
    borderBottomColor: "rgba(255,255,255,0.12)",
    borderTopColor: "rgba(255,255,255,0.12)",
    height: theme.spacing(58),
  },
  group: {
    marginTop: theme.spacing(3),
    paddingLeft: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  done: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(2),
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  btn: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",

    marginTop: theme.spacing(1),

    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  bottom: {
    marginTop: theme.spacing(3),
    fontSize: theme.spacing(3),
  },
  success: {
    color: "green",
    paddingTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  answer: {
    color: "#ffffff",
  },
}));

export default function Settings() {
  const classes = useStyles();

  const [minimize, setMinimize] = useState("");
  const [maximize, setMaximize] = useState("");
  const [capture, setCapture] = useState("");
  const [hide, setHide] = useState("");
  //const [quit,setquit ]= useState("")
  const [display, setDisplay] = useState("none");

  const [hMin, setHmin] = useState("");
  const [hMax, setHmax] = useState("");
  const [hCap, setHcap] = useState("");
  const [hHide, setHhide] = useState("");
  //const[hQuit,setHquit]=useState("")

  const [minEl, setMinEl] = React.useState(null);
  const openMin = Boolean(minEl);

  const [maxEl, setMaxEl] = React.useState(null);
  const openMax = Boolean(maxEl);

  // const [quitEl, setQuitEl] = React.useState(null);
  // const openQuit = Boolean(quitEl);

  const [captureEl, setCaptureEl] = React.useState(null);
  const openCapture = Boolean(captureEl);

  const [hideEl, setHideEl] = React.useState(null);
  const openHide = Boolean(hideEl);

  useEffect(() => {
    const loadData = async () => {
      setDisplay("none");
      await readFile();
      console.log("Hot Keys from File ", hotKeys);
      setMinimize(hotKeys.minimize[hotKeys.minimize.length - 1]);
      setMaximize(hotKeys.maximize[hotKeys.maximize.length - 1]);
      setCapture(hotKeys.capture[hotKeys.capture.length - 1]);
      setHide(hotKeys.hide[hotKeys.minimize.length - 1]);
      setHmin(hotKeys.minimize.split("+")[0]);
      setHmax(hotKeys.maximize.split("+")[0]);
      setHcap(hotKeys.capture.split("+")[0]);
      setHhide(hotKeys.hide.split("+")[0]);
    };

    loadData();
  }, []);

  const saveKeys = async () => {
    let shortCuts = {
      minimize: hMin + "+" + minimize,
      //maximize: hMax + "+" + maximize,

      Capture: hCap + "+" + capture,
      Hide: hHide + "+" + hide,
    };
    if (shortCuts.minimize || shortCuts.maximize || shortCuts.Capture || shortCuts.Hide) {
      await ipcRenderer.send("save-keys", shortCuts);
      ipcRenderer.on("key-reply", (event, arg) => {
        console.log("Message from MainProcess", arg); // prints "pong"

        setDisplay("block");
      });

      console.log("ShortCuts to be saved", shortCuts);
      await readFile();
    } else {
      setDisplay("none");
    }
  };

  const handleMinClick = (event) => {
    setMinEl(event.currentTarget);
  };

  const handleMaxClick = (event) => {
    setMaxEl(event.currentTarget);
  };

  // const  handleQuitClick =(event)=>{

  //     setQuitEl(event.currentTarget)
  // }

  const handleCaptureClick = (event) => {
    setCaptureEl(event.currentTarget);
  };

  const handleHideClick = (event) => {
    setHideEl(event.currentTarget);
  };

  const handleMinClose = () => {
    setMinEl(null);
  };

  const handleMin = (event) => {
    setMinimize(event.target.value);
  };

  const handleMax = (event) => {
    setMaximize(event.target.value);
  };

  const handleHide = (event) => {
    setHide(event.target.value);
  };

  const handleCapture = (event) => {
    setCapture(event.target.value);
  };

  // const handleQuit=(event)=>{

  //     setquit(event.target.value)
  // }

  const handleAlt = (el) => {
    if (el === "minimize") {
      setHmin("Alt");
      handleMinClose();
    } else if (el === "maximize") {
      setHmax("Alt");
      handleMaxClose();
    } else if (el === "capture") {
      setHcap("Alt");
      handleCaptureClose(0);
    } else if (el === "hide") {
      setHhide("Alt");
      handleHideClose();
    }
  };
  const handleShift = (el) => {
    if (el === "minimize") {
      setHmin("Shift");
      handleMinClose();
    } else if (el === "maximize") {
      setHmax("Shift");
      handleMaxClose();
    } else if (el === "capture") {
      setHcap("Shift");
      handleCaptureClose(0);
    } else if (el === "hide") {
      setHhide("Shift");
      handleHideClose();
    }
  };
  const handleCtrl = (el) => {
    if (el === "minimize") {
      setHmin("CmdOrCtrl");
      handleMinClose();
    } else if (el === "maximize") {
      setHmax("CmdOrCtrl");
      handleMaxClose();
    } else if (el === "capture") {
      setHcap("CmdOrCtrl");
      handleCaptureClose(0);
    } else if (el === "hide") {
      setHhide("CmdOrCtrl");
      handleHideClose();
    }
  };
  const handleMaxClose = () => {
    setMaxEl(null);
  };
  // const handleQuitClose=()=>{
  //     setQuitEl(null)
  // }
  const handleCaptureClose = () => {
    setCaptureEl(null);
  };
  const handleHideClose = () => {
    setHideEl(null);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container>
        <SideBar />

        <Grid item xs={11}>
          <Header />
          <Box className={classes.box}>
            <Typography component="h5" variant="h5" className={classes.heading}>
              Hot Keys
            </Typography>

            <Grid container className={classes.group}>
              <Grid xs="4">
                <Typography variant="subtitle1" color="textSecondary" className={classes.heading}>
                  Minimize
                </Typography>
              </Grid>
              <Grid xs="3">
                <Button
                  className={classes.btn}
                  aria-label="more"
                  aria-controls="min-menu"
                  aria-haspopup="true"
                  onClick={handleMinClick}
                >
                  {hMin}
                </Button>
                <Menu
                  id="min-menu"
                  anchorEl={minEl}
                  keepMounted
                  open={openMin}
                  onClose={handleMinClose}
                >
                  <MenuItem onClick={() => handleCtrl("minimize")}>CmdOrCtrl </MenuItem>
                  <MenuItem onClick={() => handleShift("minimize")}>Shift</MenuItem>
                  <MenuItem onClick={() => handleAlt("minimize")}>Alt</MenuItem>
                </Menu>
              </Grid>
              <Grid xs="1" className={classes.bottom}>
                +
              </Grid>
              <Grid xs="1">
                <TextField
                  disabled={true}
                  className={classes.answer}
                  value={minimize}
                  onChange={handleMin}
                  name="minimize"
                />
              </Grid>
            </Grid>

            {/* <Grid container className={classes.group}>
              <Grid xs="4">
                <Typography variant="subtitle1" color="textSecondary" className={classes.heading}>
                  Maximize
                </Typography>
              </Grid>
              <Grid xs="3">
                <Button
                  className={classes.btn}
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleMaxClick}
                >
                  {hMax}
                </Button>
                <Menu
                  id="long-menu"
                  anchorEl={maxEl}
                  keepMounted
                  open={openMax}
                  onClose={handleMaxClose}
                >
                  <MenuItem onClick={() => handleCtrl("maximize")}>CmdOrCtrl</MenuItem>
                  <MenuItem onClick={() => handleShift("maximize")}>Shift</MenuItem>
                  <MenuItem onClick={() => handleAlt("maximize")}>Alt</MenuItem>
                </Menu>
              </Grid>
              <Grid xs="1" className={classes.bottom}>
                +
              </Grid>
              <Grid xs="1">
                <TextField
                  className={classes.answer}
                  value={maximize}
                  onChange={handleMax}
                  name="maximize"
                />
              </Grid>
            </Grid> */}

            <Grid container className={classes.group}>
              <Grid xs="4">
                <Typography variant="subtitle1" color="textSecondary" className={classes.heading}>
                  Capture
                </Typography>
              </Grid>

              <Grid xs="3">
                <Button
                  className={classes.btn}
                  aria-label="more"
                  aria-controls="capture-menu"
                  aria-haspopup="true"
                  onClick={handleCaptureClick}
                >
                  {hCap}
                </Button>
                <Menu
                  id="capture-menu"
                  anchorEl={captureEl}
                  keepMounted
                  open={openCapture}
                  onClose={handleCaptureClose}
                >
                  <MenuItem onClick={() => handleCtrl("capture")}>CmdOrCtrl</MenuItem>
                  <MenuItem onClick={() => handleShift("capture")}>Shift</MenuItem>
                  <MenuItem onClick={() => handleAlt("capture")}>Alt</MenuItem>
                </Menu>
              </Grid>
              <Grid xs="1" className={classes.bottom}>
                +
              </Grid>
              <Grid xs="1">
                <TextField
                  disabled={true}
                  className={classes.answer}
                  value={capture}
                  onChange={handleCapture}
                  name="capture"
                />
              </Grid>
            </Grid>

            <Grid container className={classes.group}>
              <Grid xs="4">
                <Typography variant="subtitle1" color="textSecondary" className={classes.heading}>
                  Runs in background
                </Typography>
              </Grid>
              <Grid xs="3">
                <Button
                  aria-label="more"
                  aria-controls="hide-menu"
                  aria-haspopup="true"
                  onClick={handleHideClick}
                  className={classes.btn}
                >
                  {hHide}
                </Button>
                <Menu
                  id="hide-menu"
                  anchorEl={hideEl}
                  keepMounted
                  open={openHide}
                  onClose={handleHideClose}
                >
                  <MenuItem onClick={() => handleCtrl("hide")}>CmdOrCtrl</MenuItem>
                  <MenuItem onClick={() => handleShift("hide")}>Shift</MenuItem>
                  <MenuItem onClick={() => handleAlt("hide")}>Alt</MenuItem>
                </Menu>
              </Grid>
              <Grid xs="1" className={classes.bottom}>
                +
              </Grid>
              <Grid xs="1">
                <TextField
                  disabled={true}
                  className={classes.answer}
                  value={hide}
                  onChange={handleHide}
                  name="hide"
                />
              </Grid>
            </Grid>
            {/* <Grid container>
              <Grid xs="6">
                <br />
                <Typography
                  variant="label"
                  className={classes.success}
                  style={{ display: `${display}` }}
                >
                  Keys Saved Successfully !
                </Typography>
              </Grid>

              <Grid xs="6">
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.done}
                  onClick={saveKeys}
                >
                  Save
                </Button>
              </Grid>
            </Grid> */}
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
