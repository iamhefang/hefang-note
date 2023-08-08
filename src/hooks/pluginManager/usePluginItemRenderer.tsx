import { Avatar, List, Space, Switch, Tag } from "antd"
import { useCallback, useEffect, useState } from "react"
import * as semver from "semver"

import { serverHost } from "~/consts"
import { IPlugin, IPluginInfo } from "~/plugin"
import { useAppDispatch } from "~/redux"
import { switchPlugin } from "~/redux/settingSlice"

import usePluginDownloader, { PluginStatus, PluginStoreInfo, statusText } from "./usePluginDownloader"

import { PluginDescription } from "$components/plugins"
import useAntdConfirm from "$hooks/useAntdConfirm"
import { useSettings } from "$hooks/useSelectors"
import usePlugins from "$plugin/hooks/usePlugins"
import usePluginSettings from "$plugin/hooks/usePluginSettings"

function PluginItem({ item }: { item: IPluginInfo }) {
  const { editor, theme } = useSettings()
  const dispatch = useAppDispatch()
  const showConfirm = useAntdConfirm()
  const plugins = usePlugins(true)
  const settings = usePluginSettings(item.id)
  const [newPlugins, setNewPlugins] = useState<Record<string, PluginStoreInfo & { upgradable: boolean }>>({})
  const [status, setStatus, downloader] = usePluginDownloader(newPlugins[item.id])

  useEffect(() => {
    plugins.length &&
      fetch(`${serverHost}/api/v1/plugin/ids/${plugins.map((p) => p.id).join(",")}`)
        .then(async (res) => res.json())
        .then((res) => {
          if (res.data.code !== 200) {
            return console.error("获取插件信息失败", res)
          }
          setNewPlugins(
            res.data.data.reduce(
              (acc, cur) => ({
                ...acc,
                [cur.id]: {
                  ...cur,
                  upgradable: semver.gt(cur.version, plugins.find((p) => p.id === cur.id)?.version || "0.0.0"),
                },
              }),
              {},
            ),
          )
        })
        .catch(console.error)
  }, [plugins])

  useEffect(() => {
    newPlugins[item.id]?.upgradable && setStatus(PluginStatus.upgradable)
  }, [item.id, newPlugins, setStatus])

  const createOnPluginEnable = useCallback(
    (plugin: IPlugin) => {
      return async (checked: boolean) => {
        checked ? plugin.onEnable?.(settings) : plugin.onDisable?.()
        let sureClose = true
        if (!checked) {
          const items = []
          if (plugin.id === editor) {
            items.push("编辑器")
          }
          if (plugin.id === theme) {
            items.push("主题")
          }
          sureClose =
            items.length === 0 ||
            (await showConfirm({
              title: `正在使用插件提供的${items.join("、")}`,
              content: `关闭插件后，${items.join("、")}将重置为默认值`,
              okText: "关闭",
            }))
        }
        if (sureClose || checked) {
          dispatch(switchPlugin(plugin.id))
        }
      }
    },
    [settings, editor, theme, showConfirm, dispatch],
  )

  return (
    <List.Item
      extra={
        <Switch
          checked={item.enable}
          onChange={createOnPluginEnable(item)}
          checkedChildren="开"
          unCheckedChildren="关"
        />
      }
    >
      <List.Item.Meta
        avatar={<Avatar src={item.logo} alt={item.name} size={100} shape="square" style={{ borderRadius: 17 }} />}
        title={
          <Space>
            <span>{item.name}</span>
            <Tag>
              v{item.version} {item.scriptUrl ? "dev" : ""}
            </Tag>
            {newPlugins[item.id]?.upgradable && (
              <Tag
                color="orange"
                onClick={downloader}
                style={{ cursor: "pointer" }}
                title={`可从 v${item.version} 升级到 v${newPlugins[item.id]?.version}`}
              >
                {statusText[status]}
              </Tag>
            )}
          </Space>
        }
        description={<PluginDescription plugin={item} />}
      />
    </List.Item>
  )
}

export default function usePluginItemRenderer() {
  return useCallback((item: IPlugin) => <PluginItem item={item} />, [])
}
