import { checkUpdate, installUpdate } from "@tauri-apps/api/updater"
import { App, Space, Spin } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"

import { versionCode } from "~/consts"
import { useSettings } from "~/hooks/useSelectors"

import pkg from "^/package.json"

const enum UpdateStatus {
  none = "none",
  checking = "checking",
  downloading = "downloading",
  hasUpgrade = "hasUpgrade",
}

let needCheckUpdate = true

export default function VersionView() {
  const { autoCheckUpdate } = useSettings()
  const { message, modal } = App.useApp()
  const checkedVersion = Number((localStorage.getItem("version") || pkg.version).replace(/\./g, ""))
  const [status, setStatus] = useState(checkedVersion > versionCode ? UpdateStatus.hasUpgrade : UpdateStatus.none)
  const doInstallUpdate = useCallback(() => {
    if (!window.__TAURI_IPC__) {
      return
    }
    void message.info("正在尝试安装新版本")
    void installUpdate().catch((error) => {
      console.error("安装更新失败", error)
      modal.error({ title: "安装更新失败", content: error })
    })
  }, [message, modal])
  const doCheckUpdate = useCallback(() => {
    if (!window.__TAURI_IPC__) {
      return
    }
    setStatus(UpdateStatus.checking)
    checkUpdate()
      .then((res) => {
        setStatus(res.shouldUpdate ? UpdateStatus.hasUpgrade : UpdateStatus.none)
        if (res.shouldUpdate) {
          res.manifest?.version && localStorage.setItem("version", res.manifest?.version)
          modal.confirm({
            title: "有新版本可用",
            content: (
              <div style={{ maxHeight: "80vh", overflow: "auto" }}>
                <p>
                  您当前使用的版本是v{pkg.version}，最新的版本为v{res.manifest?.version}。
                </p>
                {res.manifest?.date && (
                  <>
                    <b style={{ marginTop: 10, display: "block" }}>发布日期</b>
                    <p>{res.manifest.date.split(" ")[0]}</p>
                  </>
                )}
                <b style={{ marginTop: 10, display: "block" }}>更新日志</b>
                <p>{res.manifest?.body}</p>
              </div>
            ),
            okText: "升级",
            onOk(...args) {
              void installUpdate()
            },
          })
        } else {
          void message.success("当前版本已是最新")
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [message, modal])

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
            正在检查更新
          </Space>
        )
      case UpdateStatus.downloading:
        return (
          <Space>
            <Spin size="small" />
            正在下载新版本
          </Space>
        )
      case UpdateStatus.hasUpgrade:
        return (
          <Space>
            <span>v{pkg.version}</span>
            <a onClick={doInstallUpdate}>有新版本可用</a>
          </Space>
        )
      default:
        return <span onClick={doCheckUpdate}>v{pkg.version}</span>
    }
  }, [status, doInstallUpdate, doCheckUpdate])
}
