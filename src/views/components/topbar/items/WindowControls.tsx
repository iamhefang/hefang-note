import { appWindow } from "@tauri-apps/api/window"
import { theme } from "antd"
import { useCallback, useMemo } from "react"

import ss from "./WindowControls.module.scss"

import Iconfont from "$components/icons/Iconfont"
import useMaximized from "$hooks/useMaximized"
import { closeWindow } from "$utils/window"

export default function WindowControls() {
  const {
    token: { colorTextBase },
  } = theme.useToken()
  const maximized = useMaximized()
  const minimize = useCallback(async () => appWindow.minimize(), [])
  const toggleMaximize = useCallback(async () => appWindow.toggleMaximize(), [])

  return useMemo(() => {
    return (
      <div className={ss.root} style={{ color: colorTextBase }}>
        <button onClick={minimize}>
          <Iconfont type="window-minimum" />
        </button>
        <button onClick={toggleMaximize}>
          {maximized ? <Iconfont type="window-maximize" /> : <Iconfont type="window-restore" />}
        </button>
        <button onClick={closeWindow} className={ss.close}>
          <Iconfont type="window-close" />
        </button>
      </div>
    )
  }, [minimize, toggleMaximize, maximized, colorTextBase])
}
