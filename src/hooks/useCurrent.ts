import {useMemo} from "react"

import {NoteItem} from "~/types"

import {useNotes, useSettings} from "./useSelectors"

export default function useCurrent(): NoteItem | undefined {
    const {current} = useSettings()
    const {entities} = useNotes()

    return useMemo(() => entities[current], [current, entities])
}