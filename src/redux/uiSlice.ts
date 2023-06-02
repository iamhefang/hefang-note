import {createSlice, PayloadAction, SliceCaseReducers} from "@reduxjs/toolkit"

import {NoteIndentItem, UIState} from "~/types"

const sliceName = "states"


export const uiSlice = createSlice<UIState, SliceCaseReducers<UIState>>({
    name: sliceName,
    initialState: {
        showSettingsModal: false,
        launching: true,
        exporting: false,
        unlockedContents: {},
        search: "",
    },
    reducers: {
        /**
         * 显示/隐藏配置弹窗
         * @param state
         */
        toggleSettingsModal(state: UIState) {
            state.showSettingsModal = !state.showSettingsModal
        },
        /**
         * 重新锁定笔记或目录
         * @param state
         * @param action
         */
        relockContent(state, action: PayloadAction<string>) {
            delete state.unlockedContents[action.payload]
        },
        /**
         * 解锁笔记或目录
         * @param state
         * @param action
         */
        unlockContent(state, action: PayloadAction<string>) {
            // TODO: 暂时使用最大值做为锁定时间，后期改为无活动多长时间重新锁定
            state.unlockedContents[action.payload] = Number.MAX_SAFE_INTEGER
        },
        /**
         * 设置启动状态为已完成
         * @param state
         */
        ready(state) {
            state.launching = false
        },
        /**
         * 设置右键点击的笔记或目录
         * @param state
         * @param action
         */
        setRightClickItem(state, action: PayloadAction<NoteIndentItem>) {
            state.rightClickedItem = action.payload
        },
        /**
         * 设置搜索值
         * @param state
         * @param action
         */
        setSearchValue(state, action: PayloadAction<string>) {
            state.search = action.payload
        },
    },
})

export const {
    toggleSettingsModal,
    ready,
    unlockContent,
    relockContent,
    setRightClickItem,
    setSearchValue,
} = uiSlice.actions