import {dialog} from "@tauri-apps/api"
import {readTextFile} from "@tauri-apps/api/fs"
import Ajv from "ajv"
import {App, Button, Col, Dropdown, Modal, Row} from "antd"
// eslint-disable-next-line import/no-internal-modules
import {ModalStaticFunctions} from "antd/es/modal/confirm"
import {useCallback} from "react"

import {isInClient} from "~/consts"
import schema from "~/data/note-data-schema.json"
import {NoteItem} from "~/types"

import {notesStore} from "$utils/database"
import pkg from "^/package.json"

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
                filters: [{name: "JSON文件", extensions: ["json"]}],
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
                                void dialog.message(`您选择的文件不是${pkg.productName}导出的文件`, {title: "数据无法解析"})

                                return reject("数据无法解析")
                            }
                            resolve(json)
                        } catch (error) {
                            void dialog.message(String(error), {title: "数据无法解析"})

                            return reject("数据无法解析")
                        }
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}

async function importWithHtml(modal: Omit<ModalStaticFunctions, "warn">): Promise<NoteData> {
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
            reader.addEventListener("loadend", ({target}) => {
                if (!target?.result) {
                    modal.error({title: "读取的文件为空"})

                    return reject("读取的文件为空")
                }
                try {
                    const json: NoteData = JSON.parse(target.result as string)
                    if (!validate(json)) {
                        console.error("导入文件不正确", validate.errors)
                        void modal.error({title: "数据无法解析", content: `您选择的文件不是${pkg.productName}导出的文件`})

                        return reject()
                    }
                    resolve(json)
                } catch (error) {
                    void modal.error({title: "数据无法解析"})

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

export default function useImporter() {
    const {message, modal} = App.useApp()

    return useCallback(async () => {
        const json: NoteData = isInClient ? await importWithTauri() : await importWithHtml(modal)
        const importIds = json.contents.map((item) => item.id)
        const currentIds = await notesStore.getAllIds()
        const ids = new Set([...currentIds, ...importIds])
        const total = currentIds.length + importIds.length
        if (ids.size !== total) {
            modal.confirm({
                title: "有重复项",
                content: `导入的${importIds.length}条笔记中有${total - ids.size}项已存在，要如何处理？`,
                footer: (
                    <Row style={{marginTop: 10}} gutter={15}>
                        <Col flex={1}/>
                        <Col>
                            <Button onClick={Modal.destroyAll}>取消导入</Button>
                        </Col>
                        <Col>
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "保留最新的", label: "保留最新的", onClick: () => {
                                            },
                                        },
                                        {
                                            key: "保留本地的", label: "保留本地的", onClick: () => {
                                            },
                                        },
                                        {
                                            key: "保留置导入的", label: "保留导入的", onClick: () => {
                                            },
                                        },
                                        {
                                            key: "全部保留", label: "全部保留", onClick: () => {
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
        }
    }, [modal])
}
