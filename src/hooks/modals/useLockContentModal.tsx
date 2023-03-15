import { App, Form, Input } from "antd"
import { Rule } from "antd/es/form"
import { useCallback } from "react"

import { useAppDispatch } from "~/redux"
import { cancelLockContent, lockContent } from "~/redux/settingSlice"
import { NoteItem } from "~/types"

import { useSettings } from "$hooks/useSelectors"

export default function useLockContentModal() {
  const { modal } = App.useApp()
  const [form] = Form.useForm()
  const { lockedContents } = useSettings()
  const dispatch = useAppDispatch()

  return useCallback(
    (note: NoteItem | undefined) => {
      if (!note) {
        return
      }

      const rules: Rule[] = [
        { required: true, message: "请输入解锁密码" },
        {
          async validator(rule, value, callback) {
            if (lockedContents[note.id] && value && value !== lockedContents[value]) {
              return Promise.reject(new Error("密码不正确"))
            } else {
              return Promise.resolve()
            }
          },
        },
      ]
      modal.confirm({
        title: `${lockedContents[note.id] ? "取消" : ""}锁定"${note.title}"`,
        okText: "锁定",
        content: (
          <Form layout="vertical" form={form} initialValues={{ password: "" }}>
            <Form.Item label="输入解锁密码" rules={rules} name="password">
              <Input.Password placeholder="输入密码" allowClear maxLength={6} />
            </Form.Item>
          </Form>
        ),
        onOk(closeModal) {
          void form.validateFields().then((res) => {
            if (lockedContents[note.id]) {
              dispatch(cancelLockContent(note.id))
            } else {
              dispatch(lockContent({ noteId: note.id, password: res.password }))
            }
            form.resetFields()
            closeModal()
          })
        },
      })
    },
    [dispatch, form, lockedContents, modal],
  )
}
