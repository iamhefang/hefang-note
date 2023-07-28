import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"
import _ from "lodash"

import { Settings } from "~/types"

import { settingsStore } from "$utils/database"

export const defaultSettings: Settings = {
  theme: "auto",
  plugins: [],
  lock: { locked: false, immediately: false },
  showSideBar: true,
  current: "",
  expandItems: {},
  sort: { field: "modifyTime", type: "desc" },
  showEditTime: true,
  autoCheckUpdate: false,
  editor: "default",
  editorOptions: {
    minimap: true,
    fontSize: 14,
    lineHeight: 1.5,
    showLineNumbers: false,
  },
  shortcut: { lock: "CmdOrCtrl+L", closeWindow: "CmdOrCtrl+W" },
  lockedContents: {},
  unlockContentByAppLockPassword: true,
  language: "auto",
}

const sliceName = "settings"

export const loadSettings = createAsyncThunk(`${sliceName}/loadSettings`, async () => {
  return settingsStore.getObject()
})

export const settingSlice = createSlice<Settings, SliceCaseReducers<Settings>>({
  name: sliceName,
  initialState: defaultSettings,
  reducers: {
    /**
     * 锁屏
     * @param state
     * @param action
     */
    lockScreen(state, action) {
      state.lock = { ...state.lock, ...action.payload }
    },
    /**
     * 锁定笔记或目录
     * @param state
     * @param action
     */
    lockContent(state, action: PayloadAction<{ noteId: string; password: string }>) {
      const { noteId, password } = action.payload
      state.lockedContents[noteId] = password
      state.current = noteId
    },
    /**
     * 取消锁定笔记或目录
     * @param state
     * @param action
     */
    cancelLockContent(state, action: PayloadAction<string>) {
      delete state.lockedContents[action.payload]
    },
    /**
     * 切换侧边栏显示状态
     * @param state
     */
    toggleSidebar(state) {
      state.showSideBar = !state.showSideBar
    },
    /**
     * 切换主题
     * @param state
     * @param action
     */
    changeTheme(state, action) {
      state.theme = action.payload
    },
    /**
     * 设置展示的目录
     * @param state
     * @param action
     */
    setItemsExpanded(state, action) {
      for (const [key, value] of Object.entries(action.payload)) {
        if (value) {
          state.expandItems[key] = true
        } else {
          delete state.expandItems[key]
        }
      }
    },
    /**
     * 设置当前笔记
     * @param state
     * @param action
     */
    setCurrent(state, action) {
      state.current = action.payload
    },
    /**
     * 设置排序方式
     * @param state
     * @param action
     */
    setSort(state, action) {
      state.sort = { ...state.sort, ...action.payload }
    },
    /**
     * 同步设置到内存
     * @param state
     * @param action
     */
    setSettings(state, action) {
      _.merge(state, action.payload)
    },
    /**
     * 启用/禁用插件
     * @param state
     * @param action
     */
    switchPlugin(state, action: PayloadAction<string | { id: string; enable: boolean }>) {
      // 要开关的插件的id
      const id = typeof action.payload === "string" ? action.payload : action.payload.id
      // 要把插件设置为的开关状态（新的状态）
      const enable = typeof action.payload === "string" ? !state.plugins.includes(id) : action.payload.enable
      if (enable) {
        state.plugins.push(id)
      } else {
        state.plugins.splice(state.plugins.indexOf(id), 1)
        if (state.editor === id) {
          state.editor = ""
        }
        if (state.theme === id) {
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
  lockScreen,
  lockContent,
  cancelLockContent,
  toggleSidebar,
  changeTheme,
  setItemsExpanded,
  setCurrent,
  setSort,
  setSettings,
  switchPlugin,
} = settingSlice.actions
