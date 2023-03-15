import { shell } from "@tauri-apps/api"
import { Col, Row, Space, Tag } from "antd"
import React, { useMemo } from "react"

import ss from "./PluginDescription.module.scss"

import { IPluginInfo, PluginAbility, PluginComponents } from "$hooks/usePlugins"


const abilities: Record<PluginAbility, string> = {
  themes: "主题",
}

function pluginAbilities(value: PluginAbility) {
  return abilities[value]
}

const components: Record<PluginComponents, string> = {
  Editor: "编辑器",
}

function pluginComponents(value: PluginComponents) {
  return components[value]
}
function openInNative(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  void shell.open(e.currentTarget.href)
}
export function PluginDescription({ plugin }: { plugin: IPluginInfo }) {
  return useMemo(
    () => (
      <Space direction="vertical" style={{ width: "100%" }}>
        <p className={ss.description}>{plugin.description || "该插件没有描述"}</p>
        <Row>
          <Col>
            <Space>
              <span>@{plugin.author}</span>
              {plugin.repository && (
                <a href={plugin.repository} onClick={openInNative}>
                  源码
                </a>
              )}
              {plugin.homepage && (
                <a href={plugin.homepage} onClick={openInNative}>
                  主页
                </a>
              )}
              {plugin.license && <Tag>{plugin.license}</Tag>}
            </Space>
          </Col>
          <Col flex={1} />
          <Col>
            <Space>
              {plugin.abilities && plugin.abilities.map(pluginAbilities)}
              {plugin.components && plugin.components.map(pluginComponents)}
            </Space>
          </Col>
        </Row>
      </Space>
    ),
    [plugin.abilities, plugin.author, plugin.components, plugin.description, plugin.homepage, plugin.license, plugin.repository],
  )
}
