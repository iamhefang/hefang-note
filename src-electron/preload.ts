import {contextBridge, ipcRenderer} from "electron"
import {decl} from "postcss"
import {IpcEvents} from "../src/common/ipcEvents"

const shell = {
    version: "1.0.0",
    platform: process.platform,
    api: {
        setThemeColor(color: string) {
            ipcRenderer.emit(IpcEvents.SET_THEME_COLOR, color)
        },
    },
}
contextBridge.exposeInMainWorld("shell", shell)


declare global {
    interface Window {
        shell: typeof shell
    }
}