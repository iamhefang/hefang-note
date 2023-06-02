import {createAsyncThunk, createSlice, PayloadAction, Slice, SliceCaseReducers} from "@reduxjs/toolkit"
import _ from "lodash"

import {CONTENT_SAVE_DELAY} from "~/config"
import {ContentSaveEvent, PluginHookOccasion} from "~/plugin"
import {DeleteNotePayload, NoteItem, NoteState} from "~/types"

import {contentStore, database, notesStore} from "$utils/database"
import {findNoteParents} from "$utils/notes"


const sliceName = "notes"

export const loadAllNotes = createAsyncThunk(`${sliceName}/loadNotes`, async () => {
    const items = await notesStore.getAll()

    return Object.fromEntries(items.map(item => [item.id, item]))
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
const lastSave: Record<string, { time: number, content: string }> = {}
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
        updateContent(state, action: PayloadAction<{ id: string, content: string, force?: boolean }>) {

            const {id, content, force = false} = action.payload
            const last = lastSave[id] ?? {time: 0, content: ""}

            // console.log("更新笔记内容到数据库", action.payload, lastSave, last)

            const now = Date.now()
            if (!force && (last.content === content || now - last.time <= CONTENT_SAVE_DELAY)) {
                return
            }

            lastSave[id] = {time: now, content}
            const notes = findNoteParents(state.entities, id)
                .map((me) => ({...me, modifyTime: now}))
                .concat({...state.entities[id], modifyTime: now})
            const item = _.last(notes)!
            console.info("正在保存笔记", item.id, content)
            const beforeEvent = new ContentSaveEvent({detail: {note: item, nextContent: content}, occasion: PluginHookOccasion.before})
            for (const plugin of window.notebook.plugins) {
                if (!beforeEvent.bubble) {
                    break
                }
                plugin.hooks?.includes("onContentSave") && plugin.onContentSave?.(beforeEvent)
            }
            if (!beforeEvent.isDefaultPrevented()) {
                void notesStore.set(...notes)
                void contentStore.set(item.id, beforeEvent.detail.nextContent)
                for (const note of notes) {
                    state.entities[note.id] = note
                }
                const afterEvent = new ContentSaveEvent({detail: {note: item, nextContent: content}, occasion: PluginHookOccasion.after})
                for (const plugin of window.notebook.plugins) {
                    if (!afterEvent.bubble) {
                        break
                    }
                    plugin.hooks?.includes("onContentSave") && plugin.onContentSave?.(afterEvent)
                }
            }
        },
        /**
         * 删除笔记
         * @param state
         * @param action
         */
        deleteNote(state, action: PayloadAction<DeleteNotePayload>) {
            const {noteId, deleteChildren} = action.payload
            const note = state.entities[noteId]
            delete state.entities[noteId]
            state.ids.splice(state.ids.indexOf(noteId), 1)
            const children = Object.values(state.entities).filter(item => item.parentId === noteId)
            if (deleteChildren) {
                void notesStore.delete(...children.map(item => item.id))
            } else {
                for (const entity of Object.values(state.entities)) {
                    if (entity.parentId === noteId) {
                        entity.parentId = note.parentId
                    }
                }
                note.isLeaf || void notesStore.set(...children.map((c) => ({...c, parentId: note.parentId})))
            }
            void notesStore.delete(noteId)
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
        stopRenaming(state: NoteState, action: PayloadAction<{ id: string, newName: string }>) {
            const {id, newName} = action.payload
            state.renamingId = undefined
            state.entities[id].title = newName
            state.entities[id].modifyTime = Date.now()
            void notesStore.set({...state.entities[id]})
        },
        /**
         * 新笔记入库
         * @param state
         * @param action
         */
        newNote(state, action: PayloadAction<NoteItem>) {
            state.ids.push(action.payload.id)
            state.entities[action.payload.id] = action.payload
            void notesStore.set(action.payload)
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
        moveNote(state, action: PayloadAction<{ sourceId: string, targetId: string }>) {
            const {sourceId, targetId} = action.payload
            const note = state.entities[sourceId]
            note.parentId = targetId
            note.modifyTime = Date.now()
            console.info(`移动笔记${note.title}到${targetId}`)
            void notesStore.set({...note})
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

export const {updateContent, startRenaming, stopRenaming, newNote, deleteNote, moveNote} = slice.actions

