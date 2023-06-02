import {WorkerEventKeys} from "~/types"

export function emit2main(name: WorkerEventKeys, data?: unknown) {
    self.postMessage({name, data})
}
