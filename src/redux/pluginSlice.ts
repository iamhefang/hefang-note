import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"
import { IPluginInfo, IPluginLoadParams, NoteItem, Settings } from "hefang-note-types"
import { isEmpty, isPlainObject } from "lodash"

import { StoreState } from "~/types"

import { setNotes } from "./noteSlice"
import { setSettings } from "./settingSlice"

import hooksBuilder from "$plugin/hooks/hooksBuilder"
import { PluginState } from "$plugin/redux"
import { contentStore, notesStore, pluginScriptStore, pluginStore } from "$utils/database"
import { createObjectURL } from "$utils/url"

const sliceName = "plugins"

async function requireJavascript(code: string) {
  return (await import(/* @vite-ignore */ createObjectURL(code, { type: "application/javascript; charset=utf-8" })))
    .default
}

export const loadPlugins = createAsyncThunk<PluginState, boolean | void>(
  `${sliceName}/loadPlugins`,
  async (refresh = false, api) => {
    const store = api.getState() as StoreState
    if (!refresh && store.plugins.ids.length > 0) {
      return store.plugins
    }
    const enabledPluginIds = store.settings.plugins
    const plugins = await pluginStore.getAll()
    const entities: PluginState["entities"] = {}
    const ids: PluginState["ids"] = []
    const coreSettings = Object.fromEntries(
      Object.entries(store.settings).filter(([key]) => !key.startsWith("plugin-")),
    ) as Settings

    for (const plugin of plugins) {
      console.group(`正在加载插件: ${plugin.name}`)
      console.info(plugin)
      try {
        const instance = plugin.scriptUrl
          ? (await import(/* @vite-ignore */ plugin.scriptUrl)).default
          : await requireJavascript(await pluginScriptStore.get(plugin.id))

        if (plugin.scriptUrl) {
          entities[plugin.id] = { ...instance, enable: enabledPluginIds.includes(plugin.id) }
        } else {
          entities[plugin.id] = { ...instance, ...plugin, enable: enabledPluginIds.includes(plugin.id) }
        }

        if (entities[plugin.id].enable) {
          const params: IPluginLoadParams = {
            selfSettings: (store.settings?.[`plugin-${plugin.id}`] ?? {}) as Record<string, unknown>,
            coreSettings,
            setSettings(self, core) {
              let newSettings = {
                [`plugin-${plugin.id}`]: self,
              }

              if (plugin.abilities?.includes("synchronization")) {
                if (!isEmpty(core) && isPlainObject(core)) {
                  newSettings = {
                    ...newSettings,
                    ...Object.fromEntries(Object.entries(core).filter(([key]) => !key.startsWith("plugin-"))),
                  }
                }
              }
              api.dispatch(setSettings(newSettings))
            },
            reactHooks: hooksBuilder(plugin.id),
          }

          if (plugin.abilities?.includes("synchronization")) {
            params.notes = store.notes.entities
            params.setNotes = (notes: NoteItem[]) => {
              console.info(`插件"${plugin.name}"(${plugin.id})正在写入笔记`, notes)
              api.dispatch(setNotes(notes))
              void notesStore.set(...notes.map((item) => ({ ...item, syncTime: Date.now() })))
              void contentStore.setObject(Object.fromEntries(notes.map((item) => [item.id, item.content ?? ""])))
            }
          }

          console.log("正在执行插件onLoad钩子")
          entities[plugin.id].onLoad?.(params)
        }

        ids.push(plugin.id)
      } catch (error) {
        console.error(`加载插件 ${plugin.name}(${plugin.id}) 失败`, error)
      }
      console.groupEnd()
    }

    return { entities, ids, loading: false }
  },
)

export const pluginSlice = createSlice<PluginState, SliceCaseReducers<PluginState>>({
  name: sliceName,
  initialState: {
    entities: {},
    ids: [],
    loading: false,
  },
  reducers: {
    installPlugin(state, { payload: { plugin, script } }: PayloadAction<{ plugin: IPluginInfo; script: string }>) {
      state.entities[plugin.id] = plugin
      state.ids.push(plugin.id)
      void pluginStore.set(plugin)
      void pluginScriptStore.set(plugin.id, script)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlugins.pending, (state) => {
      state.loading = true
    })

    builder.addCase(loadPlugins.fulfilled, (state, { payload }) => {
      // @ts-ignore
      state.entities = payload.entities
      state.ids = payload.ids
      state.loading = false
    })

    builder.addCase(loadPlugins.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { installPlugin } = pluginSlice.actions
