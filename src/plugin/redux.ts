import { IPlugin } from "./defines"

export type PluginState = {
  entities: { [id: string]: IPlugin }
  ids: string[]
  loading: boolean
}
