import { CaretDownOutlined, CaretRightOutlined, FileTextOutlined, FolderOpenOutlined, FolderOutlined } from "@ant-design/icons"
import { App, Col, Input, Row, theme } from "antd"
import _ from "lodash"
import React, { useCallback, useEffect, useState } from "react"

import { nameMaxLength } from "~/config"
import useContentLoader from "~/hooks/useContentLoader"
import useGlobalState from "~/hooks/useGlobalState"
import useItemChildrens from "~/hooks/useItemChildrens"
import useNewModal from "~/hooks/useNewModal"
import type { GlobalState, NoteItem } from "~/types"
import { contentStore } from "~/utils/database"
import { iconPlacehodler } from "~/views/components/icons/IconPlaceholder"
import NoteTreeItemMenu, { MenuInfo, NoteTreeMenuKeys } from "~/views/components/menus/NoteTreeItemMenu"

import ss from "./NoteTree.module.scss"
export type NoteTreeProps = {
  indent?: number
  search: string
  parentId?: string
}
export default function NoteTree({ search, indent = 0, parentId }: NoteTreeProps) {
  const [{ current, expandItems, items }, setState] = useGlobalState()
  const data = useItemChildrens(parentId, search)
  const { token } = theme.useToken()
  const { message, modal } = App.useApp()
  const [renaming, setRenaming] = useState("")
  const showModal = useNewModal()
  const renderExpandIcon = useCallback(
    (item: NoteItem) => {
      if (item.isLeaf) {
        return iconPlacehodler
      }

      return expandItems[item.id] ? <CaretDownOutlined /> : <CaretRightOutlined />
    },
    [expandItems],
  )
  const createOnItemClick = useCallback(
    (item: NoteItem) => {
      return (e: React.MouseEvent<HTMLElement>) => {
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
      }
    },
    [current, expandItems, renaming, setState],
  )

  const createOnItemDoubleClick = useCallback((item: NoteItem) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])
  const loadContent = useContentLoader()
  const createOnMenuClick = useCallback(
    (item: NoteItem) => {
      return (info: MenuInfo) => {
        switch (info.key) {
          case NoteTreeMenuKeys.rename:
            setRenaming(item.id)
            break
          case NoteTreeMenuKeys.delete:
            const children = Object.values(items).filter((c) => c.parentId === item.id)
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
      }
    },
    [items, loadContent, modal, showModal],
  )
  const createOnRenamingBlur = useCallback(
    (item: NoteItem) => {
      return (e: React.FocusEvent<HTMLInputElement>) => {
        const newName = e.currentTarget.value
        if (!newName.trim()) {
          void message.warning("名称不为能空")
        } else {
          contentStore
            .set({ ...item, title: newName })
            .then(loadContent)
            .catch(console.error)
        }
        setRenaming("")
      }
    },
    [loadContent, message],
  )
  const onRenameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }, [])
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!current) {
        return
      }
      if (e.key === "ArrowLeft" && expandItems[current]) {
        setState({ expandItems: { ...expandItems, [current]: false } })
      } else if (e.key === "ArrowRight" && !expandItems[current]) {
        setState({ expandItems: { ...expandItems, [current]: true } })
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [current, expandItems, setState])

  return (
    <ol className={ss.root}>
      {data.map((item: NoteItem) => (
        <li key={item.id}>
          <NoteTreeItemMenu onClick={createOnMenuClick(item)} item={item} indent={indent}>
            <Row
              wrap={false}
              gutter={10}
              className={ss.item}
              onClick={createOnItemClick(item)}
              onDoubleClick={createOnItemDoubleClick(item)}
              data-active={current === item.id}
              style={{
                background: current === item.id ? token.colorPrimaryBg : "none",
                color: current === item.id ? token.colorPrimaryTextActive : undefined,
              }}
            >
              <Col style={{ width: `${24 + indent * 16}px`, textAlign: "right" }}>{renderExpandIcon(item)}</Col>
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
                    onBlur={createOnRenamingBlur(item)}
                    maxLength={nameMaxLength}
                  />
                ) : (
                  <div title={item.title} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title}
                  </div>
                )}
              </Col>
              {/* <Col>{item.isLeaf || 11}</Col> */}
            </Row>
          </NoteTreeItemMenu>
          {!item.isLeaf && expandItems[item.id] ? <NoteTree search={search} parentId={item.id} indent={indent + 1} /> : null}
        </li>
      ))}
    </ol>
  )
}
