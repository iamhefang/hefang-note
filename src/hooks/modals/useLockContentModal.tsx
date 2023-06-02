import {App, Form, FormItemProps, Input, ModalFuncProps} from "antd"
import {useCallback, useRef} from "react"

import {useAppDispatch} from "~/redux"
import {cancelLockContent, lockContent} from "~/redux/settingSlice"
import {NoteItem} from "~/types"

import {useSettings} from "$hooks/useSelectors"

type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)

export default function useLockContentModal() {
    const {modal} = App.useApp()
    const [form] = Form.useForm()
    const {lockedContents} = useSettings()
    const dispatch = useAppDispatch()

    const refModal = useRef<{
        destroy: () => void
        update: (configUpdate: ConfigUpdate) => void
    }>()

    const createRules = useCallback(
        (note: NoteItem): FormItemProps["rules"] => {
            return [
                {required: true, message: "请输入解锁密码"},
                {
                    async validator(rule, value, callback) {
                        if (lockedContents[note.id] && value && value !== lockedContents[note.id]) {
                            return Promise.reject(new Error("密码不正确"))
                        } else {
                            return Promise.resolve()
                        }
                    },
                },
            ]
        },
        [lockedContents],
    )

    const createOnOk = useCallback(
        (note: NoteItem) => {
            return () => {
                void form.validateFields().then((res) => {
                    if (lockedContents[note.id]) {
                        dispatch(cancelLockContent(note.id))
                    } else {
                        dispatch(lockContent({noteId: note.id, password: res.password}))
                    }
                    form.resetFields()
                    refModal.current?.destroy()
                })
            }
        },
        [dispatch, form, lockedContents],
    )

    const createOnKeyDown = useCallback((onOk: () => void) => {
        return (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault()
                onOk()
            }
        }
    }, [])

    return useCallback(
        (note: NoteItem | undefined) => {
            if (!note) {
                return
            }
            const onOk = createOnOk(note)
            const titlePrefix = lockedContents[note.id] ? "取消" : ""
            refModal.current = modal.confirm({
                title: `${titlePrefix}锁定"${note.title}"`,
                okText: `${titlePrefix}锁定`,
                content: (
                    <Form layout="vertical" form={form} initialValues={{password: ""}}>
                        <Form.Item label="输入解锁密码" rules={createRules(note)} name="password">
                            <Input.Password placeholder="输入密码" allowClear maxLength={6} autoFocus onKeyDown={createOnKeyDown(onOk)}/>
                        </Form.Item>
                    </Form>
                ),
                onOk,
                onCancel() {
                    form.resetFields()
                },
            })
        },
        [createOnKeyDown, createOnOk, createRules, form, lockedContents, modal],
    )
}
