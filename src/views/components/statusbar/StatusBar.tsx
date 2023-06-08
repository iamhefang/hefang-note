import {theme as antdTheme, Layout} from "antd"
import React from "react"

import ss from "./StatusBar.module.scss"

import FooterLeftSpace from "$components/statusbar/FooterLeftSpace"
import FooterRightSpace from "$components/statusbar/FooterRightSpace"

const {Footer} = Layout
export default function Rooter() {
    const {token: {colorBorder}} = antdTheme.useToken()

    return (
        <Footer style={{borderColor: colorBorder}} className={ss.root}>
            <div className={ss.left}>
                <FooterLeftSpace/>
            </div>
            <div className={ss.right}>
                <FooterRightSpace/>
            </div>
        </Footer>
    )
}