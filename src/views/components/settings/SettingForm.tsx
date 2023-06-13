import {EditOutlined, HomeOutlined, KeyOutlined, SafetyOutlined} from "@ant-design/icons"
import {Form, Segmented} from "antd"
import {ReactNode, useCallback, useMemo, useState} from "react"

import {useAppDispatch} from "~/redux"
import {setSettings} from "~/redux/settingSlice"
import type {Settings} from "~/types"

import useEditorSettings from "./useEditorSettings"
import useGeneralSettings from "./useGeneralSettings"
import useSafeSettings from "./useSafeSettings"
import useShortcutSettings from "./useShortcutSettings"

import SettingRenderer from "$components/settings/SettingRenderer"
import usePluginSettings from "$components/settings/usePluginSettings"
import {useSettings} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"

type SettingTypes = "general" | "editor" | "shortcut" | "plugin" | string | number

export default function SettingForm() {
    const [form] = Form.useForm()
    const settings = useSettings()
    const dispatch = useAppDispatch()
    const [active, setActive] = useState<SettingTypes>("general")
    const onValuesChange = useCallback(
        (changedValues: Partial<Settings>, values: Settings) => {
            setTimeout(() => dispatch(setSettings(changedValues)), 0)
        },
        [dispatch],
    )

    const generalSettings = useGeneralSettings()
    const editorSettings = useEditorSettings()
    const shortcutSettings = useShortcutSettings()
    const safeSettings = useSafeSettings()
    const pluginSettings = usePluginSettings()
    const t = useTranslate()

    const formItems: Record<SettingTypes, Record<string, ReactNode> | ReactNode> = useMemo(
        () => ({
            general: generalSettings,
            editor: editorSettings,
            shortcut: shortcutSettings,
            safe: safeSettings,
            plugin: pluginSettings,
        }),
        [editorSettings, generalSettings, pluginSettings, safeSettings, shortcutSettings],
    )
    const segmentedOptions = useMemo(() => {
        return [
            {label: t("通用"), value: "general", icon: <HomeOutlined/>},
            {label: t("安全"), value: "safe", icon: <SafetyOutlined/>},
            {label: t("编辑器"), value: "editor", icon: <EditOutlined/>},
            {label: t("快捷键"), value: "shortcut", icon: <KeyOutlined/>},
        ]
    }, [t])


    return (
        <Form
            form={form} layout="inline"
            onValuesChange={onValuesChange}
            style={{width: "100%"}}
            initialValues={settings}
        >
            <Segmented
                value={active}
                onChange={setActive}
                options={segmentedOptions}
            />
            <SettingRenderer formItems={formItems[active]}/>
        </Form>
    )
}

