import type { ThemeConfig } from "antd"
import type { CSSProperties, ReactNode } from "react"


export type NoteItem = {
  id: string
  title: string
  isLeaf: boolean
  createTime: number
  modifyTime: number
  parentId?: string
  content?: string
}

export type ThemeType = "auto" | "light" | "dark" | "eyeshield" | "anti-blue-ray" | string
export type Themes = Record<ThemeType, ThemeDefine>
export type ThemeDefine = ThemeConfig & { label: ReactNode; tooltip?: string; icon?: ReactNode }
export type Settings = {
  theme: ThemeType;
  /**
   * 当前打开的文件路径
   */
  current: string;
  items: Record<string, NoteItem>;
  title: string;
  showSideBar: boolean;
  lock: {
    locked: boolean;
    password?: string;
    immediately: boolean
  };
  /**
   * 启用的插件id
   */
  plugins: string[];
  expandItems: Record<string, boolean>
  sort: NoteSort
  editor: string
  showTimeAboveEditor: boolean
  autoCheckUpdate: boolean
  editorStyle: CSSProperties
}

export type NoteSort = Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">>

export type GlobalState = Settings & {
  loading: boolean;
  showSettingModal: boolean;
  launching: boolean
  /**
   * 正在重命名的项目id
   */
  renaming: string
}

export type GlobalDispatcher = (state: Partial<GlobalState>) => void

export type Sort<F> = { field: F, type: "asc" | "desc" }
