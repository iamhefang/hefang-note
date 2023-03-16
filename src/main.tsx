import { Empty, message, Modal } from "antd"
import ReactDOMClient from "react-dom/client"
import { Provider } from "react-redux"

import Application from "./Application"
import { versionName } from "./consts"
import store from "./redux"

import { Html } from "$components/utils/Html"
import "$utils/debug"
import "$utils/globals"
import { html } from "^/CHANGELOG.md"
import pkg from "^/package.json"

import "$utils/worker"
import "./style.scss"

message.config({ top: 40 })
const root = ReactDOMClient.createRoot(document.getElementById("root") as HTMLElement)
void navigator.locks.request("hefang-note", { ifAvailable: true }, async (lock) => {
  if (lock) {
    root.render(
      <Provider store={store}>
        <Application />
      </Provider>,
    )

    if (localStorage.getItem("firstRun") !== versionName) {
      Modal.info({
        title: "更新日志",
        content: <Html className="changelog-container">{html}</Html>,
        okText: "知道了",
        onOk() {
          localStorage.setItem("firstRun", versionName)
        },
      })
    }
  } else {
    root.render(<Empty description={`${pkg.productName}已在其他窗口打开`} />)
  }

  return new Promise(() => {})
})
