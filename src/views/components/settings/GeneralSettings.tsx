import { Form, FormInstance, Input, List, Select, Space, Switch } from "antd"
import { ReactNode, useMemo, useState } from "react"

import { useSettings } from "~/hooks/useSelectors"
import { sortItems } from "~/utils/sort"

export default function GeneralSettings() {
  const { lock } = useSettings()
  const [immediately, setImmediately] = useState(lock.immediately)
  const formItems: Record<string, ReactNode> = useMemo(
    () => ({
      排序方式: (
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
      锁定时不再弹窗提示: (
        <Space>
          {immediately && (
            <Form.Item name={["lock", "password"]} label="解锁密码" dependencies={["lockImmediately"]}>
              <Input.Password maxLength={6} placeholder="请输入解锁密码" style={{ width: 120 }} size="small" />
            </Form.Item>
          )}
          <Form.Item name={["lock", "immediately"]} valuePropName="checked" noStyle>
            <Switch onChange={setImmediately} />
          </Form.Item>
        </Space>
      ),
      启动时自动检查更新: (
        <Form.Item noStyle name="autoCheckUpdate" valuePropName="checked">
          <Switch />
        </Form.Item>
      ),
    }),
    [immediately],
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
