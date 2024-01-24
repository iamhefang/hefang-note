/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:06:09
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import { Space } from "antd"
import React, { Suspense } from "react"

import ss from "./TopBarRight.module.scss"

import ShowInPlatform from "$components/utils/ShowInPlatform"
import { usePlatformType } from "$hooks/usePlatform"
import usePluginComponents from "$plugin/hooks/usePluginComponents"
import usePluginFooterTopComponentProps from "$plugin/hooks/usePluginFooterTopComponentProps"
import WindowControls from "./items/WindowControls"

const LazyScreenLocker = React.lazy(async () => import("$components/locker/ScreenLocker"))
const LazyThemeSelector = React.lazy(async () => import("$components/topbar/items/ThemeSelector"))
const LazyAlwaysOnTop = React.lazy(async () => import("$components/topbar/items/AlwaysOnTop"))

export default function TopBarRight() {
  const osType = usePlatformType()
  const components = usePluginComponents("TopRight")
  const props = usePluginFooterTopComponentProps()

  return (
    <Space className={ss.root} style={{ right: osType === "linux" ? 0 : 100 }}>
      {...components}
      <Suspense>
        <LazyThemeSelector {...props} />
      </Suspense>
      <ShowInPlatform platforms={["linux", "darwin", "win32"]}>
        {() => (
          <Suspense>
            <LazyAlwaysOnTop {...props} />
          </Suspense>
        )}
      </ShowInPlatform>
      <Suspense>
        <LazyScreenLocker {...props} />
      </Suspense>
      <ShowInPlatform platforms={["linux"]}>{() => <WindowControls />}</ShowInPlatform>
    </Space>
  )
}
