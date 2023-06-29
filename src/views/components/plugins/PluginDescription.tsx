/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:23:00
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import { Col, Row, Space, Tag } from "antd"
import { useMemo } from "react"

import { IPluginInfo, PluginAbility, PluginComponents } from "~/plugin"

import ss from "./PluginDescription.module.scss"

import { openInNative } from "$components/utils/native"

const abilities: Record<PluginAbility, string> = {
  synchronization: "同步",
  theme: "主题",
  settings: "设置项",
}

function pluginAbilities(value: PluginAbility) {
  return (
    <Tag color="volcano" key={value}>
      {abilities[value]}
    </Tag>
  )
}

const components: Record<PluginComponents, string> = {
  Editor: "编辑器",
  FooterLeft: "状态栏左",
  FooterRight: "状态栏右",
  TopLeft: "标题栏左",
  TopRight: "标题栏右",
  Float: "悬浮窗",
}

function pluginComponents(value: PluginComponents) {
  return (
    <Tag color="pink" key={value}>
      {components[value]}
    </Tag>
  )
}


export function PluginDescription({ plugin }: { plugin: IPluginInfo }) {
  return useMemo(
    () => (
      <Space direction="vertical" style={{ width: "100%" }}>
        {plugin.description ? (
          <p className={ss.description}>{plugin.description}</p>
        ) : (
          <p className={ss.description} style={{ opacity: 0.4 }}>
            该插件没有描述
          </p>
        )}
        <Row>
          <Col flex={1}>
            <Space>
              <a href={plugin.homepage ?? undefined} onClick={openInNative}>
                @{plugin.author}
              </a>
              {plugin.repository && (
                <a href={plugin.repository} onClick={openInNative}>
                  源码
                </a>
              )}
              {plugin.license && <Tag>{plugin.license}</Tag>}
            </Space>
          </Col>
          <Col>
            <Space size={0}>
              {plugin.abilities && plugin.abilities.map(pluginAbilities)}
              {plugin.components && plugin.components.map(pluginComponents)}
            </Space>
          </Col>
        </Row>
      </Space>
    ),
    [
      plugin.abilities,
      plugin.author,
      plugin.components,
      plugin.description,
      plugin.homepage,
      plugin.license,
      plugin.repository,
    ],
  )
}
