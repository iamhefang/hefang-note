import { useCallback, useMemo } from "react"

import { NoteIndentItem } from "~/types"

import useGlobalState from "./useGlobalState"
import useItemArray from "./useItemArray"

export default function useItemsTree(search?: string): NoteIndentItem[] {
  const [{ expandItems, items }] = useGlobalState()

  const itemArray = useItemArray(true)

  const findChildren = useCallback(
    (parentId: string | undefined, indent: number): NoteIndentItem[] =>
      itemArray
        .filter((item) => item.parentId === parentId)
        .map((item) => {
          const treeItem: NoteIndentItem = { ...item, indent }
          if (item.isLeaf || !expandItems[item.id]) {
            return treeItem
          }
          const children = findChildren(item.id, indent + 1)

          return [treeItem, ...children]
        })
        .flat(3),
    [expandItems, itemArray],
  )

  return useMemo(() => {
    const _items = findChildren(undefined, 0)
    const s = search?.trim()?.toLowerCase()
    if (!s) {
      return _items
    }

    return _items
  }, [findChildren, search])
}
