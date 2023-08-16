import { Form } from "antd"
import { IPlugin, Settings } from "hefang-note-types"
import { useCallback, useMemo } from "react"

import { useAppDispatch } from "~/redux"
import { setSettings } from "~/redux/settingSlice"

import SettingRenderer from "$components/settings/SettingRenderer"
import { useSettings } from "$hooks/useSelectors"

export type PluginSettingFormProps = {
  plugin: IPlugin
}
export default function PluginSettingForm({ plugin }: PluginSettingFormProps) {
  const [form] = Form.useForm()
  const settings = useSettings()
  const dispatch = useAppDispatch()
  const onValuesChange = useCallback(
    (changedValues: Partial<Settings>, values: Settings) => {
      console.info("插件配置变化", changedValues)
      setTimeout(() => dispatch(setSettings(changedValues)), 0)
    },
    [dispatch],
  )

  const formItems = useMemo(() => {
    if (!plugin.settings?.items) {
      return []
    }

    return Object.fromEntries(
      Object.entries(plugin.settings.items).map(([key, { label, ...itemProps }]) => [
        label,
        <Form.Item key={`${plugin.id}-${key}`} noStyle {...itemProps} name={[`plugin-${plugin.id}`, key]} />,
      ]),
    )
  }, [plugin.id, plugin.settings?.items])

  const SelfSetting = plugin.settings?.component

  return (
    <Form
      form={form}
      layout="inline"
      onValuesChange={onValuesChange}
      style={{ width: "100%" }}
      initialValues={settings}
    >
      {SelfSetting && <SelfSetting />}
      <SettingRenderer formItems={formItems} />
    </Form>
  )
}
