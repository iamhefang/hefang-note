import {Button, Col, Divider, Empty, Row, Space, Tag} from "antd"
import React, {ForwardedRef, useEffect, useMemo, useState} from "react"
import {ItemProps, ListProps, Virtuoso} from "react-virtuoso"

import {IPluginInfo} from "~/plugin"

import {PluginDescription} from "./PluginDescription"
import ss from "./PluginStore.module.scss"
import {PluginProps} from "./types"

import {pluginStore} from "$utils/database"

const PluginListItem = React.memo(({item, "data-known-size": dataKnownSize, ...props}: ItemProps<IPluginInfo>) => {
    return (
        <li className={ss.item} style={{height: dataKnownSize}} {...props} key={`store-${item.id}`}>
            <Row gutter={15} wrap={false}>
                <Col>
                    <img src={item.logo ?? ""} className={ss.cover} style={{height: (dataKnownSize / 3) * 2}} alt={item.name}/>
                </Col>
                <Col flex={1}>
                    <Space direction="vertical">
                        <Space>
                            <h3>{item.name}</h3>
                            <Tag>{item.version}</Tag>
                        </Space>

                        <PluginDescription plugin={item}/>
                    </Space>
                </Col>
                <Col style={{alignSelf: "center"}}>
                    <Button>安装</Button>
                </Col>
            </Row>
            <Divider/>
        </li>
    )
})

const PluginList = React.forwardRef(({children, ...props}: ListProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} {...props}>
            <ul className={ss.list}>{children}</ul>
        </div>
    )
})

const PluginListEmpty = React.memo(({context}: { context?: unknown }) => <Empty/>)

export function PluginStore({search}: PluginProps) {
    const [plugins, setPlugins] = useState<IPluginInfo[]>()
    const [height, setHeight] = useState(window.innerHeight - 200)
    useEffect(() => {
        void pluginStore.getAll().then(setPlugins)
    }, [])

    const data = useMemo(() => {
        const s = search.toLowerCase().trim()
        if (!s) {
            return plugins ?? []
        }

        return plugins?.filter((item) => {
            return [item.author, item.name, item.description].join("").toLowerCase().includes(s)
        }) ?? []
    }, [plugins, search])
    useEffect(() => {
        const onResize = () => {
            setHeight(Math.min
            (window.innerHeight - 200, (data.length * 70) || 200))
        }
        onResize()
        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [data])

    return (
        <Virtuoso
            components={{List: PluginList, Item: PluginListItem, EmptyPlaceholder: PluginListEmpty}}
            data={data}
            style={{height}}
            fixedItemHeight={150}
            increaseViewportBy={300}
        />
    )
}
