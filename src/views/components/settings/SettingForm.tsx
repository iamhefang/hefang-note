import { EditOutlined, HomeOutlined } from "@ant-design/icons"
import { Form, Segmented } from "antd"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import useSettingsLoader from "~/hooks/useSettingsLoader"
import type { Settings } from "~/types"
import { settingsStore } from "~/utils/database"
import EditorSettings from "./EditorSettings"
import GeneralSettings from "./GeneralSettings"

type SettingTypes = "general" | "editor" | string | number

export default function SettingForm() {
  const [form] = Form.useForm()
  const [{ loading, launching, showSettingModal, renaming, ...settings }, setState] = useGlobalState()
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
        })
        .then(loadSettings)
        .catch(console.error)
    },
    [loadSettings, settings.editorStyle, settings.lock, settings.sort],
  )

  useEffect(() => {
    form.setFieldsValue({ ...settings })
  }, [form, settings])

  const formItems: Record<SettingTypes, ReactNode> = useMemo(() => {
    return { general: <GeneralSettings />, editor: <EditorSettings /> }
  }, [])

  return (
    <Form form={form} layout="inline" onValuesChange={onValuesChange} style={{ width: "100%" }}>
      <Segmented
        value={active}
        onChange={setActive}
        options={[
          { label: "通用", value: "general", icon: <HomeOutlined /> },
          { label: "编辑器", value: "editor", icon: <EditOutlined /> },
        ]}
      />
      {formItems[active]}
    </Form>
  )
}
