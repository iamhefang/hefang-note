import { useCallback } from "react"

import { useAppDispatch } from "~/redux"
import { startRenaming } from "~/redux/noteSlice"
import { NoteItem } from "~/types"

export default function useOnRenameKeyDown(item: NoteItem) {
    const dispatch = useAppDispatch()

    return useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.currentTarget.blur()
            } else if (e.key === "Escape") {
                dispatch(startRenaming(undefined))
            }
        },
        [dispatch],
    )
}