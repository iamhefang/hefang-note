import {useMemo} from "react"

import {useNotes} from "./useSelectors"

import {findNoteParents} from "$utils/notes"


export default function useNoteParents(noteId: string | undefined) {
    const {entities} = useNotes()

    return useMemo(() => noteId ? findNoteParents(entities, noteId) : [], [entities, noteId])
}