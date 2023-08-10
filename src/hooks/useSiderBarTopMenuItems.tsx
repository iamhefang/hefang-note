import { CheckOutlined } from "@ant-design/icons"
import { App, MenuProps } from "antd"
import { NoteSort } from "hefang-note-types"
import { useCallback, useMemo } from "react"

import { useAppDispatch } from "~/redux"
import { setSort } from "~/redux/settingSlice"

import { iconPlacehodler } from "$components/icons/IconPlaceholder"
import { NoteTreeMenuKeys } from "$components/menus/NoteTreeItemMenu"
import useNewNoteDispatcher from "$hooks/noteTreeItem/useNewNoteDispatcher"
import useCurrent from "$hooks/useCurrent"
import useNoteParents from "$hooks/useNoteParents"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import { sortItems } from "$utils/sort"

export default function useSiderBarTopMenuItems() {
  const dispatch = useAppDispatch()
  const current = useCurrent()
  const { modal } = App.useApp()
  const t = useTranslate()
  const { sort } = useSettings()
  const createOnSortChange = useCallback((newSort: Partial<NoteSort>) => () => dispatch(setSort(newSort)), [dispatch])
  const newNoteDispatch = useNewNoteDispatcher(current?.isLeaf ? current?.parentId : current?.id)
  const parents = useNoteParents(current?.id)

  return useMemo<MenuProps["items"]>(() => {
    const items: MenuProps["items"] = [
      {
        key: NoteTreeMenuKeys.newNote,
        label: t("新建笔记"),
        onClick: () => newNoteDispatch(true),
      },
      { type: "divider" },
      {
        key: "sort-type",
        label: t("排序方式"),
        children: [
          ...sortItems.map(({ field, label }) => ({
            key: field,
            label: t(label),
            onClick: createOnSortChange({ field }),
            icon: sort.field === field ? <CheckOutlined /> : iconPlacehodler,
          })),
          { type: "divider" },
          {
            key: "desc",
            label: t("最新的排在上面"),
            icon: sort.type === "desc" ? <CheckOutlined /> : iconPlacehodler,
            onClick: createOnSortChange({ type: "desc" }),
          },
          {
            key: "asc",
            label: t("最旧的排在上面"),
            icon: sort.type === "asc" ? <CheckOutlined /> : iconPlacehodler,
            onClick: createOnSortChange({ type: "asc" }),
          },
        ] as MenuProps["items"],
      },
      { type: "divider" },
      {
        key: "export",
        label: t("备份笔记"),
        onClick: async () =>
          import("$utils/plugin").then((res) => {
            void res.hefang.contens.export()
          }),
      },
      {
        key: "import",
        label: t("还原备份"),
        onClick: async () =>
          import("$utils/plugin").then((res) => {
            void res.hefang.contens.import().then((count) => {
              modal.info({ title: t("共导入{count}条数据", { count }) })
            })
          }),
      },
    ]

    if (!current || parents.length < 2) {
      items.unshift({
        key: NoteTreeMenuKeys.newDir,
        label: t("新建目录"),
        onClick: () => newNoteDispatch(false),
      })
    }

    return items
  }, [createOnSortChange, current, modal, newNoteDispatch, parents.length, sort.field, sort.type, t])
}
