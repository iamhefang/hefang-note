import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useCallback, useMemo } from "react"

import useGlobalState from "~/hooks/useGlobalState"

export default function SiderBarToggle() {
  const [{ showSideBar }, setState] = useGlobalState()
  const onClick = useCallback(() => {
    setState({ showSideBar: !showSideBar })
  }, [showSideBar, setState])

  return useMemo(
    () => (
      <Button
        icon={showSideBar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        size="small"
        type="text"
        onClick={onClick}
        title={showSideBar ? "关闭侧边栏" : "打开侧边栏"}
      />
    ),
    [onClick, showSideBar],
  )
}
