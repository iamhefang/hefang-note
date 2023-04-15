import { Empty } from "antd"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ListRange, Virtuoso, VirtuosoHandle } from "react-virtuoso"

import useDeleteModal from "~/hooks/modals/useDeleteModal"
import useLockContentModal from "~/hooks/modals/useLockContentModal"
import { useAppDispatch } from "~/redux"
import { startRenaming } from "~/redux/noteSlice"
import { setCurrent, setItemsExpanded } from "~/redux/settingSlice"
import type { NoteIndentItem } from "~/types"

import { MemodNoteTreeItem } from "./NoteTreeItem"

import NoteTreeItemMenu, { MenuInfo, NoteTreeMenuKeys } from "$components/menus/NoteTreeItemMenu"
import useNewModal from "$hooks/modals/useNewModal"
import useItemsTree from "$hooks/useItemsTree"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"

export type NoteTreeProps = {
  search: string
}

export default function NoteTree({ search }: NoteTreeProps) {
  const { current, expandItems } = useSettings()
  const t = useTranslate()
  const data = useItemsTree(search)
  const [rightClickItem, setRightClickItem] = useState<NoteIndentItem>()
  const dispatch = useAppDispatch()
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: data.length })
  const showNewModal = useNewModal()
  const showLockModal = useLockContentModal()
  const showDeleteModal = useDeleteModal()
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
          rightClickItem && showDeleteModal(rightClickItem)
          break
        case NoteTreeMenuKeys.newDir:
        case NoteTreeMenuKeys.newNote:
          showNewModal(info, rightClickItem?.id)
          break
        case NoteTreeMenuKeys.lock:
          showLockModal(rightClickItem)
          break
        default:
          console.warn("未生效的菜单")
      }
    },
    [rightClickItem, dispatch, showDeleteModal, showNewModal, showLockModal],
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
          <Empty description={t("没有笔记")} />
        )}
      </NoteTreeItemMenu>
    ),
    [data, menuOpened, onListRightClick, onMenuClick, rightClickItem, t],
  )
}

export const MemoedNoteTree = React.memo(NoteTree)
