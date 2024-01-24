import { contextBridge, ipcRenderer } from "electron"
import { IpcEvents } from "../src/common/ipcEvents"

const shell = {
  version: "1.0.0",
  platform: process.platform,
  arch: process.arch,
  type: "electron",
  api: {
    setThemeColor(colors: { bgColor: string; fgColor?: string }) {
      console.log("preload.ts: setThemeColor", colors)
      ipcRenderer.send(IpcEvents.SET_THEME_COLOR, colors)
    },
    setAlwaysOnTop(value: boolean) {
      ipcRenderer.send(IpcEvents.SET_ALWAYS_ON_TOP, value)
    },
    async isAlwaysOnTop(): Promise<boolean> {
      return await ipcRenderer.invoke(IpcEvents.GET_ALWAYS_ON_TOP)
    },
    exit() {
      ipcRenderer.send(IpcEvents.EXIT_APP)
    },
    window: {
      minimize() {
        ipcRenderer.send(IpcEvents.WINDOW_MINIMIZE)
      },
      maximize() {
        ipcRenderer.send(IpcEvents.WINDOW_MAXIMIZE)
      },
      restore() {
        ipcRenderer.send(IpcEvents.WINDOW_RESTORE)
      },
      toggle() {
        ipcRenderer.send(IpcEvents.TOGGLE_MAXIMIZE)
      },
      async isMaximized() {
        return await ipcRenderer.invoke(IpcEvents.GET_WINDOW_MAXIMIZE)
      },
    },
  },
}
contextBridge.exposeInMainWorld("shell", shell)

declare global {
  interface Window {
    shell?: typeof shell
  }
}
