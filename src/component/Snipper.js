import React, { Fragment } from "react";
import "./Snipper.scss";

// import logoIcon from "../images/logo.png";
import Cropper from "./Cropper";

import Jimp from "jimp";

import CancelIcon from "@material-ui/icons/Cancel";
import { PhotoCamera } from "@material-ui/icons";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import { Button, Tooltip } from "@material-ui/core";

const { ipcRenderer, desktopCapturer, shell, remote } = window.require("electron");
//const homedir = require("os").homedir() + "/soai_app";
const screen = remote.screen;
const electron = window.require("electron");
const BrowserWindow = remote.BrowserWindow;
const dev = process.env.NODE_ENV === "development";
const path = require("path");
const homeDir = window.require("os").homedir() + "/soai";
const screenSize = screen.getPrimaryDisplay().size;
const uuidv4 = require("uuid/v4");
const fs = window.require("fs");
const { post } = require("axios");
let largeIconPath = require("./iconlarge.png");

var mainScreen = screen.getPrimaryDisplay();

let snipWindow = null,
  mainWindow = null;
if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir);
}
class Snipper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.getContext(),

      save_controls: false,
      image: "",
      upload_url: "http://127.0.0.1:8989/upload",
    };
  }
  initCropper(e) {
    console.log("LOGGER", global);
    mainWindow = this.getCurrentWindow();
    // mainWindow.transparent = true
    mainWindow.hide();

    console.log("initCropper", e);
    snipWindow = new BrowserWindow({
      frame: false,
      transparent: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        webSecurity: false,
      },
    });

    snipWindow.on("close", () => {
      snipWindow = null;
    });
    ipcRenderer.once("snip", (event, data) => {
      console.log("IPC RENDERER", data, "EVENT", event);
      this.captureScreen(data, null);
    });
    ipcRenderer.once("cancelled", (event) => {
      console.log("Cancelled called ");
      mainWindow.show();
    });
    ipcRenderer.send("get-path", "asd");
    ipcRenderer.on("new-path", (e, arg) => {
      console.log("Notification created ", arg);
      snipWindow.loadURL(arg);
      snipWindow.maximize();
      snipWindow.show();
    });
    // snipWindow.setResizable(true)
    // snipWindow.webContents.openDevTools();
  }
  getContext() {
    const context = global.location.search;
    console.log("context----", context);
    return context.substr(1, context.length - 1);
  }
  getCurrentWindow() {
    return remote.getCurrentWindow();
  }
  getAllInstances() {
    return BrowserWindow.getAllWindows();
  }
  getMainInstance() {
    let instances = this.getAllInstances();
    return instances.filter((instance) => {
      return instance.id !== this.getCurrentWindow().id;
    })[0];
  }
  destroyCurrentWindow(e) {
    this.getCurrentWindow().close();
  }
  getScreenShot(callback, imageFormat) {
    // console.log("CallBack", callback, "image format", imageFormat);
    let _this = this;
    this.callback = callback;
    imageFormat = imageFormat || "image/png";
    this.handleStream = (stream) => {
      console.log("Handle stream called ", stream);
      // Create hidden video tag
      let video_dom = document.createElement("video");
      video_dom.style.cssText = "position:absolute;top:-10000px;left:-10000px;";
      // Event connected to stream
      video_dom.onloadedmetadata = function () {
        // Set video ORIGINAL height (screenshot)
        video_dom.style.height = this.videoHeight / window.devicePixelRatio + "px"; // videoHeight
        video_dom.style.width = this.videoWidth / window.devicePixelRatio + "px"; // videoWidth
        // Create canvas/
        let canvas = document.createElement("canvas");
        canvas.width = this.videoWidth / window.devicePixelRatio;
        canvas.height = this.videoHeight / window.devicePixelRatio;
        let ctx = canvas.getContext("2d");
        // Draw video on canvas
        ctx.drawImage(video_dom, 0, 0, canvas.width, canvas.height);
        if (_this.callback) {
          // Save screenshot to base64
          _this.callback(canvas.toDataURL(imageFormat));
        } else {
          console.log("Need callback!");
        }
        // Remove hidden video tag
        video_dom.remove();
        try {
          // Destroy connect to stream
          stream.getTracks()[0].stop();
        } catch (e) {
          console.log("Error Detroying connect to stream  , func getScreenshot", e);
        }
      };
      video_dom.srcObject = stream;
      video_dom.play();
      // video_dom.src = URL.createObjectURL(stream);
      document.body.appendChild(video_dom);
    };
    this.handleError = (e) => {
      console.log("Error in stream ", e);
    };
    try {
      desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
        for (let i = 0; i < sources.length; ++i) {
          navigator.getUserMedia_ =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
          if (!!navigator.getUserMedia_) {
            navigator.getUserMedia_(
              {
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: sources[i].id,
                    minWidth: 1280,
                    maxWidth: 8000,
                    minHeight: 720,
                    maxHeight: 8000,
                  },
                },
              },
              this.handleStream,
              this.handleError
            );
          }
          return;
          // if (sources[i].name === "Entire screen") {
          //   try {
          //   } catch (err) {
          //     this.handleError(err);
          //   }
          //   console.log("working++++++++++");
          //   return;
          // }
        }
      });
    } catch (error) {
      console.log("desktop errror ", error);
    }
  }

  updateCropperCordinates = (cord) => {
    let val = screenSize.width * window.devicePixelRatio;
    let errW = (1.66 * val) / 100;
    console.log("errW", errW);

    let valY = screenSize.height * window.devicePixelRatio;
    let errH = (2.4 * valY) / 100;
    console.log("errH", errH);

    let valX = screenSize.width * window.devicePixelRatio;
    let errX = (1.96 * valX) / 100;
    console.log("errW", errX);

    let errorInX = errX;
    let errorInY = errH;
    let errorInWidth = errW;
    let errorInHeight = errH;
    if (cord) {
      console.log("IF CASE=> Coordinates", cord);

      let widthInInt = parseInt(cord.width, 10);
      let heightInInt = parseInt(cord.height, 10);

      let pixelsToAddInXBaseOnErrorInX = (cord.x * errorInX) / 100;
      let pixelsToAddInYBaseOnErrorInY = (cord.y * errorInY) / 100;

      console.log("Add X", pixelsToAddInXBaseOnErrorInX);
      console.log("Add Y", pixelsToAddInYBaseOnErrorInY);

      cord.x += pixelsToAddInXBaseOnErrorInX;
      cord.y += pixelsToAddInYBaseOnErrorInY;

      let widthToAdd = (widthInInt * errorInWidth) / 100;
      let heightToAdd = (heightInInt * errorInHeight) / 100;

      cord.height = heightInInt + heightToAdd;
      cord.width = widthInInt + widthToAdd;

      return cord;
    } else {
      return null;
    }
  };
  captureScreen(coordinates, e) {
    try {
      console.log("coordinates", coordinates, "event", e);
      mainWindow = this.getCurrentWindow();
      mainWindow.hide();
      setTimeout(() => {
        this.getScreenShot((base64data) => {
          // console.log("Get screen shot ", base64data);

          // add to buffer base64 image instead of saving locally in order to manipulate with Jimp
          let encondedImageBuffer = new Buffer(
            base64data.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
            "base64"
          );
          Jimp.read(encondedImageBuffer, (err, image) => {
            if (err) throw err;

            if (
              coordinates &&
              ((coordinates.x === 0 && coordinates.y === 0) || coordinates.y === 0)
            ) {
              coordinates.y = 20;
            }

            let crop = coordinates
              ? image.crop(
                  coordinates.x,
                  coordinates.y,
                  parseInt(coordinates.width, 10),
                  parseInt(coordinates.height, 10)
                )
              : image.crop(0, 0, screenSize.width, screenSize.height);

            crop.getBase64("image/png", (err, base64data) => {
              this.props.setImageState(true);
              this.props.Capture(base64data);
              this.props.setImageFromSnipper(base64data);
              this.props.setShowCropper(false);
              this.props.setShowModal(false);
              this.setState({
                image: base64data,
                save_controls: true,
              });
              this.saveToDisk(base64data);

              // this.resizeWindowFor('snip')
              mainWindow.show();
            });
          });
        });
      }, 200);
    } catch (error) {
      console.log("Error in capturing image", error);
    }
  }
  snip(state, e) {
    this.getMainInstance().webContents.send("snip", state);
    this.destroyCurrentWindow(null);
  }
  destroySnipView(e) {
    this.getMainInstance().webContents.send("cancelled");
    this.destroyCurrentWindow(null);
  }
  resizeWindowFor(view) {
    if (view === "snip") {
      mainWindow.setSize(999, 550);
      let x = screenSize.width / 2 - 400;
      let y = screenSize.height / 2 - 250;
      mainWindow.setPosition(x, y);
    } else if (view === "main") {
      const width = dev ? 999 : 400;
      const height = dev ? 550 : 200;
      mainWindow.setSize(999, 550);
      let x = screenSize.width / 2 - width / 2;
      let y = screenSize.height / 2 - height / 2;
      mainWindow.setPosition(x, y);
    }
  }
  discardSnip(e) {
    this.setState({
      image: "",
      save_controls: false,
    });
    this.resizeWindowFor("main");
  }
  saveToDisk(imageData) {
    const name = "Screenshot-" + Date.now() + ".png";
    const filepath = homeDir + "/" + name;
    this.createNotification();
    localStorage.setItem("fileName", name);

    fs.writeFile(
      homeDir + "/" + name,
      imageData.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
      "base64",
      (err, data) => {
        if (err) {
          console.log("Error==============", err);
        } else {
          shell.showItemInFolder(filepath);
          this.discardSnip(null);
          this.createNotification();
        }
      }
    );
  }
  createNotification() {
    console.log("Directory name ", __dirname);
    let notification = new electron.remote.Notification({
      // icon: largeIconPath,
      title: "SOAI Notifications",
      body: "Screenshot taken successfully.",
      closeButtonText: "Close Button",
      actions: [
        {
          type: "button",
          text: "Show Button",
        },
      ],
    });
    notification.show();
    notification.on("click", () => {
      mainWindow.show();
    });
  }
  uploadAndGetURL(e) {
    post(this.state.upload_url, {
      image: this.state.image,
    })
      .then((response) => {
        const res = response.data;
        if (res.uploaded) {
          shell.openExternal(this.state.upload_url + "/" + res.filename);
          this.discardSnip(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <Fragment>
        {this.state.view === "main" ? (
          <Fragment>
            <div className="snip-controls text-center">
              {/* <span
                className='close'
                title='close'
                onClick={this.destroyCurrentWindow.bind(this)}
              >
                &times;
              </span> */}
              {/* 
              <div>
                <h2>
                  <img height="25" src={require("../images/logo-big.png")} alt="" />
                  Snipper
                </h2>
              </div> */}
              {!this.state.save_controls ? (
                <div style={{ marginTop: "5%" }}>
                  <Tooltip title="Full Screen">
                    <Button onClick={this.captureScreen.bind(this, null)}>
                      <PhotoCamera fontSize="medium" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Partial Screen">
                    <Button onClick={this.initCropper.bind(this)}>
                      <AspectRatioIcon fontSize="medium" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Cancel">
                    <Button
                      onClick={() => {
                        this.props.setImageState(true);

                        this.props.setImageFromSnipper("");
                        this.props.setShowCropper(false);
                      }}
                    >
                      <CancelIcon fontSize="medium" />
                    </Button>
                  </Tooltip>
                </div>
              ) : (
                <div>
                  <button className="btn btn-primary mr-1" onClick={this.saveToDisk.bind(this)}>
                    Save to Disk
                  </button>
                  <button className="btn btn-primary mr-1" onClick={this.discardSnip.bind(this)}>
                    Discard
                  </button>
                </div>
              )}
            </div>
            {this.state.image && (
              <div className="snipped-image">
                <img className="preview" src={this.state.image} alt="" />
              </div>
            )}
          </Fragment>
        ) : (
          <Cropper snip={this.snip.bind(this)} destroySnipView={this.destroySnipView.bind(this)} />
        )}
      </Fragment>
    );
  }
}
export default Snipper;
