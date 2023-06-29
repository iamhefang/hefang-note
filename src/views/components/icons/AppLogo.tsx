import { Button, Dropdown, MenuProps } from "antd"
import { useCallback, useEffect, useMemo } from "react"

import { isInClient, productName } from "~/consts"
import { useAppDispatch } from "~/redux"
import { showSettingModal } from "~/redux/uiSlice"

import CommonMenuItem from "$components/menus/CommonMenuItem"
import { shortcuts } from "$utils/shortcuts"
import { exitProcess } from "$utils/window"
import pkg from "^/package.json"
import logo from "^/src-tauri/icons/icon.png"

export default function AppLogo() {
  const dispatch = useAppDispatch()
  const toggleSettings = useCallback(() => {
    dispatch(showSettingModal("settings"))
  }, [dispatch])
  const showAboutModal = useCallback(() => {
    dispatch(showSettingModal("about"))
  }, [dispatch])
  useEffect(() => {
    if (!isInClient) {
      return
    }

    shortcuts.register({ shortcut: "Ctrl+,", handler: toggleSettings })
    shortcuts.register({ shortcut: "Ctrl+Q", handler: exitProcess })

    return () => {
      shortcuts.remove({ shortcut: "Ctrl+,", handler: toggleSettings })
      shortcuts.remove({ shortcut: "Ctrl+Q", handler: exitProcess })
    }
  }, [toggleSettings])

  const menuItems = useMemo<MenuProps["items"]>(() => {
    const items: MenuProps["items"] = [
      {
        key: "app-name",
        label: `关于${pkg.productName}`,
        onClick: showAboutModal,
      },
      { type: "divider" },
      {
        key: "menu-settings",
        label: <CommonMenuItem title="设置" shortcut="Ctrl+," />,
        onClick: toggleSettings,
      },
    ]

    if (isInClient) {
      items.push(
        { type: "divider" },
        {
          key: "menu-quit",
          label: <CommonMenuItem title="退出" shortcut="Ctrl+Q" />,
          onClick: exitProcess,
        },
      )
    }

    return items
  }, [showAboutModal, toggleSettings])

  return (
    <>
      <Dropdown
        trigger={["click", "contextMenu"]}
        placement="bottomLeft"
        overlayStyle={{ zIndex: 10000 }}
        menu={{ items: menuItems }}
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
              alt={productName}
            />
          }
        />
      </Dropdown>
    </>
  )
}
