import { InfoCircleOutlined } from "@ant-design/icons"
import { theme as antdTheme, Col, Layout, Row, Space, Spin } from "antd"
import { Resizable, ResizeCallback } from "re-resizable"
import { useCallback, useEffect, useMemo, useState } from "react"

import { productName, versionName } from "~/consts"

import EditorArea from "$components/editor/EditorArea"
import SiderBar from "$components/sidebar/SiderBar"
import Github from "$components/topbar/items/Github"
import TopBarLeft from "$components/topbar/TopBarLeft"
import TopBarRight from "$components/topbar/TopBarRight"
import VersionView from "$components/version/VersionView"
import { useNotes, useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import usePluginFooterTopComponents from "$plugin/hooks/usePluginFooterTopComponents"
import { shortcuts } from "$utils/shortcuts"
import { closeWindow } from "$utils/window"

const { Sider, Content, Header, Footer } = Layout
export default function View() {
  const t = useTranslate()
  const {
    showSideBar,
    theme,
    lock: { locked },
    current,
    shortcut,
  } = useSettings()
  const { entities, status } = useNotes()
  const {
    token: { colorBgContainer, colorBorder, colorBgBase },
  } = antdTheme.useToken()
  const [width, setWidth] = useState(240)
  const [sw, setSW] = useState(width)
  const onResizeStop = useCallback<ResizeCallback>((_e, _d, _ref, _delta) => setSW(width), [width])
  const onResize = useCallback<ResizeCallback>(
    (_e, _d, _ref, delta) => {
      const newWidth = sw + delta.width
      setWidth(newWidth)
    },
    [sw],
  )
  const footer = useMemo(() => {
    const values = Object.values(entities)
    const notes = values.filter((item) => item.isLeaf)
    const dirCount = values.length - notes.length
    const noteCount = notes.length

    return t("共{dirCount}个目录,{noteCount}篇笔记", { dirCount, noteCount })
  }, [entities, t])

  const loadStatus = useMemo(() => {
    if (status === "failed") {
      return <InfoCircleOutlined />
    }
    if (status === "idle") {
      return null
    }

    return (
      <span title={t("数据量大，正在加载，请稍候")}>
        <Spin size="small" />
      </span>
    )
  }, [status, t])

  useEffect(() => {
    if (!shortcut?.closeWindow) {
      return
    }

    shortcuts.register({ shortcut: shortcut.closeWindow, handler: closeWindow })

    return () => {
      shortcuts.remove({ shortcut: shortcut.closeWindow, handler: closeWindow })
    }
  }, [shortcut?.closeWindow])

  useEffect(() => {
    localStorage.setItem("bgColor", colorBgBase)
  }, [colorBgBase, theme])
  const left = usePluginFooterTopComponents("FooterLeft")
  const right = usePluginFooterTopComponents("FooterRight")

  const title = useMemo(() => {
    if (locked) {
      return t("已锁定")
    }
    const item = entities[current]

    return `${item?.isLeaf ? `${item.title} - ` : ""}${productName} v${versionName}`
  }, [current, entities, locked, t])

  return (
    <Layout>
      <Header data-tauri-drag-region={true} style={{ backgroundColor: colorBgContainer }}>
        <TopBarLeft />
        {title}
        <TopBarRight />
      </Header>
      <Layout>
        <Resizable
          minWidth={250}
          maxWidth={400}
          size={{ width, height: "auto" }}
          enable={{ right: true }}
          onResizeStop={onResizeStop}
          onResize={onResize}
          style={{ display: showSideBar ? "block" : "none" }}
        >
          <Sider theme="light" width="100%">
            <SiderBar />
          </Sider>
        </Resizable>
        <Content>
          <EditorArea />
        </Content>
      </Layout>
      <Footer style={{ borderColor: colorBorder }}>
        <Row gutter={10}>
          <Col>
            <Space>
              {footer}
              {loadStatus}
              {...left}
            </Space>
          </Col>
          <Col flex={1} />
          <Col>
            <Space>
              {...right}
              <Github />
              <VersionView />
            </Space>
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}
