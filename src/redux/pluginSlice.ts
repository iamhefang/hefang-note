import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"
import { IPluginInfo, Settings } from "hefang-note-types"

import { StoreState } from "~/types"

import { PluginState } from "$plugin/redux"
import { pluginScriptStore, pluginStore } from "$utils/database"
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
    const baseSettings = Object.fromEntries(
      Object.entries(store.settings).filter(([key]) => !key.startsWith("plugin-")),
    ) as Settings

    for (const plugin of plugins) {
      try {
        const instance = plugin.scriptUrl
          ? (await import(/* @vite-ignore */ plugin.scriptUrl)).default
          : await requireJavascript(await pluginScriptStore.get(plugin.id))

        if (plugin.scriptUrl) {
          entities[plugin.id] = { ...instance, enable: enabledPluginIds.includes(plugin.id) }
        } else {
          entities[plugin.id] = { ...instance, ...plugin, enable: enabledPluginIds.includes(plugin.id) }
        }

        entities[plugin.id].onLoad?.(
          (store.settings?.[`plugin-${plugin.id}`] ?? {}) as Record<string, unknown>,
          baseSettings,
        )

        ids.push(plugin.id)
      } catch (error) {
        console.error(`加载插件 ${plugin.name}(${plugin.id}) 失败`, error)
      }
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
