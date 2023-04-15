import { EditOutlined, HomeOutlined, KeyOutlined, SafetyOutlined } from "@ant-design/icons"
import { Form, List, Segmented } from "antd"
import { ReactNode, useCallback, useMemo, useState } from "react"

import { useAppDispatch } from "~/redux"
import { setSettings } from "~/redux/settingSlice"
import type { Settings } from "~/types"

import useEditorSettings from "./useEditorSettings"
import useGeneralSettings from "./useGeneralSettings"
import useSafeSettings from "./useSafeSettings"
import useShortcutSettings from "./useShortcutSettings"

import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"

type SettingTypes = "general" | "editor" | "shortcut" | string | number

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
  const t = useTranslate()

  const formItems: Record<SettingTypes, Record<string, ReactNode>> = useMemo(
    () => ({
      general: generalSettings,
      editor: editorSettings,
      shortcut: shortcutSettings,
      safe: safeSettings,
    }),
    [editorSettings, generalSettings, safeSettings, shortcutSettings],
  )

  return (
    <Form form={form} layout="inline" onValuesChange={onValuesChange} style={{ width: "100%" }} initialValues={settings}>
      <Segmented
        value={active}
        onChange={setActive}
        options={[
          { label: t("通用"), value: "general", icon: <HomeOutlined /> },
          { label: t("安全"), value: "safe", icon: <SafetyOutlined /> },
          { label: t("编辑器"), value: "editor", icon: <EditOutlined /> },
          { label: t("快捷键"), value: "shortcut", icon: <KeyOutlined /> },
        ]}
      />
      <List style={{ width: "100%" }}>
        {Object.entries(formItems[active]).map(([label, dom]) => (
          <List.Item extra={dom} key={`form-label-${label}`}>
            {label}
          </List.Item>
        ))}
      </List>
    </Form>
  )
}
