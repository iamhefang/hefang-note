import { App, Empty } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { Virtuoso } from "react-virtuoso"

import useContentLoader from "~/hooks/useContentLoader"
import useGlobalState from "~/hooks/useGlobalState"
import useItemArray from "~/hooks/useItemArray"
import useItemsTree from "~/hooks/useItemsTree"
import useNewModal from "~/hooks/useNewModal"
import type { NoteIndentItem } from "~/types"
import { contentStore } from "~/utils/database"
import NoteTreeItemMenu, { MenuInfo, NoteTreeMenuKeys } from "~/views/components/menus/NoteTreeItemMenu"

import { MemodNoteTreeItem } from "./NoteTreeItem"

export type NoteTreeProps = {
  search: string
}

export default function NoteTree({ search }: NoteTreeProps) {
  const [{ current, expandItems }, setState] = useGlobalState()
  const data = useItemsTree(search)
  const itemArray = useItemArray()
  const [rightClickItem, setRightClickItem] = useState<NoteIndentItem>()
  const loadContent = useContentLoader()
  const showModal = useNewModal()
  const { modal } = App.useApp()

  const createOnRightClick = useCallback((item: NoteIndentItem) => () => setRightClickItem(item), [])

  const itemContentRenderer = useCallback(
    (_index: number, item: NoteIndentItem) => <MemodNoteTreeItem key={item.id} item={item} onRightClick={createOnRightClick(item)} />,
    [createOnRightClick],
  )

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

  const onMenuClick = useCallback(
    (info: MenuInfo) => {
      if (!rightClickItem) {
        return
      }
      switch (info.key) {
        case NoteTreeMenuKeys.rename:
          setState({ renaming: rightClickItem.id })
          break
        case NoteTreeMenuKeys.delete:
          const children = itemArray.filter((c) => c.parentId === rightClickItem.id)
          modal.confirm({
            title: `要删除"${rightClickItem.title}"吗?`,
            content:
              rightClickItem.isLeaf || !children.length
                ? null
                : `${rightClickItem.title}是一个非空目录，删除后，其下面的${children.length}条内容将移动到上级目录`,
            onOk() {
              Promise.all([
                contentStore.delete(rightClickItem.id),
                rightClickItem.isLeaf ? Promise.resolve() : contentStore.set(...children.map((c) => ({ ...c, parentId: rightClickItem.parentId }))),
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
          showModal(info, rightClickItem.id)
          break
        default:
          console.warn("未生效的菜单")
      }
    },
    [rightClickItem, setState, itemArray, modal, showModal, loadContent],
  )

  return data.length ? (
    <NoteTreeItemMenu item={rightClickItem} onClick={onMenuClick}>
      <Virtuoso data={data} totalCount={data.length} itemContent={itemContentRenderer} fixedItemHeight={28} increaseViewportBy={280} />
    </NoteTreeItemMenu>
  ) : (
    <Empty description="没有笔记" />
  )
}

export const MemoedNoteTree = React.memo(NoteTree)
