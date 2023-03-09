import { useCallback } from "react"

import { useAppDispatch } from "~/redux"
import { loadNotes } from "~/redux/noteSlice"

export default function useContentLoader() {
  const dispatch = useAppDispatch()

  return useCallback(() => dispatch(loadNotes()), [dispatch])
}
