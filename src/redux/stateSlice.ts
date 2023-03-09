import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"


export type States = {
    showSettingsModal: boolean
    launching: boolean
    exporting: boolean
}
const sliceName = "states"


export const stateSlice = createSlice<States, SliceCaseReducers<States>>({
    name: sliceName,
    initialState: {
        showSettingsModal: false,
        launching: true,
        exporting: false,
    },
    reducers: {
        toggleSettingsModal(state: States) {
            state.showSettingsModal = !state.showSettingsModal
        },
        ready(state) {
            state.launching = false
        },
    },
})

export const { toggleSettingsModal, startRenaming, stopRenaming, ready } = stateSlice.actions