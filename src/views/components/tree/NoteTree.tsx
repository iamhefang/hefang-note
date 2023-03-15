import { App, Empty } from "antd"
import _ from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ListRange, Virtuoso, VirtuosoHandle } from "react-virtuoso"

import { useAppDispatch } from "~/redux"
import { deleteNote, startRenaming } from "~/redux/noteSlice"
import { setCurrent, setItemsExpanded } from "~/redux/settingSlice"
import type { NoteIndentItem } from "~/types"

import { MemodNoteTreeItem } from "./NoteTreeItem"

import NoteTreeItemMenu, { MenuInfo, NoteTreeMenuKeys } from "$components/menus/NoteTreeItemMenu"
import useItemArray from "$hooks/useItemArray"
import useItemsTree from "$hooks/useItemsTree"
import useNewModal from "$hooks/useNewModal"
import { useSettings } from "$hooks/useSelectors"

export type NoteTreeProps = {
  search: string
}

export default function NoteTree({ search }: NoteTreeProps) {
  const { current, expandItems } = useSettings()
  const data = useItemsTree(search)
  const itemArray = useItemArray()
  const [rightClickItem, setRightClickItem] = useState<NoteIndentItem>()
  const dispatch = useAppDispatch()
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: data.length })
  const showModal = useNewModal()
  const { modal } = App.useApp()
  const refVirtuoso = useRef<VirtuosoHandle>(null)
  const [menuOpened, setMenuOpened] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!current || isContentEditable(document.activeElement)) {
        return
      }
      if (e.key.startsWith("Arrow")) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }
      const currentIndex = data.findIndex((item) => item.id === current)
      if (currentIndex === -1) {
        return
      }
      const currentItem = data[currentIndex]
      if (e.key === "ArrowLeft" && expandItems[current]) {
        if (currentItem?.isLeaf) {
          if (currentItem.parentId) {
            dispatch(setItemsExpanded({ [currentItem.parentId]: false }))
            dispatch(setCurrent(currentItem.parentId))
          }
        } else {
          dispatch(setItemsExpanded({ [current]: false }))
        }

        return
      }
      if (e.key === "ArrowRight" && !expandItems[current]) {
        dispatch(setItemsExpanded({ [current]: true }))

        return
      }
      let newIndex: number = -1
      if (e.key === "ArrowDown") {
        newIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1
      } else if (e.key === "ArrowUp") {
        newIndex = currentIndex ? currentIndex - 1 : data.length - 1
      }
      if (newIndex !== -1) {
        dispatch(setCurrent(data[newIndex].id))
        if (newIndex < range.startIndex + 10 || newIndex > range.endIndex - 10) {
          refVirtuoso.current?.scrollToIndex({ index: newIndex, align: "center", behavior: "smooth" })
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [current, data, dispatch, expandItems, range, range.endIndex, range.startIndex])

  const onMenuClick = useCallback(
    (info: MenuInfo) => {
      switch (info.key) {
        case NoteTreeMenuKeys.rename:
          rightClickItem && dispatch(startRenaming(rightClickItem.id))
          break
        case NoteTreeMenuKeys.delete:
          if (!rightClickItem) {
            return
          }
          const children = itemArray.filter((c) => c.parentId === rightClickItem.id)
          modal.confirm({
            title: `要删除"${rightClickItem.title}"吗?`,
            content:
              rightClickItem.isLeaf || !children.length
                ? null
                : `${rightClickItem.title}是一个非空目录，删除后，其下面的${children.length}条内容将移动到上级目录`,
            onOk() {
              dispatch(deleteNote(rightClickItem.id))
            },
          })
          break
        case NoteTreeMenuKeys.newDir:
        case NoteTreeMenuKeys.newNote:
          showModal(info, rightClickItem?.id)
          break
        default:
          console.warn("未生效的菜单")
      }
    },
    [rightClickItem, dispatch, itemArray, modal, showModal],
  )

  const onListRightClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const pathes = e.nativeEvent.composedPath()
      const itemId = (pathes.find((path) => path instanceof HTMLDivElement && path.getAttribute("data-id")) as HTMLDivElement)?.getAttribute("data-id")
      setRightClickItem(data.find((item) => item.id === itemId))
    },
    [data],
  )

  return useMemo(
    () => (
      <NoteTreeItemMenu item={rightClickItem} onClick={onMenuClick} onOpenChange={setMenuOpened}>
        {data.length ? (
          <Virtuoso
            style={{ overflowY: menuOpened ? "hidden" : "auto" }}
            ref={refVirtuoso}
            data={data}
            totalCount={data.length}
            fixedItemHeight={30}
            increaseViewportBy={300}
            onContextMenu={onListRightClick}
            components={{ Item: MemodNoteTreeItem }}
            rangeChanged={setRange}
          />
        ) : (
          <Empty description="没有笔记" />
        )}
      </NoteTreeItemMenu>
    ),
    [data, menuOpened, onListRightClick, onMenuClick, rightClickItem],
  )
}

export const MemoedNoteTree = React.memo(NoteTree)
