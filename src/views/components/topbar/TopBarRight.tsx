/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:06:09
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import AlwaysOnTop from "$components/topbar/items/AlwaysOnTop"
import {Space} from "antd"
import React, {Suspense} from "react"

import ss from "./TopBarRight.module.scss"

import WindowControls from "$components/topbar/items/WindowControls"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import {usePlatformType} from "$hooks/usePlatform"
import usePluginComponents from "$plugin/hooks/usePluginComponents"
import usePluginFooterTopComponentProps from "$plugin/hooks/usePluginFooterTopComponentProps"

const LazyScreenLocker = React.lazy(async () => import("$components/locker/ScreenLocker"))
const LazyThemeSelector = React.lazy(async () => import("$components/topbar/items/ThemeSelector"))
const LazyAlwaysOnTop = React.lazy(async () => import("$components/topbar/items/AlwaysOnTop"))

export default function TopBarRight() {
    const osType = usePlatformType()
    const components = usePluginComponents("TopRight")
    const props = usePluginFooterTopComponentProps()

    return (
        <Space className={ss.root} style={{right: osType === "darwin" ? 8 : 0}}>
            {...components}
            <Suspense>
                <LazyThemeSelector {...props} />
            </Suspense>
            <AlwaysOnTop {...props}/>
            <Suspense>
                <LazyScreenLocker {...props} />
            </Suspense>
        </Space>
    )
}
