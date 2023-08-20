import { NoteItem, Settings } from "hefang-note-types"

import { PluginState } from "$plugin/redux"

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

// /**
//  * 主题类型
//  * "auto" | "light" | "dark" | "eyeshield" | "anti-blue-ray": 内置主题
//  * string: 插件主题
//  */
// export type ThemeType = "auto" | "light" | "dark" | "eyeshield" | "anti-blue-ray" | string
// export type Themes = Record<ThemeType, ThemeDefine>
// export type ThemeDefine = ThemeConfig & { label: ReactNode; tooltip?: string; icon?: ReactNode }

/**
 * UI渲染相关状态
 */
export type UIState = {
  /**
   * 当前是否正在显示设置弹窗
   */
  showSettingsModal: "settings" | "about" | "plugins" | string | false
  /**
   * 是否正在启动
   */
  launching: false | string
  /**
   * 是否正在导出
   */
  exporting: boolean
  /**
   * 已解锁的加锁笔记
   * key: 笔记的id，value: 解锁有效期
   */
  unlockedContents: { [id: string]: number }
  /**
   * 当前右键点击的笔记
   */
  rightClickedItem?: NoteIndentItem
  /**
   * 当前正在搜索的内容
   */
  search: string
}

export type StoreState = {
  settings: Settings
  notes: NoteState
  states: UIState
  plugins: PluginState
}

export type NoteState = {
  /**
   * 所有笔记和目录id
   */
  ids: string[]
  /**
   * 所有笔记和目录id和实体对应关系
   */
  entities: { [id: string]: NoteItem }
  /**
   * 是否正在初始化
   */
  initializing: boolean
  /**
   * 当前状态
   * <ul>
   *     <li><b>loading</b>: 正在从数据库加载笔记</li>
   *     <li><b>idle</b>: 未在执行加载</li>
   *     <li><b>failed</b>: 加载失败</li>
   * </ul>
   */
  status: "loading" | "idle" | "failed"
  /**
   * 当前正在重命名的笔记或目录id
   * <ul>
   *     <li><b><i>string</i></b>: 当前正在重命名的笔记或目录的id</li>
   *     <li><b>new-note</b>: 正在新建笔记</li>
   *     <li><b>new-dir</b>: 正在新建目录</li>
   * </ul>
   */
  renamingId?: string | "new-note" | "new-dir"
}

export type DeleteNotePayload = {
  noteId: string
  deleteChildren?: boolean
}
