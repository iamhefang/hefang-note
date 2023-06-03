import {useCallback} from "react"

import {ContentIOType} from "~/plugin"
import {useAppDispatch} from "~/redux"
import {startRenaming} from "~/redux/noteSlice"

import useNewNoteDispatcher from "./useNewNoteDispatcher"

import {MenuInfo, NoteTreeMenuKeys} from "$components/menus/NoteTreeItemMenu"
import useDeleteModal from "$hooks/modals/useDeleteModal"
import useLockContentModal from "$hooks/modals/useLockContentModal"
import {doExport} from "$hooks/noteTreeItem/uitils"
import {useStates} from "$hooks/useSelectors"




export default function useOnNoteTreeMenuClick() {
    const dispatch = useAppDispatch()
    const showLockModal = useLockContentModal()
    const showDeleteModal = useDeleteModal()
    const {rightClickedItem} = useStates()
    const newNoteDispatch = useNewNoteDispatcher(rightClickedItem?.id)

    return useCallback(
        (info: MenuInfo) => {
            switch (info.key) {
                case NoteTreeMenuKeys.rename:
                    rightClickedItem && dispatch(startRenaming(rightClickedItem.id))
                    break
                case NoteTreeMenuKeys.delete:
                    rightClickedItem && showDeleteModal(rightClickedItem)
                    break
                case NoteTreeMenuKeys.newDir:
                case NoteTreeMenuKeys.newNote:
                    newNoteDispatch(info.key === NoteTreeMenuKeys.newNote)
                    break
                case NoteTreeMenuKeys.lock:
                    showLockModal(rightClickedItem)
                    break
                case NoteTreeMenuKeys.exportHTML:
                    rightClickedItem && doExport(rightClickedItem, ContentIOType.html)
                    break
                case NoteTreeMenuKeys.exportMarkdown:
                    rightClickedItem && doExport(rightClickedItem, ContentIOType.markdown)
                    break
                default:
                    console.warn("未生效的菜单")
            }
        },
        [rightClickedItem, dispatch, showDeleteModal, newNoteDispatch, showLockModal],
    )
}
