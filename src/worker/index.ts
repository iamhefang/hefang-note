import {emit2main} from "~/common/utils"
import {ExportType, IWorkerMessage, WorkerEventKeys} from "~/types"

import {buildExportJson} from "$utils/notes"

async function doExport(type: ExportType) {
    const json = await buildExportJson()
    if (type.type === "json") {
        emit2main(WorkerEventKeys.exportSuccess, {type, data: json, path: type.path})
    } else if (type.type === "url") {
        const blob = new Blob([json], {type: "application/json;charset=utf-8"})
        const url = URL.createObjectURL(blob)
        emit2main(WorkerEventKeys.exportSuccess, {type, data: url, path: type.path})
    }
}

self.addEventListener("message", (e: MessageEvent<IWorkerMessage>) => {
    console.info("message to worker", e.data)
    const {name, data} = e.data
    switch (name) {
        case WorkerEventKeys.exportStart:
            void doExport(data as ExportType)
            break
        default:
    }
})

