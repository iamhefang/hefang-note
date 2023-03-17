import { configureStore } from "@reduxjs/toolkit"
import _ from "lodash"
import { useDispatch } from "react-redux"

import { settingsStore } from "$utils/database"

import { noteSlice } from "./noteSlice"
import { pluginSlice } from "./pluginSlice"
import { settingSlice } from "./settingSlice"
import { uiSlice } from "./uiSlice"

const store = configureStore({
  reducer: {
    settings: settingSlice.reducer,
    notes: noteSlice.reducer,
    states: uiSlice.reducer,
    plugins: pluginSlice.reducer,
  },
  devTools: import.meta.env.DEV,
})

const saveSettings = _.debounce(() => {
  console.info("正在保存配置")
  void settingsStore.setObject(store.getState().settings)
}, 1000)

store.subscribe(() => {
  saveSettings()
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch

export default store
