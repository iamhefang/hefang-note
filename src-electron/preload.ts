import { contextBridge, ipcRenderer } from "electron"
import { IpcEvents } from "../src/common/ipcEvents"

const shell = {
  version: "1.0.0",
  platform: process.platform,
  arch: process.arch,
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
  },
}
contextBridge.exposeInMainWorld("shell", shell)

declare global {
  interface Window {
    shell: typeof shell
  }
}
