import {save} from "@tauri-apps/api/dialog"
import {writeFile} from "@tauri-apps/api/fs"

import {isInTauri} from "~/consts"


export type DownloadFileOptions = {
    mimeType?: string
    fileName?: string
}

export function saveFile(content: string, options?: DownloadFileOptions) {
    if (isInTauri) {
        save({title: "保存文件", defaultPath: options?.fileName}).then(filePath => {
            if (!filePath) {
                return
            }
            writeFile(filePath, content).catch(console.error)
        }).catch(console.error)
    } else {
        const a = document.createElement("a")
        a.style.display = "none"
        const blob = new Blob([content], {type: options?.mimeType || "text/plain"})
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = options?.fileName || "何方笔记.txt"
        document.body.appendChild(a)
        a.click()
        setTimeout(() => a.remove(), 0)
    }
}