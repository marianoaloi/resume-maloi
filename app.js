const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require("url");
const path = require("path");
const fs = require("fs")

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, `dist/resume-maloi/favicon.ico`),
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: true,
            nodeIntegration: true, enableRemoteModule: true, contextIsolation: false
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `dist/resume-maloi/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
var fileGlobal;
ipcMain.on('open', async (event, dataScreen) => {

    let options = { filters: ["*.json"], properties: ['openFile'], title: "Open your resume" }
    if (fileGlobal)
        options["defaultPath"] = fileGlobal
    let files = await dialog.showOpenDialog(options)
    if (!files.canceled) {
        fs.readFile(files.filePaths[0], 'utf8', (err, data) => {
            if (err)
                console.error(err)
            else {
                event.sender.send('fileToOpen', JSON.parse(data));
                fileGlobal = files.filePaths[0]
            }
        })

    }

})


ipcMain.on('save', async (event, dataScreen, autosave) => {
    let data = JSON.stringify(dataScreen, null, 4)
    if (autosave && fileGlobal) {
        save(fileGlobal, data, event)
    } else {
        let options = { filters: ["*.json"], properties: ['saveFile',], title: "Save your resume" }
        if (fileGlobal)
            options["defaultPath"] = fileGlobal
        let files = await dialog.showSaveDialog(options)
        if (!files.canceled) {
            let file = fileGlobal = files.filePath

            save(file, data, event)

        }
    }

})

const save = (file, data, event) => {
    fs.writeFile(file, data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    })

    event.sender.send('fileTosave', `File ${file} saved`);
}