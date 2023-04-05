import { CaretDownOutlined, CaretRightOutlined, FileTextOutlined, FolderOpenOutlined, FolderOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons"
import { App, Button, Col, Input, Row, theme } from "antd"
import React, { CSSProperties, useCallback, useMemo } from "react"
import { ItemProps } from "react-virtuoso"

import { NAME_MAX_LENGTH } from "~/config"
import useNoteLocked from "~/hooks/useNoteLocked"
import { useAppDispatch } from "~/redux"
import { stopRenaming } from "~/redux/noteSlice"
import { setCurrent, setItemsExpanded } from "~/redux/settingSlice"
import { relockContent } from "~/redux/uiSlice"
import { NoteIndentItem } from "~/types"

import ss from "./NoteTree.module.scss"

import { iconPlacehodler } from "$components/icons/IconPlaceholder"
import { useNotes, useSettings } from "$hooks/useSelectors"

export default function NoteTreeItem({
  item,
  "data-index": dataIndex,
  "data-item-index": dataItemIndex,
  "data-known-size": dataSize,
}: ItemProps<NoteIndentItem>) {
  const { current, expandItems, lockedContents } = useSettings()
  const { renamingId } = useNotes()
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const noteLocked = useNoteLocked(item.id)
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

  const onLockClick = useCallback(() => {
    dispatch(relockContent(item.id))
    dispatch(setCurrent(item.id))
  }, [dispatch, item.id])

  const expandIcon = useMemo(() => {
    if (item.isLeaf) {
      return iconPlacehodler
    }
    if (!expandItems[item.id] || noteLocked) {
      return <CaretRightOutlined />
    }

    return <CaretDownOutlined />
  }, [expandItems, item.id, item.isLeaf, noteLocked])

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
    (): CSSProperties => ({
      background: current === item.id ? token.colorPrimaryBg : "none",
      color: current === item.id ? token.colorPrimaryTextActive : undefined,
      marginInline: 10,
      borderColor: token.colorPrimary,
      height: dataSize,
    }),
    [current, dataSize, item.id, token.colorPrimary, token.colorPrimaryBg, token.colorPrimaryTextActive],
  )
  const icon = useMemo(() => {
    if (item.isLeaf) {
      return <FileTextOutlined />
    }
    if (noteLocked || !expandItems[item.id]) {
      return <FolderOutlined />
    }

    return <FolderOpenOutlined />
  }, [expandItems, item.id, item.isLeaf, noteLocked])

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
    >
      <Col style={{ width, textAlign: "right", flexShrink: 0 }}>{expandIcon}</Col>
      <Col>{icon}</Col>
      <Col flex={1}>{title}</Col>
      {lockedContents[item.id] && (
        <Col>
          <Button
            onClick={onLockClick}
            disabled={noteLocked}
            icon={noteLocked ? <LockOutlined title={`该${item.isLeaf ? "笔记" : "目录"}已锁定`} /> : <UnlockOutlined title="立即锁定" />}
            size="small"
            type="text"
          />
        </Col>
      )}
    </Row>
  )
}

export const MemodNoteTreeItem = React.memo(NoteTreeItem)
