import { relaunch } from "@tauri-apps/api/process"
import { checkUpdate, installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater"
import { App } from "antd"
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"

import { isInClient, versionCode, versionName } from "~/consts"

import { useTranslate } from "./useTranslate"

import Html from "$components/utils/Html"

export const enum UpdateStatus {
  none = "none",
  checking = "checking",
  downloading = "downloading",
  hasUpgrade = "hasUpgrade",
}

export default function useCheckUpdate(): [() => void, UpdateStatus, Dispatch<SetStateAction<UpdateStatus>>] {
  const t = useTranslate()
  const { modal, message } = App.useApp()
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
  }, [modal, t, doInstallUpdate, message])

  useEffect(() => {
    if (!isInClient) {
      return
    }
    const unlisten = onUpdaterEvent((event) => {
      // This will log all updater events, including status updates and errors.
      console.log("Updater event", event)
    })

    return () => {
      void unlisten.then((func) => func())
    }
  }, [])

  return useMemo(() => [doCheckUpdate, status, setStatus], [doCheckUpdate, status, setStatus])
}
