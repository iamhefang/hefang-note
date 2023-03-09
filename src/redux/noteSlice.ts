import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"
import _ from "lodash"

import { NoteItem } from "~/types"
import { contentStore, notesStore } from "~/utils/database"
import { findNoteParents } from "~/utils/notes"



export type NoteState = {
    ids: string[]
    entities: { [id: string]: NoteItem }
    initializing: boolean
    status: "loading" | "idle" | "failed"
    renamingId?: string
}
const sliceName = "notes"

export const loadNotes = createAsyncThunk(`${sliceName}/loadNotes`, async () => {
    const items = await notesStore.getAll()

    return Object.fromEntries(items.map(item => [item.id, item]))
})

export const noteSlice = createSlice<NoteState, SliceCaseReducers<NoteState>>({
    name: "notes",
    initialState: {
        entities: {},
        ids: [],
        initializing: true,
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
        deleteNote(state, action: PayloadAction<string>) {
            const id = action.payload
            const note = state.entities[id]
            delete state.entities[id]
            state.ids.splice(state.ids.indexOf(id), 1)
            const children = Object.values(state.entities).filter(item => item.parentId === id)
            for (const entity of Object.values(state.entities)) {
                if (entity.parentId === id) {
                    entity.parentId = note.parentId
                }
            }
            void notesStore.delete(id)
            note.isLeaf || void notesStore.set(...children.map((c) => ({ ...c, parentId: note.parentId })))
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
    },
    extraReducers(builder) {
        builder
            .addCase(loadNotes.fulfilled, (state, action) => {
                state.entities = action.payload
                state.ids = Object.keys(action.payload)
                state.initializing = false
                state.status = "idle"
            })
            .addCase(loadNotes.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadNotes.rejected, (state) => {
                state.status = "failed"
            })
    },
})

export const { updateContent, startRenaming, stopRenaming, newNote, deleteNote } = noteSlice.actions