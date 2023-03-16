import { useMemo } from "react"

import { isNoteLocked } from "~/utils/notes"

import { useSettings, useStates } from "./useSelectors"

export default function useNoteLocked(noteId: string | undefined) {
    const { lockedContents } = useSettings()
    const { unlockedContents } = useStates()

    return useMemo(() => isNoteLocked(noteId, lockedContents, unlockedContents), [lockedContents, noteId, unlockedContents])
}