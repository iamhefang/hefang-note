import { GithubOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"

export default function Github() {
  return (
    <Tooltip title="查看源码">
      <Button icon={<GithubOutlined />} href="https://github.com/iamhefang/hefang-note" size="small" type="text" target="__blank" />
    </Tooltip>
  )
}
