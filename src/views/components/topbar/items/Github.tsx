import { GithubOutlined } from "@ant-design/icons"
import { shell } from "@tauri-apps/api"
import { Button, Tooltip } from "antd"
import React, { useCallback } from "react"

import { isInTauri } from "~/consts"

import { repository } from "^/package.json"


export default function Github() {
  const onClick = useCallback((e: React.MouseEvent) => {
    if (!isInTauri) {
      return
    }
    e.preventDefault()
    void shell.open(repository.url)
  }, [])

  return (
    <Tooltip title="查看源码">
      <Button title={import.meta.env.VITE_COMMIT} icon={<GithubOutlined />} onClick={onClick} href={repository.url} size="small" type="text" target="__blank" />
    </Tooltip>
  )
}
