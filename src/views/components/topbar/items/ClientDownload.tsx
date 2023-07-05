import { DownloadOutlined } from "@ant-design/icons"
import { Button, Modal, Space, Tooltip } from "antd"
import { isEmpty } from "lodash"
import { useCallback, useEffect, useState } from "react"

import { productName, serverHost } from "~/consts"

import { useTranslate } from "$hooks/useTranslate"

export default function ClientDownload() {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<{
    platforms: Record<string, { installerUrl: string; platformName: string }>
  }>()
  const onClick = useCallback(() => {
    setOpen(!open)
  }, [open])
  const t = useTranslate()
  useEffect(() => {
    fetch(`${serverHost}/api/v1/release/latest`)
      .then(async (res) => res.json())
      .then(setClients)
      .catch(console.error)
  }, [])

  if (isEmpty(clients?.platforms)) {
    return null
  }

  return (
    <>
      <Tooltip title={t("下载客户端")} placement="bottomLeft">
        <Button type="text" size="small" icon={<DownloadOutlined />} onClick={onClick} />
      </Tooltip>
      <Modal
        title={
          <Space>
            <DownloadOutlined />
            {t("下载{productName}客户端", { productName })}
          </Space>
        }
        open={open}
        width={400}
        footer={null}
        destroyOnClose
        onCancel={onClick}
      >
        <ul>
          {Object.entries(clients?.platforms ?? {}).map(([platform, { installerUrl, platformName }]) => (
            <li key={platform}>
              <a href={installerUrl} target="__blank">
                {platformName}
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
