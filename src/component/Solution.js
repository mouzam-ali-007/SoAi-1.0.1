import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import fileDownload from "react-file-download";
import SingleArtifact from "./SingleArtifact";
import {
  Box,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
  makeStyles,
  Button,
  Dialog,
  Tab,
  AppBar,
  Card,
  CardContent,
  Menu,
  MenuItem,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import Quest from "./Quest";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

//icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DescriptionIcon from "@material-ui/icons/Description";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CachedIcon from "@material-ui/icons/Cached";
import ClearIcon from "@material-ui/icons/Clear";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import Snipper from "./Snipper";
import Spinner from "./Spinner";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import "../assets/css/voice-recorder.css";
import Modal from "react-modal";
import "../assets/css/modal.css";
// generals
const remote = window.require("electron").remote;

const Jimp = require("jimp");

const path = require("path");
const BrowserWindow = remote.BrowserWindow;
const { screen } = remote;
const screenSize = screen.getPrimaryDisplay().size;
const homeDir = window.require("os").homedir() + "/soai";
const screenshot = window.require("screenshot-desktop");
const { ipcRenderer } = window.require("electron");

const fs = remote.require("fs");
const settings = remote.require("electron-settings");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir);
}

const useStyles = makeStyles((theme) => ({
  back: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-3),
  },
  collapsabe: {
    // height:"40px",
    border: "0.5px solid transparent",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  borderBox: {
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(8),
    lineHeight: "3px",
    border: "0.5px solid transparent",
  },
  inlineList: {
    marginLeft: theme.spacing(5),
    display: "flex",
    flexDirection: "row",
    padding: 0,
    backgroundColor: "black",
  },
  answer: {
    width: theme.spacing(75),
  },
  dialogue: {
    marginLeft: theme.spacing(11),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(5),
  },
  content: {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(2),
  },
  _box: {
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    lineHeight: "3px",
    border: "0.5px solid transparent",
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "auto",
    width: "40%",
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  browseButton: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  next: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",

    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    maginLeft: theme.spacing(2),
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  card: {
    marginTop: theme.spacing(5),
    width: theme.spacing(40),
    background: "#121212",
  },
  heading: {
    fontSize: theme.spacing(4),
    border: "1px solid transparent",
    borderRadius: "3px",

    color: "#888",
    backgroundColor: "#eee",
  },
  description: {
    marginLeft: theme.spacing(1),
  },

  status: {
    border: "1px solid #2196f3",
    width: theme.spacing(7),
    color: "white",
    backgroundColor: "#2196f3",
  },
  progressBar: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(22),
    color: "#888",
  },
  linearProgress: {
    marginTop: theme.spacing(2),
    width: theme.spacing(48),
    marginLeft: theme.spacing(5),
    color: "#888",
  },
  inputStyles: {
    color: "red",
    padding: "20px",
  },
}));

