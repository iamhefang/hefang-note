/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:06:48
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import {Space} from "antd"
import React, {Suspense} from "react"

import ss from "./TopBarLeft.module.scss"

import AppLogo from "$components/icons/AppLogo"
import SiderBarToggle from "$components/topbar/items/SiderBarToggle"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import {usePlatformType} from "$hooks/usePlatform"
import {useSettings, useStates} from "$hooks/useSelectors"
import usePluginComponents from "$plugin/hooks/usePluginComponents"



const LazyClientDownload = React.lazy(async () => import("$components/topbar/items/ClientDownload"))

export default function TopBarLeft() {
    const osType = usePlatformType()
    const {
        lock: {locked},
    } = useSettings()
    const {showSettingsModal} = useStates()

    const components = usePluginComponents("TopLeft")

    return (
        <Space className={ss.root} style={{left: osType === "Darwin" ? 70 : 8}}>
            <ShowInPlatform platforms={["Linux", "Windows_NT", "Browser"]}>{() => <AppLogo/>}</ShowInPlatform>
            {!showSettingsModal && !locked && <SiderBarToggle/>}
            <ShowInPlatform platforms={["Browser"]}>
                {() => (
                    <Suspense>
                        <LazyClientDownload/>
                    </Suspense>
                )}
            </ShowInPlatform>
            {components}
        </Space>
    )
}
