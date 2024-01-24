import { existsSync, writeFile } from "fs"
import path from "path"

import { app, BrowserWindow, ipcMain, TitleBarOverlayOptions } from "electron"

import { IpcEvents } from "../src/common/ipcEvents"

import appMenu from "./menus/app"

let window: BrowserWindow | null = null

function injectChannel() {
  ipcMain
    .on(IpcEvents.SET_THEME_COLOR, (event, colors) => {
      console.log("ipcMain.on: SET_THEME_COLOR", colors)
      window?.setTitleBarOverlay?.({
        color: colors.bgColor,
        symbolColor: colors.fgColor,
      })
      const configPath = path.resolve(app.getPath("userData"), "config.json")
      writeFile(
        configPath,
        JSON.stringify({
          titleBarOverlay: {
            color: colors.bgColor,
            symbolColor: colors.fgColor,
          },
        }),
        "utf-8",
        () => {},
      )
    })
    .on(IpcEvents.SET_ALWAYS_ON_TOP, (e, value) => {
      window?.setAlwaysOnTop(value)
    })
    .on(IpcEvents.GET_ALWAYS_ON_TOP, (e) => {
      e.returnValue = window?.isAlwaysOnTop ?? false
    })
    .on(IpcEvents.GET_WINDOW_MAXIMIZE, (e) => {
      e.returnValue = window?.isMaximized ?? false
    })
    .on(IpcEvents.WINDOW_MAXIMIZE, (e) => {
      window?.maximize()
    })
    .on(IpcEvents.WINDOW_RESTORE, () => {
      window?.restore()
    })
    .on(IpcEvents.WINDOW_MINIMIZE, () => {
      window?.minimize()
    })
    .on(IpcEvents.TOGGLE_MAXIMIZE, () => {
      window?.isMaximized() ? window?.restore() : window?.maximize()
    })
    .on(IpcEvents.EXIT_APP, () => {
      app.exit(0)
    })
}

function createWindow() {
  const configPath = path.resolve(app.getPath("userData"), "config.json")
  let backgroundColor: string | undefined
  const titleBarOverlay: TitleBarOverlayOptions = {
    height: 30,
  }
  if (existsSync(configPath)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const lastConfig = require(configPath)
    console.log(configPath, lastConfig)
    titleBarOverlay.color = lastConfig.titleBarOverlay.color
    titleBarOverlay.symbolColor = lastConfig.titleBarOverlay.symbolColor
    backgroundColor = titleBarOverlay.color
  }
  window = new BrowserWindow({
    width: 1024,
    height: 768,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay,
    backgroundColor,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // window.loadFile("index.html")
  void window.loadURL("http://localhost:8888")
}
void app.whenReady().then(() => {
  app.applicationMenu = appMenu
  injectChannel()
  createWindow()
})
