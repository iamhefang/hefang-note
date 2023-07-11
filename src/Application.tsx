import { App } from "antd"
import React, { Suspense, useEffect } from "react"

import { uiSlice } from "~/redux/uiSlice"
import View from "~/views"

import { versionName } from "./consts"
import { useAppDispatch } from "./redux"

import Loading from "$components/loading/Loading"
import Html from "$components/utils/Html"
import useContentLoader from "$hooks/useContentLoader"
import { useStates } from "$hooks/useSelectors"
import useSettingsLoader from "$hooks/useSettingsLoader"
import { useTranslate } from "$hooks/useTranslate"
import usePluginComponents from "$plugin/hooks/usePluginComponents"
import usePluginEffect from "$plugin/hooks/usePluginEffect"
import { html } from "^/CHANGELOG.md"

const LazySettings = React.lazy(async () => import("~/views/settings"))

export default function Application() {
  const { launching } = useStates()
  const loadContents = useContentLoader()
  const loadSettings = useSettingsLoader()
  const dispatch = useAppDispatch()
  const { modal } = App.useApp()
  const t = useTranslate()
  useEffect(() => {
    void (async () => {
      await loadSettings()
      dispatch(uiSlice.actions.ready({}))
      void loadContents()
    })()
  }, [dispatch, loadContents, loadSettings])

  usePluginEffect()

  useEffect(() => {
    if (localStorage.getItem("firstRun") !== versionName) {
      modal.info({
        title: t("更新日志"),
        content: (
          <Html className="changelog-container" data-selectable>
            {html}
          </Html>
        ),
        okText: t("知道了"),
        width: "90%",
        centered: true,
        style: { maxWidth: 600 },
        onOk() {
          localStorage.setItem("firstRun", versionName)
        },
      })
    }
  }, [modal, t])

  const components = usePluginComponents("Float")

  return launching ? (
    <Loading />
  ) : (
    <>
      <View />
      <Suspense>
        <LazySettings />
      </Suspense>
      {components}
    </>
  )
}
