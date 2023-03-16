import { Space } from "antd"
import React, { Suspense } from "react"

import ss from "./TopBarRight.module.scss"

import AlwaysOnTop from "$components/topbar/items/AlwaysOnTop"
import WindowControls from "$components/topbar/items/WindowControls"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import usePlatform from "$hooks/usePlatform"


const LazyScreenLocker = React.lazy(async () => import("$components/locker/ScreenLocker"))
const LazyThemeSelector = React.lazy(async () => import("$components/topbar/items/ThemeSelector"))

export default function TopBarRight() {
  const osType = usePlatform()

  return (
    <Space className={ss.root} style={{ right: osType === "Darwin" ? 8 : 0 }}>
      <Suspense>
        <LazyThemeSelector />
      </Suspense>
      <ShowInPlatform platforms={["Linux", "Darwin", "Windows_NT"]}>{() => <AlwaysOnTop />}</ShowInPlatform>
      <Suspense>
        <LazyScreenLocker />
      </Suspense>
      <ShowInPlatform platforms={["Linux", "Windows_NT"]}>{() => <WindowControls />}</ShowInPlatform>
    </Space>
  )
}
