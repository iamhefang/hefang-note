import { IPlugin } from "hefang-note-types"

export type PluginState = {
  entities: { [id: string]: IPlugin }
  ids: string[]
  loading: boolean
}
