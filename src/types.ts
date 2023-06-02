import type {ThemeConfig} from "antd"
import type {ReactNode} from "react"

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
    /**
     * 笔记或目录id
     */
    id: string
    /**
     * 笔记或目录标题
     */
    title: string
    /**
     * 是否是笔记
     */
    isLeaf: boolean
    /**
     * 创建时间
     */
    createTime: number
    /**
     * 修改时间
     */
    modifyTime: number
    /**
     * 父目录id
     */
    parentId?: string
    /**
     * 笔记内容
     * @deprecated 笔记内容不再保存到笔记中，而是保存到数据库contentStore中
     */
    content?: string
}

/**
 * 主题类型
 * "auto" | "light" | "dark" | "eyeshield" | "anti-blue-ray": 内置主题
 * string: 插件主题
 */
export type ThemeType = "auto" | "light" | "dark" | "eyeshield" | "anti-blue-ray" | string
export type Themes = Record<ThemeType, ThemeDefine>
export type ThemeDefine = ThemeConfig & { label: ReactNode; tooltip?: string; icon?: ReactNode }
export type DefaultEditorOptions = { showLineNumbers: boolean; fontSize: number; lineHeight: number; minimap: boolean }
export type Settings = {
    theme: ThemeType
    /**
     * 当前打开的笔记id
     */
    current: string
    /**
     * 是否显示侧边栏
     */
    showSideBar: boolean
    /**
     * 锁屏
     */
    lock: {
        /**
         * 当前是否已锁定
         */
        locked: boolean
        /**
         * 解锁密码
         */
        password?: string
        /**
         * 点击锁屏后是否不再弹窗提示弹窗
         */
        immediately: boolean
    }
    /**
     * 启用的插件id
     */
    plugins: string[]
    /**
     * 展示的目录
     */
    expandItems: Record<string, boolean>
    /**
     * 排序方式
     */
    sort: NoteSort
    /**
     * 编辑器
     * <b>default</b>: 内置编辑器
     * <i>string</i>: 插件编辑器
     */
    editor: string
    /**
     * 是否显示编辑时间
     */
    showEditTime: boolean
    /**
     * 是否自动检查更新
     */
    autoCheckUpdate: boolean
    /**
     * 内置编辑器配置项
     */
    editorOptions: DefaultEditorOptions
    /**
     * 快捷键
     */
    shortcut: { lock: string; closeWindow: string }
    /**
     * 笔记或目录是否加密
     * key: 笔记的id，value: 加密密码
     */
    lockedContents: { [id: string]: string }
    /**
     * 是否可以使用锁屏密码解锁笔记和目录
     */
    unlockContentByAppLockPassword: boolean
    /**
     * 软件语言
     */
    language: "auto" | string
} & { [pluginId: string]: unknown }

export type NoteSort = Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">>

/**
 * UI渲染相关状态
 */
export type UIState = {
    /**
     * 当前是否正在显示设置弹窗
     */
    showSettingsModal: boolean
    /**
     * 是否正在启动
     */
    launching: boolean
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
export type PluginState = {
    entities: string[]
}

export type Sort<F> = { field: F; type: "asc" | "desc" }

export type DeleteNotePayload = {
    noteId: string
    deleteChildren?: boolean
}
