import { NoteItem } from "hefang-note-types"

import { contentStore, notesStore } from "./database"

import pkg from "^/package.json"

/**
 * 获取指定笔记或目录的全部上级目录
 * @param items 全部笔记
 * @param id 要获取上级目录的笔记id
 * @returns 全部上级目录，不包括本身
 */
export function findNoteParents<T extends NoteItem = NoteItem>(items: Record<string, T>, id: string): T[] {
  let item = items[id]
  if (!item) {
    return []
  }
  const parents: T[] = []

  while (item?.parentId) {
    item = items[item.parentId]
    item && parents.push(item)
  }

  return parents
}

export async function buildExportJson(): Promise<string> {
  const notes = await notesStore.getAll()
  const contents = await contentStore.getObject()
  const json = JSON.stringify({
    name: pkg.productName,
    version: pkg.version,
    notes,
    contents,
    saveTime: Date.now(),
  })

  return json
}

export function isNoteLocked(
  noteId: string | undefined,
  lockedContents: { [id: string]: string },
  unlockedContents: { [id: string]: number },
): boolean {
  if (!noteId) {
    return false
  }

  return !!(lockedContents[noteId] && (unlockedContents[noteId] || Number.MIN_SAFE_INTEGER) < Date.now())
}
