import { useMemo } from "react"

import useGlobalState from "./useGlobalState"
import { useSettings } from "./useSelectors"
import useThemes from "./useThemes"

export function useThemeConfig() {
  const { theme } = useSettings()
  const themes = useThemes()

  return useMemo(() => {
    return theme in themes ? themes[theme] : themes.auto
  }, [theme, themes])
}
