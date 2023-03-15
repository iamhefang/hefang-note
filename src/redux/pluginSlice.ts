import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit"

const sliceName = "plugins"


export const pluginSlice = createSlice<PluginState, SliceCaseReducers<PluginState>>({
    name: sliceName,
    initialState: {
        entities: [],
    },
    reducers: {},
})