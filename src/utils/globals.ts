// eslint-disable-next-line import/no-internal-modules
import * as icons from "@ant-design/icons/lib/icons"
import * as antd from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import React from "react"
import ReactDOM from "react-dom"
import ReactDomClient from "react-dom/client"

import Html from "$components/utils/Html"
import ShowInPlatform from "$components/utils/ShowInPlatform"

const globals = {
    React,
    ReactDOM,
    ReactDomClient,
    _, lodash: _,
    antd,
    icons,
    dayjs,
    ShowInPlatform,
    Html,
}

Object.defineProperty(window, "globals", {value: globals, writable: false})

type GlobalType = typeof globals

declare global {
    const globals: GlobalType
}