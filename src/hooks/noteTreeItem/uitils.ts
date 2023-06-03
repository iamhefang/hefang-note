import {message} from "antd"
import TurnDown from "turndown"
import turndownPluginGfm from "turndown-plugin-gfm"

import {ContentIOType, PluginHookOccasion} from "~/plugin"
import exportTplHTML from "~/templates/export-html.html?raw"
import {NoteItem} from "~/types"

import ContentIOEvent, {ContentIODirection} from "$plugin/events/ContentIOEvent"
import {callPluginsHook} from "$plugin/utils"
import {contentStore} from "$utils/database"
import {saveFile} from "$utils/file"

const turndown = new TurnDown({headingStyle: "atx"})
turndown.use(turndownPluginGfm.gfm)

export function getNewNote(item: Partial<NoteItem>): NoteItem {
    return {
        id: crypto.randomUUID(),
        title: item.isLeaf ? "新建笔记" : "新建目录",
        createTime: Date.now(),
        modifyTime: Date.now(),
        isLeaf: true,
        ...item,
    }
}

function convert4export(html: string, type: ContentIOType) {
    switch (type) {
        case ContentIOType.markdown:
            return turndown.turndown(html)
        case ContentIOType.html:
            return html
        default:
            throw new Error("不支持的导出类型")
    }
}

export function doExport(item: NoteItem, type: ContentIOType) {
    contentStore
        .get(item.id)
        .then((content) => {
            const event = callPluginsHook("onContentExport", new ContentIOEvent({
                detail: {
                    item,
                    content,
                    direction: ContentIODirection.export,
                    type,
                },
                occasion: PluginHookOccasion.before,
            }))
            if (event.isDefaultPrevented()) {
                console.warn("插件阻止了导出")

                return
            }
            const title = event.detail.item.title
            const exportHtml = exportTplHTML.replace("$TITLE_PLACEHOLDER$", title).replace("$CONTENT_PLACEHOLDER$", event.detail.content)

            saveFile(convert4export(exportHtml, type), {
                mimeType: "text/html",
                fileName: `${title}.html`,
            }).then(res => {
                callPluginsHook("onContentExport", new ContentIOEvent({
                    detail: event.detail,
                    occasion: PluginHookOccasion.after,
                }))
            }).catch(() => message.error("导出失败"))
        })
        .catch(console.error)
}
