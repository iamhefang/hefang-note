import { Form, List } from "antd"
import { ReactNode, useMemo } from "react"

import ShortcutsView from "$components/shortcusts/ShortcutsView"

export default function useShortcutSettings(): Record<string, ReactNode> {
  return useMemo(
    () => ({
      锁定软件: (
        <Form.Item name={["shortcut", "lock"]} noStyle>
          <ShortcutsView />
        </Form.Item>
      ),
      关闭窗口: (
        <Form.Item name={["shortcut", "closeWindow"]} noStyle>
          <ShortcutsView />
        </Form.Item>
      ),
    }),
    [],
  )
}
