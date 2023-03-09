import { Avatar, Button, Empty, List, Space, Tag } from "antd"
import VirtualList from "rc-virtual-list"
import { useCallback, useEffect, useMemo, useState } from "react"

import { pluginStore } from "~/utils/database"

import { PluginDescription } from "./PluginDescription"
import { PluginProps } from "./types"

import { IPluginInfo } from "$hooks/usePlugins"

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

  const renderItem = useCallback(
    (item: IPluginInfo) => (
      <List.Item key={item.id} extra={<Button size="small">安装</Button>}>
        <List.Item.Meta
          avatar={<Avatar src={item.logo} alt={item.name} size="large" />}
          title={
            <Space>
              <span>{item.name}</span>
              <Tag>{item.version}</Tag>
            </Space>
          }
          description={<PluginDescription plugin={item} />}
        />
      </List.Item>
    ),
    [],
  )
  const data = useMemo(() => {
    const s = search.toLowerCase().trim()
    if (!s) {
      return plugins
    }

    return plugins?.filter((item) => {
      return [item.author, item.name, item.description].join("").toLowerCase().includes(s)
    })
  }, [plugins, search])

  return (
    <List loading={data === undefined}>
      {data?.length ? (
        <VirtualList data={data} itemKey="id" itemHeight={151} height={height}>
          {renderItem}
        </VirtualList>
      ) : undefined}
    </List>
  )
}
