import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useCallback, useMemo } from "react"

import { useAppDispatch } from "~/redux"
import { toggleSidebar } from "~/redux/settingSlice"

import { useSettings } from "$hooks/useSelectors"

export default function SiderBarToggle() {
  const { showSideBar } = useSettings()
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    dispatch(toggleSidebar(null))
  }, [dispatch])

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
