import { useMemo } from "react"

import useGlobalState from "./useGlobalState"
import useThemes from "./useThemes"

export function useThemeConfig() {
  const [{ theme }] = useGlobalState()
  const themes = useThemes()

  return useMemo(() => {
    return theme in themes ? themes[theme] : themes.auto
  }, [theme, themes])
}
