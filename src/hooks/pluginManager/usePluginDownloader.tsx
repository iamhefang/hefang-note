import { CloudUploadOutlined, DownloadOutlined } from "@ant-design/icons"
import { writeBinaryFile } from "@tauri-apps/api/fs"
import { fetch } from "@tauri-apps/api/http"
import { App } from "antd"
import { ReactNode, useCallback, useMemo, useState } from "react"

import { IPluginInfo } from "$plugin/index"

export type PluginStoreInfo = IPluginInfo & {
  hashType: string
  hashValue: string
  downloadUrl: string
  downloadCount: 1
}

export const enum PluginStatus {
  installed = "installed",
  upgradable = "upgradable",
  downloading = "downloading",
  downloadfailed = "downloadfailed",
  none = "none",
  verifing = "verifing",
}

export const statusText: Record<PluginStatus, string> = {
  installed: "已安装",
  upgradable: "可升级",
  downloading: "下载中",
  downloadfailed: "下载失败",
  verifing: "校验中",
  none: "安装",
}
export const statusIcon: Partial<Record<PluginStatus, ReactNode>> = {
  [PluginStatus.none]: <DownloadOutlined />,
  [PluginStatus.upgradable]: <CloudUploadOutlined />,
}

export default function usePluginDownloader(
  item: PluginStoreInfo | undefined | null,
): [PluginStatus, React.Dispatch<React.SetStateAction<PluginStatus>>, () => void] {
  const [status, setStatus] = useState<PluginStatus>(PluginStatus.none)
  const { message } = App.useApp()

  const downloader = useCallback(() => {
    if (!item) {
      return
    }
    setStatus(PluginStatus.downloading)

    fetch<number[]>(item.downloadUrl, { responseType: 3, method: "GET" })
      .then((res) => {
        setStatus(PluginStatus.verifing)
        crypto.subtle
          .digest(item.hashType, new Uint8Array(res.data))
          .then((hash) => {
            const hashString = Array.from(new Uint8Array(hash))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")
            console.info("hash", hashString)
            if (hashString === item.hashValue) {
              setStatus(PluginStatus.installed)
              writeBinaryFile(`plugins/${item.id}.zip`, res.data).catch(console.error)
            } else {
              void message.error("检验失败")
              setStatus(PluginStatus.downloadfailed)
            }
          })
          .catch((e) => {
            void message.error("检验错误")
            console.error(e)
            setStatus(PluginStatus.downloadfailed)
          })
      })
      .catch((err) => {
        void message.error("下载失败")
        setStatus(PluginStatus.downloadfailed)
        console.error(err)
      })
  }, [item, message])

  return useMemo(() => [status, setStatus, downloader], [status, setStatus, downloader])
}
