import { App, Form, Input, Modal, ModalFuncProps } from "antd"
import React, { useCallback, useRef } from "react"

import { NAME_MAX_LENGTH } from "~/config"
import { useAppDispatch } from "~/redux"
import { newNote } from "~/redux/noteSlice"
import { setCurrent, setItemsExpanded } from "~/redux/settingSlice"
import { MenuInfo, NoteTreeMenuKeys } from "~/views/components/menus/NoteTreeItemMenu"

import { useNotes } from "./useSelectors"

export default function useNewModal() {
  const { modal } = App.useApp()
  const refModal = useRef<{
    destroy: () => void
    update: (configUpdate: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void
  }>()
  const [form] = Form.useForm()
  const { entities } = useNotes()
  const dispatch = useAppDispatch()

  const doSave = useCallback(
    (info: MenuInfo, parentId?: string, closeModal?: () => void) => {
      void form.validateFields().then((values) => {
        const id = crypto.randomUUID()
        const isLeaf = info.key === NoteTreeMenuKeys.newNote
        const createTime = Date.now()
        dispatch(
          newNote({
            id,
            title: values.title,
            parentId,
            isLeaf,
            createTime,
            modifyTime: createTime,
            content: isLeaf ? "" : undefined,
          }),
        )
        Modal.destroyAll()
        setTimeout(() => {
          dispatch(setCurrent(id))
          parentId && dispatch(setItemsExpanded({ [parentId]: true }))
        }, 0)
      })
    },
    [dispatch, form],
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
        onOk() {
          doSave(info, parentId)
        },
      })
    },
    [createOnKeyDown, doSave, form, modal],
  )
}
