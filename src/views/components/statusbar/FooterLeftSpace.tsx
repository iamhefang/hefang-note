import {Space} from "antd"
import React from "react"

import LoadStatusView from "$components/statusbar/LoadStatusView"
import NoteCountView from "$components/statusbar/NoteCountView"
import ModifyTimeView from "$components/time/ModifyTimeView"
import usePluginComponents from "$plugin/hooks/usePluginComponents"

export default function FooterLeftSpace() {
    const components = usePluginComponents("FooterLeft")
    
    return (
        <Space>
            <NoteCountView/>
            <LoadStatusView/>
            <ModifyTimeView/>
            {components}
        </Space>
    )
}