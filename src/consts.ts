
import pkg from "^/package.json"

export const versionName = pkg.version
export const versionCode = parseInt(pkg.version.replace(/\./g, ""), 10)
export const isInTauri = typeof window !== "undefined" && Reflect.has(window, "__TAURI_IPC__")