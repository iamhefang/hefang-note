import { PushpinFilled, PushpinOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { Button } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"

import { useTranslate } from "$hooks/useTranslate"
import { FooterTopComponent } from "$plugin/types"

const AlwaysOnTop: FooterTopComponent = () => {
  const t = useTranslate()
  const [enable, setEnable] = useState(false)
  const onClick = useCallback(() => {
    setEnable(!enable)
  }, [enable])

  useEffect(() => {
    void appWindow.setAlwaysOnTop(enable)
  }, [enable])
  const title = useMemo(() => t(enable ? "取消置顶" : "置顶"), [enable, t])

  return <Button type="text" icon={enable ? <PushpinFilled /> : <PushpinOutlined />} size="small" onClick={onClick} title={title} />
}

AlwaysOnTop.order = 8

export default AlwaysOnTop
