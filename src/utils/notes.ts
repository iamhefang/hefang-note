import { NoteItem } from "~/types"

/**
 * 获取指定笔记或目录的全部上级目录
 * @param items 全部笔记
 * @param id 要获取上级目录的笔记id
 * @returns 全部上级目录，不包括本身
 */
export function findNoteParents<T extends NoteItem = NoteItem>(items: Record<string, T>, id: string): T[] {
    let item = items[id]
    if (!item) { return [] }
    const parents: T[] = []

    while (item?.parentId) {
        item = items[item.parentId]
        item && parents.push(item)
    }

    return parents
}