import { ArrowRightOutlined, CloudUploadOutlined, DownloadOutlined } from "@ant-design/icons"
import { writeBinaryFile } from "@tauri-apps/api/fs"
import { fetch } from "@tauri-apps/api/http"
import { App, Avatar, Button, Col, Divider, Empty, Row, Space, Spin, Tag } from "antd"
import React, { ForwardedRef, ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { ItemProps, ListProps, Virtuoso } from "react-virtuoso"
import * as semver from "semver"

import { serverHost } from "~/consts"
import { IPluginInfo } from "~/plugin"

import { PluginDescription } from "./PluginDescription"
import ss from "./PluginStore.module.scss"
import { PluginProps } from "./types"

import usePlugins from "$plugin/hooks/usePlugins"

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
const statusIcon: Partial<Record<PluginStatus, ReactNode>> = {
  [PluginStatus.none]: <DownloadOutlined />,
  [PluginStatus.upgradable]: <CloudUploadOutlined />,
}

const PluginListItem = React.memo(({ item, "data-known-size": dataKnownSize, ...props }: ItemProps<PluginInfo>) => {
  const plugins = usePlugins(true)
  const plugin = useMemo(() => plugins.find((p) => p.id === item.id), [item.id, plugins])
  const upgradable = useMemo(
    () => (plugin?.version ? semver.gt(item.version, plugin.version) : false),
    [item.version, plugin?.version],
  )
  const [status, setStatus] = useState<PluginStatus>(PluginStatus.none)
  const { message } = App.useApp()
  const doDownload = useCallback(() => {
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
  }, [item.downloadUrl, item.hashType, item.hashValue, item.id, message])

  useEffect(() => {
    setStatus((lastStatus) => {
      if (!plugin?.id) {
        return lastStatus
      }
      if (upgradable) {
        return PluginStatus.upgradable
      }

      return PluginStatus.installed
    })
  }, [plugin?.id, upgradable])

  return (
    <li className={ss.item} {...props} style={{ height: dataKnownSize }} key={`store-${item.id}`}>
      <Row gutter={15} wrap={false}>
        <Col>
          <Avatar src={item.logo} shape="square" size={(dataKnownSize / 3) * 2} />
        </Col>
        <Col flex={1}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <h3>{item.name}</h3>
              <Tag>v{item.version}</Tag>
            </Space>
            <PluginDescription plugin={item} />
          </Space>
        </Col>
        <Col style={{ alignSelf: "center" }}>
          <Button
            onClick={doDownload}
            loading={status === PluginStatus.downloading}
            danger={status === PluginStatus.downloadfailed}
            icon={statusIcon[status]}
            disabled={status === PluginStatus.installed}
            title={upgradable ? `可从 v${plugin?.version} 升级到 v${item.version}` : undefined}
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
  <div style={{ textAlign: "center", padding: "15px 0" }}>
    <Spin delay={200} />
  </div>
))

type PluginInfo = IPluginInfo & {
  hashType: string
  hashValue: string
  downloadUrl: string
  downloadCount: 1
}

export function PluginStore({ search }: PluginProps) {
  const [loading, setLoading] = useState(true)
  const [plugins, setPlugins] = useState<PluginInfo[]>([])
  const [height, setHeight] = useState(window.innerHeight - 200)
  const [pager, setPager] = useState({ pageIndex: 1, pageSize: 10, total: 0 })
  const fetchData = useCallback(
    (pageIndex: number, pageSize: number) => {
      setLoading(true)
      fetch<{
        code: number
        msg: string
        data: { pageIndex: number; pageSize: number; total: number; records: PluginInfo[] }
      }>(`${serverHost}/api/v1/plugin?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
        .then((res) => {
          const {
            data: {
              data: { records, ...pagerInfo },
            },
          } = res
          setPlugins((lastPlugins) => (pageIndex === 1 ? records : lastPlugins.concat(records)))
          setPager(pagerInfo)
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false)
        })
    },
    [search],
  )

  const onEndReached = useCallback(() => {
    if (pager.pageIndex * pager.pageSize < pager.total) {
      fetchData(pager.pageIndex + 1, pager.pageSize)
    }
  }, [fetchData, pager.pageIndex, pager.pageSize, pager.total])

  useEffect(() => {
    fetchData(1, 10)
  }, [fetchData])
  const onResize = useCallback(() => {
    setHeight(Math.min(window.innerHeight - 200, Math.max((plugins?.length ?? 0) * 150, 200)))
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
        EmptyPlaceholder: loading ? undefined : PluginListEmpty,
        Footer: () => {
          if (pager.pageIndex * pager.pageSize >= pager.total) {
            return <div style={{ opacity: 0.3, textAlign: "center" }}>已加载全部插件</div>
          }

          return loading ? <PluginListLoading /> : null
        },
      }}
      endReached={onEndReached}
      data={plugins ?? []}
      style={{ height }}
      fixedItemHeight={150}
      increaseViewportBy={300}
    />
  )
}
