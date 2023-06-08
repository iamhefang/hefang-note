import {App, Button, Descriptions, Dropdown, MenuProps, Modal} from "antd"
import {useCallback, useEffect, useMemo} from "react"

import {isInClient, productName} from "~/consts"
import {useAppDispatch} from "~/redux"
import {toggleSettingsModal} from "~/redux/uiSlice"

import CommonMenuItem from "$components/menus/CommonMenuItem"
import {usePlatformType} from "$hooks/usePlatform"
import {useTranslate} from "$hooks/useTranslate"
import {shortcuts} from "$utils/shortcuts"
import {exitProcess} from "$utils/window"
import pkg from "^/package.json"
import logo from "^/src-tauri/icons/icon.png"



export default function AppLogo() {
    const dispatch = useAppDispatch()
    const t = useTranslate()
    const toggleSettings = useCallback(() => {
        dispatch(toggleSettingsModal(null))
    }, [dispatch])
    const osType = usePlatformType()
    const {modal} = App.useApp()
    const showAboutModal = useCallback(() => {
        Modal.destroyAll()
        modal.info({
            title: `关于${pkg.productName}`,
            width: 500,
            content: (
                <Descriptions column={1} size="small">
                    <Descriptions.Item label={t("版本号")}>v{pkg.version}</Descriptions.Item>
                    <Descriptions.Item label={t("源码版本")}>{import.meta.env.VITE_COMMIT}</Descriptions.Item>
                    <Descriptions.Item label={t("平台")}>{osType}</Descriptions.Item>
                </Descriptions>
            ),
        })
    }, [modal, osType, t])
    useEffect(() => {
        if (!isInClient) {
            return
        }

        shortcuts.register({shortcut: "Ctrl+,", handler: toggleSettings})
        shortcuts.register({shortcut: "Ctrl+Q", handler: exitProcess})

        return () => {
            shortcuts.remove({shortcut: "Ctrl+,", handler: toggleSettings})
            shortcuts.remove({shortcut: "Ctrl+Q", handler: exitProcess})
        }
    }, [toggleSettings])

    const menuItems = useMemo<MenuProps["items"]>(() => {
        const items: MenuProps["items"] = [
            {
                key: "app-name",
                label: `关于${pkg.productName}`,
                onClick: showAboutModal,
            },
            {type: "divider"},
            {
                key: "menu-settings",
                label: <CommonMenuItem title="设置" shortcut="Ctrl+,"/>,
                onClick: toggleSettings,
            },
        ]

        if (isInClient) {
            items.push(
                {type: "divider"},
                {
                    key: "menu-quit",
                    label: <CommonMenuItem title="退出" shortcut="Ctrl+Q"/>,
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
                overlayStyle={{zIndex: 10000}}
                menu={{items: menuItems}}
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
