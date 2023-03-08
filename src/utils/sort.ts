import _ from "lodash"

import { NoteItem, NoteSort, Sort } from "~/types"

export const sortItems: (Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">> & { label: string })[] = [
  { field: "createTime", type: "asc", label: "创建时间" },
  { field: "modifyTime", type: "asc", label: "编辑时间" },
  { field: "title", type: "asc", label: "标题" },
]

export function treeSorter({ field, type }: NoteSort) {
  console.info("treeSorter", field, type)

  return (a: NoteItem, b: NoteItem) => {
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
  }
}