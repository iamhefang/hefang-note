import { LockOutlined } from "@ant-design/icons"
import { Input, Result, theme } from "antd"
import { NoteItem } from "hefang-note-types"
import React, { useCallback } from "react"

import { useSettings } from "~/hooks/useSelectors"
import { useAppDispatch } from "~/redux"
import { setItemsExpanded } from "~/redux/settingSlice"
import { unlockContent } from "~/redux/uiSlice"

import { useTranslate } from "$hooks/useTranslate"

export type NoteUnlockerProps = {
  item: NoteItem
}
export default function NoteUnlocker({ item }: NoteUnlockerProps) {
  const {
    lockedContents,
    unlockContentByAppLockPassword,
    lock: { password },
  } = useSettings()
  const t = useTranslate()
  const { token } = theme.useToken()
  const dispatch = useAppDispatch()
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const matchNotePwd = lockedContents[item.id] === e.currentTarget.value
      const matchAppPwd = unlockContentByAppLockPassword && password === e.currentTarget.value
      if (matchNotePwd || matchAppPwd) {
        dispatch(unlockContent(item.id))
        item.isLeaf || dispatch(setItemsExpanded({ [item.id]: true }))
      }
    },
    [dispatch, item.id, item.isLeaf, lockedContents, password, unlockContentByAppLockPassword],
  )

  return (
    <Result
      style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
      title={item.title}
      subTitle={t(`该${item.isLeaf ? "笔记" : "目录"}已锁定，请输入解锁密码`)}
      icon={<LockOutlined style={{ color: token.colorPrimary }} />}
      extra={
        <Input.Password
          placeholder={t("请输入解锁密码")}
          allowClear
          maxLength={6}
          onChange={onChange}
          style={{ maxWidth: 180 }}
        />
      }
    />
  )
}
