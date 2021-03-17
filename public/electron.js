const electron = require("electron");
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const Notification = electron.Notification;
const path = require("path");
const fs = require("fs").promises;
const _fs = require("fs");
const isDev = require("electron-is-dev");
const ipcMain = electron.ipcMain;
const screenshot = require("screenshot-desktop");
const homedir = require("os").homedir() + "/soai";
const filePath = require("os").homedir() + "/soai" + "/hotKeys.json";
const settings = require("electron-settings");
const keytar = require("keytar");
let hotKeys = {
  minimize: "CmdOrCtrl+G",
  maximize: "CmdOrCtrl+O",
  hide: "CmdOrCtrl+H",
  capture: "Alt+1",
};
let smallIconPath = path.join(__dirname, "icon.png");
let largeIconPath = path.join(__dirname, "iconlarge.png");

let mainWindow = null;

ipcMain.on("get-path", async (event) => {
  event.reply(
    "new-path",
    isDev
      ? path.join("http://localhost:3000/") + "?snip"
      : `file://${path.join(__dirname, "../build/index.html") + "?snip"}`
  );
});
function trayIcon() {
  appIcon = new Tray(smallIconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Screenshot",
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send("tray-screen-shot", true);
        console.log("tray screen shot");
      },
      type: "normal",
    },
    {
      label: "SOAI",
      click: () => mainWindow.show(),
      type: "normal",
    },
    {
      label: "Quit",
      accelerator: "CmdOrCtrl+W",
      type: "normal",
      click: () => {
        mainWindow.destroy(), app.quit();
      },
    },
  ]);
  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu);
}
// set into electron settings
function capture() {}
// A function to create Notification at electron level
function createNotification(body) {
  let notification = new Notification({
    icon: largeIconPath,
    title: "SOAI Notifications",

    body: body,
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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 999,
    height: 550,
    frame: false,
    resizable: false,
    icon: largeIconPath,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  // mainWindow.setContentProtection(true)
  //  mainWindow.loadURL(path.join('http://localhost:3000/') + '?main')
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000?main"
      : `file://${path.join(__dirname, "../build/index.html?main")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
  globalShortcut.register(hotKeys.minimize, () => {
    mainWindow.minimize();
  });
  globalShortcut.register(hotKeys.maximize, () => {
    mainWindow.show();
  });
  globalShortcut.register(hotKeys.hide, () => {
    mainWindow.hide();
  });

  globalShortcut.register(hotKeys.capture, () => {
    // capture()
    mainWindow.webContents.send("hot-key-screen-shot", true);
  });
}
/// **************** Filing Part ****************************//

const writeFile = () => {
  fs.writeFile(filePath, JSON.stringify(hotKeys), (error) => {
    if (error) {
      console.log("Error", error);
    } else {
      console.log("File is made");
    }
  });
};
const readFile = async () => {
  hotKeys = await fs.readFile(filePath, "utf8");
  hotKeys = JSON.parse(hotKeys);
  return hotKeys;
};
function createFile() {
  if (!_fs.existsSync(filePath)) {
    writeFile();
    return true;
  } else {
    return false;
  }
}
//******************************************************* */
app.on("ready", async () => {
  if (!createFile()) {
    await readFile();
    // console.log("Read a file now",hotKeys)
  }
  createWindow();
  console.log("Window ready");
  trayIcon();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// An ipc-main functions to be called from a chiiled process (renderer process)
ipcMain.on("create-notification", async (event, arg) => {
  //console.log("Notification will be called ")
  createNotification(arg);
  event.reply("notification", arg);
});

ipcMain.on("save-keys", async (event, arg) => {
  //  console.log("This is called called" , arg)
  let flag = 0;

  if (arg.minimize) {
    globalShortcut.unregister(hotKeys.minimize);
    hotKeys.minimize = arg.minimize;
    globalShortcut.register(hotKeys.minimize, () => {
      mainWindow.minimize();
    });

    flag = 1;
  }
  if (arg.maximize) {
    globalShortcut.unregister(hotKeys.maximize);
    hotKeys.maximize = arg.maximize;
    globalShortcut.register(arg.maximize, () => {
      mainWindow.show();
    });

    flag = 1;
  }
  if (arg.Capture) {
    globalShortcut.unregister(hotKeys.capture);
    globalShortcut.register(arg.Capture, () => {
      capture();
    });
    hotKeys.capture = arg.Capture;

    flag = 1;
  }
  if (arg.Hide) {
    globalShortcut.unregister(hotKeys.hide);
    hotKeys.hide = arg.Hide;
    globalShortcut.register(arg.Hide, () => {
      mainWindow.hide();
    });

    flag = 1;
  }
  if (flag) {
    fs.unlink(filePath, (err) => {
      if (err) console.log("error", err);
    });
    writeFile();
    event.reply("key-reply", "Saved");
  } else {
    event.reply("key-reply", "none");
  }
});

ipcMain.on("take-screenshot", (event, arg) => {
  // console.log("File Name " , arg)
  screenshot({ filename: homedir + "/" + arg }).then((img) => {
    console.log("Captured");
    createNotification();
  });
});
