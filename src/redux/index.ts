import { configureStore } from "@reduxjs/toolkit"
import _ from "lodash"
import { useDispatch } from "react-redux"

import { Settings } from "~/types"
import { settingsStore } from "~/utils/database"

import { noteSlice, NoteState } from "./noteSlice"
import { pluginSlice, PluginState } from "./pluginSlice"
import { settingSlice } from "./settingSlice"
import { States, stateSlice } from "./stateSlice"

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

export type StoreState = {
  settings: Settings
  notes: NoteState
  states: States
  plugins: PluginState
}

const store = configureStore({
  reducer: {
    settings: settingSlice.reducer,
    notes: noteSlice.reducer,
    states: stateSlice.reducer,
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
