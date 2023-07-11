import { WarningOutlined } from "@ant-design/icons"
import { useCallback, useMemo } from "react"

import { isInClient } from "~/consts"

import ss from "./VersionError.module.scss"

import useCheckUpdate from "$hooks/useCheckUpdate"
export default function VersionError() {
  const [doCheck, status] = useCheckUpdate()
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
    <div className={ss.root} data-tauri-drag-region>
      <div>
        <WarningOutlined style={{ fontSize: 100 }} />
      </div>
      <div>您当前使用的版本过低</div>
      {notice}
    </div>
  )
}
