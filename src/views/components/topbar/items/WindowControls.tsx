import { appWindow } from "@tauri-apps/api/window"
import { theme } from "antd"
import { useCallback, useMemo } from "react"

import useMaximized from "~/hooks/useMaximized"
import WindowClose from "~/views/icons/window-close.svg"
import WindowMaximize from "~/views/icons/window-maximize.svg"
import WindowMinimize from "~/views/icons/window-minimum.svg"
import WindowRestore from "~/views/icons/window-restore.svg"

import ss from "./WindowControls.module.scss"

export default function WindowControls() {
  const {
    token: { colorTextBase },
  } = theme.useToken()
  const maximized = useMaximized()
  const minimize = useCallback(async () => appWindow.minimize(), [])
  const toggleMaximize = useCallback(
    async () => appWindow.toggleMaximize(),
    [],
  )

  return useMemo(() => {
    return (
      <div className={ss.root} style={{ color: colorTextBase }}>
        <button onClick={minimize}>
          <WindowMinimize />
        </button>
        <button onClick={toggleMaximize}>
          {maximized ? <WindowRestore /> : <WindowMaximize />}
        </button>
        <button onClick={window.close} className={ss.close}>
          <WindowClose />
        </button>
      </div>
    )
  }, [minimize, toggleMaximize, maximized, colorTextBase])
}
