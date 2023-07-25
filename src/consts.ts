import { Arch, OsType } from "@tauri-apps/api/os"

import pkg from "^/package.json"

export const serverHost = import.meta.env.DEV ? "http://localhost:3333" : "https://note.hefang.app"

export const versionName = pkg.version
export const productName = pkg.productName
export const productDescription = pkg.description
export const versionCode = parseInt(pkg.version.replace(/\./g, ""), 10)
export const isInClient = typeof window !== "undefined" && Reflect.has(window, "__TAURI_IPC__")
export const isInWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope
export const isLocalhost = window.location.hostname === "localhost"
