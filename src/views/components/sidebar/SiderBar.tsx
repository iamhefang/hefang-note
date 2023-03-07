import { CheckOutlined, MoreOutlined } from "@ant-design/icons"
import { App, Button, Col, Dropdown, Empty, Input, MenuProps, Modal, Row, Skeleton, Space } from "antd"
import _ from "lodash"
import { useCallback, useMemo, useState } from "react"

import useContentLoader from "~/hooks/useContentLoader"
import useGlobalState from "~/hooks/useGlobalState"
import useNewModal from "~/hooks/useNewModal"
import useSettingsLoader from "~/hooks/useSettingsLoader"
import { NoteSort } from "~/types"
import { settingsStore } from "~/utils/database"
import { sortItems } from "~/utils/sort"
import { iconPlacehodler } from "~/views/components/icons/IconPlaceholder"
import { MenuInfo, NoteTreeMenuKeys } from "~/views/components/menus/NoteTreeItemMenu"
import NoteTree, { MemoedNoteTree } from "~/views/components/tree/NoteTree"

export default function SiderBar() {
  const [{ items, loading, sort }] = useGlobalState()
  const [search, setSearch] = useState<string>("")
  const loadSettings = useSettingsLoader()
  const { message, modal } = App.useApp()
  const loadContent = useContentLoader()
  const showModal = useNewModal()
  const createOnSortChange = useCallback(
    ({ field = sort.field, type = sort.type }: Partial<NoteSort>) => {
      return (info: MenuInfo) => {
        settingsStore.set("sort", { field, type }).then(loadSettings).catch(console.error)
      }
    },
    [loadSettings, sort.field, sort.type],
  )

  const menuItems: MenuProps["items"] = useMemo(
    () => [
      { key: NoteTreeMenuKeys.newDir, label: "新建目录", onClick: showModal as never },
      { key: NoteTreeMenuKeys.newNote, label: "新建笔记", onClick: showModal as never },
      { type: "divider" },
      {
        key: "sort-type",
        label: "排序方式",
        children: [
          ...sortItems.map(({ field, label }) => ({
            key: field,
            label,
            onClick: createOnSortChange({ field }),
            icon: sort.field === field ? <CheckOutlined /> : iconPlacehodler,
          })),
          { type: "divider" },
          {
            key: "desc",
            label: "最新的排在上面",
            icon: sort.type === "desc" ? <CheckOutlined /> : iconPlacehodler,
            onClick: createOnSortChange({ type: "desc" }),
          },
          {
            key: "asc",
            label: "最旧的排在上面",
            icon: sort.type === "asc" ? <CheckOutlined /> : iconPlacehodler,
            onClick: createOnSortChange({ type: "asc" }),
          },
        ] as MenuProps["items"],
      },
      { type: "divider" },
      {
        key: "export",
        label: "导出全部笔记",
        onClick: async () =>
          import("~/utils/plugin").then((res) => {
            void res.hefang.contens.export()
          }),
      },
      {
        key: "import",
        label: "导入笔记",
        onClick: async () =>
          import("~/utils/plugin").then((res) => {
            void res.hefang.contens.import().then((count) => {
              loadContent()
              modal.info({ title: `共导入${count}条数据` })
            })
          }),
      },
    ],
    [createOnSortChange, loadContent, modal, showModal, sort.field, sort.type],
  )

  return (
    <>
      <Row style={{ margin: 10 }} gutter={10} wrap={false}>
        <Col flex={1}>
          <Input.Search placeholder="搜索目录和标题" onSearch={setSearch} allowClear={true} />
        </Col>
        <Col>
          <Dropdown trigger={["click"]} menu={{ items: menuItems }}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Col>
      </Row>
      <Skeleton loading={loading} active={true} style={{ padding: 20 }}>
        <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100vh - 110px)" }}>
          <NoteTree search={search} />
        </div>
      </Skeleton>
    </>
  )
}
