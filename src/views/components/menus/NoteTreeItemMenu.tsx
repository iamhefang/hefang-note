import { Dropdown, MenuProps } from "antd"
import React, { useCallback, useMemo } from "react"

import { NoteIndentItem, NoteItem } from "~/types"

export type MenuInfo = {
  key: NoteTreeMenuKeys
  keyPath: string[]
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
}
export type NoteTreeMenuOnClick = (info: MenuInfo, item: NoteIndentItem) => void
export type NoteTreeItemMenuProps = React.PropsWithChildren<{ onClick?: NoteTreeMenuOnClick; item: NoteIndentItem; indent: number }>

export const enum NoteTreeMenuKeys {
  delete = "delete",
  rename = "rename",
  newNote = "newNote",
  newDir = "newDir",
}

export default function NoteTreeItemMenu({ children, onClick, item, indent }: NoteTreeItemMenuProps) {
  const onMenuClick = useCallback((info: MenuInfo) => onClick?.(info, item), [item, onClick])
  const items: MenuProps["items"] = useMemo(() => {
    if (item.isLeaf) {
      return [
        { key: NoteTreeMenuKeys.rename, label: "重命名" },
        { key: NoteTreeMenuKeys.delete, label: "删除" },
      ]
    }

    return [
      indent >= 2 ? null : { key: NoteTreeMenuKeys.newDir, label: "新建目录" },
      { key: NoteTreeMenuKeys.newNote, label: "新建笔记" },
      { type: "divider" },
      { key: NoteTreeMenuKeys.rename, label: "重命名" },
      { key: NoteTreeMenuKeys.delete, label: "删除" },
    ] as MenuProps["items"]
  }, [indent, item.isLeaf])

  return (
    <Dropdown trigger={["contextMenu"]} menu={{ items, onClick: onMenuClick as never }}>
      {children}
    </Dropdown>
  )
}
