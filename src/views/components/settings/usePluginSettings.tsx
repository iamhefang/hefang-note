import {Avatar, Empty, Form, List, Space, Tabs} from "antd"
import {useCallback, useMemo} from "react"

import {IPlugin} from "~/plugin"

import usePlugins from "$plugin/hooks/usePlugins"

export default function usePluginSettings() {
    const plugins = usePlugins()

    const settingRenderer = useCallback((plugin: IPlugin) => {
        return <List style={{width: "100%"}} key={plugin.id}>
            {Object.entries(plugin.settings!).map(([key, {label, ...setting}]) => (
                <List.Item extra={<Form.Item key={key} name={[plugin.id, key]} {...setting}/>} key={`form-label-${label}`}>
                    {label}
                </List.Item>
            ))}
        </List>
    }, [])

    return useMemo(() => (
        <Tabs
            tabPosition="left"
            items={plugins.map(p => ({
                key: p.id,
                label: p.logo ?
                    <Space align="center">
                        <Avatar src={p.logo} size={22} shape="square"/>
                        {p.name}
                    </Space> : p.name,
                children: <>
                    {p.settings ? settingRenderer(p) : <Empty description="该插件未提供配置项"/>}
                </>,
            }))}
        />
    ), [plugins, settingRenderer])
}