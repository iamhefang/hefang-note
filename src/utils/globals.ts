// eslint-disable-next-line import/no-internal-modules
import * as icons from "@ant-design/icons/lib/icons"
import * as antd from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import React from "react"
import ReactDOM from "react-dom"
import ReactDomClient from "react-dom/client"

import { findNoteParents } from "./notes"

import Html from "$components/utils/Html"
import ShowInPlatform from "$components/utils/ShowInPlatform"

const globals = {
  libs: {
    react: React,
    "react-dom": ReactDOM,
    "react-dom/client": ReactDomClient,
    _,
    lodash: _,
    antd,
    "@ant-design/icons": icons,
    dayjs,
  },
  components: {
    ShowInPlatform,
    Html,
  },
  utils: {
    findNoteParents,
  },
}

Object.defineProperty(window, "globals", { value: globals, writable: false })

type GlobalType = typeof globals

declare global {
  const globals: GlobalType
}
