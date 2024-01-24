import { Arch, OsType } from "@tauri-apps/api/os"

import pkg from "^/package.json"

export const serverHost = import.meta.env.DEV ? "http://localhost:3333" : "https://note.hefang.app"

export const versionName = pkg.version
export const productName = pkg.productName
export const productDescription = pkg.description
export const versionCode = parseInt(pkg.version.replace(/\./g, ""), 10)
export const isInElectron = window.shell?.type === "electron"
export const isInTauri = typeof window !== "undefined" && Reflect.has(window, "__TAURI_IPC__")
export const isInClient = isInElectron || isInTauri
export const isInWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope

export const clientUrls: Partial<Record<`${OsType}-${Arch}`, string>> = {
  "Darwin-x86_64": "https://iamhefang.cn/tools/notebook/releases/何方笔记_x64.dmg",
  "Windows_NT-x86_64": "https://iamhefang.cn/tools/notebook/releases/何方笔记_x64_zh-CN.msi",
}
