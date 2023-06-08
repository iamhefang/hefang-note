import {SettingOutlined} from "@ant-design/icons"
import {appWindow} from "@tauri-apps/api/window"
import {Modal, Space, Tabs} from "antd"
import {useCallback, useEffect} from "react"

import {isInClient} from "~/consts"
import {useAppDispatch} from "~/redux"
import {toggleSettingsModal} from "~/redux/uiSlice"

import {PluginManager} from "$components/plugins"
import SettingForm from "$components/settings/SettingForm"
import {useSettings, useStates} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"

export default function SettingsModal() {
    const {
        lock: {locked},
    } = useSettings()
    const t = useTranslate()
    const {showSettingsModal} = useStates()
    const dispatch = useAppDispatch()
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

    return (
        <Modal
            title={
                <Space>
                    <SettingOutlined/>
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
                        children: <SettingForm/>,
                    },
                    {
                        key: "plugins",
                        label: t("插件"),
                        children: <PluginManager/>,
                    },
                ]}
            /> : <SettingForm/>}
        </Modal>
    )
}
