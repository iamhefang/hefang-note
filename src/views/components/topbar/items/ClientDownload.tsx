import { DownloadOutlined } from "@ant-design/icons"
import { Button, Modal, Space, Tooltip } from "antd"
import { useCallback, useState } from "react"

import { clientUrls, productName } from "~/consts"

import Iconfont from "$components/icons/Iconfont"
import { useTranslate } from "$hooks/useTranslate"

export default function ClientDownload() {
  const [open, setOpen] = useState(false)
  const onClick = useCallback(() => {
    setOpen(!open)
  }, [open])
  const t = useTranslate()

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
        <Space style={{ width: "100%", justifyContent: "space-between", marginTop: 15 }}>
          <Space direction="vertical" align="center" size="large">
            <Iconfont type="macos" style={{ fontSize: 80 }} />
            <Button href={clientUrls["Darwin-x86_64"]}>MacOS</Button>
          </Space>
          <Space direction="vertical" align="center" size="large">
            <Iconfont type="windows" style={{ fontSize: 80 }} />
            <Button href={clientUrls["Windows_NT-x86_64"]}>Windows</Button>
          </Space>
          <Space direction="vertical" align="center" size="large">
            <Iconfont type="linux" style={{ fontSize: 80 }} />
            <Button>敬请期待</Button>
          </Space>
        </Space>
      </Modal>
    </>
  )
}
