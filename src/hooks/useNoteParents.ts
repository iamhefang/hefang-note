import { useMemo } from "react"

import { findNoteParents } from "~/utils/notes"

import { useNotes } from "./useSelectors"

export default function useNoteParents(noteId: string | undefined) {
    const { entities } = useNotes()

    return useMemo(() => noteId ? findNoteParents(entities, noteId) : [], [entities, noteId])
}