const Solution = (props) => {
  const [file, setFile] = useState({});
  const [clickedTask, setClickedTask] = useState({});
  const [imagePath, setImagePath] = useState("");
  const [artifacts, setArtifacts] = useState([]);
  const [imageFromSnipper, setImageFromSnipper] = useState("");
  const [imageState, setImageState] = useState(false);
  const [value, setValue] = useState("1");
  const [loader, setLoader] = useState("none");
  const [done, setDone] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState("none");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snipAnchorEl, setSnipAnchorEl] = useState(null);
  const snipOpen = Boolean(snipAnchorEl);
  const open = Boolean(anchorEl);
  const [utility, setUtility] = useState(false);
  const classes = useStyles();
  const [showCropper, setShowCropper] = useState(false);
  const [showFileUploadButton, setShowFileUplaodButton] = useState(false);
  const [fileDownloading, setFileDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [artifactLoading, setArtifactLoading] = useState(false);

  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });

  const handleAudioStop = (data) => {
    console.log("Recorder audio data", data);
    setAudioDetails(data);
  };
  const handleReset = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    setAudioDetails(reset);
  };

  function blobToFile(theBlob, fileName) {
    console.log("The blob", theBlob);
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    if (theBlob) {
      theBlob.lastModifiedDate = new Date();

      return new File([theBlob], fileName, {
        type: theBlob.type,
        lastModified: Date.now(),
      });
    }
  }
  const handleAudioUpload = async (blob) => {
    if (blob) {
      let file = blobToFile(blob, "Audio-" + Date.now());
      console.log("Blob int File  ", file.type);
      const url = "https://cloud.so.ai:8443/API/Model/UploadFiles";
      const tenantId = props.selectedTenant.tenantId;
      const id = props.selectedTenant.id;
      const type = clickedTask.taskType;
      const typeId = clickedTask.taskID;
      const fileType = "ARTIFACT";
      const fileName = "Audio-" + Date.now();
      const contentType = file.type;
      const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
      const token = sessionData.token;

      var formData = new FormData();
      formData.append("tenantId", tenantId);
      formData.append("id", id);
      formData.append("type", type);
      formData.append("typeId", typeId);
      formData.append("fileType", fileType);
      formData.append("name", file);
      formData.append("fileName", fileName);
      formData.append("Content-Type", contentType);

      console.log(formData);
      await fetch(url, {
        headers: {
          TenantId: tenantId,
          Authorization: "Bearer " + token,

          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
          "Cache-Control": "no-cache",
          "X-Requested-With": "XMLHttpRequest",
        },
        method: "Post",
        body: formData,
      })
        .then((res) => res.text())
        .then((jsonResponse) => {
          console.log("Response upload", jsonResponse);

          getArtifacts();
          handleReset();
          ipcRenderer.send("create-notification", "Uploaded artifact successfully");
          ipcRenderer.on("notification", (e, arg) => {
            console.log("Notification created ", arg);
          });
        });
    }
  };
  const loadImage = () => {
    if (settings.getSync("captured")) {
      const captured = settings.getSync("captured");
      // console.log('captured image', captured.image)
      setImageFromSnipper(captured.image);
      setImageState(true);
    } else {
      setImageState(false);
      console.log("No Saved ScreenShot in electron settings");
    }
  };
  const clearLoadedScreenShot = () => {
    if (settings.getSync("captured")) {
      settings.setSync("captured", null);
      setImageState(false);
      setImageFromSnipper(null);
    }
  };

  useEffect(() => {
    loadImage();
    setDone("none");
  }, [showCropper]);
  React.useEffect(() => {
    ipcRenderer.on("hot-key-screen-shot", (event, message) => {
      console.log("Capture Done ", message);
      setShowCropper(message);
    });
  });

  const handleAnswers = (object) => {
    console.log("From Solution Component", object);
    props.onChange(object);
  };

  const handleFile = (event) => {
    setImagePath(event.target.files[0].path);
    console.log(event.target.value);
    console.log("event is ", event.target);
    setFile(event.target.files[0]);

    setShowFileUplaodButton(true);
  };

  const Capture = async (b64) => {
    const name = "artifact" + Math.random().toString(36).substring(5) + ".png";

    settings.setSync("captured", {
      image: b64,
    });
  };
  //
  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  const uploadScreenShot = async () => {
    setIsLoading(true);
    setImageLoader("block");
    const name = localStorage.getItem("fileName");

    var dataFile = dataURLtoFile(imageFromSnipper, name);
    const url = "https://cloud.so.ai:8443/API/Model/UploadFiles";
    const tenantId = props.selectedTenant.tenantId;
    const id = props.selectedTenant.id;
    const type = clickedTask.taskType;
    const typeId = clickedTask.taskID;
    const fileType = "ARTIFACT";
    const fileName = dataFile.name;
    const contentType = dataFile.type;
    const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
    const token = sessionData.token;

    var formData = new FormData();
    formData.append("tenantId", tenantId);
    formData.append("id", id);
    formData.append("image_data", imageFromSnipper);

    formData.append("type", type);
    formData.append("typeId", typeId);
    formData.append("fileType", fileType);
    formData.append("name", dataFile);
    formData.append("fileName", fileName);
    formData.append("Content-Type", contentType);

    await fetch(url, {
      headers: {
        TenantId: tenantId,
        Authorization: "Bearer " + token,

        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
      method: "Post",
      body: formData,
    })
      .then((jsonResponse) => {
        if (jsonResponse.ok) {
          console.log("Response upload", jsonResponse);
          setImageLoader("none");
          setImageUploaded(true);
          clearLoadedScreenShot();
          setIsLoading(false);
          getArtifacts();
          ipcRenderer.send("create-notification", "Uploaded artifact successfully");
          ipcRenderer.on("notification", (e, arg) => {
            console.log("Notification created ", arg);
          });
        }
      })
      .catch((err) => {
        console.log("Error", err);
        setIsLoading(false);
      });
  };

  const uploadFile = async () => {
    if (file.name) {
      setImageLoading(true);
      setLoader("block");
      console.log("File from state is", file);
      console.log("Selected Tenant", props.selectedTenant);
      console.log("Clicked Task", clickedTask);

      const url = "https://cloud.so.ai:8443/API/Model/UploadFiles";
      const tenantId = props.selectedTenant.tenantId;
      const id = props.selectedTenant.id;
      const type = clickedTask.taskType;
      const typeId = clickedTask.taskID;
      const fileType = "ARTIFACT";
      const fileName = file.name;
      const contentType = file.type;
      const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
      const token = sessionData.token;

      var formData = new FormData();
      formData.append("tenantId", tenantId);
      formData.append("id", id);
      formData.append("type", type);
      formData.append("typeId", typeId);
      formData.append("fileType", fileType);
      formData.append("name", file);
      formData.append("fileName", fileName);
      formData.append("Content-Type", contentType);

      console.log(formData);
      await fetch(url, {
        headers: {
          TenantId: tenantId,
          Authorization: "Bearer " + token,

          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
          "Cache-Control": "no-cache",
          "X-Requested-With": "XMLHttpRequest",
        },
        method: "Post",
        body: formData,
      })
        .then((res) => res.text())
        .then((jsonResponse) => {
          console.log("Response upload", jsonResponse);
          setImageLoading(false);
          setLoader("none");
          setDone("block");
          setFile("");
          setImagePath("");
          getArtifacts();
          setShowFileUplaodButton(false);
          ipcRenderer.send("create-notification", "Uploaded artifact successfully");
          ipcRenderer.on("notification", (e, arg) => {
            console.log("Notification created ", arg);
          });
        });
    }
  };

  const handleClickOpen = (task) => {
    setClickedTask(task);

    setUtility(true);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const closeSnipMenu = () => {
    setSnipAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSnippet = (event) => {
    setSnipAnchorEl(event.currentTarget);
    console.log(event.currentTarget);
  };

  const handleChange = (event, newValue) => {
    console.log("newValue", newValue);
    setValue(newValue);
  };

  // this fetch will get all the artifacts related to each task of notebook
  const getArtifacts = async () => {
    setArtifactLoading(true);
    const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
    const token = sessionData.token;
    const tenantId = props.selectedTenant.tenantId;
    const taskId = clickedTask.taskID;
    const id = props.selectedTenant.id;
    const url = "https://cloud.so.ai:8443/API/Model/LoadFilelib";

    const raw = {
      tenantId: tenantId,
      id: id,
      fileType: "ARTIFACT",
      type: "TASK",
      typeId: taskId,
      page: 1,
      count: 25,
    };

    await fetch(url, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        TenantId: tenantId,
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
      method: "Post",
      body: JSON.stringify(raw),
    })
      .then((res) => res.json())
      .then((jsonResponse) => {
        if (!jsonResponse.message) {
          setArtifactLoading(false);
          setArtifacts([...jsonResponse.list]);
          console.log("Check Artifacts....", artifacts);
        } else {
          setArtifactLoading(false);
        }
      });
  };

  const handleClose = () => {
    setUtility(false);
  };

  const getString = (htmlString) => {
    var span = document.createElement("span");
    span.innerHTML = htmlString;
    return span.textContent || span.innerText;
  };

  //cropper

  const setShowCropperMethod = () => {
    setShowCropper(true);
    setShowModal(true);
    setImageUploaded(false);
  };

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 2px #3a38d2",
    margin: "5px",
  };
  return (
    <React.Fragment>
      {showCropper ? (
        <Modal
          style={{
            overlay: {
              backgroundColor: "rgb(1,1,1,0.3)",
            },
            content: {
              border: "0px",
              backgroundColor: "rgb(33, 35, 33)",

              borderRadius: "50px 50px 50px 50px",
              marginTop: "150px",
            },
          }}
          id="modal"
          isOpen={showModal}
          onRequestClose={() => {
            setShowModal(false);
            setShowCropper(false);
          }}
        >
          <div>
            <Snipper
              setImageFromSnipper={setImageFromSnipper}
              setImageState={setImageState}
              setShowCropper={setShowCropper}
              Capture={Capture}
              setShowModal={setShowModal}
            />
          </div>
        </Modal>
      ) : (
        <>
          <div>
            <Box className={classes.collapsabe}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{props.taskName}</Typography>
                </AccordionSummary>
                {props.taskList.map((task, key) => {
                  return (
                    <AccordionDetails component="fieldset" className={classes.formControl} id={key}>
                      <div>
                        <Typography variant="subtitle1" color="textSecondary">
                          {task.description}
                        </Typography>
                        <Grid container>
                          <Grid item>
                            <Quest
                              onChange={handleAnswers}
                              answer={getString(task.data.form.fldModel)}
                              taskName={props.taskName}
                              data={task.data.form}
                              task={task}
                              fldName={task.data.form.fldName}
                            />
                          </Grid>
                          <Grid item>
                            <List className={classes.inlineList}>
                              <ListItem button>
                                <AttachFileIcon
                                  title="Attach File"
                                  onClick={() => {
                                    handleClickOpen(task);
                                  }}
                                />
                              </ListItem>
                              {/* <ListItem button>
                              <QuestionAnswerIcon />
                            </ListItem> */}
                            </List>
                          </Grid>
                        </Grid>
                      </div>
                    </AccordionDetails>
                  );
                })}
              </Accordion>
            </Box>
          </div>
          <Dialog className={classes.dialogue} fullScreen open={utility} onClose={handleClose}>
            <TabContext value={value}>
              <AppBar position="static">
                <TabList
                  onChange={handleChange}
                  aria-label="simple tabs example"
                  variant="fullWidth"
                  style={{ background: "#121212" }}
                  textColor="primary"
                  TabIndicatorProps={{ style: { background: "#ffffff" } }}
                >
                  <Tab icon={<CloudUploadIcon />} label="UPLOADER" value="1" />
                  <Tab
                    icon={<DescriptionIcon />}
                    onClick={() => getArtifacts()}
                    label="ARTIFACTS "
                    value="2"
                  />
                </TabList>
              </AppBar>
              <TabPanel value="1">
                <div>
                  <Typography style={{ textAlign: "center" }}>Task: {props.taskName}</Typography>
                  <Grid container className={classes.content}>
                    <Grid item xs={1}>
                      <Tooltip title="Go back">
                        <Button className={classes.back} onClick={handleClose}>
                          <ArrowBackOutlinedIcon fontSize="medium" />
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={5}>
                      <div style={{ float: "right", marginTop: "2px" }}>
                        <Button
                          onClick={() => {
                            setShowCropperMethod();
                          }}
                        >
                          <Tooltip title="Capture">
                            <PhotoCamera fontSize="medium" />
                          </Tooltip>
                        </Button>
                      </div>
                    </Grid>{" "}
                    <Grid item xs={1}>
                      <div style={{ float: "right", marginTop: "2px" }}>
                        <Button>
                          <Tooltip title="Remove">
                            <ClearIcon onClick={clearLoadedScreenShot} fontSize="medium" />
                          </Tooltip>
                        </Button>
                      </div>
                    </Grid>
                  </Grid>

                  <Box className={classes._box}>
                    <div className={classes.root}>
                      {isLoading ? (
                        <div
                          style={{
                            display: "flex",
                            width: "50%",
                            margin: "auto",
                          }}
                        >
                          <Spinner size={50} />
                        </div>
                      ) : !imageUploaded && imageState ? (
                        <>
                          <img
                            style={{ maxWidth: "250px", maxHeight: "250px" }}
                            className="preview"
                            src={imageFromSnipper}
                            alt=""
                          />
                          <div
                            style={{
                              display: "flex",
                              width: "50%",
                              margin: "auto",
                            }}
                          >
                            <Button
                              style={{ height: "45px" }}
                              className={classes.next}
                              onClick={uploadScreenShot}
                            >
                              {"Upload"}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div>
                          {imageUploaded ? (
                            <h4>Screenshot uploaded successfully.</h4>
                          ) : (
                            <h4>No screenshot available.</h4>
                          )}
                        </div>
                      )}
                      {}
                    </div>
                  </Box>

                  {/* <Grid xs={5}></Grid> */}

                  <Box className={classes._box}>
                    <Grid>
                      <h5>Files</h5>
                    </Grid>
                    <Grid container>
                      <Grid item xs={8}>
                        <div>
                          <TextField
                            style={{
                              backgroundColor: "rgba(255,255,255,0.12)",
                            }}
                            inputLabelProps={{
                              className: classes.inputStyles,
                            }}
                            disabled={true}
                            required
                            fullWidth
                            variant="outlined"
                            id="upload"
                            name="upload"
                            label={!imagePath ? "Select a File" : imagePath}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <Button className={classes.browseButton}>
                          <label htmlFor="icon-button-file">
                            <input
                              accept="/*"
                              type="file"
                              onChange={handleFile}
                              style={{ display: "none" }}
                              id="icon-button-file"
                              className="uploader"
                            />
                            Browse
                          </label>
                        </Button>
                      </Grid>
                      <Grid xs={5}>
                        {showFileUploadButton ? (
                          <Button className={classes.next} onClick={uploadFile}>
                            {imageLoading ? <Spinner /> : "Upload"}
                          </Button>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  <Box className={classes._box}>
                    <Typography></Typography>
                    <Recorder
                      title="Record Audio"
                      record={false}
                      audioURL={audioDetails.url}
                      showUIAudio
                      handleAudioStop={(data) => handleAudioStop(data)}
                      handleAudioUpload={(data) => handleAudioUpload(data)}
                      handleRest={() => handleReset()}
                    />
                  </Box>
                </div>
              </TabPanel>
              {/* {setDone("none")} */}
              <TabPanel value="2">
                <Typography style={{ textAlign: "center" }}>Task: {props.taskName}</Typography>
                <Grid container>
                  <Grid item xs={1}>
                    <Button className={classes.back} onClick={handleClose}>
                      <ArrowBackOutlinedIcon fontSize="medium" />
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <h3 style={{ marginTop: "10px", marginLeft: "-20px" }}>Uploaded Artifacts</h3>
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.content}>
                  {!artifactLoading ? (
                    artifacts.length === 0 ? (
                      <Typography style={{ textAlign: "center", marginLeft: "35%" }}>
                        No Artifacts Available
                      </Typography>
                    ) : (
                      artifacts.map((art, key) => {
                        return <SingleArtifact art={art} getArtifacts={getArtifacts} />;
                      })
                    )
                  ) : (
                    <Grid
                      style={{
                        minWidth: "100%",
                        paddingLeft: "40%",
                        paddingTop: "15%",
                      }}
                    >
                      <Spinner size={60} />
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
            </TabContext>
          </Dialog>
        </>
      )}
    </React.Fragment>
  );
};

export default Solution;
