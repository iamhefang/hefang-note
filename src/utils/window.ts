import {dialog, shell} from "@tauri-apps/api"
import {exit} from "@tauri-apps/api/process"
import {appWindow} from "@tauri-apps/api/window"
import {Modal} from "antd"

import {isInClient, isInElectron, isInTauri, productName} from "~/consts"

export function closeWindow() {
    window.shell?.api?.window?.minimize()
}

export function exitProcess() {
    window.shell?.api?.exit()
}

export function showDbBlockingDialog({}: { currentVersion: number; blockedVersion: number | null }) {
    const title = `您已经使用过新版本的${productName}`
    const content = "您使用的当前版本低于之前使用的版本"
    if (isInClient) {
        void dialog.message(`${content}，请下载使用新版本`, {title}).then(() => {
            void shell.open("https://github.com/iamhefang/hefang-note/releases")
        })
    } else {
        Modal.info({
            title,
            content: `${content}，请刷新后使用`,
            onOk() {
                window.location.reload()
            },
        })
    }
}
