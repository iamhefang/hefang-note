import TurnDown from "turndown"
import * as  turndownPluginGfm from "turndown-plugin-gfm"

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

function convert4export(html: string, type: ContentIOType): [string, string, string] {
    switch (type) {
        case ContentIOType.markdown:
            return [turndown.turndown(html), "text/markdown", "md"]
        case ContentIOType.html:
            return [html, "text/html", "html"]
        default:
            throw new Error("不支持的导出类型")
    }
}

export async function doExport(item: NoteItem, type: ContentIOType): Promise<void> {
    return new Promise((resolve, reject) => {
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

                    return reject("插件阻止了导出")
                }
                const title = event.detail.item.title
                const exportHtml = exportTplHTML.replace("$TITLE_PLACEHOLDER$", title).replace("$CONTENT_PLACEHOLDER$", event.detail.content)
                const [finalContent, mimeType, fileExt] = convert4export(exportHtml, type)
                saveFile(finalContent, {mimeType, fileName: `${title}.${fileExt}`}).then(res => {
                    callPluginsHook("onContentExport", new ContentIOEvent({
                        detail: event.detail,
                        occasion: PluginHookOccasion.after,
                    }))
                    resolve()
                }).catch(error => {
                    console.error("保存文件失败", error)
                    reject(`保存文件失败: ${error}`)
                })
            })
            .catch(error => {
                console.error("导出失败", error)
                reject(`导出失败: ${error}`)
            })
    })
}
