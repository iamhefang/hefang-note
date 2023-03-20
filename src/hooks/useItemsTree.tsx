import { useCallback, useMemo } from "react"

import { NoteIndentItem } from "~/types"


import useItemArray from "./useItemArray"
import { useSettings, useStates } from "./useSelectors"

import { isNoteLocked } from "$utils/notes"

export default function useItemsTree(search?: string): NoteIndentItem[] {
  const { expandItems, lockedContents } = useSettings()
  const { unlockedContents } = useStates()

  const itemArray = useItemArray({ needSort: true, search })
  const findChildren = useCallback(
    (parentId: string | undefined, indent: number): NoteIndentItem[] =>
      itemArray
        .filter((item) => item.parentId === parentId)
        .map((item) => {
          const treeItem: NoteIndentItem = { ...item, indent }
          if (item.isLeaf || !expandItems[item.id] || isNoteLocked(item.id, lockedContents, unlockedContents)) {
            return treeItem
          }
          const children = findChildren(item.id, indent + 1)

          return [treeItem, ...children]
        })
        .flat(2),
    [expandItems, itemArray, lockedContents, unlockedContents],
  )

  return useMemo(() => findChildren(undefined, 0), [findChildren])
}
