import {PluginHookEvent} from "~/plugin"
import {NoteItem} from "~/types"

export  type ContentIOEventDetail = {
    /**
     * 正在导入或导出的笔记信息
     */
    item: NoteItem
    /**
     * 正在导入或导出的笔记内容
     */
    content: string
    readonly direction: ContentIODirection
    readonly type: ContentIOType
}

export enum ContentIOType {
    pdf = "pdf",
    html = "html",
    markdown = "markdown"
}

export enum ContentIODirection {
    import = "import",
    export = "export"
}

/**
 * 笔记导入导出事件
 */
export default class ContentIOEvent extends PluginHookEvent<ContentIOEventDetail> {
}