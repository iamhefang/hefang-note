import { NoteItem, Sort } from "~/types"

export const sortItems: (Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">> & { label: string })[] = [
  { field: "createTime", type: "asc", label: "创建时间" },
  { field: "modifyTime", type: "asc", label: "编辑时间" },
  { field: "title", type: "desc", label: "标题" },
]
