import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"

import { StoreState } from "~/types"

import { IPluginInfo } from "$plugin/index"
import { PluginState } from "$plugin/redux"
import { pluginScriptStore, pluginStore } from "$utils/database"
import { createObjectURL } from "$utils/url"

const sliceName = "plugins"


const globalMap: Record<string, string> = {
    "@ant-design/icons/lib/icons": "icons",
    "antd": "antd",
    "dayjs": "dayjs",
    "lodash": "lodash",
    "react": "React",
    "react-dom": "ReactDOM",
    "react-dom/client": "ReactDomClient",
}

async function requireJavascript(code: string) {
    const js = code.replace(/import (.*?) from "(react|antd)"/g, (input, $1, $2) => {
        if ($2 in globalMap) {
            return `const ${$1} = window.globals.${globalMap[$2]};`
        }

        return input
    })

    return (await import(/* @vite-ignore */ createObjectURL(js, { type: "application/javascript; charset=utf-8" }))).default
}

export const loadPlugins = createAsyncThunk<PluginState, boolean | void>(
    `${sliceName}/loadPlugins`, async (refresh = false, api) => {
        const store = api.getState() as StoreState
        if (!refresh && store.plugins.ids.length > 0) {
            return store.plugins
        }

        const plugins = await pluginStore.getAll()
        const entities: PluginState["entities"] = {}
        const ids: PluginState["ids"] = []
        for (const plugin of plugins) {
            const instance = await requireJavascript(await pluginScriptStore.get(plugin.id))
            entities[plugin.id] = { ...instance, ...plugin }
            ids.push(plugin.id)
        }

        return { entities, ids }
    },
)

export const pluginSlice = createSlice<PluginState, SliceCaseReducers<PluginState>>({
    name: sliceName,
    initialState: {
        entities: {},
        ids: [],
    },
    reducers: {
        installPlugin(state, { payload: { plugin, script } }: PayloadAction<{ plugin: IPluginInfo, script: string }>) {
            state.entities[plugin.id] = plugin
            state.ids.push(plugin.id)
            void pluginStore.set(plugin)
            void pluginScriptStore.set(plugin.id, script)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadPlugins.fulfilled, (state, { payload }) => {
            // @ts-ignore
            state.entities = payload.entities
            state.ids = payload.ids
        })
    },
})

export const { installPlugin } = pluginSlice.actions