import { Form, Select, Switch } from "antd"
import { ReactNode, useMemo } from "react"

import CkEditor from "$components/editor/CkEditor"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import usePlugins from "$plugin/hooks/usePlugins"

export default function useEditorSettings(): Record<string, ReactNode> {
  const allPlugins = usePlugins()
  const t = useTranslate()
  const plugins = useMemo(() => {
    return allPlugins.filter((item) => item.components?.includes("Editor"))
  }, [allPlugins])

  const { editor } = useSettings()

  const options = useMemo(() => {
    const editorComponent = plugins.find((plugin) => plugin.id === editor)?.Editor || CkEditor

    return Object.fromEntries(
      editorComponent.options?.map(({ label, name, ...props }) => {
        const itemName = name ? (Array.isArray(name) ? ["editorOptions", ...name] : ["editorOptions", name]) : undefined

        if (editor && editor !== "default" && itemName) {
          itemName.unshift(editor)
        }

        return [label, <Form.Item {...props} name={itemName} key={`${itemName?.join("-")}`} noStyle />]
      }) || [],
    )
  }, [editor, plugins])

  return useMemo(
    () => ({
      [t("要使用的编辑器")]: (
        <Form.Item name="editor" noStyle>
          <Select style={{ minWidth: 100 }}>
            <Select.Option value="default">{t("默认编辑器")}</Select.Option>
            {plugins.map((p) => (
              <Select.Option key={`setting-form-editor-${p.id}`} value={p.id}>
                {p.Editor?.editorName || "未命名编辑器"} - {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
      [t("显示当前笔记编辑时间")]: (
        <Form.Item name="showEditTime" noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      ),
      ...options,
    }),
    [options, plugins, t],
  )
}
