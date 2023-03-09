import { Space } from "antd"
import React, { Suspense, useMemo } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import usePlatform from "~/hooks/usePlatform"
import { useSettings, useStates } from "~/hooks/useSelectors"
import AppLogo from "~/views/components/icons/AppLogo"
import SiderBarToggle from "~/views/components/topbar/items/SiderBarToggle"
import ShowInPlatform from "~/views/components/utils/ShowInPlatform"

import ss from "./TopBarLeft.module.scss"

const LazyClientDownload = React.lazy(async () => import("~/views/components/topbar/items/ClientDownload"))

export default function TopBarLeft() {
  const osType = usePlatform()
  const {
    lock: { locked },
  } = useSettings()
  const { showSettingsModal } = useStates()

  return (
    <Space className={ss.root} style={{ left: osType === "Darwin" ? 70 : 8 }}>
      <ShowInPlatform platforms={["Linux", "Windows_NT"]}>{() => <AppLogo />}</ShowInPlatform>
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
