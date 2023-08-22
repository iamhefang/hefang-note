import { App } from "antd"
import { NoteItem } from "hefang-note-types"
import { useCallback } from "react"

import { isInClient, productName } from "~/consts"

import { buildExportJson } from "$utils/notes"
import { createObjectURL } from "$utils/url"

export default function useExportModal() {
  const { message } = App.useApp()

  return useCallback(
    async (notes: NoteItem[], contents: { [id: string]: string }) => {
      if (isInClient) {
        const { dialog, path } = await import("@tauri-apps/api")
        const { writeTextFile } = await import("@tauri-apps/api/fs")

        const downloadDir = await path.downloadDir()
        void dialog
          .save({
            title: "保存笔记数据",
            filters: [{ name: "何方笔记备份文件", extensions: ["hbk"] }],
            defaultPath: await path.join(downloadDir, `${productName}-${Date.now()}`),
          })
          .then(async (res) => {
            if (!res) {
              return
            }
            const loading = message.loading("正在导出")
            const json = await buildExportJson(notes, contents)
            writeTextFile(res, json)
              .then(() => {
                void message.success("导出成功")
              })
              .catch((e) => {
                void message.error(`导出失败:${JSON.stringify(e)}`)
              })
              .finally(loading)
          })
      } else {
        const loading = message.loading("正在导出")
        const json = await buildExportJson(notes, contents)
        const url = createObjectURL(json, { type: "application/json;charset=utf-8" })
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${productName}-${Date.now()}.hbk`)
        document.body.append(link)
        link.click()
        loading?.()
        setTimeout(() => link.remove(), 0)
      }
    },
    [message],
  )
}
