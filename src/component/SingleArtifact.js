import React from "react";

import {
  Grid,
  Typography,
  CardContent,
  Tooltip,
  Card,
  makeStyles,
  Button,
} from "@material-ui/core";

import GetAppIcon from "@material-ui/icons/GetApp";
import Spinner from "./Spinner";
import ClearIcon from "@material-ui/icons/Clear";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import fileDownload from "react-file-download";
const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),

    width: theme.spacing(40),
    background: "#121212",
  },

  description: {
    marginLeft: theme.spacing(1),
  },
  imageGrid: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  nameGrid: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
}));

const { ipcRenderer } = window.require("electron");

function SingleArtifact({ art, getArtifacts }) {
  const [fileDownloading, setFileDownloading] = React.useState(false);
  const [isImage, setIsImage] = React.useState(false);
  const [imageBase64, setImageBase64] = React.useState("");
  const [isAudio, setIsAudio] = React.useState(false);
  const [audio, setAudio] = React.useState("");
  const classes = useStyles();

  React.useEffect(() => {
    getArtifactData(art);
  }, []);

  const downloadFile = async (art) => {
    setFileDownloading(true);
    const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
    const token = sessionData.token;

    const url = `https://cloud.so.ai:8443/API/Model/DownloadFile?fileId=${art.id}&fileType=${art.type}&tenantId=${art.tenantId}`;

    await fetch(url, {
      headers: {
        TenantId: art.tenantId,
        Authorization: "Bearer " + token,

        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
      method: "Get",
    })
      .then((res) => res.blob())
      .then((jsonResponse) => {
        console.log("Json response from file download => ", jsonResponse);
        fileDownload(jsonResponse, art.name);
        ipcRenderer.send("create-notification", "Artifact downloaded successfully.");
        ipcRenderer.on("notification", (e, arg) => {
          console.log("Notification created ", arg);
        });
        setFileDownloading(false);
      })
      .catch((err) => {
        setFileDownloading(false);
      });
  };

  const getArtifactData = async (art) => {
    const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
    const token = sessionData.token;

    const url = `https://cloud.so.ai:8443/API/Model/DownloadFile?fileId=${art.id}&fileType=${art.type}&tenantId=${art.tenantId}`;

    await fetch(url, {
      headers: {
        TenantId: art.tenantId,
        Authorization: "Bearer " + token,

        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
      method: "Get",
    })
      .then((res) => res.blob())
      .then((jsonResponse) => {
        var reader = new FileReader();
        reader.readAsDataURL(jsonResponse);
        reader.onloadend = function () {
          var base64data = reader.result;
          let checkMimeType = base64data.slice(5, 10);
          if (checkMimeType === "image") {
            setImageBase64(base64data);
            setIsImage(true);
            setIsAudio(false);
          } else if (checkMimeType === "appli") {
            var res = base64data.split(";");
            let val = "data:audio/wav;" + res[1];
            setIsImage(false);
            setIsAudio(true);
            setAudio(val);
          } else {
            setIsImage(false);
            setIsAudio(false);
          }
        };
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const removeArtifact = async (art) => {
    const tenantId = art.tenantId;
    const fileType = art.type;
    const fileId = art.id;

    const sessionData = JSON.parse(sessionStorage.getItem("userAuthData"));
    const token = sessionData.token;
    const url = "https://cloud.so.ai:8443/API/Model/RemoveFile";
    const raw = {
      tenantId: tenantId,
      fileType: fileType,
      fileId: fileId,
    };

    //fetch will come below

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
        ipcRenderer.send("create-notification", "Artifact deleted successfully.");
        ipcRenderer.on("notification", (e, arg) => {
          console.log("Notification created ", arg);
        });
        getArtifacts();
      });
  };
  return (
    <div>
      <Grid item xs={7}>
        <Card className={classes.card}>
          <CardContent>
            <Grid container>
              <Grid className={classes.imageGrid}>
                {isImage ? (
                  <img
                    src={imageBase64}
                    width="400"
                    height="400"
                    style={{
                      display: "block",
                      maxWidth: "230px",
                      maxHeight: "130px",
                      minHeight: "130px",
                      minWidth: "230px",
                      width: "auto",
                      height: "auto",
                    }}
                    alt={`${art.name}`}
                  />
                ) : isAudio ? (
                  <audio controls src={audio} style={{ marginTop: "40px", marginBottom: "34px" }} />
                ) : (
                  <InsertDriveFileIcon style={{ fontSize: "130" }} />
                )}
              </Grid>
              <Grid item className={classes.nameGrid}>
                <div className={classes.description}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {art.name.length >= 15 ? art.name.slice(0, 14) + "..." : art.name}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={8}></Grid>
              <Grid item xs={2}>
                {!fileDownloading ? (
                  <Button>
                    <Tooltip title="Download">
                      <GetAppIcon
                        onClick={() => {
                          downloadFile(art);
                        }}
                        fontSize="medium"
                      />
                    </Tooltip>
                  </Button>
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      marginLeft: "5px",
                    }}
                  >
                    <Spinner />
                  </div>
                )}
              </Grid>

              <Grid item xs={2}>
                <Button>
                  <Tooltip title="Delete">
                    <ClearIcon
                      onClick={() => {
                        console.log("Artifact on clear button", art);

                        removeArtifact(art);
                      }}
                      fontSize="medium"
                    />
                  </Tooltip>
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default SingleArtifact;
