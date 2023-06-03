import {Space} from "antd"
import React from "react"

import Github from "$components/topbar/items/Github"
import VersionView from "$components/version/VersionView"
import usePluginComponents from "$plugin/hooks/usePluginComponents"

export default function FooterRightSpace() {
    const components = usePluginComponents("FooterRight")

    return (
        <Space>
            {components}
            <Github/>
            <VersionView/>
        </Space>
    )
}