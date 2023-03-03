import { Space } from "antd"
import { useMemo } from "react"
export type CommonMenuItemProps = {
  title: string
  shortcut?: string
}
export default function CommonMenuItem({ title, shortcut }: CommonMenuItemProps) {
  return useMemo(() => {
    return shortcut ? (
      <Space style={{ width: "100%", justifyContent: "space-between" }} size="large">
        <span>{title}</span>
        <span style={{ opacity: 0.5 }}>{shortcut}</span>
      </Space>
    ) : (
      <span>{title}</span>
    )
  }, [title, shortcut])
}
