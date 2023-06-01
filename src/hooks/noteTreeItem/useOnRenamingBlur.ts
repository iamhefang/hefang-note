import {App} from "antd"
import React, {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {startRenaming, stopRenaming} from "~/redux/noteSlice"
import {NoteItem} from "~/types"

import {useTranslate} from "$hooks/useTranslate"


export default function useOnRenamingBlur(item: NoteItem) {
    const t = useTranslate()
    const {message} = App.useApp()
    const dispatch = useAppDispatch()

    return useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const newName = e.currentTarget.value
            if (!newName.trim()) {
                void message.warning(t("名称不为能空"))
            } else if (newName === item.title) {
                dispatch(startRenaming(undefined))
            } else {
                dispatch(stopRenaming({id: item.id, newName}))
            }
        },
        [dispatch, item.id, item.title, message, t],
    )
}