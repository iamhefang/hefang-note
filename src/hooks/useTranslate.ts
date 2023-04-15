import { Locale } from "antd/es/locale"
import deAntd from "antd/locale/de_DE"
import enUSAntd from "antd/locale/en_US"
import jaAntd from "antd/locale/ja_JP"
import zhCNAntd from "antd/locale/zh_CN"
import { useCallback, useMemo } from "react"

import { useSettings } from "./useSelectors"

import de from "$locales/de.json"
import en from "$locales/en.json"
import ja from "$locales/ja.json"
import zhCN from "$locales/zh-CN.json"
import { format } from "$utils/string"

export type LocalDefine = typeof zhCN & { antd: Locale }
export type LocalMap = LocalDefine["map"]
export type LocaleKey = keyof LocalMap

export const defaultLocaleDefine: LocalDefine = { ...zhCN, antd: zhCNAntd }

export const Locales: LocalDefine[] = [defaultLocaleDefine, { ...en, antd: enUSAntd }, { ...ja, antd: jaAntd }, { ...de, antd: deAntd }]

export function useLocaleDefine(): LocalDefine {
  const { language } = useSettings()

  return useMemo(() => {
    const lang = language === "auto" ? navigator.language : language

    return Locales.find((item) => item.keys.includes(lang)) || defaultLocaleDefine
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
