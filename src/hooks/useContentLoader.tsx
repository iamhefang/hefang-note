import {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {loadNotesProgressively} from "~/redux/noteSlice"

export default function useContentLoader() {
    const dispatch = useAppDispatch()

    return useCallback(() => dispatch(loadNotesProgressively()), [dispatch])
}
