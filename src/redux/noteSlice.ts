import { createAsyncThunk, createSlice, PayloadAction, Slice, SliceCaseReducers } from "@reduxjs/toolkit"
import {
  NoteChangeEvent,
  NoteChangeType,
  NoteContentChangeDetail,
  NoteItem,
  NoteMoveDetail,
  NoteNewDetail,
  NoteRenameDetail,
  PluginHookOccasion,
} from "hefang-note-types"
import _ from "lodash"

import { CONTENT_SAVE_DELAY } from "~/config"
import { DeleteNotePayload, NoteState } from "~/types"

import { callPluginsHooks } from "$plugin/utils"
import { contentStore, database, notesStore } from "$utils/database"
import { findNoteParents } from "$utils/notes"

const sliceName = "notes"

export const loadAllNotes = createAsyncThunk(`${sliceName}/loadNotes`, async () => {
  const items = await notesStore.getAll()

  return Object.fromEntries(items.map((item) => [item.id, item]))
})

let slice: Slice<NoteState, SliceCaseReducers<NoteState>> | null = null

const bufferSize = 3000

export const loadNotesProgressively = createAsyncThunk(`${sliceName}/loadNotesProgressively`, async (_never, api) => {
  if (!slice) {
    return
  }
  const tx = (await database).transaction("notes", "readonly")
  let cursor = await tx.objectStore("notes").openCursor()
  const buffer: NoteItem[] = new Array(bufferSize)
  let index = 0
  while (cursor) {
    buffer[index++] = cursor.value
    if (index === bufferSize) {
      api.dispatch(slice.actions.setNotes(buffer))
      index = 0
    }
    cursor = await cursor.continue()
  }
  if (index !== bufferSize) {
    api.dispatch(slice.actions.setNotes(buffer.slice(0, index)))
  }
  await tx.done
})
const lastSave: Record<string, { time: number; content: string }> = {}
slice = createSlice<NoteState, SliceCaseReducers<NoteState>>({
  name: "notes",
  initialState: {
    entities: {},
    ids: [],
    initializing: false,
    status: "loading",
  },
  reducers: {
    /**
     * 更新笔记内容到数据库
     * @param state
     * @param action
     */
    updateContent(state, action: PayloadAction<{ id: string; content: string; force?: boolean }>) {
      const { id, content, force = false } = action.payload
      const last = lastSave[id] ?? { time: 0, content: "" }

      const now = Date.now()
      if (!force && (last.content === content || now - last.time <= CONTENT_SAVE_DELAY)) {
        return
      }

      lastSave[id] = { time: now, content }
      const notes = findNoteParents(state.entities, id)
        .map((me) => ({ ...me, modifyTime: now }))
        .concat({ ...state.entities[id], modifyTime: now })
      const item = _.last(notes)!

      callPluginsHooks(
        "onNoteChange",
        new NoteChangeEvent({
          detail: {
            type: NoteChangeType.CONTENT_CHANGE,
            note: item,
            newContent: content,
          },
          occasion: PluginHookOccasion.before,
        }),
        (detail) => {
          const newContent = (detail as NoteContentChangeDetail).newContent
          void notesStore.set(...notes)
          void contentStore.set(item.id, newContent)
          for (const note of notes) {
            state.entities[note.id] = note
          }
        },
      )
    },
    /**
     * 删除笔记
     * @param state
     * @param action
     */
    deleteNote(state, action: PayloadAction<DeleteNotePayload>) {
      const { noteId, deleteChildren } = action.payload
      const note = state.entities[noteId]
      const children = Object.values(state.entities).filter((item) => item.parentId === noteId)
      callPluginsHooks(
        "onNoteChange",
        new NoteChangeEvent({
          detail: { type: NoteChangeType.DELETE, note, children: deleteChildren ? children : undefined },
          occasion: PluginHookOccasion.before,
        }),
        (detail) => {
          delete state.entities[noteId]
          state.ids.splice(state.ids.indexOf(noteId), 1)
          if (deleteChildren) {
            void notesStore.delete(...children.map((item) => item.id))
          } else {
            for (const entity of Object.values(state.entities)) {
              if (entity.parentId === noteId) {
                entity.parentId = note.parentId
              }
            }
            note.isLeaf || void notesStore.set(...children.map((c) => ({ ...c, parentId: note.parentId })))
          }
          void notesStore.delete(noteId)
        },
      )
    },
    /**
     * 开始重命名
     * @param state
     * @param action
     */
    startRenaming(state: NoteState, action) {
      state.renamingId = action.payload
    },
    /**
     * 结束重命名
     * @param state
     * @param action
     */
    stopRenaming(state: NoteState, action: PayloadAction<{ id: string; newName: string }>) {
      const { id, newName } = action.payload
      state.renamingId = undefined
      callPluginsHooks(
        "onNoteChange",
        new NoteChangeEvent({
          detail: { type: NoteChangeType.RENAME, note: state.entities[id], newTitle: newName },
          occasion: PluginHookOccasion.before,
        }),
        (detail: NoteRenameDetail) => {
          const newTitle = detail.newTitle
          state.entities[id].title = newTitle
          state.entities[id].modifyTime = Date.now()
          void notesStore.set({ ...state.entities[id] })
        },
      )
    },
    /**
     * 新笔记入库
     * @param state
     * @param action
     */
    newNote(state, action: PayloadAction<NoteItem>) {
      const parents = findNoteParents(state.entities, action.payload.id)
      callPluginsHooks(
        "onNoteChange",
        new NoteChangeEvent({
          detail: {
            type: NoteChangeType.NEW,
            note: action.payload,
            parents,
          },
          occasion: PluginHookOccasion.before,
        }),
        (detail: NoteNewDetail) => {
          state.ids.push(detail.note.id)
          state.entities[detail.note.id] = detail.note
          void notesStore.set(detail.note)
        },
      )
    },
    /**
     * 同步数据库笔记到内存
     * @param state
     * @param action
     */
    setNotes(state, action: PayloadAction<NoteItem[]>) {
      for (const item of action.payload) {
        state.entities[item.id] = item
        state.ids.push(item.id)
      }
    },
    /**
     * 移动笔记到指定目录
     * @param state
     * @param action
     */
    moveNote(state, action: PayloadAction<{ sourceId: string; targetId: string }>) {
      const { sourceId, targetId } = action.payload
      const note = state.entities[sourceId]
      callPluginsHooks(
        "onNoteChange",
        new NoteChangeEvent({
          detail: { type: NoteChangeType.MOVE, note, newParentId: targetId },
          occasion: PluginHookOccasion.before,
        }),
        (detail: NoteMoveDetail) => {
          note.parentId = detail.newParentId
          note.modifyTime = Date.now()
          console.info(`移动笔记${note.title}到${targetId}`)
          void notesStore.set({ ...note })
        },
      )
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadNotesProgressively.fulfilled, (state) => {
        state.status = "idle"
      })
      .addCase(loadNotesProgressively.pending, (state) => {
        state.status = "loading"
      })
      .addCase(loadNotesProgressively.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const noteSlice: Slice<NoteState, SliceCaseReducers<NoteState>> = slice

export const { updateContent, startRenaming, stopRenaming, newNote, deleteNote, moveNote, setNotes } = slice.actions
