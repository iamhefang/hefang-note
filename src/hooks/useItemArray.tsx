import { useMemo } from "react"

import { findNoteParents } from "~/utils/notes"
import { treeSorter } from "~/utils/sort"

import { useNotes, useSettings } from "./useSelectors"

export type UseItemArrayOptions = { needSort?: boolean; search?: string }

export default function useItemArray({ needSort = false, search }: UseItemArrayOptions = {}) {
  const {
    sort: { field, type },
  } = useSettings()

  const { entities } = useNotes()

  const searched = useMemo(() => {
    const s = search?.trim().toLowerCase()
    const itemArray = Object.values(entities)
    if (!s) {
      return itemArray
    }

    const matches = itemArray
      .filter((item) => item.title.includes(s))
      .map((item) => findNoteParents(entities, item.id))
      .flat(2)

    return Array.from(new Set(matches))
  }, [entities, search])

  const sorter = useMemo(() => treeSorter({ field, type }), [field, type])

  const sorted = useMemo(() => (needSort ? searched.sort(sorter) : searched), [needSort, searched, sorter])

  return sorted
}
