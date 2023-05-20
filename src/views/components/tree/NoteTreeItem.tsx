import { LockOutlined, UnlockOutlined } from "@ant-design/icons"
import { Button, Col, Row } from "antd"
import React, { useCallback, useMemo } from "react"
import { ItemProps } from "react-virtuoso"

import useNoteLocked from "~/hooks/useNoteLocked"
import { useAppDispatch } from "~/redux"
import { setCurrent } from "~/redux/settingSlice"
import { relockContent } from "~/redux/uiSlice"
import { NoteIndentItem } from "~/types"

import useExpandIcon from "./hooks/useExpandIcon"
import useOnItemClick from "./hooks/useOnItemClick"
import useTreeItemIcon from "./hooks/useTreeItemIcon"
import useTreeItemStyle from "./hooks/useTreeItemStyle"
import useTreeItemTitle from "./hooks/useTreeItemTitle"
import ss from "./NoteTree.module.scss"

import { useSettings, useStates } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"

export default function NoteTreeItem({
  item,
  "data-index": dataIndex,
  "data-item-index": dataItemIndex,
  "data-known-size": dataSize,
}: ItemProps<NoteIndentItem>) {
  const { current, lockedContents } = useSettings()
  const t = useTranslate()
  const { rightClickedItem } = useStates()
  const noteLocked = useNoteLocked(item.id)
  const dispatch = useAppDispatch()

  const onItemClick = useOnItemClick(item)

  const expandIcon = useExpandIcon(item)
  const title = useTreeItemTitle(item)

  const width = useMemo(() => `${24 + item.indent * 16}px`, [item.indent])

  const style = useTreeItemStyle(item, dataSize)
  const icon = useTreeItemIcon(item)

  const onLockClick = useCallback(() => {
    dispatch(relockContent(item.id))
    dispatch(setCurrent(item.id))
  }, [dispatch, item.id])

  return (
    <Row
      wrap={false}
      gutter={10}
      className={ss.item}
      onClick={onItemClick}
      style={style}
      data-active={current === item.id}
      data-id={item.id}
      data-index={dataIndex}
      data-item-index={dataItemIndex}
      data-menu-open={rightClickedItem?.id === item.id}
    >
      <Col style={{ width, textAlign: "right", flexShrink: 0 }}>{expandIcon}</Col>
      <Col>{icon}</Col>
      <Col flex={1}>{title}</Col>
      {lockedContents[item.id] && (
        <Col>
          <Button
            onClick={onLockClick}
            disabled={noteLocked}
            icon={noteLocked ? <LockOutlined title={t(item.isLeaf ? "该笔记已锁定" : "该目录已锁定")} /> : <UnlockOutlined title={t("立即锁定")} />}
            size="small"
            type="text"
          />
        </Col>
      )}
    </Row>
  )
}

export const MemodNoteTreeItem = React.memo(NoteTreeItem)
