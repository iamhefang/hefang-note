import { MoreOutlined } from "@ant-design/icons"
import { Button, Col, Dropdown, Input, Row, Skeleton } from "antd"
import { debounce } from "lodash"
import { ChangeEvent, useMemo } from "react"

import NoteTree from "$components/tree/NoteTree"
import useSearchValue from "$hooks/useSearchValue"
import { useNotes } from "$hooks/useSelectors"
import useSiderBarTopMenuItems from "$hooks/useSiderBarTopMenuItems"
import { useTranslate } from "$hooks/useTranslate"

export default function SiderBar() {
  const { initializing } = useNotes()
  const [search, setSearch] = useSearchValue()

  const t = useTranslate()

  const menuItems = useSiderBarTopMenuItems()

  const onSearchChange = useMemo(
    () =>
      debounce((e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target?.value)
      }, 200),
    [setSearch],
  )

  return (
    <>
      <Row style={{ margin: 10 }} gutter={10} wrap={false}>
        <Col flex={1}>
          <Input
            name="search"
            placeholder={t("搜索目录和标题")}
            onChange={onSearchChange}
            allowClear={true}
            disabled={initializing}
          />
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
