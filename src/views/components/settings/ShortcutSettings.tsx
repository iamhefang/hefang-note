import { Form, List, Space } from "antd"
import { ReactNode, useMemo } from "react"

import ShortcutsView from "~/views/components/shortcusts/ShortcutsView"

export default function ShortcutSettings() {
  const formItems: Record<string, ReactNode> = useMemo(
    () => ({
      锁定软件: (
        <Form.Item name={["shortcut", "lock"]} noStyle>
          <ShortcutsView />
        </Form.Item>
      ),
    }),
    [],
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
