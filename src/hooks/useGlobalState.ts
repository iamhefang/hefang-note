import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import type { GlobalDispatcher, GlobalState } from "~/types"

export default function useGlobalState(): [GlobalState, GlobalDispatcher] {
  const dispatch = useDispatch()
  const state = useSelector<GlobalState, GlobalState>((s: GlobalState) => s)

  return useMemo(
    () => [
      state,
      (payload) => {
        dispatch({ type: "", payload })
      },
    ],
    [dispatch, state],
  )
}
