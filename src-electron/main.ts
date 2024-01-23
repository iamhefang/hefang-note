import {app, BrowserWindow, ipcMain} from "electron"
import path from "path"
import {IpcEvents} from "../src/common/ipcEvents"
import appMenu from "./menus/app"

let window: BrowserWindow | null = null

app.whenReady().then(() => {
    app.applicationMenu = appMenu
    injectChannel()
    createWindow()
})


function injectChannel() {
    ipcMain.on(IpcEvents.SET_THEME_COLOR, (event, color) => {
        window?.setTitleBarOverlay({color})
    })
}

function createWindow() {
    window = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: false,
        titleBarStyle: "hidden",
        titleBarOverlay: true,
        webPreferences: {
            preload: path.resolve(__dirname, "preload.cjs"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    // window.loadFile("index.html")
    window.loadURL("http://localhost:8888")
}