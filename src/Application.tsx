import React, { Suspense, useEffect } from "react"

import { setLaunchingStatus, uiSlice } from "~/redux/uiSlice"
import View from "~/views"

import { useAppDispatch } from "./redux"

import useVersionInfoModal from "$hooks/modals/useVersionInfoModal"
import useContentLoader from "$hooks/useContentLoader"
import usePluginsLoader from "$hooks/usePluginsLoader"
import useSettingsLoader from "$hooks/useSettingsLoader"
import usePluginComponents from "$plugin/hooks/usePluginComponents"
import usePluginEffect from "$plugin/hooks/usePluginEffect"

const LazySettings = React.lazy(async () => import("~/views/settings"))

export default function Application() {
  const loadContents = useContentLoader()
  const loadSettings = useSettingsLoader()
  const loadPlugins = usePluginsLoader()
  const dispatch = useAppDispatch()
  useEffect(() => {
    void (async () => {
      dispatch(setLaunchingStatus("正在加载配置项"))
      await loadSettings()

      dispatch(setLaunchingStatus("正在加载笔记"))
      await loadContents()

      dispatch(setLaunchingStatus("正在加载插件"))
      await loadPlugins()
      dispatch(uiSlice.actions.ready({}))
    })()
  }, [dispatch, loadContents, loadPlugins, loadSettings])

  usePluginEffect()
  useVersionInfoModal()

  const components = usePluginComponents("Float")

  return (
    <>
      <View />
      <Suspense>
        <LazySettings />
      </Suspense>
      {components}
    </>
  )
}
