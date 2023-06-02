import {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {setCurrent, setItemsExpanded} from "~/redux/settingSlice"
import {NoteItem} from "~/types"

import {useNotes, useSettings} from "$hooks/useSelectors"

export default function useOnItemClick(item: NoteItem) {
    const {renamingId} = useNotes()
    const dispatch = useAppDispatch()
    const {current, expandItems} = useSettings()

    return useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (renamingId && [item.id, "new-note", "new-dir"].includes(renamingId)) {
                return
            }
            if (!item.isLeaf) {
                dispatch(setItemsExpanded({[item.id]: !expandItems[item.id]}))
                if (e.nativeEvent.composedPath().find((node: EventTarget) => (node as HTMLElement).classList?.contains("anticon"))) {
                    return
                }
            }
            if (current !== item.id) {
                dispatch(setCurrent(item.id))
            }
        },
        [current, dispatch, expandItems, item.id, item.isLeaf, renamingId],
    )
}