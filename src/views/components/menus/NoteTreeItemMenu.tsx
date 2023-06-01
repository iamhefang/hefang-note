import { Dropdown, DropdownProps, MenuProps } from "antd"
import React, { useCallback, useMemo } from "react"

import { NoteIndentItem } from "~/types"

import { useSettings, useStates } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"

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
  onOpenChange: DropdownProps["onOpenChange"]
}>

export const enum NoteTreeMenuKeys {
  delete = "delete",
  rename = "rename",
  newNote = "newNote",
  newDir = "newDir",
  lock = "lock",
  export = "export",
  exportPDF = "exportPDF",
  exportHTML = "exportHTML",
  exportMarkdown = "exportMarkdown",
}

export default function NoteTreeItemMenu({ children, onClick, onOpenChange }: NoteTreeItemMenuProps) {
  const { rightClickedItem: item } = useStates()
  const onMenuClick = useCallback(
    (info: MenuInfo) => {
      onClick?.(info, item)
      onOpenChange?.(false)
    },
    [onClick, onOpenChange, item],
  )
  const t = useTranslate()
  const { lockedContents } = useSettings()
  const items = useMemo<MenuProps["items"]>(() => {
    const menus: MenuProps["items"] = []
    if (!item) {
      return [
        { key: NoteTreeMenuKeys.newDir, label: t("新建目录") },
        { key: NoteTreeMenuKeys.newNote, label: t("新建笔记") },
      ]
    }
    if (item.isLeaf) {
      menus.push({
        key: NoteTreeMenuKeys.export,
        label: t("导出"),
        children: [
          { key: NoteTreeMenuKeys.exportPDF, label: "PDF" },
          { key: NoteTreeMenuKeys.exportHTML, label: "HTML" },
          { key: NoteTreeMenuKeys.exportMarkdown, label: "Markdown" },
        ],
      })
    } else {
      item.indent < 2 && menus.push({ key: NoteTreeMenuKeys.newDir, label: t("新建目录") })
      menus.push({ key: NoteTreeMenuKeys.newNote, label: t("新建笔记") })
    }
    if (menus.length) {
      menus.push({ type: "divider" })
    }
    menus.push({ key: NoteTreeMenuKeys.rename, label: t("重命名") }, { key: NoteTreeMenuKeys.delete, label: t("删除") })

    if (!item.indent) {
      if (menus.length) {
        menus.push({ type: "divider" })
      }
      menus.push({ key: NoteTreeMenuKeys.lock, label: lockedContents[item.id] ? t("取消锁定") : t("锁定") })
    }

    return menus
  }, [item, lockedContents, t])

  return (
    <Dropdown trigger={["contextMenu"]} menu={{ items, onClick: onMenuClick as never }} onOpenChange={onOpenChange}>
      {children}
    </Dropdown>
  )
}
