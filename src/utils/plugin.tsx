import { dialog, path } from "@tauri-apps/api"
import { readTextFile } from "@tauri-apps/api/fs"
import Ajv from "ajv"
import { Button, Col, Dropdown, Modal, Row } from "antd"

import { isInTauri } from "~/consts"
import { NoteItem, WorkerEventKeys } from "~/types"

import { contentStore, notesStore } from "./database"
import schema from "./note-data-schema.json"
import { emit2worker } from "./worker"

import pkg from "^/package.json"
export const enum ExportType {
  keepAll = "keepAll",
  keepLocal = "keepLocal",
  keepLatest = "keepLatest",
  keepImport = "keepImport",
}
type NoteData = {
  name: string
  version: string
  notes: NoteItem[]
  contents: { [id: string]: string }
  saveTime: number
}

const ajv = new Ajv()
const validate = ajv.compile(schema)

async function importWithTauri(): Promise<NoteData> {
  return new Promise((resolve, reject) => {
    void dialog
      .open({
        title: "选择文件",
        multiple: false,
        directory: false,
        filters: [{ name: "何方笔记备份文件", extensions: ["hbk"] }],
      })
      .then((filePath) => {
        if (!filePath) {
          return reject("未选择文件")
        }
        readTextFile(filePath as string)
          .then((value) => {
            try {
              const json: NoteData = JSON.parse(value)
              if (!validate(json)) {
                console.error("导入文件不正确", validate.errors)
                void dialog.message(`您选择的文件不是${pkg.productName}导出的文件`, { title: "数据无法解析" })

                return reject("数据无法解析")
              }
              resolve(json)
            } catch (error) {
              void dialog.message(String(error), { title: "数据无法解析" })

              return reject("数据无法解析")
            }
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

async function importWithHtml(): Promise<NoteData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", ".hbk")
    input.addEventListener("change", () => {
      if (!input.files?.length) {
        return
      }

      const [file] = input.files
      const reader = new FileReader()
      reader.addEventListener("loadend", ({ target }) => {
        if (!target?.result) {
          Modal.error({ title: "读取的文件为空" })

          return reject("读取的文件为空")
        }
        try {
          const json: NoteData = JSON.parse(target.result as string)
          if (!validate(json)) {
            console.error("导入文件不正确", validate.errors)
            void Modal.error({ title: "数据无法解析", content: `您选择的文件不是${pkg.productName}导出的文件` })

            return reject()
          }
          resolve(json)
        } catch (error) {
          void Modal.error({ title: "数据无法解析" })

          return reject("数据无法解析")
        }
      })
      reader.readAsText(file, "utf-8")
    })
    document.body.append(input)
    input.click()
    setTimeout(() => {
      input.remove()
    }, 0)
  })
}

export const hefang = {
  contens: {
    export: async () => {
      if (isInTauri) {
        const downloadDir = await path.downloadDir()
        void dialog
          .save({
            title: "保存笔记数据",
            filters: [{ name: "何方笔记备份文件", extensions: ["hbk"] }],
            defaultPath: await path.join(downloadDir, `${pkg.productName}-${Date.now()}`),
          })
          .then(async (res) => {
            emit2worker(WorkerEventKeys.exportStart, { type: "json", path: res })
          })
      } else {
        emit2worker(WorkerEventKeys.exportStart, { type: "url" })
      }
    },
    import: async (): Promise<number> => {
      return new Promise<number>(async (resolve, reject) => {
        const json: NoteData = isInTauri ? await importWithTauri() : await importWithHtml()
        const importIds = json.notes.map((item) => item.id)
        const currentIds = await notesStore.getAllIds()
        const ids = new Set([...currentIds, ...importIds])
        const total = currentIds.length + importIds.length
        if (ids.size !== total) {
          Modal.confirm({
            title: "有重复项",
            content: `导入的${importIds.length}条笔记中有${total - ids.size}项已存在，要如何处理？`,
            footer: (
              <Row style={{ marginTop: 10 }} gutter={15}>
                <Col flex={1} />
                <Col>
                  <Button onClick={Modal.destroyAll}>取消导入</Button>
                </Col>
                <Col>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "保留最新的",
                          label: "保留最新的",
                          onClick: async () => {
                            const currentItems = await notesStore.getAll()
                            const currentItemMap: Record<string, NoteItem> = Object.fromEntries(currentItems.map((item) => [item.id, item]))

                            const data = json.notes.filter((item) => {
                              return item.modifyTime > (currentItemMap[item.id]?.modifyTime || 0)
                            })

                            await notesStore.set(...data)
                            await contentStore.setObject(Object.fromEntries(data.map((item) => [item.id, json.contents[item.id]])))
                            Modal.destroyAll()
                            resolve(data.length)
                          },
                        },
                        {
                          key: "保留本地的",
                          label: "保留本地的",
                          onClick: async () => {
                            const data = json.notes.filter((item) => !currentIds.includes(item.id))
                            await notesStore.set(...data)
                            await contentStore.setObject(Object.fromEntries(data.map((item) => [item.id, json.contents[item.id]])))
                            Modal.destroyAll()
                            resolve(data.length)
                          },
                        },
                        {
                          key: "保留置导入的",
                          label: "保留导入的",
                          onClick: async () => {
                            await notesStore.set(...json.notes)
                            await contentStore.setObject(json.contents)
                            Modal.destroyAll()
                            resolve(importIds.length)
                          },
                        },
                        {
                          key: "全部保留",
                          label: "全部保留",
                          onClick: async () => {
                            const data = json.notes.map((item) => {
                              if (currentIds.includes(item.id)) {
                                const newId = crypto.randomUUID()
                                json.contents[newId] = json.contents[item.id]
                                delete json.contents[item.id]

                                return { ...item, id: newId }
                              }

                              return item
                            })
                            await notesStore.set(...data)
                            await contentStore.setObject(json.contents)
                            Modal.destroyAll()
                            resolve(importIds.length)
                          },
                        },
                      ],
                    }}
                  >
                    <Button type="primary">保留</Button>
                  </Dropdown>
                </Col>
              </Row>
            ),
          })
        } else {
          await notesStore.set(...json.notes)
          await contentStore.setObject(json.contents)
          Modal.destroyAll()
          resolve(importIds.length)
        }
      })
    },
  },
}
