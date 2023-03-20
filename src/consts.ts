
import { Arch, OsType } from "@tauri-apps/api/os"

import pkg from "^/package.json"

export const versionName = pkg.version
export const productName = pkg.productName
export const versionCode = parseInt(pkg.version.replace(/\./g, ""), 10)
export const isInTauri = typeof window !== "undefined" && Reflect.has(window, "__TAURI_IPC__")
export const isInWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope

export const clientUrls: Partial<Record<`${OsType}-${Arch}`, string>> = {
    "Darwin-x86_64": "https://iamhefang.cn/tools/notebook/releases/何方笔记_x64.dmg",
    "Windows_NT-x86_64": "https://iamhefang.cn/tools/notebook/releases/何方笔记_x64_zh-CN.msi",
}