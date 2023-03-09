import { register, unregister } from "@tauri-apps/api/globalShortcut"
import { App, Button, Descriptions, Dropdown, Modal } from "antd"
import { useCallback, useEffect } from "react"

import { isInTauri } from "~/consts"
import usePlatform from "~/hooks/usePlatform"
import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/stateSlice"
import CommonMenuItem from "~/views/components/menus/CommonMenuItem"

import pkg from "^/package.json"
import logo from "^/src-tauri/icons/icon.png"

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
          <Descriptions.Item label="平台">{osType}</Descriptions.Item>
        </Descriptions>
      ),
    })
  }, [modal, osType])
  useEffect(() => {
    if (!isInTauri) {
      return
    }
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
        placement="bottomLeft"
        overlayStyle={{ zIndex: 10000 }}
        menu={{
          items: ["Linux", "Windows"].includes(osType)
            ? [
                {
                  key: "app-name",
                  label: `关于${pkg.productName}`,
                  onClick: showAboutModal,
                },
                { type: "divider" },
                { key: "menu-settings", label: <CommonMenuItem title="设置" shortcut="Ctrl+," />, onClick: toggleSettings },
                { type: "divider" },
                { key: "menu-quit", label: <CommonMenuItem title="退出" shortcut="Ctrl+Q" />, onClick: window.close },
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
