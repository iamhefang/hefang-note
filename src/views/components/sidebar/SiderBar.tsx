import { CheckOutlined, MoreOutlined } from "@ant-design/icons"
import { App, Button, Col, Dropdown, Input, MenuProps, Row, Skeleton } from "antd"
import { useCallback, useMemo, useState } from "react"

import { useAppDispatch } from "~/redux"
import { setSort } from "~/redux/settingSlice"
import { NoteSort } from "~/types"

import { iconPlacehodler } from "$components/icons/IconPlaceholder"
import { NoteTreeMenuKeys } from "$components/menus/NoteTreeItemMenu"
import NoteTree from "$components/tree/NoteTree"
import useNewModal from "$hooks/useNewModal"
import { useNotes, useSettings } from "$hooks/useSelectors"
import { sortItems } from "$utils/sort"

export default function SiderBar() {
  const { initializing } = useNotes()
  const { sort } = useSettings()
  const { modal } = App.useApp()
  const [search, setSearch] = useState<string>("")
  const dispatch = useAppDispatch()
  const showModal = useNewModal()
  const createOnSortChange = useCallback((newSort: Partial<NoteSort>) => () => dispatch(setSort(newSort)), [dispatch])

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
              modal.info({ title: `共导入${count}条数据` })
            })
          }),
      },
    ],
    [createOnSortChange, modal, showModal, sort.field, sort.type],
  )

  return (
    <>
      <Row style={{ margin: 10 }} gutter={10} wrap={false}>
        <Col flex={1}>
          <Input.Search placeholder="搜索目录和标题" onSearch={setSearch} allowClear={true} disabled={initializing} />
        </Col>
        <Col>
          <Dropdown trigger={["click"]} menu={{ items: menuItems }} disabled={initializing}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Col>
      </Row>
      <Skeleton loading={initializing} active style={{ padding: 20 }}>
        <div style={{ overflow: "hidden", height: "calc(100vh - 110px)" }}>
          <NoteTree search={search} />
        </div>
      </Skeleton>
    </>
  )
}
