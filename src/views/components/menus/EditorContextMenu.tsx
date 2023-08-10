import { Dropdown, MenuItemProps } from "antd"
import React from "react"

import CommonMenuItem from "./CommonMenuItem"
import { MenuKeys } from "./MenuKeys"

export default function EditorContextMenu({
  children,
  onClick,
}: React.PropsWithChildren<{
  onClick?: MenuItemProps["onClick"]
}>) {
  return (
    <Dropdown
      trigger={["contextMenu"]}
      menu={{
        onClick: ({ key }) => {
          switch (key as MenuKeys) {
            case MenuKeys.copy:
              const text = window.getSelection()?.toString()
              text && void navigator.clipboard.writeText(text)
              break
            default:
          }
        },
        items: [
          {
            label: <CommonMenuItem title="撤消" shortcut="⌘+Z" />,
            key: MenuKeys.undo,
          },
          {
            label: <CommonMenuItem title="恢复" shortcut="⌘+Shift+Z" />,
            key: MenuKeys.redo,
          },
          { type: "divider" },
          {
            label: <CommonMenuItem title="剪切" shortcut="⌘+X" />,
            key: MenuKeys.cut,
          },
          {
            label: <CommonMenuItem title="复制" shortcut="⌘+C" />,
            key: MenuKeys.copy,
          },
          {
            label: <CommonMenuItem title="粘贴" shortcut="⌘+V" />,
            key: MenuKeys.paste,
          },
          { type: "divider" },
          {
            label: <CommonMenuItem title="全选" shortcut="⌘+A" />,
            key: MenuKeys.selectAll,
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
