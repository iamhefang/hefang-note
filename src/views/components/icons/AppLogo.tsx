import { register, unregister } from "@tauri-apps/api/globalShortcut"
import { App, Button, Descriptions, Dropdown, Modal } from "antd"
import { useCallback, useEffect } from "react"

import usePlatform from "~/hooks/usePlatform"
import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/stateSlice"
import CommonMenuItem from "~/views/components/menus/CommonMenuItem"
import logo from "~/views/icons/icon.png"

import pkg from "^/package.json"

export default function AppLogo() {
  const dispatch = useAppDispatch()
  const toggleSettings = useCallback(() => {
    dispatch(toggleSettingsModal(null))
  }, [dispatch])
  const osType = usePlatform()
  const { modal } = App.useApp()
  const showAboutModal = useCallback(() => {
    Modal.destroyAll()
    modal.info({
      title: `关于${pkg.productName}`,
      content: (
        <Descriptions column={1} size="small">
          <Descriptions.Item label="版本号">v{pkg.version}</Descriptions.Item>
          <Descriptions.Item label="操作系统">{osType}</Descriptions.Item>
        </Descriptions>
      ),
    })
  }, [modal, osType])
  useEffect(() => {
    void register("Ctrl+,", toggleSettings)
    void register("Ctrl+Q", window.close)

    return () => {
      void unregister("Ctrl+,")
      void unregister("Ctrl+Q")
    }
  }, [toggleSettings])

  return (
    <>
      <Dropdown
        trigger={["click", "contextMenu"]}
        menu={{
          items: [
            {
              key: "app-name",
              label: `关于${pkg.productName}`,
              onClick: showAboutModal,
            },
            //   { type: "divider" },
            { key: "menu-settings", label: <CommonMenuItem title="设置" shortcut="Ctrl+," />, onClick: toggleSettings },
            //   { type: "divider" },
            { key: "menu-quit", label: <CommonMenuItem title="退出" shortcut="Ctrl+Q" />, onClick: window.close },
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
