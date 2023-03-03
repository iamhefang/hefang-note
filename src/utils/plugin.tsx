import { dialog } from "@tauri-apps/api"
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import Ajv from "ajv"
import { Button, Col, Dropdown, message, Modal, Row } from "antd"

import { isInTauri } from "~/consts"
import { NoteItem } from "~/types"

import { contentStore } from "./database"
import schema from "./note-data-schema.json"

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
  contents: NoteItem[]
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
        filters: [{ name: "JSON文件", extensions: ["json"] }],
      })
      .then((path) => {
        if (!path) {
          return reject("未选择文件")
        }
        readTextFile(path as string)
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
    input.setAttribute("accept", ".json")
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
      const all = await contentStore.getAll()
      const json = JSON.stringify({
        name: pkg.productName,
        version: pkg.version,
        contents: all,
        saveTime: Date.now(),
      })
      if (isInTauri) {
        void dialog
          .save({
            title: "保存笔记数据",
            filters: [{ name: "JSON文件", extensions: ["json"] }],
            defaultPath: `${pkg.productName}-${Date.now()}`,
          })
          .then((res) => {
            res &&
              void writeTextFile(res, json).then(() => {
                void dialog.message("导出成功")
              })
          })
      } else {
        const blob = new Blob([json], {
          type: "application/json;charset=utf-8",
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${pkg.productName}-${Date.now()}.json`)
        document.body.append(link)
        void message.info("已发起下载")
        link.click()
        setTimeout(() => {
          link.remove()
        }, 0)
      }
    },
    import: async (): Promise<number> => {
      return new Promise<number>(async (resolve, reject) => {
        const json: NoteData = isInTauri ? await importWithTauri() : await importWithHtml()
        const importIds = json.contents.map((item) => item.id)
        const currentIds = await contentStore.getAllIds()
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
                            const currentItems = await contentStore.getAll()
                            const currentItemMap: Record<string, NoteItem> = Object.fromEntries(currentItems.map((item) => [item.id, item]))

                            const data = json.contents.filter((item) => {
                              return item.modifyTime > (currentItemMap[item.id]?.modifyTime || 0)
                            })

                            await contentStore.set(...data)
                            Modal.destroyAll()
                            resolve(data.length)
                          },
                        },
                        {
                          key: "保留本地的",
                          label: "保留本地的",
                          onClick: async () => {
                            const data = json.contents.filter((item) => !currentIds.includes(item.id))
                            await contentStore.set(...data)
                            Modal.destroyAll()
                            resolve(data.length)
                          },
                        },
                        {
                          key: "保留置导入的",
                          label: "保留导入的",
                          onClick: async () => {
                            await contentStore.set(...json.contents)
                            Modal.destroyAll()
                            resolve(importIds.length)
                          },
                        },
                        {
                          key: "全部保留",
                          label: "全部保留",
                          onClick: async () => {
                            await contentStore.set(
                              ...json.contents.map((item) => {
                                if (currentIds.includes(item.id)) {
                                  return { ...item, id: crypto.randomUUID() }
                                }

                                return item
                              }),
                            )
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
          await contentStore.set(...json.contents)
          Modal.destroyAll()
          resolve(importIds.length)
        }
      })
    },
  },
}
