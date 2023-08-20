import "$utils/debug"
import "$utils/globals"

import { Empty } from "antd"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import ReactDOMClient from "react-dom/client"
import { Provider } from "react-redux"

import Application from "./Application"
import { versionCode, versionName } from "./consts"
import store from "./redux"

import Container from "$components/container/Container"
import VersionError from "$components/version/VersionError"
import { database } from "$utils/database"
import { logger } from "$utils/logger"
import pkg from "^/package.json"
import "./style.scss"

dayjs.extend(relativeTime)

logger.info("已启动，正在准备渲染", versionName, versionCode)

const root = ReactDOMClient.createRoot(document.getElementById("root") as HTMLElement)

function renderApplication() {
  logger.info("正在渲染应用")
  root.render(
    <Provider store={store}>
      <Container>
        <Application />
      </Container>
    </Provider>,
  )
}

function renderLockError() {
  logger.info("正在渲染单例提示")
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
  logger.info("正在渲染版本错误提示")
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
