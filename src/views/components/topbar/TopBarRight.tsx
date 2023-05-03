/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:06:09
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import { Space } from "antd"
import React, { Suspense, useMemo } from "react"

import ss from "./TopBarRight.module.scss"

import WindowControls from "$components/topbar/items/WindowControls"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import { usePlatformType } from "$hooks/usePlatform"
import usePluginFooterTopComponentProps from "$plugin/hooks/usePluginFooterTopComponentProps"
import usePlugins from "$plugin/hooks/usePlugins"
import usePluginFooterTopComponents from "$plugin/hooks/usePluginFooterTopComponents"

const LazyScreenLocker = React.lazy(async () => import("$components/locker/ScreenLocker"))
const LazyThemeSelector = React.lazy(async () => import("$components/topbar/items/ThemeSelector"))
const LazyAlwaysOnTop = React.lazy(async () => import("$components/topbar/items/AlwaysOnTop"))

export default function TopBarRight() {
  const osType = usePlatformType()
  const components = usePluginFooterTopComponents("TopRight")
  const props = usePluginFooterTopComponentProps()

  return (
    <Space className={ss.root} style={{ right: osType === "Darwin" ? 8 : 0 }}>
      {...components}
      <Suspense>
        <LazyThemeSelector {...props} />
      </Suspense>
      <ShowInPlatform platforms={["Linux", "Darwin", "Windows_NT"]}>{() => <LazyAlwaysOnTop {...props} />}</ShowInPlatform>
      <Suspense>
        <LazyScreenLocker {...props} />
      </Suspense>
      <ShowInPlatform platforms={["Linux", "Windows_NT"]}>{() => <WindowControls />}</ShowInPlatform>
    </Space>
  )
}
