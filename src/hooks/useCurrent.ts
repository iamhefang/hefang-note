import { useMemo } from "react"

import { NoteItem } from "~/types"

import { useNotes, useSettings } from "./useSelectors"

export default function useCurrent(): [string?, NoteItem?] {
    const { current } = useSettings()
    const { entities } = useNotes()

    return useMemo(() => [current, entities[current]], [current, entities])
}