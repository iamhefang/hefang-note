import type { ThemeConfig } from "antd"
import { type } from "os"
import type { CSSProperties, ReactNode } from "react"

declare global {
  function isContentEditable(electron: Element | null | EventTarget): boolean
}

export type ValueOrFactory<T, C = unknown> = T | ((c: C) => T)

export const enum WorkerEventKeys {
  startExport = "startExport",
  exportStart = "exportStart",
  exportSuccess = "exportSuccess",
  databaseBlocking = "databaseBlocking",
}

export type ExportType = {
  type: "url" | "json"
  path?: string
  data: string
}

export interface IWorkerMessage<D = unknown> {
  name: WorkerEventKeys
  data: D
}
export type NoteIndentItem = NoteItem & { indent: number }

export type NoteItem = {
  id: string
  title: string
  isLeaf: boolean
  createTime: number
  modifyTime: number
  parentId?: string
  /**
   * @deprecated
   */
  content?: string
}

export type ThemeType = "auto" | "light" | "dark" | "eyeshield" | "anti-blue-ray" | string
export type Themes = Record<ThemeType, ThemeDefine>
export type ThemeDefine = ThemeConfig & { label: ReactNode; tooltip?: string; icon?: ReactNode }
export type DefaultEditorOptions = CSSProperties & { showToolbar: boolean, highlightCodeBlock: boolean }
export type Settings = {
  theme: ThemeType
  /**
   * 当前打开的文件路径
   */
  current: string
  items: Record<string, NoteItem>
  showSideBar: boolean
  lock: {
    locked: boolean
    password?: string
    immediately: boolean
  }
  /**
   * 启用的插件id
   */
  plugins: string[]
  expandItems: Record<string, boolean>
  sort: NoteSort
  editor: string
  showTimeAboveEditor: boolean
  autoCheckUpdate: boolean
  editorOptions: DefaultEditorOptions
  shortcut: { lock: string; closeWindow: string }
  // key: 笔记的id，value: 加密密码
  lockedContents: { [id: string]: string }
  unlockContentByAppLockPassword: boolean
} & { [pluginId: string]: unknown }

export type NoteSort = Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">>

export type UIState = {
  showSettingsModal: boolean
  launching: boolean
  exporting: boolean
  // key: 笔记的id，value: 解锁有效期
  unlockedContents: { [id: string]: number }
}
export type StoreState = {
  settings: Settings
  notes: NoteState
  states: UIState
  plugins: PluginState
}

export type NoteState = {
  ids: string[]
  entities: { [id: string]: NoteItem }
  initializing: boolean
  status: "loading" | "idle" | "failed"
  renamingId?: string
}
export type PluginState = {
  entities: string[]
}
export type GlobalState = Settings & {
  loading: boolean
  showSettingModal: boolean
  launching: boolean
  /**
   * 正在重命名的项目id
   */
  renaming: string
}

export type GlobalDispatcher = (state: Partial<GlobalState>) => void

export type Sort<F> = { field: F; type: "asc" | "desc" }

export type DeleteNotePayload = {
  noteId: string
  deleteChildren?: boolean
}