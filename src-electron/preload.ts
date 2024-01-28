import { contextBridge, ipcRenderer } from "electron"

import { IpcEvents } from "~/common/ipcEvents"
import { IListeners, INativeBridge } from "~/common/nativeBridge"

const shell: INativeBridge = {
  debug: false,
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
      return ipcRenderer.invoke(IpcEvents.GET_ALWAYS_ON_TOP)
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
        return ipcRenderer.invoke(IpcEvents.GET_WINDOW_MAXIMIZE)
      },
      async isMinimized() {
        return ipcRenderer.invoke(IpcEvents.GET_WINDOW_MINIMIZE)
      },
    },
    listeners: {
      on(event: IpcEvents, listener: () => void): IListeners {
        console.log("preload.ts: on", event, listener)
        ipcRenderer.on(event, listener)

        return this
      },
      off(event: IpcEvents, listener: () => void): IListeners {
        console.log("preload.ts: off", event, listener)
        ipcRenderer.off(event, listener)

        return this
      },
      once(event: IpcEvents, listener: () => void): IListeners {
        console.log("preload.ts: once", event, listener)
        ipcRenderer.once(event, listener)

        return this
      },
      removeAllListeners(event: IpcEvents): IListeners {
        console.log("preload.ts: removeAllListeners", event)
        ipcRenderer.removeAllListeners(event)

        return this
      },
    },
  },
}
contextBridge.exposeInMainWorld("shell", shell)

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    shell?: typeof shell
  }
}
