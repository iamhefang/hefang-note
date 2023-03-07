import { Space } from "antd"
import React, { Suspense } from "react"

import usePlatform from "~/hooks/usePlatform"
import AlwaysOnTop from "~/views/components/topbar/items/AlwaysOnTop"
import WindowControls from "~/views/components/topbar/items/WindowControls"
import ShowInPlatform from "~/views/components/utils/ShowInPlatform"

import ss from "./TopBarRight.module.scss"

const LazyScreenLocker = React.lazy(async () => import("~/views/components/locker/ScreenLocker"))
const LazyThemeSelector = React.lazy(async () => import("~/views/components/topbar/items/ThemeSelector"))
const LazyGithub = React.lazy(async () => import("~/views/components/topbar/items/Github"))

export default function TopBarRight() {
  const osType = usePlatform()

  return (
    <Space className={ss.root} style={{ right: osType === "Darwin" ? 8 : 0 }}>
      <ShowInPlatform platforms={["Browser"]}>
        {() => (
          <Suspense>
            <LazyGithub />
          </Suspense>
        )}
      </ShowInPlatform>
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
