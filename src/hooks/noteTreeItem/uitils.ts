import { marked } from "marked"

import { ContentIOType, PluginHookOccasion } from "~/plugin"
import exportTplHTML from "~/templates/export-html.html?raw"
import { NoteItem } from "~/types"

import ContentIOEvent, { ContentIODirection } from "$plugin/events/ContentIOEvent"
import { callPluginsHook } from "$plugin/utils"
import { contentStore } from "$utils/database"
import { saveFile } from "$utils/file"

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

function convert4export(markdown: string, type: ContentIOType, title: string): [string, string, string] {
    switch (type) {
        case ContentIOType.markdown:
            return [`# ${title}\n\n${markdown}`, "text/markdown", "md"]
        case ContentIOType.html:
            const exportHtml = exportTplHTML
                .replace("$TITLE_PLACEHOLDER$", title)
                .replace("$CONTENT_PLACEHOLDER$", marked(markdown))

            return [exportHtml, "text/html", "html"]
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
                const [finalContent, mimeType, fileExt] = convert4export(event.detail.content, type, title)
                saveFile(finalContent, { mimeType, fileName: `${title}.${fileExt}` }).then(res => {
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
