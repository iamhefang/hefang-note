import { PluginReactHooks } from "hefang-note-types"
import { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"

import { useAppDispatch } from "~/redux"
import { setPluginState } from "~/redux/uiSlice"
import { StoreState } from "~/types"

export default function hooksBuilder(pluginId: string): PluginReactHooks {
  return {
    usePluginState<S extends object>(defaultValue?: S): [S, (state: Partial<S>) => void] {
      const state = useSelector<StoreState, S>((s) => (s.states[pluginId] ?? defaultValue) as S)
      const disaptch = useAppDispatch()
      const setState = useCallback(
        (newState: Partial<S>) => {
          disaptch(setPluginState({ pluginId, state: { ...state, ...newState } }))
        },
        [disaptch, state],
      )

      return useMemo(() => [state, setState], [setState, state])
    },
  }
}
