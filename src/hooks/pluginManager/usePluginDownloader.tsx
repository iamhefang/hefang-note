import { CloudUploadOutlined, DownloadOutlined } from "@ant-design/icons"
import { App } from "antd"
import { IPluginInfo } from "hefang-note-types"
import { ReactNode, useCallback, useMemo, useState } from "react"

import { useAppDispatch } from "~/redux"
import { installPlugin } from "~/redux/pluginSlice"

import { digestHash } from "$utils/hash"

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
  const dispatch = useAppDispatch()

  const downloader = useCallback(() => {
    if (!item) {
      return
    }
    setStatus(PluginStatus.downloading)

    fetch(item.downloadUrl, { method: "GET" })
      .then(async (res) => res.text())
      .then(async (res) => {
        if (item.hashType === "none" || !item.hashType || !item.hashValue) {
          dispatch(installPlugin({ plugin: item, content: res }))
          setStatus(PluginStatus.installed)

          return
        }
        setStatus(PluginStatus.verifing)
        digestHash(item.hashType, res)
          .then((hash) => {
            if (hash === item.hashValue) {
              dispatch(installPlugin({ plugin: item, content: res }))
              setStatus(PluginStatus.installed)
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
  }, [dispatch, item, message])

  return useMemo(() => [status, setStatus, downloader], [status, setStatus, downloader])
}
