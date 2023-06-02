import {App, Form, Input, Space, Switch} from "antd"
import {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {deleteNote} from "~/redux/noteSlice"
import {setCurrent} from "~/redux/settingSlice"
import {NoteItem} from "~/types"

import useCurrent from "$hooks/useCurrent"
import useItemArray from "$hooks/useItemArray"
import {useSettings} from "$hooks/useSelectors"

export default function useDeleteModal() {
    const itemArray = useItemArray()
    const dispatch = useAppDispatch()
    const {modal} = App.useApp()
    const {lockedContents} = useSettings()
    const [form] = Form.useForm()
    const current = useCurrent()

    return useCallback(
        (note: NoteItem) => {
            const children = itemArray.filter((c) => c.parentId === note.id)
            const noteLocked = lockedContents[note.id]

            modal.confirm({
                title: `要删除"${note.title}"吗?`,
                content: (
                    <Form layout="horizontal" form={form}>
                        {noteLocked && (
                            <Space direction="vertical">
                                <span>“{note.title}“已锁定，请输入解锁密码后才能删除</span>
                                <Form.Item
                                    name="password"
                                    validateTrigger="none"
                                    rules={[
                                        {required: true, message: "请输入解锁密码"},
                                        {
                                            async validator(rule, value, callback) {
                                                if (value && value !== lockedContents[note.id]) {
                                                    return Promise.reject(new Error("解锁密码不正确"))
                                                }

                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="请输入解锁密码" allowClear maxLength={6}/>
                                </Form.Item>
                            </Space>
                        )}
                        {!note.isLeaf && children.length ? (
                            <Form.Item
                                name="deleteChildren"
                                label="同时删除目录下所有子目录和笔记"
                                valuePropName="checked"
                                tooltip={
                                    <Space direction="vertical">
                                        <span>是：该目录下所有的笔记和子目录都将被删除</span>
                                        <span>否：该目录下所有的笔记和子目录都将被移动到上级目录</span>
                                    </Space>
                                }
                            >
                                <Switch checkedChildren="是" unCheckedChildren="否"/>
                            </Form.Item>
                        ) : null}
                    </Form>
                ),
                onOk(closeModal) {
                    void form.validateFields().then(({deleteChildren}) => {
                        dispatch(deleteNote({noteId: note.id, deleteChildren}))
                        if (current?.id === note.id) {
                            dispatch(setCurrent(undefined))
                        }
                        form.resetFields()
                        closeModal()
                    })
                },
                okButtonProps: {danger: true},
                onCancel() {
                    form.resetFields()
                },
            })
        },
        [current?.id, dispatch, form, itemArray, lockedContents, modal],
    )
}
