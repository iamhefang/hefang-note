import {NoteItem} from "~/types"

const renamingMap: Record<string, string> = {
    "new-note": "输入笔记名",
    "new-dir": "输入目录名",
}

export function renamingPlaceholder(renamingId: string, item: NoteItem) {
    return renamingMap[renamingId] ?? item.title
}

export function renamingDefaultValue(renamingId: string, item: NoteItem) {
    return renamingId.startsWith("new") ? "" : item.title
}

export function getNewNote(item: Partial<NoteItem>): NoteItem {
    return {
        id: crypto.randomUUID(),
        title: item.isLeaf ? "新建笔记" : "新建目录",
        createTime: Date.now(),
        modifyTime: Date.now(),
        isLeaf: true,
        ...item,
    }
}