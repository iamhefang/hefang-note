/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:25:53
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import {List} from "antd"
import {useMemo} from "react"

import {PluginProps} from "./types"

import usePluginItemRenderer from "$hooks/pluginManager/usePluginItemRenderer"
import usePlugins from "$plugin/hooks/usePlugins"

export function PluginInstalled({search}: PluginProps) {
    const allPlugins = usePlugins(true)
    const renderItem = usePluginItemRenderer()
    const dataSource = useMemo(() => {
        if (!search) {
            return allPlugins
        }
        const s = search.toLowerCase()

        return allPlugins.filter(({author, name, description}) => {
            return [author, name, description].join("").toLowerCase().includes(s)
        })
    }, [search, allPlugins])

    return <List itemLayout="vertical" dataSource={dataSource} renderItem={renderItem} loading={!dataSource}/>
}
