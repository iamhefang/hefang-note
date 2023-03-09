
import { ExportType, IWorkerMessage, WorkerEventKeys } from "~/types"
import { buildExportJson } from "~/utils/notes"

function emit(name: WorkerEventKeys, data?: unknown) {
    self.postMessage({ name, data })
}

async function doExport(type: ExportType) {
    const json = await buildExportJson()
    if (type.type === "json") {
        emit(WorkerEventKeys.exportSuccess, { type, data: json, path: type.path })
    } else if (type.type === "url") {
        const blob = new Blob([json], {
            type: "application/json;charset=utf-8",
        })
        const url = URL.createObjectURL(blob)
        emit(WorkerEventKeys.exportSuccess, { type, data: url, path: type.path })
    }
}


self.addEventListener("message", (e: MessageEvent<IWorkerMessage>) => {
    const { name, data } = e.data
    console.info("message to worker", e.data)
    switch (name) {
        case WorkerEventKeys.exportStart:
            void doExport(data as ExportType)
            break
        default:
    }
})

