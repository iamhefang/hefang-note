import React, {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {startRenaming} from "~/redux/noteSlice"

export default function useOnRenameKeyDown() {
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