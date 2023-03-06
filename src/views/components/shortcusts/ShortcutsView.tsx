import { EditOutlined } from "@ant-design/icons"
import { Button, Input, Space, theme } from "antd"
import _ from "lodash"
import { CSSProperties, ReactNode, useCallback, useMemo, useState } from "react"

export type ShortcutsViewProps = {
  value?: string
  onChange?: (newValue: string) => void
  placeholder?: ReactNode
}

export default function ShortcutsView({ value, onChange, placeholder = <span>未设置</span> }: ShortcutsViewProps) {
  const { token } = theme.useToken()
  const [editing, setEditing] = useState<string | undefined>()
  const style = useMemo((): CSSProperties => {
    return {
      color: token.colorText,
      backgroundColor: token.colorBgBase,
      borderColor: token.colorBorder,
      boxShadow: `inset 0 -1px 0 ${token.colorBorder}`,
    }
  }, [token.colorBgBase, token.colorBorder, token.colorText])
  const items = useMemo(
    () =>
      value?.split("+").map((k) => (
        <kbd key={`${value}-${k}`} style={style}>
          {k}
        </kbd>
      )),
    [style, value],
  )

  const onEditClick = useCallback(() => {
    setEditing(value || "")
  }, [value])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === "Escape") {
        setEditing(undefined)

        return
      }
      if (e.key === "Enter") {
        editing && onChange?.(editing)
        setEditing(undefined)

        return
      }
      const keys: string[] = []
      e.metaKey && keys.push("Meta")
      e.ctrlKey && keys.push("Ctrl")
      e.shiftKey && keys.push("Shift")
      e.altKey && keys.push("Alt")
      e.key.length === 1 && keys.push(e.key.toUpperCase())
      setEditing(keys.join("+"))
    },
    [editing, onChange],
  )

  return _.isString(editing) ? (
    <Input size="small" placeholder="请按下快捷键" style={{ width: 200 }} onKeyDown={onKeyDown} value={editing} />
  ) : (
    <Space size="small">
      {items?.length ? items : placeholder}
      <Button icon={<EditOutlined />} type="text" size="small" onClick={onEditClick} />
    </Space>
  )
}
