import { App as Antd, theme as antdTheme, ConfigProvider } from "antd"
import React, { Suspense, useEffect } from "react"

import { uiSlice } from "~/redux/uiSlice"
import View from "~/views"

import { useAppDispatch } from "./redux"

import Loading from "$components/loading/Loading"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import useContentLoader from "$hooks/useContentLoader"
import usePlugins from "~/plugin/hooks/usePlugins"
import { useSettings, useStates } from "$hooks/useSelectors"
import useSettingsLoader from "$hooks/useSettingsLoader"
import { useThemeConfig } from "$hooks/useThemeConfig"
import { useLocaleDefine } from "$hooks/useTranslate"

const LazySettings = React.lazy(async () => import("~/views/settings"))

export default function Application() {
  const { theme, language } = useSettings()
  const { launching } = useStates()
  const plugins = usePlugins()
  const { token } = antdTheme.useToken()
  const loadContents = useContentLoader()
  const loadSettings = useSettingsLoader()
  const dispatch = useAppDispatch()
  useEffect(() => {
    void (async () => {
      await loadSettings()
      dispatch(uiSlice.actions.ready({}))
      void loadContents()
    })()
  }, [dispatch, loadContents, loadSettings])

  useEffect(() => {
    for (const plugin of plugins) {
      plugin.hooks?.includes?.("onThemeChange") && plugin.onThemeChange?.(theme, token)
    }
  }, [theme, plugins, token])

  const themeConfig = useThemeConfig()
  const locale = useLocaleDefine()

  return launching ? (
    <Loading />
  ) : (
    <ConfigProvider autoInsertSpaceInButton={false} locale={locale.antd} theme={themeConfig}>
      <Antd message={{ top: 40 }} notification={{ top: 40 }}>
        <View />
        <ShowInPlatform platforms={["Linux", "Darwin", "Windows_NT", "Browser"]}>
          {() => (
            <Suspense>
              <LazySettings />
            </Suspense>
          )}
        </ShowInPlatform>
      </Antd>
    </ConfigProvider>
  )
}
