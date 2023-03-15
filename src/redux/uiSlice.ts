import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit"

import { UIState } from "~/types"

const sliceName = "states"


export const uiSlice = createSlice<UIState, SliceCaseReducers<UIState>>({
    name: sliceName,
    initialState: {
        showSettingsModal: false,
        launching: true,
        exporting: false,
    },
    reducers: {
        toggleSettingsModal(state: UIState) {
            state.showSettingsModal = !state.showSettingsModal
        },
        ready(state) {
            state.launching = false
        },
    },
})

export const { toggleSettingsModal, startRenaming, stopRenaming, ready } = uiSlice.actions