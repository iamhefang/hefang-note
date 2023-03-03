import { useCallback } from "react"

import { settingsStore } from "~/utils/database"

import useGlobalState from "./useGlobalState"

export default function useSettingsLoader() {
  const [{}, setState] = useGlobalState()

  return useCallback(() => {
    settingsStore
      .getObject()
      .then((settings) => setState(settings))
      .catch(console.error)
  }, [setState])
}
