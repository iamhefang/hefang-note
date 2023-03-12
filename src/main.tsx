import { Empty, message, Modal } from "antd"
import ReactDOMClient from "react-dom/client"
import { Provider } from "react-redux"

import Application from "./Application"
import store from "./redux"

import pkg from "^/package.json"
import "$utils/debug"

import "~/utils/worker"
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

    if (localStorage.getItem("firstRun") !== pkg.version) {
      Modal.info({
        title: "提示",
        content: (
          <div className="first-run-notice">
            <p>感谢你使用{pkg.productName}。</p>
            <p>{pkg.productName}的所有内容都保存在本地，不通过网络传输，开发者和您的网络运营商都无法获取您的数据</p>
            <p>在您不清空浏览器数据的情况下数据将一直存在。</p>
            <p>
              {pkg.productName}到后期会开源，如果您想要立即参与{pkg.productName}的开发，可联系我的邮箱{" "}
              <a target="_blank" href="mailto:he@hefang.link" rel="noreferrer">
                he@hefang.link
              </a>
            </p>
          </div>
        ),
        okText: "知道了",
        onOk() {
          localStorage.setItem("firstRun", pkg.version)
        },
      })
    }
  } else {
    root.render(<Empty description={`${pkg.productName}已在其他窗口打开`} />)
  }

  return new Promise(() => {})
})
