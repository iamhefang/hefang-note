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

export const { updateContent } = noteSlice.actions