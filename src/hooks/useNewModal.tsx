import { App, Form, Input, message, ModalFuncProps } from "antd"
import React, { useCallback, useRef } from "react"

import { NAME_MAX_LENGTH } from "~/config"
import { useAppDispatch } from "~/redux"
import { setCurrent } from "~/redux/settingSlice"
import { notesStore } from "~/utils/database"
import { MenuInfo, NoteTreeMenuKeys } from "~/views/components/menus/NoteTreeItemMenu"

import useContentLoader from "./useContentLoader"
import useGlobalState from "./useGlobalState"

export default function useNewModal() {
  const { modal } = App.useApp()
  const refModal = useRef<{
    destroy: () => void
    update: (configUpdate: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void
  }>()
  const [form] = Form.useForm()
  const loadContent = useContentLoader()
  const dispatch = useAppDispatch()

  const doSave = useCallback(
    (info: MenuInfo, parentId?: string) => {
      void form.validateFields().then((values) => {
        const id = crypto.randomUUID()
        const isLeaf = info.key === NoteTreeMenuKeys.newNote
        notesStore
          .set({
            id,
            title: values.title,
            parentId,
            isLeaf,
            createTime: Date.now(),
            modifyTime: Date.now(),
            content: isLeaf ? "" : undefined,
          })
          .then(() => {
            void loadContent()
            refModal.current?.destroy()
            setTimeout(() => dispatch(setCurrent(id)), 0)
          })
          .catch((e) => {
            console.error(e)
            void message.error(`出现错误: ${JSON.stringify(e)}`)
          })
      })
    },
    [dispatch, form, loadContent],
  )

  const createOnKeyDown = useCallback(
    (info: MenuInfo, parentId?: string) => {
      return (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && doSave(info, parentId)
      }
    },
    [doSave],
  )

  return useCallback(
    (info: MenuInfo, parentId?: string) => {
      const type = info.key === NoteTreeMenuKeys.newDir ? "目录" : "笔记"
      form.setFieldValue("title", "")
      refModal.current = modal.confirm({
        title: `新建${type}`,
        content: (
          <Form form={form}>
            <Form.Item name="title" rules={[{ required: true, message: `请输入${type}名` }]}>
              <Input placeholder={`请输入${type}名`} maxLength={NAME_MAX_LENGTH} autoFocus onKeyDown={createOnKeyDown(info, parentId)} />
            </Form.Item>
          </Form>
        ),
        okText: "新建",
        onOk(closeModal) {
          doSave(info, parentId)
        },
      })
    },
    [createOnKeyDown, doSave, form, modal],
  )
}
