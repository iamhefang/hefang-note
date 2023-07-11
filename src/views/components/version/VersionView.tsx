import { App, Space, Spin } from "antd"
import { useEffect, useMemo } from "react"

import useCheckUpdate, { UpdateStatus } from "$hooks/useCheckUpdate"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import pkg from "^/package.json"

// const enum UpdateStatus {
//   none = "none",
//   checking = "checking",
//   downloading = "downloading",
//   hasUpgrade = "hasUpgrade",
// }

let needCheckUpdate = true

/**
 * 版本信息
 * @constructor
 */
export default function VersionView() {
  const t = useTranslate()
  const { autoCheckUpdate } = useSettings()
  const [doCheckUpdate, status, setStatus] = useCheckUpdate()

  useEffect(() => {
    if (autoCheckUpdate && needCheckUpdate) {
      needCheckUpdate = false
      doCheckUpdate()
    }
  }, [autoCheckUpdate, doCheckUpdate])

  return useMemo(() => {
    switch (status) {
      case UpdateStatus.checking:
        return (
          <Space>
            <Spin size="small" />
            {t("正在检查更新")}
          </Space>
        )
      case UpdateStatus.downloading:
        return (
          <Space>
            <Spin size="small" />
            {t("正在下载新版本")}
          </Space>
        )
      case UpdateStatus.hasUpgrade:
        return (
          <Space>
            <span>v{pkg.version}</span>
            <a onClick={doCheckUpdate}>{t("有新版本可用")}</a>
          </Space>
        )
      default:
        return (
          <span onClick={doCheckUpdate} title={import.meta.env.VITE_COMMIT}>
            v{pkg.version}
          </span>
        )
    }
  }, [status, t, doCheckUpdate])
}
