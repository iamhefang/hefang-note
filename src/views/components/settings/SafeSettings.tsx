import { Form, Input, List, Space, Switch } from "antd"
import { ReactNode, useMemo, useState } from "react"
import { useSettings } from "~/hooks/useSelectors"

export default function SafeSettings() {
  const { lock } = useSettings()
  const [immediately, setImmediately] = useState(lock.immediately)
  const formItems: Record<string, ReactNode> = useMemo(
    () => ({
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
