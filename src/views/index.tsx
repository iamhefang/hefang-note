import { InfoCircleOutlined } from "@ant-design/icons"
import { theme as antdTheme, Col, Layout, Row, Spin } from "antd"
import { Resizable, ResizeCallback } from "re-resizable"
import { useCallback, useEffect, useMemo, useState } from "react"

import { useNotes, useSettings } from "~/hooks/useSelectors"
import Editor from "~/views/components/editor/Editor"
import SiderBar from "~/views/components/sidebar/SiderBar"
import TopBarLeft from "~/views/components/topbar/TopBarLeft"
import TopBarRight from "~/views/components/topbar/TopBarRight"
import VersionView from "~/views/components/version/VersionView"

const { Sider, Content, Header, Footer } = Layout
export default function View() {
  const {
    title,
    showSideBar,
    theme,
    lock: { locked },
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

    return <Spin size="small" />
  }, [status])

  useEffect(() => {
    localStorage.setItem("bgColor", colorBgBase)
  }, [colorBgBase, theme])

  return (
    <Layout>
      <Header data-tauri-drag-region={true} style={{ backgroundColor: colorBgContainer }}>
        <TopBarLeft />
        {locked ? "已锁定" : title}
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
