import { WarningOutlined } from "@ant-design/icons"
import { theme } from "antd"
import { useCallback, useMemo } from "react"

import { isInClient } from "~/consts"

import ss from "./VersionError.module.scss"

import WindowControls from "$components/topbar/items/WindowControls"
import ShowInPlatform from "$components/utils/ShowInPlatform"
import useCheckUpdate from "$hooks/useCheckUpdate"

export default function VersionError() {
  const { token } = theme.useToken()
  const [doCheck] = useCheckUpdate()
  const doUpgrade = useCallback(async () => {
    if (isInClient) {
      doCheck()
    } else {
      window.location.reload()
    }
  }, [doCheck])
  const notice = useMemo(() => {
    if (isInClient) {
      return (
        <div>
          请<a onClick={doUpgrade}>检查更新</a>
        </div>
      )
    }

    return (
      <div>
        请<a onClick={doUpgrade}>刷新</a>后使用
      </div>
    )
  }, [doUpgrade])

  return (
    <div className={ss.root} data-tauri-drag-region style={{ color: token.colorText, background: token.colorBgLayout }}>
      <ShowInPlatform platforms={["Linux", "Windows_NT"]}>
        {() => (
          <div className={ss.controls}>
            <WindowControls />
          </div>
        )}
      </ShowInPlatform>
      <div>
        <WarningOutlined style={{ fontSize: 100, color: token.colorPrimary }} />
      </div>
      <div>您当前使用的版本过低</div>
      {notice}
    </div>
  )
}
