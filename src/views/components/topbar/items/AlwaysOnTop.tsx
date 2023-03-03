import { PushpinFilled, PushpinOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { Button } from "antd"
import { useCallback, useEffect, useState } from "react"

export default function AlwaysOnTop() {
  const [enable, setEnable] = useState(false)
  const onClick = useCallback(() => {
    setEnable(!enable)
  }, [enable])

  useEffect(() => {
    void appWindow.setAlwaysOnTop(enable)
  }, [enable])

  return <Button type="text" icon={enable ? <PushpinFilled /> : <PushpinOutlined />} size="small" onClick={onClick} title={`${enable ? "取消" : ""}置顶`} />
}
