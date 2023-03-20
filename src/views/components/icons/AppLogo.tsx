import { App, Button, Descriptions, Dropdown, Modal } from "antd"
import { useCallback, useEffect } from "react"

import { isInTauri } from "~/consts"
import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/uiSlice"

import CommonMenuItem from "$components/menus/CommonMenuItem"
import { usePlatformType } from "$hooks/usePlatform"
import { shortcuts } from "$utils/shortcuts"
import { closeWindow } from "$utils/window"
import pkg from "^/package.json"
import logo from "^/src-tauri/icons/icon.png"

export default function AppLogo() {
  const dispatch = useAppDispatch()
  const toggleSettings = useCallback(() => {
    dispatch(toggleSettingsModal(null))
  }, [dispatch])
  const osType = usePlatformType()
  const { modal } = App.useApp()
  const showAboutModal = useCallback(() => {
    Modal.destroyAll()
    modal.info({
      title: `关于${pkg.productName}`,
      width: 500,
      content: (
        <Descriptions column={1} size="small">
          <Descriptions.Item label="版本号">v{pkg.version}</Descriptions.Item>
          <Descriptions.Item label="源码版本">{import.meta.env.VITE_COMMIT}</Descriptions.Item>
          <Descriptions.Item label="平台">{osType}</Descriptions.Item>
        </Descriptions>
      ),
    })
  }, [modal, osType])
  useEffect(() => {
    if (!isInTauri) {
      return
    }

    shortcuts.register({ shortcut: "Ctrl+,", handler: toggleSettings })
    shortcuts.register({ shortcut: "Ctrl+Q", handler: closeWindow })

    return () => {
      shortcuts.remove({ shortcut: "Ctrl+,", handler: toggleSettings })
      shortcuts.remove({ shortcut: "Ctrl+Q", handler: closeWindow })
    }
  }, [toggleSettings])

  return (
    <>
      <Dropdown
        trigger={["click", "contextMenu"]}
        placement="bottomLeft"
        overlayStyle={{ zIndex: 10000 }}
        menu={{
          items: ["Linux", "Windows_NT"].includes(osType)
            ? [
                {
                  key: "app-name",
                  label: `关于${pkg.productName}`,
                  onClick: showAboutModal,
                },
                { type: "divider" },
                { key: "menu-settings", label: <CommonMenuItem title="设置" shortcut="Ctrl+," />, onClick: toggleSettings },
                { type: "divider" },
                { key: "menu-quit", label: <CommonMenuItem title="退出" shortcut="Ctrl+Q" />, onClick: closeWindow },
              ]
            : [
                {
                  key: "app-name",
                  label: `关于${pkg.productName}`,
                  onClick: showAboutModal,
                },
              ],
        }}
      >
        <Button
          type="text"
          size="small"
          className="center"
          icon={
            <img
              src={logo}
              style={{
                height: "100%",
                width: "100%",
                pointerEvents: "none",
              }}
            />
          }
        />
      </Dropdown>
    </>
  )
}
