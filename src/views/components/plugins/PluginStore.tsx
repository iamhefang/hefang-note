import { Button, Col, Divider, Row, Space, Tag } from "antd"
import React, { ForwardedRef, useEffect, useMemo, useState } from "react"
import { ItemProps, ListProps, Virtuoso } from "react-virtuoso"

import { pluginStore } from "$utils/database"

import { PluginDescription } from "./PluginDescription"
import ss from "./PluginStore.module.scss"
import { PluginProps } from "./types"

import { IPluginInfo } from "$hooks/usePlugins"
const PluginListItem = React.memo(({ item, "data-known-size": dataKnownSize, ...props }: ItemProps<IPluginInfo>) => {
  return (
    <li className={ss.item} style={{ height: dataKnownSize }} {...props} key={`store-${item.id}`}>
      <Row gutter={15} wrap={false}>
        <Col>
          <img src={item.logo} className={ss.cover} style={{ height: (dataKnownSize / 3) * 2 }} alt={item.name} />
        </Col>
        <Col flex={1}>
          <Space direction="vertical">
            <Space>
              <h3>{item.name}</h3>
              <Tag>{item.version}</Tag>
            </Space>

            <PluginDescription plugin={item} />
          </Space>
        </Col>
        <Col style={{ alignSelf: "center" }}>
          <Button>安装</Button>
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

export function PluginStore({ search }: PluginProps) {
  const [plugins, setPlugins] = useState<IPluginInfo[]>()
  const [height, setHeight] = useState(window.innerHeight - 200)
  useEffect(() => {
    void pluginStore.getAll().then(setPlugins)

    const onResize = () => {
      setHeight(window.innerHeight - 200)
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const data = useMemo(() => {
    const s = search.toLowerCase().trim()
    if (!s) {
      return plugins
    }

    return plugins?.filter((item) => {
      return [item.author, item.name, item.description].join("").toLowerCase().includes(s)
    })
  }, [plugins, search])

  return <Virtuoso components={{ List: PluginList, Item: PluginListItem }} data={data} style={{ height }} fixedItemHeight={150} increaseViewportBy={300} />
}
