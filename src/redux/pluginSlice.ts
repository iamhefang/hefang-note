import {createSlice, SliceCaseReducers} from "@reduxjs/toolkit"

import {PluginState} from "~/types"

const sliceName = "plugins"


export const pluginSlice = createSlice<PluginState, SliceCaseReducers<PluginState>>({
    name: sliceName,
    initialState: {
        entities: [],
    },
    reducers: {},
})