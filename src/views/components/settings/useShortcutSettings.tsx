import { Form } from "antd"
import { ReactNode, useMemo } from "react"

import { isInClient } from "~/consts"

import ShortcutsView from "$components/shortcusts/ShortcutsView"
import { useTranslate } from "$hooks/useTranslate"

export default function useShortcutSettings(): Record<string, ReactNode> {
  const t = useTranslate()

  return useMemo(() => {
    const shortcuts = {
      [t("锁定软件")]: (
        <Form.Item name={["shortcut", "lock"]} noStyle>
          <ShortcutsView />
        </Form.Item>
      ),
    }

    if (isInClient) {
      shortcuts[t("关闭窗口")] = (
        <Form.Item name={["shortcut", "closeWindow"]} noStyle>
          <ShortcutsView />
        </Form.Item>
      )
    }

    return shortcuts
  }, [t])
}
