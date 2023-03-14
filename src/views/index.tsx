import { InfoCircleOutlined } from "@ant-design/icons"
import { theme as antdTheme, Col, Layout, Row, Spin } from "antd"
import { Resizable, ResizeCallback } from "re-resizable"
import { useCallback, useEffect, useMemo, useState } from "react"

import { productName, versionName } from "~/consts"

import Editor from "$components/editor/Editor"
import SiderBar from "$components/sidebar/SiderBar"
import TopBarLeft from "$components/topbar/TopBarLeft"
import TopBarRight from "$components/topbar/TopBarRight"
import VersionView from "$components/version/VersionView"
import { useNotes, useSettings } from "$hooks/useSelectors"
import { shortcuts } from "$utils/shortcuts"

const { Sider, Content, Header, Footer } = Layout
export default function View() {
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
  const onResizeStop = useCallback<ResizeCallback>((e, d, ref, delta) => setSW(width), [width])
  const onResize = useCallback<ResizeCallback>(
    (e, d, ref, delta) => {
      const newWidth = sw + delta.width
      setWidth(newWidth)
    },
    [sw],
  )
  const footer = useMemo(() => {
    const values = Object.values(entities)
    const notes = values.filter((item) => item.isLeaf)

    return `共${values.length - notes.length}个目录,${notes.length}篇笔记`
  }, [entities])

  const loadStatus = useMemo(() => {
    if (status === "failed") {
      return <InfoCircleOutlined />
    }
    if (status === "idle") {
      return null
    }

    return (
      <span title="数据量大，正在加载，请稍候">
        <Spin size="small" />
      </span>
    )
  }, [status])

  useEffect(() => {
    if (!shortcut?.closeWindow) {
      return
    }

    const closeWindow = () => {
      console.info({ shortcut: shortcut.closeWindow })
      window.close()
    }

    shortcuts.register({ shortcut: shortcut.closeWindow, handler: closeWindow })

    return () => {
      shortcuts.remove({ shortcut: shortcut.closeWindow, handler: closeWindow })
    }
  }, [shortcut?.closeWindow])

  useEffect(() => {
    localStorage.setItem("bgColor", colorBgBase)
  }, [colorBgBase, theme])

  const title = useMemo(() => {
    if (locked) {
      return "已锁定"
    }
    const item = entities[current]

    return `${item?.isLeaf ? `${item.title} - ` : ""}${productName} v${versionName}`
  }, [current, entities, locked])

  return (
    <Layout>
      <Header data-tauri-drag-region={true} style={{ backgroundColor: colorBgContainer }}>
        <TopBarLeft />
        {title}
        <TopBarRight />
      </Header>
      <Layout>
        <Resizable
          minWidth={240}
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
          <Editor />
        </Content>
      </Layout>
      <Footer style={{ borderColor: colorBorder }}>
        <Row gutter={10}>
          <Col>{footer}</Col>
          {loadStatus && <Col>{loadStatus}</Col>}
          <Col flex={1} />
          <Col>
            <VersionView />
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}
