import {NoteItem} from "~/types"

import {PluginHookEvent} from "./base"

export  type ContentSaveEventDetail = {
    /**
     * 正在保存内容的笔记信息,不可修改
     */
    readonly note: Readonly<NoteItem>
    /**
     * 要保存的内容,occasion为before时可以被插件修改
     */
    nextContent: string
}

/**
 * 保存内容事件
 */
export class ContentSaveEvent extends PluginHookEvent<ContentSaveEventDetail> {
}

