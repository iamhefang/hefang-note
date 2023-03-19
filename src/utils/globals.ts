// eslint-disable-next-line import/no-internal-modules
import * as icons from "@ant-design/icons/lib/icons"
import * as antd from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import React from "react"
import ReactDOM from "react-dom"
import ReactDomClient from "react-dom/client"


const globals = { React, ReactDOM, ReactDomClient, _, lodash: _, antd, icons, dayjs }

Object.defineProperty(window, "globals", { value: globals, writable: false })

type GlobalType = typeof globals

declare global {
    const globals: GlobalType
}