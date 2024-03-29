import { LockOutlined, UnlockOutlined } from "@ant-design/icons"
import { Button, Col, Row } from "antd"
import React, { useCallback, useMemo, useState } from "react"
import { ItemProps } from "react-virtuoso"

import useNoteLocked from "~/hooks/useNoteLocked"
import { useAppDispatch } from "~/redux"
import { moveNote } from "~/redux/noteSlice"
import { setCurrent, setItemsExpanded } from "~/redux/settingSlice"
import { relockContent } from "~/redux/uiSlice"
import { NoteIndentItem } from "~/types"

import ss from "./NoteTree.module.scss"

import useExpandIcon from "$hooks/noteTreeItem/useExpandIcon"
import useOnItemClick from "$hooks/noteTreeItem/useOnItemClick"
import useTreeItemIcon from "$hooks/noteTreeItem/useTreeItemIcon"
import useTreeItemStyle from "$hooks/noteTreeItem/useTreeItemStyle"
import useTreeItemTitle from "$hooks/noteTreeItem/useTreeItemTitle"
import { useSettings, useStates } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"

function NoteTreeItem({
  item,
  "data-index": dataIndex,
  "data-item-index": dataItemIndex,
  "data-known-size": dataSize,
}: ItemProps<NoteIndentItem>) {
  const { current, lockedContents } = useSettings()
  const t = useTranslate()
  const { rightClickedItem } = useStates()
  const [dragging, setDragging] = useState(false)
  const [dragover, setDragover] = useState(false)
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

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.dropEffect = "move"
      e.dataTransfer.setData("text/plain", item.id)
      setDragging(true)
    },
    [item.id],
  )
  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.dropEffect = "move"
      setDragover(!item.isLeaf)
    },
    [item.isLeaf],
  )

  const onDragLeave = useCallback(() => {
    setDragover(false)
  }, [])
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    e.dataTransfer.effectAllowed = "move"
  }, [])
  const onDragEnd = useCallback(() => {
    setDragging(false)
    setDragover(false)
  }, [])
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (item.isLeaf) {
        return
      }
      setDragging(false)
      setDragover(false)
      if (item.isLeaf) {
        return
      }

      try {
        const sourceId = e.dataTransfer.getData("text/plain")
        dispatch(moveNote({ targetId: item.id, sourceId }))
        dispatch(setItemsExpanded({ [item.id]: true }))
      } catch (error) {
        console.error(error)
      }
    },
    [dispatch, item.id, item.isLeaf],
  )

  return (
    <Row
      wrap={false}
      gutter={10}
      className={ss.item}
      onClick={onItemClick}
      style={style}
      data-active={current === item.id}
      data-id={item.id}
      data-leaf={item.isLeaf}
      data-index={dataIndex}
      data-item-index={dataItemIndex}
      data-dragging={dragging}
      data-dragover={dragover}
      data-menu-open={rightClickedItem?.id === item.id}
      // draggable={item.isLeaf}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Col style={{ width, textAlign: "right", flexShrink: 0 }}>{expandIcon}</Col>
      <Col>{icon}</Col>
      <Col flex={1}>{title}</Col>
      {lockedContents[item.id] && (
        <Col>
          <Button
            onClick={onLockClick}
            disabled={noteLocked}
            icon={
              noteLocked ? (
                <LockOutlined title={t(item.isLeaf ? "该笔记已锁定" : "该目录已锁定")} />
              ) : (
                <UnlockOutlined title={t("立即锁定")} />
              )
            }
            size="small"
            type="text"
          />
        </Col>
      )}
    </Row>
  )
}

export const MemoNoteTreeItem = React.memo(NoteTreeItem)
