import { SettingOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useCallback } from "react"

import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/uiSlice"

import {usePlatformType} from "$hooks/usePlatform"

export default function SettingsButton() {
  const osType = usePlatformType()
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(toggleSettingsModal(null))
  }, [dispatch])
  if (osType === "Darwin") {
    return null
  }

  return <Button type="text" size="small" icon={<SettingOutlined />} onClick={onClick} />
}
