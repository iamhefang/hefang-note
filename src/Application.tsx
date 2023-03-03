import { App as Antd, theme as antdTheme, ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import React, { Suspense, useEffect } from "react"

import useContentLoader from "~/hooks/useContentLoader"
import useGlobalState from "~/hooks/useGlobalState"
import usePlugins from "~/hooks/usePlugins"
import useSettingsLoader from "~/hooks/useSettingsLoader"
import { useThemeConfig } from "~/hooks/useThemeConfig"
import View from "~/views"
import Loading from "~/views/components/loading/Loading"
import ShowInPlatform from "~/views/components/utils/ShowInPlatform"
const LazySettings = React.lazy(async () => import("~/views/settings"))
export default function Application() {
  const [state, setState] = useGlobalState()
  const { theme, launching } = state
  const plugins = usePlugins()
  const { token } = antdTheme.useToken()
  const loadContents = useContentLoader()
  const loadSettings = useSettingsLoader()
  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      setState({})
    })
    loadSettings()
    loadContents()
    setState({ launching: false })
  }, [loadContents, loadSettings, setState])
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
