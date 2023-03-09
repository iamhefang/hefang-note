import { App as Antd, theme as antdTheme, ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import React, { Suspense, useEffect } from "react"

import { stateSlice } from "~/redux/stateSlice"
import View from "~/views"

import { useAppDispatch } from "./redux"

import Loading from "$components/loading/Loading"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import useContentLoader from "$hooks/useContentLoader"
import usePlugins from "$hooks/usePlugins"
import { useSettings, useStates } from "$hooks/useSelectors"
import useSettingsLoader from "$hooks/useSettingsLoader"
import { useThemeConfig } from "$hooks/useThemeConfig"

const LazySettings = React.lazy(async () => import("~/views/settings"))

export default function Application() {
  const { theme } = useSettings()
  const { launching } = useStates()
  const plugins = usePlugins()
  const { token } = antdTheme.useToken()
  const loadContents = useContentLoader()
  const loadSettings = useSettingsLoader()
  const dispatch = useAppDispatch()
  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      // setState({})
    })
    void (async () => {
      await loadSettings()
      dispatch(stateSlice.actions.ready({}))
      void loadContents()
    })()
  }, [dispatch, loadContents, loadSettings])
  useEffect(() => {
    for (const plugin of plugins) {
      console.info("call plugin hooks: onThemeChange", plugin, theme, token)
      plugin.onThemeChange?.(theme, token)
    }
  }, [theme, plugins, token])

  const themeConfig = useThemeConfig()

  return launching ? (
    <Loading />
  ) : (
    <ConfigProvider autoInsertSpaceInButton={false} locale={zhCN} theme={themeConfig}>
      <Antd>
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
