import {LockOutlined} from "@ant-design/icons"
import {Input, Result, Space} from "antd"
import React, {useCallback} from "react"

import {useSettings} from "~/hooks/useSelectors"
import {useAppDispatch} from "~/redux"
import {unlockContent} from "~/redux/uiSlice"
import {NoteItem} from "~/types"

import {useTranslate} from "$hooks/useTranslate"

export type NoteUnlockerProps = {
    item: NoteItem
}
export default function NoteUnlocker({item}: NoteUnlockerProps) {
    const {lockedContents} = useSettings()
    const t = useTranslate()
    const dispatch = useAppDispatch()
    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (lockedContents[item.id] === e.currentTarget.value) {
                dispatch(unlockContent(item.id))
            }
        },
        [dispatch, item.id, lockedContents],
    )

    return (
        <Result
            style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}
            title={item.title}
            subTitle={t(`该${item.isLeaf ? "笔记" : "目录"}已锁定，请输入解锁密码`)}
            icon={<LockOutlined/>}
            extra={
                <Space>
                    <Input.Password placeholder={t("请输入解锁密码")} allowClear maxLength={6} onChange={onChange} style={{maxWidth: 180}}/>
                </Space>
            }
        />
    )
}
