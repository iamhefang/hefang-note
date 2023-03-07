import _ from "lodash"
import { useCallback, useMemo } from "react"

import { NoteIndentItem } from "~/types"

import useGlobalState from "./useGlobalState"
import useItemArray from "./useItemArray"

export default function useItemsTree(search?: string): NoteIndentItem[] {
  const [{ expandItems }] = useGlobalState()

  const itemArray = useItemArray({ needSort: true, search })

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

  return useMemo(() => findChildren(undefined, 0), [findChildren])
}
