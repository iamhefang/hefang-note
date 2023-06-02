import {useCallback} from "react"
import TurnDown from "turndown"
import * as turndownPluginGfm from "turndown-plugin-gfm"

import {useAppDispatch} from "~/redux"
import {startRenaming} from "~/redux/noteSlice"
import exportHTML from "~/templates/export-html.html?raw"

import useNewNoteDispatcher from "./useNewNoteDispatcher"

import {MenuInfo, NoteTreeMenuKeys} from "$components/menus/NoteTreeItemMenu"
import useDeleteModal from "$hooks/modals/useDeleteModal"
import useLockContentModal from "$hooks/modals/useLockContentModal"
import {useSettings, useStates} from "$hooks/useSelectors"
import {contentStore} from "$utils/database"
import {saveFile} from "$utils/file"

const turndown = new TurnDown({headingStyle: "atx"})
turndown.use(turndownPluginGfm.gfm)

export default function useOnNoteTreeMenuClick() {
    const {current} = useSettings()
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
                    contentStore
                        .get(current)
                        .then((content) => {
                            const title = rightClickedItem?.title ?? ""
                            saveFile(exportHTML.replace("$TITLE_PLACEHOLDER$", title).replace("$CONTENT_PLACEHODLER$", content), {
                                mimeType: "text/html",
                                fileName: `${title}.html`,
                            })
                        })
                        .catch(console.error)
                    break
                case NoteTreeMenuKeys.exportMarkdown:
                    contentStore
                        .get(current)
                        .then((content) => {
                            const title = rightClickedItem?.title ?? ""
                            const md = turndown.turndown(content)
                            saveFile(md, {
                                mimeType: "text/markdown",
                                fileName: `${title}.md`,
                            })
                        })
                        .catch(console.error)
                    break
                default:
                    console.warn("未生效的菜单")
            }
        },
        [rightClickedItem, dispatch, showDeleteModal, newNoteDispatch, showLockModal, current],
    )
}
