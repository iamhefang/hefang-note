import { Space } from "antd"
import React, { Suspense } from "react"

import ss from "./TopBarLeft.module.scss"

import AppLogo from "$components/icons/AppLogo"
import SiderBarToggle from "$components/topbar/items/SiderBarToggle"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import usePlatform from "$hooks/usePlatform"
import { useSettings, useStates } from "$hooks/useSelectors"

const LazyClientDownload = React.lazy(async () => import("$components/topbar/items/ClientDownload"))

export default function TopBarLeft() {
  const osType = usePlatform()
  const {
    lock: { locked },
  } = useSettings()
  const { showSettingsModal } = useStates()

  return (
    <Space className={ss.root} style={{ left: osType === "Darwin" ? 70 : 8 }}>
      <ShowInPlatform platforms={["Linux", "Windows_NT", "Browser"]}>{() => <AppLogo />}</ShowInPlatform>
      {!showSettingsModal && !locked && <SiderBarToggle />}
      <ShowInPlatform platforms={["Browser"]}>
        {() => (
          <Suspense>
            <LazyClientDownload />
          </Suspense>
        )}
      </ShowInPlatform>
    </Space>
  )
}
