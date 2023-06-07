import {Avatar, List, Space, Switch, Tag} from "antd"
import {useCallback} from "react"

import {IPlugin} from "~/plugin"
import {useAppDispatch} from "~/redux"
import {switchPlugin} from "~/redux/settingSlice"

import {PluginDescription} from "$components/plugins"
import useAntdConfirm from "$hooks/useAntdConfirm"
import {useSettings} from "$hooks/useSelectors"

export default function usePluginItemRenderer() {
    const {editor, theme} = useSettings()
    const dispatch = useAppDispatch()
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
                    sureClose =
                        items.length === 0 ||
                        (await showConfirm({
                            title: `正在使用插件提供的${items.join("、")}`,
                            content: `关闭插件后，${items.join("、")}将重置为默认值`,
                            okText: "关闭",
                        }))
                }
                if (sureClose) {
                    dispatch(switchPlugin(plugin.id))
                }
            }
        },
        [editor, theme, showConfirm, dispatch],
    )

    return useCallback(
        (item: IPlugin) => (
            <List.Item extra={<Switch checked={item.enable} onChange={createOnPluginEnable(item)} checkedChildren="开" unCheckedChildren="关"/>}>
                <List.Item.Meta
                    avatar={<Avatar src={item.logo} alt={item.name} size={80} shape="square"/>}
                    title={
                        <Space>
                            <span>{item.name}</span>
                            <Tag>{item.version}</Tag>
                        </Space>
                    }
                    description={<PluginDescription plugin={item}/>}
                />
            </List.Item>
        ),
        [createOnPluginEnable],
    )
}