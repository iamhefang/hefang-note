import { invoke } from "@tauri-apps/api"

import { isInTauri } from "~/consts"
import { ExportType, IWorkerMessage, WorkerEventKeys } from "~/types"

import pkg from "^/package.json"

const worker = new window.Worker(new URL("../worker/index.ts", import.meta.url), { type: "module" })

console.info(worker)

export function emit2worker(name: WorkerEventKeys, data?: unknown) {
    worker.postMessage({ name, data })
}

worker.addEventListener("message", (e: MessageEvent<IWorkerMessage>) => {
    console.info("message from worker", e.data)
    switch (e.data.name) {
        case WorkerEventKeys.exportSuccess:
            const data = e.data.data as ExportType
            if (isInTauri) {
                void invoke("save_file", { path: data.path, contents: data.data })
            } else {
                const url = data.data
                const link = document.createElement("a")
                link.setAttribute("href", url)
                link.setAttribute("download", `${pkg.productName}-${Date.now()}.hbk`)
                document.body.append(link)
                link.click()
                setTimeout(() => {
                    link.remove()
                }, 0)
            }
            break
        default:
    }
})