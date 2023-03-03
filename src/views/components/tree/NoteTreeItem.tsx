import { CaretDownOutlined, CaretRightOutlined, FileTextOutlined, FolderOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { App, Col, Input, Row, theme } from "antd"
import { useCallback, useMemo } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import { NoteItem } from "~/types"
import NoteTreeItemMenu, { MenuInfo } from "~/views/components/menus/NoteTreeItemMenu"

import ss from "./NoteTree.module.scss"

export type NoteTreeItemProps = {
  item: NoteItem
  onMenuClick: (info: MenuInfo, item: NoteItem) => void
  onClick: (item: NoteItem) => void
  indent?: number
}
export default function NoteTreeItem({ item, onMenuClick, onClick, indent = 0 }: NoteTreeItemProps) {
  const [{ current, renaming, expandItems }, setState] = useGlobalState()
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const expandIcon = useMemo(() => {
    if (item.isLeaf) {
      return <span style={{ display: "inline-block", width: 14, height: 14 }} />
    }

    return expandItems[item.id] ? <CaretDownOutlined /> : <CaretRightOutlined />
  }, [expandItems, item.id, item.isLeaf])
  const onRenamingBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newName = e.currentTarget.value
      if (!newName) {
        void message.warning("名称不为能空")
      }
      setState({ renaming: "" })
    },
    [message, setState],
  )

  const onItemClick = useCallback(() => {
    onClick?.(item)
  }, [item, onClick])

  return (
    <NoteTreeItemMenu onClick={onMenuClick} item={item} indent={0}>
      <Row
        wrap={false}
        gutter={10}
        className={ss.item}
        onClick={onItemClick}
        data-active={current === item.id}
        style={{ background: current === item.id ? token.colorPrimaryActive : "none" }}
      >
        <Col offset={indent}>{expandIcon}</Col>
        <Col>{item.isLeaf ? <FileTextOutlined /> : <FolderOutlined />}</Col>
        <Col flex={1}>
          {renaming === item.id ? (
            <Input key={`rename-input-${item.id}`} autoFocus size="small" placeholder={item.title} defaultValue={item.title} onBlur={onRenamingBlur} />
          ) : (
            item.title
          )}
        </Col>
        <Col>{item.isLeaf || <PlusCircleOutlined className={ss.newDir} />}</Col>
      </Row>
    </NoteTreeItemMenu>
  )
}
