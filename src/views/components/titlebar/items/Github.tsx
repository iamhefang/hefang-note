import {GithubOutlined} from "@ant-design/icons"
import {shell} from "@tauri-apps/api"
import {Button} from "antd"
import React, {useCallback} from "react"

import {isInClient} from "~/consts"

import {useTranslate} from "$hooks/useTranslate"
import {repository} from "^/package.json"

export default function Github() {
    const t = useTranslate()
    const onClick = useCallback((e: React.MouseEvent) => {
        if (!isInClient) {
            return
        }
        e.preventDefault()
        void shell.open(repository.url)
    }, [])

    return <Button title={t("查看源码")} icon={<GithubOutlined/>} onClick={onClick} href={repository.url} size="small" type="text" target="__blank"/>
}
