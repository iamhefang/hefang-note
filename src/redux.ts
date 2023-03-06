import { configureStore } from "@reduxjs/toolkit"
import _ from "lodash"

import { settingsStore } from "~/utils/database"


import { GlobalState, Settings } from "./types"

import pkg from "^/package.json"

const need2save: (keyof Settings)[] = [
  "current",
  "theme",
  "lock",
  "plugins",
  "showSideBar",
  "theme",
  "plugins",
  "title",
  "expandItems",
  "sort",
  "editor",
  "autoCheckUpdate",
  "shortcut",
]

function saveSettings(state: GlobalState | undefined, newState: GlobalState, payload: GlobalState) {
  const newSettings: Partial<Settings> = {}
  for (const item of need2save) {
    if (!_.isUndefined(payload[item]) && state?.[item] !== payload[item]) {
      // @ts-ignore
      newSettings[item] = newState[item]
    }
    if (newSettings.expandItems) {
      for (const [id, expand] of Object.entries(newSettings.expandItems || {})) {
        if (!expand) {
          Reflect.deleteProperty(newSettings.expandItems, id)
        }
      }
    }
  }
  void settingsStore.setObject(newSettings)
}
export const defaultState: Settings = {
  theme: "auto",
  items: {},
  plugins: [],
  title: `${pkg.productName} v${pkg.version}`,
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
  shortcut: { lock: "" },
}


const store = configureStore<GlobalState>({
  preloadedState: {
    ...defaultState,
    launching: true,
    loading: true,
    showSettingModal: false,
    plugins: [],
  },
  reducer: function (state, action) {
    const payload = action.payload || {}
    const newState: GlobalState = { ...state, ...payload }
    if (!newState.title || payload.current) {
      let item = newState.items[newState.current]
      newState.title = `${item?.isLeaf ? `${item.title} - ` : ""}${pkg.productName}`
      if (state?.current !== newState.current) {
        while (item?.parentId) {
          newState.expandItems[item.parentId] = true
          item = newState.items[item.parentId]
        }
      }
    }
    saveSettings(state, newState, payload)

    return _.isEqual(state, newState) ? state! : newState
  },
})



export default store
