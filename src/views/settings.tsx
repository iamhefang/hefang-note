import { SettingOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { Empty, Form, Modal, Space, Tabs, TabsProps } from "antd"
import { useCallback, useEffect, useMemo } from "react"

import { isInClient } from "~/consts"
import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/uiSlice"

import { PluginManager } from "$components/plugins"
import PluginSettingForm from "$components/settings/PluginSettingForm"
import SettingForm from "$components/settings/SettingForm"
import usePluginSettings from "$components/settings/usePluginSettings"
import { useSettings, useStates } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import usePlugins from "$plugin/hooks/usePlugins"

export default function SettingsModal() {
    const {
        lock: { locked },
    } = useSettings()
    const t = useTranslate()
    const { showSettingsModal } = useStates()
    const dispatch = useAppDispatch()
    const plugins = usePlugins()
    const onCancel = useCallback(() => {
        dispatch(toggleSettingsModal(null))
    }, [dispatch])
    useEffect(() => {
        if (!isInClient) {
            return
        }
        const unlisten = appWindow.listen("toggleSettingsModal", (event) => {
            if (!locked) {
                dispatch(toggleSettingsModal(null))
            }
        })

        return () => {
            unlisten.then((callback) => callback()).catch(console.error)
        }
    }, [dispatch, locked, showSettingsModal])
    usePluginSettings()
    const pluginItems = useMemo<TabsProps["items"]>(() => {
        return plugins.map(plugin => {
            if (!plugin.abilities?.includes("settings")) {
                return null
            }
            if (!plugin.settings) {
                return {
                    key: plugin.id,
                    label: plugin.name,
                    children: <Empty />,
                }
            }
 
            return {
                key: plugin.id,
                label: plugin.settings.name ?
                    <span title={`${plugin.name}提供的配置项`}>{plugin.settings.name}</span> : plugin.name,
                children: <PluginSettingForm plugin={plugin} key={`settings-${plugin.id}`} />,
            }
        }).filter(item => !!item) as TabsProps["items"]
    }, [plugins])

    return (
        <Modal
            title={
                <Space>
                    <SettingOutlined />
                    <span>{t("首选项")}</span>
                </Space>
            }
            destroyOnClose
            footer={null}
            maskClosable={false}
            open={showSettingsModal && !locked}
            onCancel={onCancel}
            width="90%"
            style={{
                maxWidth: isInClient ? 1000 : 800,
                top: "calc(var(--top-bar-height) + 10px)",
            }}
        >
            {isInClient ? <Tabs
                tabPosition="left"
                items={[
                    {
                        key: "settings",
                        label: t("设置"),
                        children: <SettingForm />,
                    },
                    {
                        key: "plugins",
                        label: t("插件管理"),
                        children: <PluginManager />,
                    },
                    ...(pluginItems ?? []),
                ]}
            /> : <SettingForm />}
        </Modal>
    )
}
