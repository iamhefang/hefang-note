import { MoreOutlined } from "@ant-design/icons"
import { Button, Col, Dropdown, Input, Row, Skeleton } from "antd"
import { debounce } from "lodash"
import { ChangeEvent, useCallback } from "react"

import NoteTree from "$components/tree/NoteTree"
import useSearchValue from "$hooks/useSearchValue"
import { useNotes, useStates } from "$hooks/useSelectors"
import useSiderBarTopMenuItems from "$hooks/useSiderBarTopMenuItems"
import { useTranslate } from "$hooks/useTranslate"

export default function SiderBar() {
  const { initializing } = useNotes()
  const { launching } = useStates()
  const [search, setSearch] = useSearchValue()

  const t = useTranslate()

  const menuItems = useSiderBarTopMenuItems()

  const onSearchChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target?.value)
    }, 200),
    [],
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
            disabled={!!launching}
          />
        </Col>
        <Col>
          <Dropdown trigger={["click"]} menu={{ items: menuItems }} disabled={!!launching}>
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
