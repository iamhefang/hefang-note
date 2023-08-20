import { useCallback } from "react"

import { useAppDispatch } from "~/redux"
import { loadPlugins } from "~/redux/pluginSlice"

export default function usePluginsLoader() {
  const dispatch = useAppDispatch()

  return useCallback(() => dispatch(loadPlugins()), [dispatch])
}
