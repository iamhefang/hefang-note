import { SettingOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useCallback } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import usePlatform from "~/hooks/usePlatform"

export default function SettingsButton() {
  const osType = usePlatform()
  const [{ showSettingModal }, setState] = useGlobalState()
  const onClick = useCallback(() => {
    setState({ showSettingModal: !showSettingModal })
  }, [setState, showSettingModal])
  if (osType === "Darwin") {
    return null
  }

  return <Button type="text" size="small" icon={<SettingOutlined />} onClick={onClick} />
}
