import { NoteItem } from "~/types"

export function findNoteParents<T extends NoteItem = NoteItem>(items: Record<string, T>, id: string): T[] {
    let item = items[id]
    if (!item) { return [] }
    const parents: T[] = [item]

    while (item?.parentId) {
        item = items[item.parentId]
        item && parents.push(item)
    }

    return parents
}