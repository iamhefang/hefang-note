import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"
import _ from "lodash"

import { Settings } from "~/types"

import { settingsStore } from "$utils/database"

export const defaultSettings: Settings = {
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
        lineHeight: 1.2,
    },
    shortcut: { lock: "CmdOrCtrl+L", closeWindow: "CmdOrCtrl+W" },
    lockedContents: {},
    unlockContentByAppLockPassword: true,
}
const sliceName = "settings"

export const loadSettings = createAsyncThunk(`${sliceName}/loadSettings`, async () => {
    const settings = await settingsStore.getObject()

    return settings
})

export const settingSlice = createSlice<Settings, SliceCaseReducers<Settings>>({
    name: sliceName,
    initialState: defaultSettings,
    reducers: {
        lockScreen(state, action) {
            state.lock = { ...state.lock, ...action.payload }
        },
        lockContent(state, action: PayloadAction<{ noteId: string, password: string }>) {
            const { noteId, password } = action.payload
            state.lockedContents[noteId] = password
        },
        cancelLockContent(state, action: PayloadAction<string>) {
            delete state.lockedContents[action.payload]
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
        switchPlugin(state, action: PayloadAction<string>) {
            const index = state.plugins.indexOf(action.payload)
            if (index === -1) {
                state.plugins.push(action.payload)
            } else {
                state.plugins.splice(index, 1)
                if (state.editor === action.payload) {
                    state.editor = ""
                }
                if (state.theme === action.payload) {
                    state.theme = "auto"
                }
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            _.merge(state, action.payload)
        })
    },
})

export const {
    lockScreen, lockContent, cancelLockContent,
    toggleSidebar, changeTheme,
    setItemsExpanded, setCurrent, setSort, setSettings,
    switchPlugin,
} = settingSlice.actions
