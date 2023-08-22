import { CheckOutlined } from "@ant-design/icons"
import { App, MenuProps } from "antd"
import {
  NoteBackupRestoreDetail,
  NoteBackupRestoreEvent,
  NoteBackupRestoreType,
  NoteSort,
  PluginHookOccasion,
} from "hefang-note-types"
import { useCallback, useMemo } from "react"

import { useAppDispatch } from "~/redux"
import { setSort } from "~/redux/settingSlice"

import { iconPlacehodler } from "$components/icons/IconPlaceholder"
import { NoteTreeMenuKeys } from "$components/menus/NoteTreeItemMenu"
import useExportModal from "$hooks/modals/useExportModal"
import useImportModal from "$hooks/modals/useImportModal"
import useNewNoteDispatcher from "$hooks/noteTreeItem/useNewNoteDispatcher"
import useCurrent from "$hooks/useCurrent"
import useNoteParents from "$hooks/useNoteParents"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import { callPluginsHooks } from "$plugin/utils"
import { contentStore, notesStore } from "$utils/database"
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

  const showImportModal = useImportModal()
  const showExportModal = useExportModal()

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
        onClick: async () => {
          const notes = await notesStore.getAll()
          const contents = await contentStore.getObject()
          callPluginsHooks(
            "onContentExport",
            new NoteBackupRestoreEvent({
              detail: {
                type: NoteBackupRestoreType.backup,
                notes,
                contents,
              },
              occasion: PluginHookOccasion.before,
            }),
            (detail: NoteBackupRestoreDetail) => {
              void showExportModal(detail.notes, detail.contents)
            },
          )
        },
      },
      {
        key: "import",
        label: t("还原备份"),
        onClick: () => {
          showImportModal()
            .then(({ notes, contents }) => {
              callPluginsHooks(
                "onContentImport",
                new NoteBackupRestoreEvent({
                  detail: {
                    type: NoteBackupRestoreType.restore,
                    notes,
                    contents,
                  },
                  occasion: PluginHookOccasion.before,
                }),
                async (detail: NoteBackupRestoreDetail) => {
                  await notesStore.set(...detail.notes)
                  await contentStore.setObject(detail.contents)
                  modal.info({ title: t("共导入{count}条数据", { count: notes.length }) })
                },
              )
            })
            .catch(console.error)
        },
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
  }, [
    createOnSortChange,
    current,
    modal,
    newNoteDispatch,
    parents.length,
    showExportModal,
    showImportModal,
    sort.field,
    sort.type,
    t,
  ])
}
