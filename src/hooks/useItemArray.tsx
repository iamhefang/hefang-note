import { useMemo } from "react"

import { findNoteParents } from "~/utils/notes"
import { treeSorter } from "~/utils/sort"

import useGlobalState from "./useGlobalState"

export type UseItemArrayOptions = { needSort?: boolean; search?: string }

export default function useItemArray({ needSort = false, search }: UseItemArrayOptions = {}) {
  const [{ items, sort }] = useGlobalState()

  const searched = useMemo(() => {
    const s = search?.trim().toLowerCase()
    const itemArray = Object.values(items)
    if (!s) {
      return itemArray
    }

    const matches = itemArray
      .filter((item) => item.title.includes(s))
      .map((item) => findNoteParents(items, item.id))
      .flat(2)

    return Array.from(new Set(matches))
  }, [items, search])

  const sorter = useMemo(() => treeSorter(sort), [sort])

  const sorted = useMemo(() => (needSort ? searched.sort(sorter) : searched), [needSort, searched, sorter])

  return sorted
}
