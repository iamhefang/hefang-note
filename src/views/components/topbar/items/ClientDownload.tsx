import { AppleFilled, DownloadOutlined, WindowsFilled } from "@ant-design/icons"
import { Button, Modal, Space, Tooltip } from "antd"
import { useCallback, useState } from "react"

import IconLinux from "~/views/icons/linux.svg"

import pkg from "^/package.json"

const urls = {
  macos: `https://github.com/iamhefang/hefang-note/releases/download/v${pkg.version}/_${pkg.version}_x64.dmg`,
  windows: `https://github.com/iamhefang/hefang-note/releases/download/v${pkg.version}/_${pkg.version}_x64_zh-CN.msi`,
}

export default function ClientDownload() {
  const [open, setOpen] = useState(false)
  const onClick = useCallback(() => {
    setOpen(!open)
  }, [open])

  return (
    <>
      <Tooltip title="下载客户端" placement="bottomLeft">
        <Button type="text" size="small" icon={<DownloadOutlined />} onClick={onClick} />
      </Tooltip>
      <Modal title={`下载${pkg.productName}客户端`} open={open} width={400} footer={null} destroyOnClose onCancel={onClick}>
        <Space style={{ width: "100%", justifyContent: "space-between", marginTop: 15, marginBottom: 15 }}>
          <Space direction="vertical" align="center" size="large">
            <AppleFilled style={{ fontSize: 80 }} />
            <Button href={urls.macos}>MacOS</Button>
          </Space>
          <Space direction="vertical" align="center" size="large">
            <WindowsFilled style={{ fontSize: 80 }} />
            <Button href={urls.windows}>Windows</Button>
          </Space>
          <Space direction="vertical" align="center" size="large">
            <span style={{ fontSize: 80 }} className="anticon">
              <IconLinux />
            </span>
            <Button>敬请期待</Button>
          </Space>
        </Space>
      </Modal>
    </>
  )
}
