import "$utils/debug"
import "$utils/globals"

import { Empty } from "antd"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import ReactDOMClient from "react-dom/client"
import { Provider } from "react-redux"

import Application from "./Application"
import { isLocalhost, versionCode, versionName } from "./consts"
import store from "./redux"

import Container from "$components/container/Container"
import VersionError from "$components/version/VersionError"
import { database } from "$utils/database"
import pkg from "^/package.json"
import "./style.scss"

dayjs.extend(relativeTime)

if (isLocalhost) {
  console.info("%c当前处于开发模式", "color:orange;font-size:2em;")
  console.group("插件开发教程")
  console.info(`何方笔记内置了 react、react-dom、react-dom/client、antd、@ant-design/icons、lodash、dayjs 等库。
如果你的插件中使用了这些库，有两种方法导入:
  1. import varName from "hefang-note:libs:name";
  2. import varName from "name";

例如需要使用@ant-design/icons中的 <LoadingOutlined /> 图标，可以这样导入:
  1. import icons from "hefang-note:libs:@ant-design/icons";
  2. import * as icons from "@ant-design/icons";
然后从icons中取出LoadingOutlined: const { LoadingOutlined } = icons;`)
  console.groupEnd()
}

console.info("当前版本号", versionName, versionCode)

const root = ReactDOMClient.createRoot(document.getElementById("root") as HTMLElement)

function renderApplication() {
  root.render(
    <Provider store={store}>
      <Container>
        <Application />
      </Container>
    </Provider>,
  )
}

function renderLockError() {
  root.render(
    <Provider store={store}>
      <Container>
        <Empty
          description={
            <span style={{ color: "orange" }}>
              {pkg.productName}已在其他窗口打开 / Application is running in other window
            </span>
          }
        />
      </Container>
    </Provider>,
  )
}

function renderVersionError() {
  root.render(
    <Provider store={store}>
      <Container>
        <VersionError />
      </Container>
    </Provider>,
  )
}

void navigator.locks.request("hefang-note", { ifAvailable: true }, async (lock) => {
  if (lock) {
    database.then(renderApplication).catch((error) => {
      if (error instanceof DOMException) {
        if (error.name === "VersionError") {
          renderVersionError()
        }
      } else {
        console.error(error)
      }
    })
  } else {
    renderLockError()
  }
})
