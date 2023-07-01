import { Button, Dropdown, MenuProps } from "antd"
import { useCallback, useEffect, useMemo } from "react"

import { isInClient, productName } from "~/consts"
import { useAppDispatch } from "~/redux"
import { showSettingModal } from "~/redux/uiSlice"
import { UIState } from "~/types"

import CommonMenuItem from "$components/menus/CommonMenuItem"
import { useTranslate } from "$hooks/useTranslate"
import { shortcuts } from "$utils/shortcuts"
import { exitProcess } from "$utils/window"
import pkg from "^/package.json"
import logo from "^/src-tauri/icons/icon.png"

export default function AppLogo() {
  const dispatch = useAppDispatch()
  const t = useTranslate()
  const showModal = useCallback((type: UIState["showSettingsModal"]) => dispatch(showSettingModal(type)), [dispatch])
  const toggleSettings = useCallback(() => {
    dispatch(showSettingModal("settings"))
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
        onClick: () => showModal("about"),
      },
      { type: "divider" },
      {
        key: "menu-plugin",
        label: <CommonMenuItem title={t("插件")} />,
        onClick: () => showModal("plugins"),
      },
      {
        key: "menu-settings",
        label: <CommonMenuItem title={t("设置")} shortcut="Ctrl+," />,
        onClick: () => showModal("settings"),
      },
    ]

    if (isInClient) {
      items.push(
        { type: "divider" },
        {
          key: "menu-quit",
          label: <CommonMenuItem title={t("退出")} shortcut="Ctrl+Q" />,
          onClick: exitProcess,
        },
      )
    }

    return items
  }, [showModal, t])

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
