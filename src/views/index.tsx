import {theme as antdTheme, Col, Layout, Row} from "antd"
import {Resizable, ResizeCallback} from "re-resizable"
import React, {useCallback, useEffect, useMemo, useState} from "react"

import {productName, versionName} from "~/consts"

import EditorArea from "$components/editor/EditorArea"
import SiderBar from "$components/sidebar/SiderBar"
import FooterLeftSpace from "$components/statusbar/FooterLeftSpace"
import FooterRightSpace from "$components/statusbar/FooterRightSpace"
import TopBarLeft from "$components/topbar/TopBarLeft"
import TopBarRight from "$components/topbar/TopBarRight"
import useCurrent from "$hooks/useCurrent"
import {useSettings} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"
import {shortcuts} from "$utils/shortcuts"
import {closeWindow} from "$utils/window"



const {Sider, Content, Header, Footer} = Layout
export default function View() {
    const t = useTranslate()
    const {
        showSideBar,
        theme,
        lock: {locked},
        shortcut,
    } = useSettings()
    const {
        token: {colorBgContainer, colorBorder, colorBgBase},
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

    const current = useCurrent()

    useEffect(() => {
        if (!shortcut?.closeWindow) {
            return
        }

        shortcuts.register({shortcut: shortcut.closeWindow, handler: closeWindow})

        return () => {
            shortcuts.remove({shortcut: shortcut.closeWindow, handler: closeWindow})
        }
    }, [shortcut?.closeWindow])

    useEffect(() => {
        localStorage.setItem("bgColor", colorBgBase)
    }, [colorBgBase, theme])

    const title = useMemo(() => {
        if (locked) {
            return t("已锁定")
        }

        return `${current?.isLeaf ? `${current.title} - ` : ""}${productName} v${versionName}`
    }, [current?.isLeaf, current?.title, locked, t])

    return (
        <Layout>
            <Header data-tauri-drag-region={true} style={{backgroundColor: colorBgContainer}}>
                <TopBarLeft/>
                <span style={{pointerEvents: "none"}}>{title}</span>
                <TopBarRight/>
            </Header>
            <Layout>
                <Resizable
                    minWidth={250}
                    maxWidth={400}
                    size={{width, height: "auto"}}
                    enable={{right: true}}
                    onResizeStop={onResizeStop}
                    onResize={onResize}
                    style={{display: showSideBar ? "block" : "none"}}
                >
                    <Sider theme="light" width="100%">
                        <SiderBar/>
                    </Sider>
                </Resizable>
                <Content>
                    <EditorArea/>
                </Content>
            </Layout>
            <Footer style={{borderColor: colorBorder}}>
                <Row gutter={10}>
                    <Col>
                        <FooterLeftSpace/>
                    </Col>
                    <Col flex={1}/>
                    <Col>
                        <FooterRightSpace/>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    )
}
