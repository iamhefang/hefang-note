import {useArch, useOsTypr as useOsType} from "$hooks/usePlatform"
import {useSettings} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"
import {shell} from "@tauri-apps/api"
import {checkUpdate} from "@tauri-apps/api/updater"
import pkg from "^/package.json"
import {App, Space, Spin} from "antd"
import {useCallback, useEffect, useMemo, useState} from "react"

import {clientUrls, isInTauri, versionCode} from "~/consts"

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
    const {autoCheckUpdate} = useSettings()
    const {message, modal} = App.useApp()
    const checkedVersion = Number((localStorage?.getItem("version") || pkg.version).replace(/\./g, ""))
    const [status, setStatus] = useState(checkedVersion > versionCode ? UpdateStatus.hasUpgrade : UpdateStatus.none)
    const osType = useOsType()
    const arch = useArch()
    const doInstallUpdate = useCallback(async () => {
        if (!isInTauri || !osType || !arch || !(`${osType}-${arch}` in clientUrls)) {
            return
        }
        await shell.open(clientUrls[`${osType}-${arch}`]!)
    }, [arch, osType])
    const doCheckUpdate = useCallback(() => {
        if (!isInTauri) {
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
                        content: (
                            <div style={{maxHeight: "80vh", overflow: "auto"}}>
                                <p>
                                    您当前使用的版本是v{pkg.version}，最新的版本为v{res.manifest?.version}。
                                </p>
                                {res.manifest?.date && (
                                    <>
                                        <b style={{marginTop: 10, display: "block"}}>{t("发布日期")}</b>
                                        <p>{res.manifest.date.split(" ")[0]}</p>
                                    </>
                                )}
                                <b style={{marginTop: 10, display: "block"}}>{t("更新日志")}</b>
                                <p>{res.manifest?.body}</p>
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
                        <Spin size="small"/>
                        {t("正在检查更新")}
                    </Space>
                )
            case UpdateStatus.downloading:
                return (
                    <Space>
                        <Spin size="small"/>
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
