import { Avatar, List, Space, Switch, Tag } from "antd"
import { useCallback, useMemo } from "react"

import { PluginDescription } from "./PluginDescription"
import { PluginProps } from "./types"

import useAntdConfirm from "$hooks/useAntdConfirm"
import usePlugins, { IPlugin } from "$hooks/usePlugins"
import { useSettings } from "$hooks/useSelectors"


export function PluginInstalled({ search }: PluginProps) {
  const { editor, theme } = useSettings()
  const allPlugins = usePlugins(true)
  const showConfirm = useAntdConfirm()
  const createOnPluginEnable = useCallback(
    (plugin: IPlugin) => {
      return async (checked: boolean) => {
        checked ? plugin.onEnable?.() : plugin.onDisable?.()
        let sureClose = true
        if (!checked) {
          const items = []
          if (plugin.id === editor) {
            items.push("编辑器")
          }
          if (plugin.id === theme) {
            items.push("主题")
          }
          sureClose = await showConfirm({
            title: `正在使用插件提供的${items.join("、")}`,
            content: `关闭插件后，${items.join("、")}将重置为默认值`,
            okText: "关闭",
          })
        }
        sureClose &&
          setState({
            plugins: allPlugins
              .map((item) => {
                if ((item.id === plugin.id && checked) || (item.id !== plugin.id && item.enable)) {
                  return item.id
                }

                return null
              })
              .filter((item) => item) as string[],
            editor: !checked && plugin.id === editor ? "" : editor,
            theme: !checked && plugin.id === theme ? "auto" : theme,
          })
      }
    },
    [allPlugins, editor, theme, showConfirm],
  )
  const renderItem = useCallback(
    (item: IPlugin) => (
      <List.Item key={item.id} extra={<Switch checked={item.enable} onChange={createOnPluginEnable(item)} checkedChildren="开" unCheckedChildren="关" />}>
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
    [createOnPluginEnable],
  )

  const dataSource = useMemo(() => {
    if (!search) {
      return allPlugins
    }
    const s = search.toLowerCase()

    return allPlugins.filter(({ author, name, description }) => {
      return [author, name, description].join("").toLowerCase().includes(s)
    })
  }, [search, allPlugins])

  return <List itemLayout="vertical" dataSource={dataSource} renderItem={renderItem} />
}
