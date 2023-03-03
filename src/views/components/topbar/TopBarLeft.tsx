import { Space } from "antd"
import React, { Suspense } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import usePlatform from "~/hooks/usePlatform"
import AppLogo from "~/views/components/icons/AppLogo"
import SiderBarToggle from "~/views/components/topbar/items/SiderBarToggle"
import ShowInPlatform from "~/views/components/utils/ShowInPlatform"

import ss from "./TopBarLeft.module.scss"

export default function TopBarLeft() {
  const osType = usePlatform()
  const [
    {
      showSettingModal,
      lock: { locked },
    },
  ] = useGlobalState()

  return (
    <Space className={ss.root} style={{ left: osType === "Darwin" ? 70 : 8 }}>
      <ShowInPlatform platforms={["Linux", "Windows_NT"]}>{() => <AppLogo />}</ShowInPlatform>
      {!showSettingModal && !locked && <SiderBarToggle />}
      <ShowInPlatform platforms={["Browser"]}>
        {() => {
          const LazyComponent = React.lazy(async () => import("~/views/components/topbar/items/ClientDownload"))

          return (
            <Suspense>
              <LazyComponent />
            </Suspense>
          )
        }}
      </ShowInPlatform>
    </Space>
  )
}
