import { DownloadOutlined } from "@ant-design/icons"
import { writeBinaryFile } from "@tauri-apps/api/fs"
import { fetch } from "@tauri-apps/api/http"
import { Avatar, Button, Col, Divider, Empty, message, Row, Space, Spin, Tag } from "antd"
import React, { ForwardedRef, useCallback, useEffect, useMemo, useState } from "react"
import { ItemProps, ListProps, Virtuoso } from "react-virtuoso"

import { serverHost } from "~/consts"
import { IPluginInfo } from "~/plugin"

import { PluginDescription } from "./PluginDescription"
import ss from "./PluginStore.module.scss"
import { PluginProps } from "./types"

const enum PluginStatus {
  installed = "installed",
  upgradable = "upgradable",
  downloading = "downloading",
  downloadfailed = "downloadfailed",
  none = "none",
  verifing = "verifing",
}

const statusText: Record<PluginStatus, string> = {
  installed: "已安装",
  upgradable: "可升级",
  downloading: "下载中",
  downloadfailed: "下载失败",
  verifing: "校验中",
  none: "安装",
}

const PluginListItem = React.memo(({ item, "data-known-size": dataKnownSize, ...props }: ItemProps<PluginInfo>) => {
  const [status, setStatus] = useState<PluginStatus>(PluginStatus.none)
  const doDownload = useCallback(() => {
    setStatus(PluginStatus.downloading)

    fetch<number[]>(item.downloadUrl, { responseType: 3, method: "GET" })
      .then((res) => {
        setStatus(PluginStatus.verifing)
        console.info("hash", item.hashType, item.hashValue)
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
  }, [item.downloadUrl, item.hashType, item.hashValue, item.id])

  return (
    <li className={ss.item} style={{ height: dataKnownSize }} {...props} key={`store-${item.id}`}>
      <Row gutter={15} wrap={false}>
        <Col>
          <Avatar src={item.logo} shape="square" size={(dataKnownSize / 3) * 2} />
        </Col>
        <Col flex={1}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <h3>{item.name}</h3>
              <Tag>{item.version}</Tag>
            </Space>
            <PluginDescription plugin={item} />
          </Space>
        </Col>
        <Col style={{ alignSelf: "center" }}>
          <Button
            onClick={doDownload}
            loading={status === PluginStatus.downloading}
            danger={status === PluginStatus.downloadfailed}
            icon={status === PluginStatus.none ? <DownloadOutlined /> : undefined}
          >
            {statusText[status]}
          </Button>
        </Col>
      </Row>
      <Divider />
    </li>
  )
})

const PluginList = React.forwardRef(({ children, ...props }: ListProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} {...props}>
      <ul className={ss.list}>{children}</ul>
    </div>
  )
})

const PluginListEmpty = React.memo(({ context }: { context?: unknown }) => <Empty />)
const PluginListLoading = React.memo(({ context }: { context?: unknown }) => (
  <div style={{ textAlign: "center", paddingTop: 50 }}>
    <Spin />
  </div>
))

type PluginInfo = IPluginInfo & {
  hashType: string
  hashValue: string
  downloadUrl: string
  downloadCount: 1
}

export function PluginStore({ search }: PluginProps) {
  const [plugins, setPlugins] = useState<PluginInfo[]>()
  const [height, setHeight] = useState(window.innerHeight - 200)
  const [pager, setPager] = useState({ pageIndex: 1, pageSize: 10, total: 0 })
  useEffect(() => {
    fetch<{
      code: number
      msg: string
      data: { pageIndex: number; pageSize: number; total: number; records: PluginInfo[] }
    }>(`${serverHost}/apis/v1/plugins?search=${search}`)
      .then(
        ({
          data: {
            data: { records, ...pagerInfo },
          },
        }) => {
          setPlugins(records)
          setPager(pagerInfo)
        },
      )
      .catch(console.error)
  }, [search])
  const onResize = useCallback(() => {
    setHeight(Math.min(window.innerHeight - 200, Math.max((plugins?.length ?? 0) * 70, 200)))
  }, [plugins?.length])
  useEffect(() => {
    onResize()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [onResize])

  return (
    <Virtuoso
      components={{
        List: PluginList,
        Item: PluginListItem,
        EmptyPlaceholder: plugins === undefined ? PluginListLoading : PluginListEmpty,
      }}
      data={plugins ?? []}
      style={{ height }}
      fixedItemHeight={150}
      increaseViewportBy={300}
    />
  )
}
