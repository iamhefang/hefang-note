import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import type { GlobalDispatcher, GlobalState } from "~/types"

export default function useGlobalState(): [GlobalState, GlobalDispatcher] {
  const dispatch = useDispatch()
  const state = useSelector<GlobalState, GlobalState>((s: GlobalState) => s)
  const setState = useCallback((payload: Partial<GlobalState>) => {
    dispatch({ type: "", payload })
  }, [dispatch])

  return useMemo(() => [state, setState], [setState, state])
}
