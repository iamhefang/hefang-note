import { Form, List, Select, Space, Switch } from "antd"
import { ReactNode, useMemo } from "react"

import usePlugins from "$hooks/usePlugins"

const fontSizeItems = ["12px", "14px", "16px", "18px", "20px", "22px"]
const fontFamilyMaps = {
  serif: "衬线字体",
  "sans-serif": "无衬线字体",
}
const lineHeights = [1, 1.2, 1.5]

export default function EditorSettings() {
  const allPlugins = usePlugins()
  const plugins = useMemo(() => {
    return allPlugins.filter((item) => item.components?.includes("Editor"))
  }, [allPlugins])

  const formItems: Record<string, ReactNode> = useMemo(
    () => ({
      要使用的编辑器: (
        <Form.Item name="editor" noStyle>
          <Select style={{ minWidth: 100 }}>
            <Select.Option value="default">默认编辑器</Select.Option>
            {plugins.map((p) => (
              <Select.Option key={`setting-form-editor-${p.id}`} value={p.id}>
                {p.Editor?.editorName || "未命名编辑器"} - {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
      编辑器上方显示时间: (
        <Form.Item name="showTimeAboveEditor" noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      ),
      字体: (
        <Space>
          <Form.Item name={["editorStyle", "fontFamily"]} noStyle>
            <Select style={{ width: 120 }}>
              <Select.Option key={"setting-form-editorStyle-fontFamily"} value="inherit">
                自动字体
              </Select.Option>
              {Object.entries(fontFamilyMaps).map(([value, label]) => (
                <Select.Option key={`settings-form-editorStyle-font-${value}`} value={value}>
                  <span style={{ fontFamily: value }}>{label}</span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={["editorStyle", "fontSize"]} noStyle>
            <Select>
              <Select.Option key={"setting-form-editorStyle-fontSize"} value="inherit">
                自动大小
              </Select.Option>
              {fontSizeItems.map((size) => (
                <Select.Option key={`setting-form-font-size-${size}`} value={size}>
                  <span style={{ fontSize: size }}>{size}</span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
      ),
      行高: (
        <Form.Item name={["editorStyle", "lineHeight"]} noStyle>
          <Select>
            {lineHeights.map((value) => (
              <Select.Option value={value} key={`line-height-${value}`}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    }),
    [plugins],
  )

  return (
    <List style={{ width: "100%" }}>
      {Object.entries(formItems).map(([label, dom]) => (
        <List.Item extra={dom} key={`form-label-${label}`}>
          {label}
        </List.Item>
      ))}
    </List>
  )
}
