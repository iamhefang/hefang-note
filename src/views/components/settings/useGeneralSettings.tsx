import { Form, Select, SelectProps, Space, Switch } from "antd"
import { ReactNode, useMemo } from "react"

import { Locales, useTranslate } from "$hooks/useTranslate"
import { sortItems } from "$utils/sort"

export default function useGeneralSettings(): Record<string, ReactNode> {
  const t = useTranslate()
  const languageOptions = useMemo<SelectProps["options"]>(
    () => [{ label: "跟随系统 / Auto", value: "auto" }, ...Locales.map(({ name, keys: [key] }) => ({ label: name, value: key }))],
    [],
  )

  return useMemo(
    () => ({
      "多语言/Language": (
        <Form.Item noStyle name="language">
          <Select options={languageOptions} style={{ minWidth: 150 }} />
        </Form.Item>
      ),
      [t("排序方式")]: (
        <Space>
          <Form.Item name={["sort", "field"]} noStyle>
            <Select style={{ width: 120 }}>
              {sortItems.map(({ field, label }) => (
                <Select.Option key={`setting-form-sort-${field}`} value={field}>
                  按{label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={["sort", "type"]} noStyle>
            <Select>
              <Select.Option key={"setting-form-sort-asc"} value="asc">
                升序
              </Select.Option>
              <Select.Option key={"setting-form-sort-desc"} value="desc">
                降序
              </Select.Option>
            </Select>
          </Form.Item>
        </Space>
      ),
      [t("启动时自动检查更新")]: (
        <Form.Item noStyle name="autoCheckUpdate" valuePropName="checked">
          <Switch />
        </Form.Item>
      ),
    }),
    [languageOptions, t],
  )
}
