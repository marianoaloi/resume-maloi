const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

const contextMenu = require('electron-context-menu');

let mainWindow;

contextMenu({
	showSaveImageAs: true
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, `/dist/resume-maloi/favicon.ico`),
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      spellcheck: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, `/dist/resume-maloi/index.html`));
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  // const session = mainWindow.webContents.session;
  // session.getSpellCheckerLanguages(["en"]);
  // session.setSpellCheckerLanguages(["en"]);
  // mainWindow.webContents.on("context-menu", (event, params) => {
  //   console.log("context-menu event : ", event);
  //   console.log("context-menu param : ", params);
  // });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
var fileGlobal;
var lastSaved = new Date();
ipcMain.on("open", async (event, dataScreen) => {
  let options = {
    filters: ["*.json"],
    properties: ["openFile"],
    title: "Open your resume",
  };
  if (fileGlobal) options["defaultPath"] = fileGlobal;
  let files = await dialog.showOpenDialog(options);
  if (!files.canceled) {
    fileGlobal = files.filePaths[0];
    fs.watch(fileGlobal, (eventType, filename) => {
      fs.stat(fileGlobal, function (err, stats) {
        if (stats) {
          var mtime = stats.mtime;
          if (lastSaved != mtime) {
            console.log(
              `Evento ${eventType} arquivo mudado as ${mtime.getTime()} e tem no sistema lastSaved ${lastSaved.getTime()}`
            );
            openfile(event);
          }
        }
      });
    });
    openfile(event);
  }
});

const openfile = (event) => {
  fs.readFile(fileGlobal, "utf8", (err, data) => {
    if (err) console.error(err);
    else {
      event.sender.send("fileToOpen", JSON.parse(data));
    }
  });
};

ipcMain.on("save", async (event, dataScreen, autosave) => {
  let data = dataScreen;
  if (autosave && fileGlobal) {
    save(fileGlobal, data, event);
  } else {
    let options = {
      filters: ["*.json"],
      properties: ["saveFile"],
      title: "Save your resume",
    };
    if (fileGlobal) options["defaultPath"] = fileGlobal;
    let files = await dialog.showSaveDialog(options);
    if (!files.canceled) {
      let file = (fileGlobal = files.filePath);

      save(file, data, event);
    }
  }
});

const save = (file, data, event) => {
  lastSaved = new Date();
  fs.writeFile(file, data, (err) => {
    if (err) throw err;
    // console.log('Data written to file ', lastSaved);
  });

  event.sender.send("fileTosave", `File ${file} saved`);
};
