import _ from "lodash"

import {NoteItem, NoteSort, Sort} from "~/types"

import {LocaleKey} from "$hooks/useTranslate"

export const sortItems: (Sort<keyof Omit<NoteItem, "id" | "parentId" | "isLeaf">> & { label: LocaleKey })[] = [
    {field: "createTime", type: "asc", label: "创建时间"},
    {field: "modifyTime", type: "asc", label: "修改时间"},
    {field: "title", type: "asc", label: "标题"},
]
const sortCache: Record<string, (a: NoteItem, b: NoteItem) => number> = {}

export function treeSorter({field, type}: NoteSort) {
    const cacheKey = `${field}-${type}`
    if (cacheKey in sortCache) {
        return sortCache[cacheKey]
    }

    return (sortCache[cacheKey] = (a: NoteItem, b: NoteItem) => {
        if (isNaN(Number(a[field])) || isNaN(Number(b[field]))) {
            return String(a[field]).localeCompare(String(b[field]))
        }

        const item1 = _.isNumber(a[field]) ? a[field] as number : parseFloat(String(a[field]))
        const item2 = _.isNumber(b[field]) ? b[field] as number : parseFloat(String(b[field]))

        return type === "asc" ? item1 - item2 : item2 - item1
    })
}