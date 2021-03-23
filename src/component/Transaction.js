import { Alert } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import SideBar from "../component/SideBar";
import { reNewToken, logOut, onDisconnection } from "../helperFunctions";
import Solution from "./Solution";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import { Redirect } from "react-router-dom";
import {
  Select,
  Box,
  MenuItem,
  makeStyles,
  InputLabel,
  Button,
  Grid,
  Container,
  CssBaseline,
  CardContent,
  Card,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  box: {
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    lineHeight: "3px",
    border: "0.5px solid transparent",
    borderBottomColor: "rgba(255,255,255,0.12)",
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
  borderBox: {
    // paddingLeft: theme.spacing(8),
    // paddingTop: theme.spacing(2),
    // paddingRight: theme.spacing(2),
    // paddingBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    lineHeight: "3px",
    border: "0.5px solid transparent",
  },
  btnMain: {
    marginTop: theme.spacing(10),
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  btn: {
    width: theme.spacing(12),
    marginTop: theme.spacing(25),
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  btn2: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  content: {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(2),
  },
  collapsabe: {
    // height:"40px",
    border: "0.5px solid transparent",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(2),

    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  btn3: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(2),
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
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
  input: {
    visibility: "hidden",
  },
  next: {
    backgroundColor: "#121212",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    float: "right",
    width: "12vh",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    //marginLeft:theme.spacing(10),
    "&:hover": {
      color: "#000000",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  },
  heading: {
    fontSize: theme.spacing(8),
    border: "1px solid transparent",
    borderRadius: "3px",
    alignContent: "center",
    paddingLeft: "10%",
    backgroundColor: "#888",
  },
  description: {
    marginLeft: theme.spacing(2),
  },
  truncText: {
    width: theme.spacing(80),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis", // This is where the magic happens
  },
  card: {
    marginTop: theme.spacing(5),
    width: theme.spacing(90),
    "&:hover": {
      boxShadow: "10px 10px #888888",
    },
  },
  status: {
    border: "1px solid #c2185b",
    width: "32%",
    paddingLeft: "5px",
    color: "white",
    backgroundColor: "#c2185b",
  },
  rightSide: {
    width: theme.spacing(20),
  },
  BoxShadow: {
    boxShadow: "10px 10px #888888",
  },
  answer: {
    width: theme.spacing(75),
  },
  inlineList: {
    marginLeft: theme.spacing(5),
    display: "flex",
    flexDirection: "row",
    padding: 0,
    backgroundColor: "black",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogue: {
    marginLeft: theme.spacing(11),
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(5),
  },
  progress: {
    marginLeft: "50%",
    marginTop: theme.spacing(10),
  },
  back: {
    marginLeft: theme.spacing(-5),
  },
}));

const { ipcRenderer } = window.require("electron");
export default function Transaction() {
  const classes = useStyles();
  React.useEffect(() => {
    ipcRenderer.on("hot-key-screen-shot", (event, message) => {
      console.log("Capture Done ", message);
    });
  });
  // states created to rendered task realted to each mode
  const [dataCollectionTasks, setDataCollectionTasks] = useState([]);
  const [earlyDataAnalysisTasks, setEarlyDataAnalysisTasks] = useState([]);
  const [modelDevelopmentTasks, setModelDevelopmentTasks] = useState([]);
  const [modelUsageTasks, setModelUsageTasks] = useState([]);
  const [model, setModel] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [legalTasks, setLegalTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);
  const [configData, setConfigData] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [save, setSave] = useState(false);

  //---------------------------------------------------
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [disable, setDisable] = useState(true);
  const [first, changeFirst] = useState(true);
  const [second, changeSecond] = useState(false);

  const [loader, setLoader] = useState("block");
  const [show, setShow] = useState("none");

  const [list, setList] = useState([]);

  const [tenant, setTenant] = useState({});

  //--------------------------------------------------
  const [disconnection, setDisconnection] = useState(false);
  const url = "https://cloud.so.ai:8443/API/Model/LoadModels";

  // data required from session
  const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
  const tenantId = sessionData.tenantId;
  const token = sessionData.token;
  const refreshToken = sessionData.refreshToken;

  const handleNotebook = (event) => {
    console.log(event.target.value);

    let selectedTenant = list.filter((ls) => {
      return ls.name === event.target.value;
    });
    setTenant(...selectedTenant);
    let arr = [];
    arr.push(...selectedTenant);
    localStorage.setItem("notebook", JSON.stringify(arr));
    setDisable(false);
    console.table("Selected tenant", selectedTenant);
    getTasks(selectedTenant);
  };

  const UpdateModel = async () => {
    if (answers.length) {
      // let set config Data wth the updated task solutions
      let ConfigData = [...configData];
      answers.forEach((answer) => {
        let index = ConfigData.findIndex(
          (cfdata) => cfdata.type === "TASK" && cfdata.data.form.fldName === answer.fldName
        );
        ConfigData[index] &&
          (ConfigData[index].data.form.fldModel = "<p>" + answer.fldModel + "<br></p>");
      });
      setConfigData(configData, [...ConfigData]);
      // let set the updated config data to the model's config Data and extract some values
      let Model = model;
      console.log("Model before parsing", Model);
      let modelConfigData = JSON.parse(Model.configData);
      console.log("Old config data", modelConfigData);
      console.log("NEW CONFIG DATA", ConfigData);
      modelConfigData.data = ConfigData;
      console.log("Updated Config Data", modelConfigData);
      Model.configData = JSON.stringify(modelConfigData);
      console.log("Model after parsing", Model);

      setModel(Model);

      // add a fetch
      const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
      const token = sessionData.token;
      const url = "https://cloud.so.ai:8443/API/Model/UpdateModel";
      await fetch(url, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json, text/plain, */*",
          TenantId: tenantId,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
          Authorization: "Bearer " + token,
        },
        method: "Post",
        body: JSON.stringify(Model),
      })
        .then((res) => res.json())
        .then((jsonResponse) => {
          console.log("response", jsonResponse);
          // now set the success response and set everything to null
          setShowSuccess(true);
          setAnswers([]);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      console.log("Can never be sumbitted");
    }
  };
  const reset = () => {
    changeFirst(true);
    changeSecond(false);
    setDisable(true);
    setShow("none");
    setLoader("block");
    setSave(false);
    setShowSuccess(false);
    setShowError(false);
    //  setImage("Select a File From Your Computer or Specify a URL")
  };

  // fetch notebooks api
  const getNotebooks = async () => {
    let session = {
      refreshToken: refreshToken,
    };

    localStorage.setItem(
      "interval",
      setInterval(() => reNewToken({ session }), 15000)
    );
    var raw = { tenantId: tenantId, page: 1, count: 25 };

    await fetch(url, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        TenantId: tenantId,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        Authorization: "Bearer " + token,
      },
      method: "Post",
      body: JSON.stringify(raw),
    })
      .then((res) => res.json())
      .then((jsonResponse) => {
        if (jsonResponse.message) {
          console.log("Need to refresh the token ");
          setDisconnection(true);
          onDisconnection();
        } else {
          setList(jsonResponse.list);
        }
      });
  };
  const getTasksWithForm = (filterDataCollectionTasks, elements) => {
    console.log("in", filterDataCollectionTasks);
    const updated =
      filterDataCollectionTasks.length > 0 &&
      filterDataCollectionTasks.map((task) => {
        const data = addData(task, elements);
        return { ...task, data };
      });
    return updated;
  };
  const addData = (task, elements) => {
    let data = {
      form: {
        fldModel: "",
        fldName: "",
      },
    };
    elements.length > 0 &&
      elements.map((element) => {
        if (
          element.data.categoryID === task.categoryID &&
          element.data.description === task.description
        ) {
          data = element.data;
        }
      });
    return data;
  };
  // fetch to get task of each notebook .
  const getTasks = async (selectedTenant) => {
    const tenantId = selectedTenant[0].tenantId;
    const id = selectedTenant[0].id;
    const token = JSON.parse(sessionStorage.getItem("userAuthData")).token;
    const url = "https://cloud.so.ai:8443/API/Model/LoadModel";

    await fetch(url, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        TenantId: tenantId,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        Authorization: "Bearer " + token,
      },
      method: "Post",
      body: JSON.stringify({
        tenantId: tenantId,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((jsonResponse) => {
        console.log("all response", jsonResponse);
        if (jsonResponse.model && jsonResponse.model.configData !== null) {
          setModel(jsonResponse.model);

          let configData =
            JSON.parse(jsonResponse.model.configData).data ||
            JSON.parse(jsonResponse.model.configData);
          // configData = [{...configData}]
          setConfigData([{ ...configData }]);

          console.log("config data ", configData);
          let elements = [];
          configData.elements.map((element) => {
            elements.push(JSON.parse(element.configData));
          });

          setDataCollectionTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "1")) ||
                [],
              elements
            )
          );
          setEarlyDataAnalysisTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "2")) ||
                [],
              elements
            )
          );
          setModelDevelopmentTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "4")) ||
                [],
              elements
            )
          );
          setModelUsageTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "5")) ||
                [],
              elements
            )
          );
          setAllTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "6")) ||
                [],
              elements
            )
          );
          setLegalTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "7")) ||
                [],
              elements
            )
          );
          setOtherTasks(
            getTasksWithForm(
              (configData.tasks &&
                configData.tasks.length > 0 &&
                configData.tasks.filter((task) => task.categoryID === "8")) ||
                [],
              elements
            )
          );

          setLoader("none");
          setShow("block");
          setShowError(false);
        } else {
          console.log(
            "******************* Erooor in get tasks ((((((((((((()))))))))))))))))))000",
            jsonResponse
          );
          setLoader("none");
          setShow("none");
          setShowError(true);
        }
      });
  };

  const secondScreen = (tenent) => {
    changeFirst(false);
    console.log("tenant from notebook");
    changeSecond(true);
    setShowSuccess(false);
    //setShowError(false)
  };

  useEffect(() => {
    if (localStorage.getItem("notebook")) {
      setTenant(JSON.parse(localStorage.getItem("notebook"))[0]);

      setDisable(false);
      getTasks(JSON.parse(localStorage.getItem("notebook")));
    }

    getNotebooks();
  }, []);

  const handleAnswers = (object) => {
    let Answers = [...answers];
    let index = Answers.findIndex((answer) => answer.fldName === object.fldName);
    console.log("Index is ", index);
    if (index === -1) {
      Answers.push(object);
      console.log("Answer is ", Answers);
      setAnswers([...Answers]);
      setSave(true);
    } else {
      Answers[index].fldModel = object.fldModel;
      console.log("Updated Answer is ", Answers);
      setAnswers([...Answers]);
      setSave(true);
    }
  };

  return (
    <React.Fragment>
      {disconnection && logOut && <Redirect to="/" />}
      <CssBaseline />
      <Grid container>
        <SideBar />

        <Grid item xs={11}>
          <Header />
          {first && (
            <div>
              <Box className={classes.box}>
                <InputLabel id="demo-simple-select-filled-label">
                  <h4 style={{ color: "white" }}>Select Notebook</h4>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  fullWidth
                  style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                  // value={age}
                  onChange={handleNotebook}
                >
                  <MenuItem value="none" disabled>
                    <em>Notebook Dropdown</em>
                  </MenuItem>

                  {list.map((ls, index) => {
                    return (
                      <MenuItem key={index} value={ls.name}>
                        {ls.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>

              <Box className={classes.borderBox}>
                {Object.entries(tenant).length > 0 && (
                  <Card
                    className={classes.card}
                    onClick={() => {
                      console.log("Clicked on tenat", tenant);
                      setTenant(tenant);
                      changeFirst(false);
                      changeSecond(true);
                      setShow("block");
                    }}
                  >
                    <CardContent>
                      <Grid container>
                        <Grid item xs={2}>
                          <Typography component="h5" variant="h5" className={classes.heading}>
                            {tenant.name[0].toUpperCase() + tenant.name[1].toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.rightSide}>
                          <div className={classes.description}>
                            <Typography component="h5" variant="h5">
                              {tenant.name}
                            </Typography>
                            <Typography
                              className={classes.truncText}
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              {tenant.description}
                            </Typography>
                            <Typography
                              className={classes.status}
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Active
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                              {tenant.createdBy}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
                {/* {disable ? (
                  <div></div>
                ) : (
                  <Button
                    type='submit'
                    variant='contained'
                    className={classes.btnMain}
                    onClick={secondScreen}
                    disabled={disable}
                  >
                    Next
                  </Button>
                )} */}
              </Box>
            </div>
          )}

          {second && (
            <div>
              {console.log("Tenant on clicking next button", tenant)}
              <Container maxWidth="xs">
                {showSuccess && <Alert severity="success">Model Updated Successfully !</Alert>}
              </Container>

              <Box className={classes.content}>
                <Grid container>
                  <Grid item xs={1}>
                    <Button className={classes.back} onClick={reset}>
                      <ArrowBackOutlinedIcon fontSize="medium" />
                    </Button>
                  </Grid>
                  <Grid item xs={5}>
                    <h3 style={{ marginLeft: "-25px", marginTop: "2px" }}>{tenant.name}</h3>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </Box>
              <Container maxWidth="xs">
                {showError && <Alert severity="error">Something went wrong</Alert>}
              </Container>

              {show === "none" ? (
                <CircularProgress
                  className={classes.progress}
                  size={40}
                  thickness={4}
                  value={100}
                />
              ) : (
                <div></div>
              )}

              {loader === "none" && !showError ? (
                <div
                  style={{
                    display: `${show}`,
                    maxHeight: "400px",
                    paddingBottom: "40px",
                    overflowY: "scroll",
                  }}
                  className="scrollbar"
                >
                  {dataCollectionTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={dataCollectionTasks}
                      onChange={handleAnswers}
                      taskName="Data Collection"
                    />
                  )}
                  {earlyDataAnalysisTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={earlyDataAnalysisTasks}
                      onChange={handleAnswers}
                      taskName="Early Data Analysis"
                    />
                  )}
                  {modelDevelopmentTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={modelDevelopmentTasks}
                      onChange={handleAnswers}
                      taskName="Model Development"
                    />
                  )}
                  {modelUsageTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={modelUsageTasks}
                      onChange={handleAnswers}
                      taskName="Model Usage"
                    />
                  )}
                  {allTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={allTasks}
                      onChange={handleAnswers}
                      taskName="ALL"
                    />
                  )}
                  {legalTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={legalTasks}
                      onChange={handleAnswers}
                      taskName="Legal"
                    />
                  )}
                  {otherTasks.length > 0 && (
                    <Solution
                      selectedTenant={tenant}
                      taskList={otherTasks}
                      onChange={handleAnswers}
                      taskName="Other"
                    />
                  )}
                  {save && (
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.btn3}
                      onClick={UpdateModel}
                    >
                      Save
                    </Button>
                  )}
                </div>
              ) : (
                <CircularProgress
                  className={classes.progress}
                  size={40}
                  thickness={4}
                  value={100}
                />
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
