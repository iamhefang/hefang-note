import { createAsyncThunk, createSlice, SliceCaseReducers } from "@reduxjs/toolkit"
import _ from "lodash"

import { Settings } from "~/types"
import { settingsStore } from "~/utils/database"


export const defaultState: Settings = {
    theme: "auto",
    items: {},
    plugins: [],
    lock: { locked: false, immediately: false },
    showSideBar: true,
    current: "",
    expandItems: {},
    sort: { field: "modifyTime", type: "desc" },
    showTimeAboveEditor: true,
    autoCheckUpdate: false,
    editor: "default",
    editorStyle: {
        fontFamily: "inherit",
        fontSize: "inherit",
    },
    shortcut: { lock: "Ctrl+L" },
}
const sliceName = "settings"

export const loadSettings = createAsyncThunk(`${sliceName}/loadSettings`, async () => {
    const settings = await settingsStore.getObject()

    return settings
})


export const settingSlice = createSlice<Settings, SliceCaseReducers<Settings>>({
    name: sliceName,
    initialState: defaultState,
    reducers: {
        lockScreen(state, action) {
            state.lock = { ...state.lock, ...action.payload }
        },
        toggleSidebar(state) {
            state.showSideBar = !state.showSideBar
        },
        changeTheme(state, action) {
            state.theme = action.payload
        },
        setItemsExpanded(state, action) {
            for (const [key, value] of Object.entries(action.payload)) {
                if (value) {
                    state.expandItems[key] = true
                } else {
                    delete state.expandItems[key]
                }
            }
        },
        setCurrent(state, action) {
            state.current = action.payload
        },
        setSort(state, action) {
            state.sort = { ...state.sort, ...action.payload }
        },
        setSettings(state, action) {
            _.merge(state, action.payload)
        },
    },
    extraReducers(builder) {
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            _.merge(state, action.payload)
        })
    },
})


export const { lockScreen, toggleSidebar, changeTheme, setItemsExpanded, setCurrent, setSort, setSettings } = settingSlice.actions
