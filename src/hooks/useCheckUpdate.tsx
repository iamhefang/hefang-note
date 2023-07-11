import Html from "$components/utils/Html"
import { relaunch } from "@tauri-apps/api/process"
import { installUpdate, checkUpdate } from "@tauri-apps/api/updater"
import { App, message } from "antd"
import { useState, useCallback, Dispatch, SetStateAction, useMemo } from "react"
import { versionCode, isInClient, versionName } from "~/consts"
import { useTranslate } from "./useTranslate"
import modal from "antd/es/modal"

export const enum UpdateStatus {
  none = "none",
  checking = "checking",
  downloading = "downloading",
  hasUpgrade = "hasUpgrade",
}

export default function useCheckUpdate(): [() => void, UpdateStatus, Dispatch<SetStateAction<UpdateStatus>>] {
  const t = useTranslate()
  const app = App.useApp()
  const checkedVersion = Number((localStorage?.getItem("version") || versionName).replace(/\./g, ""))
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
      void (app.message ?? message).error(JSON.stringify(error))
    })
  }, [app.message])
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
          ;(app.modal ?? modal).confirm({
            title: t("有新版本可用"),
            closable: false,
            content: (
              <div style={{ maxHeight: "80vh", overflow: "auto" }}>
                <p>
                  您当前使用的版本是v{versionName}，最新的版本为v{res.manifest?.version}。
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
  }, [app.modal, doInstallUpdate, t])

  return useMemo(() => [doCheckUpdate, status, setStatus], [doCheckUpdate, status, setStatus])
}
