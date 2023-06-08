import Html from "$components/utils/Html"
import "$utils/debug"
import "$utils/globals"

import "$utils/worker"



import {Empty, message, Modal} from "antd"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import ReactDOMClient from "react-dom/client"
import {Provider} from "react-redux"

import Application from "./Application"
import {versionName} from "./consts"
import store from "./redux"

import {html} from "^/CHANGELOG.md"
import pkg from "^/package.json"
import "./style.scss"

dayjs.extend(relativeTime)

message.config({top: 40})
const root = ReactDOMClient.createRoot(document.getElementById("root") as HTMLElement)
void navigator.locks.request("hefang-note", {ifAvailable: true}, async (lock) => {
    if (lock) {
        root.render(
            <Provider store={store}>
                <Application/>
            </Provider>,
        )
        if (localStorage.getItem("firstRun") !== versionName) {
            Modal.info({
                title: "更新日志/Changelog",
                content: <Html className="changelog-container" data-selectable>{html}</Html>,
                okText: "知道了/OK",
                width: "90%",
                centered: true,
                style: {maxWidth: 600},
                onOk() {
                    localStorage.setItem("firstRun", versionName)
                },
            })
        }
    } else {
        root.render(<Empty
            description={<span style={{color: "yellow"}}>{pkg.productName}已在其他窗口打开 / Application is running in other window</span>}
        />)
    }

    return new Promise(() => {
    })
})
