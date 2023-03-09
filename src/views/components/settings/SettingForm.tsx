import { EditOutlined, HomeOutlined, KeyOutlined } from "@ant-design/icons"
import { Form, Segmented } from "antd"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import { useSettings } from "~/hooks/useSelectors"
import useSettingsLoader from "~/hooks/useSettingsLoader"
import type { Settings } from "~/types"
import { settingsStore } from "~/utils/database"

import EditorSettings from "./EditorSettings"
import GeneralSettings from "./GeneralSettings"
import ShortcutSettings from "./ShortcutSettings"

type SettingTypes = "general" | "editor" | "shortcut" | string | number

export default function SettingForm() {
  const [form] = Form.useForm()
  const settings = useSettings()
  const loadSettings = useSettingsLoader()
  const [active, setActive] = useState<SettingTypes>("general")
  const onValuesChange = useCallback(
    (changedValues: Partial<Settings>, values: Settings) => {
      settingsStore
        .setObject({
          ...changedValues,
          lock: { ...settings.lock, ...changedValues.lock },
          sort: { ...settings.sort, ...changedValues.sort },
          editorStyle: { ...settings.editorStyle, ...changedValues.editorStyle },
          shortcut: { ...settings.shortcut, ...changedValues.shortcut },
        })
        .then(loadSettings)
        .catch(console.error)
    },
    [loadSettings, settings.editorStyle, settings.lock, settings.shortcut, settings.sort],
  )

  useEffect(() => {
    form.setFieldsValue({ ...settings })
  }, [form, settings])

  const formItems: Record<SettingTypes, ReactNode> = useMemo(() => {
    return { general: <GeneralSettings />, editor: <EditorSettings />, shortcut: <ShortcutSettings /> }
  }, [])

  return (
    <Form form={form} layout="inline" onValuesChange={onValuesChange} style={{ width: "100%" }}>
      <Segmented
        value={active}
        onChange={setActive}
        options={[
          { label: "通用", value: "general", icon: <HomeOutlined /> },
          { label: "编辑器", value: "editor", icon: <EditOutlined /> },
          { label: "快捷键", value: "shortcut", icon: <KeyOutlined /> },
        ]}
      />
      {formItems[active]}
    </Form>
  )
}
