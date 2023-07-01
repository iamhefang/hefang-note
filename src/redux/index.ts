import {configureStore} from "@reduxjs/toolkit"
import _ from "lodash"
import {useDispatch} from "react-redux"


import {noteSlice} from "./noteSlice"
import {pluginSlice} from "./pluginSlice"
import {defaultSettings, settingSlice} from "./settingSlice"
import {uiSlice} from "./uiSlice"

import {settingsStore} from "$utils/database"

const store = configureStore({
    reducer: {
        settings: settingSlice.reducer,
        notes: noteSlice.reducer,
        states: uiSlice.reducer,
        plugins: pluginSlice.reducer,
    },
    devTools: import.meta.env.DEV,
})

let lastSettings = defaultSettings

const saveSettings = _.debounce(() => {
    const newSettings = store.getState().settings
    if (!_.isEqual(lastSettings, newSettings)) {
        void settingsStore.setObject(newSettings)
        lastSettings = newSettings
    }
}, 1000)

store.subscribe(() => {
    saveSettings()
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch

export default store
