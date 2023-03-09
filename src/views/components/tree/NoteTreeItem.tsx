import { CaretDownOutlined, CaretRightOutlined, FileTextOutlined, FolderOpenOutlined, FolderOutlined } from "@ant-design/icons"
import { App, Col, Input, Row, theme } from "antd"
import React, { useCallback, useMemo } from "react"

import { NAME_MAX_LENGTH } from "~/config"
import { useAppDispatch } from "~/redux"
import { stopRenaming } from "~/redux/noteSlice"
import { setCurrent, setItemsExpanded } from "~/redux/settingSlice"
import { NoteIndentItem } from "~/types"

import ss from "./NoteTree.module.scss"

import { iconPlacehodler } from "$components/icons/IconPlaceholder"
import { useNotes, useSettings } from "$hooks/useSelectors"

export type NoteTreeItemProps = {
  item: NoteIndentItem
  onRightClick?: () => void
}
export default function NoteTreeItem({ item, onRightClick }: NoteTreeItemProps) {
  const { current, expandItems } = useSettings()
  const { renamingId } = useNotes()
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const dispatch = useAppDispatch()

  const onItemClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (renamingId === item.id) {
        return
      }
      if (!item.isLeaf) {
        dispatch(setItemsExpanded({ [item.id]: !expandItems[item.id] }))
        if (e.nativeEvent.composedPath().find((node: EventTarget) => (node as HTMLElement).classList?.contains("anticon"))) {
          return
        }
      }
      if (current !== item.id) {
        dispatch(setCurrent(item.id))
      }
    },
    [current, dispatch, expandItems, item.id, item.isLeaf, renamingId],
  )

  const onRenamingBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newName = e.currentTarget.value
      if (!newName.trim()) {
        void message.warning("名称不为能空")
      } else {
        dispatch(stopRenaming({ id: item.id, newName }))
      }
    },
    [dispatch, item, message],
  )

  const onRenameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }, [])

  const expandIcon = useMemo(() => {
    if (item.isLeaf) {
      return iconPlacehodler
    }

    return expandItems[item.id] ? <CaretDownOutlined /> : <CaretRightOutlined />
  }, [expandItems, item.id, item.isLeaf])

  const width = useMemo(() => `${24 + item.indent * 16}px`, [item.indent])

  const title = useMemo(
    () =>
      renamingId === item.id ? (
        <Input
          key={`rename-input-${item.id}`}
          autoFocus
          size="small"
          placeholder={item.title}
          defaultValue={item.title}
          onKeyDown={onRenameKeyDown}
          onBlur={onRenamingBlur}
          maxLength={NAME_MAX_LENGTH}
        />
      ) : (
        <div title={item.title} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </div>
      ),
    [item.id, item.title, onRenameKeyDown, onRenamingBlur, renamingId],
  )

  const style = useMemo(
    () => ({
      background: current === item.id ? token.colorPrimaryBg : "none",
      color: current === item.id ? token.colorPrimaryTextActive : undefined,
      marginInline: 10,
      borderColor: token.colorPrimary,
    }),
    [current, item.id, token.colorPrimary, token.colorPrimaryBg, token.colorPrimaryTextActive],
  )

  return (
    <Row wrap={false} gutter={10} className={ss.item} onClick={onItemClick} onContextMenu={onRightClick} data-active={current === item.id} style={style}>
      <Col style={{ width, textAlign: "right", flexShrink: 0 }}>{expandIcon}</Col>
      <Col>{item.isLeaf ? <FileTextOutlined /> : expandItems[item.id] ? <FolderOpenOutlined /> : <FolderOutlined />}</Col>
      <Col flex={1}>{title}</Col>
    </Row>
  )
}

export const MemodNoteTreeItem = React.memo(NoteTreeItem)
