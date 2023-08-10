import { NoteItem } from "hefang-note-types"
import { useMemo } from "react"

import { useNotes, useSettings } from "./useSelectors"

export default function useCurrent(): NoteItem | undefined {
  const { current } = useSettings()
  const { entities } = useNotes()

  return useMemo(() => entities[current], [current, entities])
}
