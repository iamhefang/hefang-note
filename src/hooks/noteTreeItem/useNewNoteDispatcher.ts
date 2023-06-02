import {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {newNote, startRenaming} from "~/redux/noteSlice"
import {setCurrent, setItemsExpanded} from "~/redux/settingSlice"

import {getNewNote} from "$hooks/noteTreeItem/uitils"
import useNoteParents from "$hooks/useNoteParents"

export default function useNewNoteDispatcher(parentId?: string) {
    const dispatch = useAppDispatch()
    const parents = useNoteParents(parentId)

    return useCallback((isLeaf: boolean) => {
        const newNoteItem = getNewNote({
            isLeaf,
            parentId,
        })
        const expandItems: Record<string, boolean> = Object.fromEntries(parents.map(item => [item.id, true]))
        if (parentId) {
            expandItems[parentId] = true
        }
        dispatch(newNote(newNoteItem))
        dispatch(setCurrent(newNoteItem.id))
        dispatch(setItemsExpanded(expandItems))
        dispatch(startRenaming(newNoteItem.id))
    }, [dispatch, parentId, parents])
}