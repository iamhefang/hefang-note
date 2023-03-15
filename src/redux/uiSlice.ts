import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit"

import { UIState } from "~/types"

const sliceName = "states"


export const uiSlice = createSlice<UIState, SliceCaseReducers<UIState>>({
    name: sliceName,
    initialState: {
        showSettingsModal: false,
        launching: true,
        exporting: false,
        unlockedContents: {},
    },
    reducers: {
        toggleSettingsModal(state: UIState) {
            state.showSettingsModal = !state.showSettingsModal
        },
        relockContent(state, action: PayloadAction<string>) {
            delete state.unlockedContents[action.payload]
        },
        unlockContent(state, action: PayloadAction<string>) {
            // TODO: 暂时使用最大值做为锁定时间，后期改为无活动多长时间重新锁定
            state.unlockedContents[action.payload] = Number.MAX_SAFE_INTEGER
        },
        ready(state) {
            state.launching = false
        },
    },
})

export const { toggleSettingsModal, startRenaming, stopRenaming, ready, unlockContent, relockContent } = uiSlice.actions