import { EditOutlined, HomeOutlined, KeyOutlined, SafetyOutlined } from "@ant-design/icons"
import { Form, Segmented } from "antd"
import { ReactNode, useCallback, useMemo, useState } from "react"

import { useAppDispatch } from "~/redux"
import { setSettings } from "~/redux/settingSlice"
import type { Settings } from "~/types"

import EditorSettings from "./EditorSettings"
import GeneralSettings from "./GeneralSettings"
import SafeSettings from "./SafeSettings"
import ShortcutSettings from "./ShortcutSettings"

import { useSettings } from "$hooks/useSelectors"

type SettingTypes = "general" | "editor" | "shortcut" | string | number

export default function SettingForm() {
  const [form] = Form.useForm()
  const settings = useSettings()
  const dispatch = useAppDispatch()
  const [active, setActive] = useState<SettingTypes>("general")
  const onValuesChange = useCallback(
    (changedValues: Partial<Settings>, values: Settings) => {
      setTimeout(() => {
        dispatch(setSettings(changedValues))
      }, 0)
    },
    [dispatch],
  )

  const formItems: Record<SettingTypes, ReactNode> = useMemo(
    () => ({
      general: <GeneralSettings />,
      editor: <EditorSettings />,
      shortcut: <ShortcutSettings />,
      safe: <SafeSettings />,
    }),
    [],
  )

  return (
    <Form form={form} layout="inline" onValuesChange={onValuesChange} style={{ width: "100%" }} initialValues={settings}>
      <Segmented
        value={active}
        onChange={setActive}
        options={[
          { label: "通用", value: "general", icon: <HomeOutlined /> },
          { label: "安全", value: "safe", icon: <SafetyOutlined /> },
          { label: "编辑器", value: "editor", icon: <EditOutlined /> },
          { label: "快捷键", value: "shortcut", icon: <KeyOutlined /> },
        ]}
      />
      {formItems[active]}
    </Form>
  )
}
