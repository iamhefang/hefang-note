import { configureStore } from "@reduxjs/toolkit"
import _ from "lodash"
import { useDispatch } from "react-redux"

import { Settings } from "~/types"
import { settingsStore } from "~/utils/database"

import { noteSlice } from "./noteSlice"
import { pluginSlice } from "./pluginSlice"
import { settingSlice } from "./settingSlice"
import { uiSlice } from "./uiSlice"

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
  shortcut: { lock: "CmdOrCtrl+L", closeWindow: "CmdOrCtrl+W" },
}


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
