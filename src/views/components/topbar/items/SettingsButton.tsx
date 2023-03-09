import { SettingOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useCallback } from "react"

import usePlatform from "~/hooks/usePlatform"
import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/stateSlice"

export default function SettingsButton() {
  const osType = usePlatform()
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(toggleSettingsModal(null))
  }, [dispatch])
  if (osType === "Darwin") {
    return null
  }

  return <Button type="text" size="small" icon={<SettingOutlined />} onClick={onClick} />
}
