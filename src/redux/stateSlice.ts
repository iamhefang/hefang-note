import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit"


export type States = {
    showSettingsModal: boolean
    launching: boolean
    renaming: string
    exporting: boolean
}
const sliceName = "states"


export const stateSlice = createSlice<States, SliceCaseReducers<States>>({
    name: sliceName,
    initialState: {
        showSettingsModal: false,
        launching: true,
        renaming: "",
        exporting: false,
    },
    reducers: {
        toggleSettingsModal(state: States) {
            state.showSettingsModal = !state.showSettingsModal
        },
        startRenaming(state: States, action) {
            state.renaming = action.payload
        },
        stopRenaming(state: States) {
            state.renaming = ""
        },
        ready(state) {
            state.launching = false
        },
    },
})

export const { toggleSettingsModal, startRenaming, stopRenaming, ready } = stateSlice.actions