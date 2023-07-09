import { relaunch } from "@tauri-apps/api/process"
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater"
import { App, Space, Spin } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"

import { isInClient, versionCode } from "~/consts"

import Html from "$components/utils/Html"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import pkg from "^/package.json"

const enum UpdateStatus {
  none = "none",
  checking = "checking",
  downloading = "downloading",
  hasUpgrade = "hasUpgrade",
}

let needCheckUpdate = true

/**
 * 版本信息
 * @constructor
 */
export default function VersionView() {
  const t = useTranslate()
  const { autoCheckUpdate } = useSettings()
  const { message, modal } = App.useApp()
  const checkedVersion = Number((localStorage?.getItem("version") || pkg.version).replace(/\./g, ""))
  const [status, setStatus] = useState(checkedVersion > versionCode ? UpdateStatus.hasUpgrade : UpdateStatus.none)
  const doInstallUpdate = useCallback(async () => {
    if (!isInClient) {
      return
    }
    setStatus(UpdateStatus.downloading)
    await installUpdate().catch((error) => {
      void message.error(JSON.stringify(error))
    })
    setStatus(UpdateStatus.none)
    await relaunch().catch((error) => {
      void message.error(JSON.stringify(error))
    })
  }, [message])
  const doCheckUpdate = useCallback(() => {
    if (!isInClient) {
      return
    }
    setStatus(UpdateStatus.checking)
    checkUpdate()
      .then((res) => {
        setStatus(res.shouldUpdate ? UpdateStatus.hasUpgrade : UpdateStatus.none)
        if (res.shouldUpdate) {
          res.manifest?.version && localStorage.setItem("version", res.manifest?.version)
          modal.confirm({
            title: t("有新版本可用"),
            closable: false,
            content: (
              <div style={{ maxHeight: "80vh", overflow: "auto" }}>
                <p>
                  您当前使用的版本是v{pkg.version}，最新的版本为v{res.manifest?.version}。
                </p>
                {res.manifest?.date && (
                  <>
                    <b style={{ marginTop: 10, display: "block" }}>{t("发布日期")}</b>
                    <p>{res.manifest.date.split(" ")[0]}</p>
                  </>
                )}
                <b style={{ marginTop: 10, display: "block" }}>{t("更新日志")}</b>
                <Html>{res.manifest?.body}</Html>
              </div>
            ),
            okText: t("升级"),
            async onOk() {
              return doInstallUpdate()
            },
          })
        } else {
          void message.success(t("当前版本已是最新"))
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [doInstallUpdate, message, modal, t])

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
