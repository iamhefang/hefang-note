import _ from "lodash"
import { useMemo } from "react"

import { NoteItem } from "~/types"

import { useNotes, useSettings } from "./useSelectors"

export default function useItemChildrens(parentId?: string, search?: string): NoteItem[] {
  const { items } = useNotes()
  const {
    sort: { field, type },
  } = useSettings()

  return useMemo(() => {
    const s = search?.toLowerCase().trim()

    const values = Object.values(items)

    let _items = values
    if (s) {
      const parentIds: string[] = []
      _items = _items.filter((item) => {
        const match = item.title.toLowerCase().includes(s)
        if (match && item.parentId) {
          parentIds.push(item.parentId)
        }

        return match
      })
      if (parentIds.length) {
        _items = _items.concat(values.filter((item) => parentIds.includes(item.id)))
      }
    }

    return _items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => {
        let item1: number
        let item2: number
        if (_.isNumber(a[field]) && _.isNumber(b[field])) {
          item1 = a[field] as number
          item2 = b[field] as number
        } else {
          item1 = String(a[field]).charCodeAt(0)
          item2 = String(a[field]).charCodeAt(0)
        }

        return type === "asc" ? item1 - item2 : item2 - item1
      })
  }, [search, items, parentId, field, type])
}
