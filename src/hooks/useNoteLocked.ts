import { useMemo } from "react"

import { useSettings, useStates } from "./useSelectors"

import { isNoteLocked } from "$utils/notes"

export default function useNoteLocked(noteId: string | undefined) {
  const { lockedContents } = useSettings()
  const { unlockedContents } = useStates()

  return useMemo(
    () => isNoteLocked(noteId, lockedContents, unlockedContents),
    [lockedContents, noteId, unlockedContents],
  )
}
