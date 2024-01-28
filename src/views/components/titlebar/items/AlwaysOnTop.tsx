import {PushpinFilled, PushpinOutlined} from "@ant-design/icons"
import {Button} from "antd"
import {useCallback, useEffect, useMemo, useState} from "react"

import {PluginComponent} from "~/plugin"

import {useTranslate} from "$hooks/useTranslate"

const AlwaysOnTop: PluginComponent = () => {
    const t = useTranslate()
    const [enable, setEnable] = useState(false)
    const onClick = useCallback(() => {
        setEnable(!enable)
    }, [enable])

    useEffect(() => {
        window.shell?.api?.isAlwaysOnTop().then(setEnable)
    }, [])

    useEffect(() => {
        window.shell?.api?.setAlwaysOnTop(enable)
    }, [enable])
    const title = useMemo(() => t(enable ? "取消置顶" : "置顶"), [enable, t])

    return (
        <Button
            type="text"
            icon={enable ? <PushpinFilled/> : <PushpinOutlined/>}
            size="small"
            onClick={onClick}
            title={title}
        />
    )
}

AlwaysOnTop.order = 8

export default AlwaysOnTop