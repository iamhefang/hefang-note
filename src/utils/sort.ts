import { NoteItem, NoteSort, Sort } from "hefang-note-types"
import _ from "lodash"

import { LocaleKey } from "$hooks/useTranslate"

export const sortItems: (Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">> & { label: LocaleKey })[] = [
  { field: "createTime", type: "asc", label: "创建时间" },
  { field: "modifyTime", type: "asc", label: "修改时间" },
  { field: "title", type: "asc", label: "标题" },
]
const sortCache: Record<string, (a: NoteItem, b: NoteItem) => number> = {}

export function treeSorter({ field, type }: NoteSort) {
  const cacheKey = `${field}-${type}`
  if (cacheKey in sortCache) {
    return sortCache[cacheKey]
  }

  return (sortCache[cacheKey] = (a: NoteItem, b: NoteItem) => {
    if (_.isNumber(a[field]) && _.isNumber(b[field])) {
      const item1 = a[field] as number
      const item2 = b[field] as number

      return type === "asc" ? item1 - item2 : item2 - item1
    }

    const item1 = String(a[field])
    const item2 = String(a[field])

    return type === "asc" ? item1.localeCompare(item2) : item2.localeCompare(item1)
  })
}
