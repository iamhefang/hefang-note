import { Dropdown, DropdownProps, MenuProps } from "antd"
import React, { useCallback, useMemo } from "react"
import { useSettings } from "~/hooks/useSelectors"

import { NoteIndentItem } from "~/types"

export type MenuInfo = {
  key: NoteTreeMenuKeys
  keyPath: string[]
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
}
export type NoteTreeMenuOnClick = (info: MenuInfo, item?: NoteIndentItem) => void
export type NoteTreeItemMenuProps = React.PropsWithChildren<{
  onClick?: NoteTreeMenuOnClick
  item?: NoteIndentItem
  onOpenChange: DropdownProps["onOpenChange"]
}>

export const enum NoteTreeMenuKeys {
  delete = "delete",
  rename = "rename",
  newNote = "newNote",
  newDir = "newDir",
  lock = "lock",
}

export default function NoteTreeItemMenu({ children, onClick, item, onOpenChange }: NoteTreeItemMenuProps) {
  const onMenuClick = useCallback((info: MenuInfo) => onClick?.(info, item), [item, onClick])
  const { lockedContents } = useSettings()
  const items: MenuProps["items"] = useMemo(() => {
    const _items: MenuProps["items"] = []
    if (!item) {
      return [
        { key: NoteTreeMenuKeys.newDir, label: "新建目录" },
        { key: NoteTreeMenuKeys.newNote, label: "新建笔记" },
      ]
    }
    if (!item.isLeaf) {
      item.indent < 2 && _items.push({ key: NoteTreeMenuKeys.newDir, label: "新建目录" })
      _items.push({ key: NoteTreeMenuKeys.newNote, label: "新建笔记" })
    }

    _items.push({ key: NoteTreeMenuKeys.rename, label: "重命名" }, { key: NoteTreeMenuKeys.delete, label: "删除" })

    if (!item.indent) {
      _items.push({ type: "divider" }, { key: NoteTreeMenuKeys.lock, label: lockedContents[item.id] ? "取消锁定" : "锁定" })
    }

    return _items
  }, [item, lockedContents])

  return (
    <Dropdown trigger={["contextMenu"]} menu={{ items, onClick: onMenuClick as never }} onOpenChange={onOpenChange}>
      {children}
    </Dropdown>
  )
}
