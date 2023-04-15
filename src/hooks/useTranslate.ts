import { useCallback, useMemo } from "react"

import { useSettings } from "./useSelectors"

import en from "$locales/en.json"
import zhCN from "$locales/zh-CN.json"
import { format } from "$utils/string"

export type LocalDefine = typeof zhCN
export type LocalMap = LocalDefine["map"]
export type LocaleKey = keyof LocalMap

export const Locales: LocalDefine[] = [zhCN, en]

export function useLocaleDefine() {
  const { language } = useSettings()

  return useMemo(() => {
    const lang = language === "auto" ? navigator.language : language

    return Locales.find((item) => item.keys.includes(lang)) || zhCN
  }, [language])
}

export function useTranslate() {
  const define = useLocaleDefine()

  return useCallback(
    (key: LocaleKey, params?: Record<string, unknown>) => {
      const locale = key in define.map ? define.map : zhCN.map

      return params ? format(locale[key], params) : locale[key]
    },
    [define.map],
  )
}
