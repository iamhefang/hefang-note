import "$utils/debug"
import "$utils/globals"

import { Empty } from "antd"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import ReactDOMClient from "react-dom/client"
import { Provider } from "react-redux"

import Application from "./Application"
import { isInClient, isInElectron, isInTauri, versionCode, versionName } from "./consts"
import store from "./redux"

import Container from "$components/container/Container"
import VersionError from "$components/version/VersionError"
import { database } from "$utils/database"
import pkg from "^/package.json"
import "./style.scss"

dayjs.extend(relativeTime)

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
