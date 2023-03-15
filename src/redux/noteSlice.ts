import { createAsyncThunk, createSlice, PayloadAction, Slice, SliceCaseReducers } from "@reduxjs/toolkit"
import _ from "lodash"

import { DeleteNotePayload, NoteItem, NoteState } from "~/types"
import { contentStore, database, notesStore } from "~/utils/database"
import { findNoteParents } from "~/utils/notes"



const sliceName = "notes"

export const loadAllNotes = createAsyncThunk(`${sliceName}/loadNotes`, async () => {
    const items = await notesStore.getAll()

    return Object.fromEntries(items.map(item => [item.id, item]))
})

let slice: Slice<NoteState, SliceCaseReducers<NoteState>> | null = null

const bufferSize = 3000

export const loadNotesProgressively = createAsyncThunk(`${sliceName}/loadNotesProgressively`, async (_never, api) => {
    if (!slice) { return }
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

slice = createSlice<NoteState, SliceCaseReducers<NoteState>>({
    name: "notes",
    initialState: {
        entities: {},
        ids: [],
        initializing: false,
        status: "loading",
    },
    reducers: {
        updateContent(state, action: PayloadAction<{ id: string, content: string }>) {
            const { id, content } = action.payload
            const modifyTime = Date.now()
            const notes = findNoteParents(state.entities, id)
                .map((me) => ({ ...me, modifyTime }))
                .concat({ ...state.entities[id], modifyTime })
            const item = _.last(notes)!
            for (const note of notes) {
                state.entities[note.id] = note
            }
            void notesStore.set(...notes)
            void contentStore.set(item.id, content)
        },
        deleteNote(state, action: PayloadAction<DeleteNotePayload>) {
            const { noteId, deleteChildren } = action.payload
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
                note.isLeaf || void notesStore.set(...children.map((c) => ({ ...c, parentId: note.parentId })))
            }
            void notesStore.delete(noteId)
        },
        startRenaming(state: NoteState, action) {
            state.renamingId = action.payload
        },
        stopRenaming(state: NoteState, action: PayloadAction<{ id: string, newName: string }>) {
            const { id, newName } = action.payload
            state.renamingId = undefined
            state.entities[id].title = newName
            state.entities[id].modifyTime = Date.now()
            void notesStore.set({ ...state.entities[id] })
        },
        newNote(state, action: PayloadAction<NoteItem>) {
            state.ids.push(action.payload.id)
            state.entities[action.payload.id] = action.payload
            void notesStore.set(action.payload)
        },
        setNotes(state, action: PayloadAction<NoteItem[]>) {
            for (const item of action.payload) {
                state.entities[item.id] = item
                state.ids.push(item.id)
            }
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

export const { updateContent, startRenaming, stopRenaming, newNote, deleteNote } = slice.actions

