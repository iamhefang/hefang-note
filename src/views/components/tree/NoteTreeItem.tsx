import { CaretDownOutlined, CaretRightOutlined, FileTextOutlined, FolderOpenOutlined, FolderOutlined } from "@ant-design/icons"
import { App, Col, Input, Row, theme } from "antd"
import _ from "lodash"
import React, { useCallback, useMemo } from "react"

import { NAME_MAX_LENGTH } from "~/config"
import useContentLoader from "~/hooks/useContentLoader"
import useGlobalState from "~/hooks/useGlobalState"
import useItemArray from "~/hooks/useItemArray"
import useNewModal from "~/hooks/useNewModal"
import { GlobalState, NoteIndentItem } from "~/types"
import { contentStore } from "~/utils/database"
import { iconPlacehodler } from "~/views/components/icons/IconPlaceholder"
import NoteTreeItemMenu, { MenuInfo, NoteTreeMenuKeys } from "~/views/components/menus/NoteTreeItemMenu"

import ss from "./NoteTree.module.scss"

export type NoteTreeItemProps = {
  item: NoteIndentItem
  onRightClick?: () => void
}
export default function NoteTreeItem({ item, onRightClick }: NoteTreeItemProps) {
  const [{ current, renaming, expandItems }, setState] = useGlobalState()
  const { token } = theme.useToken()
  const { message, modal } = App.useApp()
  const itemArray = useItemArray()
  const loadContent = useContentLoader()
  const showModal = useNewModal()

  const onItemClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (renaming === item.id) {
        return
      }
      const newState: Partial<GlobalState> = {}
      if (!item.isLeaf) {
        newState.expandItems = { ...expandItems, [item.id]: !expandItems[item.id] }
        if (e.nativeEvent.composedPath().find((node: EventTarget) => (node as HTMLElement).classList?.contains("anticon"))) {
          setState(newState)

          return
        }
      }
      if (current !== item.id) {
        newState.current = item.id
      }
      _.isEmpty(newState) || setState(newState)
    },
    [current, expandItems, item.id, item.isLeaf, renaming, setState],
  )

  const onRenamingBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newName = e.currentTarget.value
      if (!newName.trim()) {
        void message.warning("名称不为能空")
      } else {
        contentStore
          .set({ ...item, title: newName })
          .then(loadContent)
          .catch(console.error)
      }
      setState({ renaming: "" })
    },
    [item, loadContent, message, setState],
  )

  const onRenameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }, [])
  const onMenuClick = useCallback(
    (info: MenuInfo) => {
      switch (info.key) {
        case NoteTreeMenuKeys.rename:
          setState({ renaming: item.id })
          break
        case NoteTreeMenuKeys.delete:
          const children = itemArray.filter((c) => c.parentId === item.id)
          modal.confirm({
            title: `要删除"${item.title}"吗?`,
            content: item.isLeaf || !children.length ? null : `${item.title}是一个非空目录，删除后，其下面的${children.length}条内容将移动到上级目录`,
            onOk() {
              Promise.all([
                contentStore.delete(item.id),
                item.isLeaf ? Promise.resolve() : contentStore.set(...children.map((c) => ({ ...c, parentId: item.parentId }))),
              ])
                .then(() => {
                  void loadContent()
                })
                .catch(console.error)
            },
          })
          break
        case NoteTreeMenuKeys.newDir:
        case NoteTreeMenuKeys.newNote:
          showModal(info, item.id)
          break
        default:
          console.warn("未生效的菜单")
      }
    },
    [item.id, item.isLeaf, item.parentId, item.title, itemArray, loadContent, modal, setState, showModal],
  )

  const expandIcon = useMemo(() => {
    if (item.isLeaf) {
      return iconPlacehodler
    }

    return expandItems[item.id] ? <CaretDownOutlined /> : <CaretRightOutlined />
  }, [expandItems, item.id, item.isLeaf])

  const width = useMemo(() => `${24 + item.indent * 16}px`, [item.indent])

  return (
    <Row
      wrap={false}
      gutter={10}
      className={ss.item}
      onClick={onItemClick}
      onContextMenu={onRightClick}
      data-active={current === item.id}
      style={{
        background: current === item.id ? token.colorPrimaryBg : "none",
        color: current === item.id ? token.colorPrimaryTextActive : undefined,
        marginInline: 10,
        borderColor: token.colorPrimary,
      }}
    >
      <Col style={{ width, textAlign: "right", flexShrink: 0 }}>{expandIcon}</Col>
      <Col>{item.isLeaf ? <FileTextOutlined /> : expandItems[item.id] ? <FolderOpenOutlined /> : <FolderOutlined />}</Col>
      <Col flex={1}>
        {renaming === item.id ? (
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
        )}
      </Col>
    </Row>
  )
}

export const MemodNoteTreeItem = React.memo(NoteTreeItem)
