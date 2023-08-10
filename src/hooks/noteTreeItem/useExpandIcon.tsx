import { CaretRightOutlined } from "@ant-design/icons"
import { NoteItem } from "hefang-note-types"
import { useMemo } from "react"

import ss from "./noteTreeItem.module.scss"

import { iconPlacehodler } from "$components/icons/IconPlaceholder"
import useNoteLocked from "$hooks/useNoteLocked"
import { useSettings } from "$hooks/useSelectors"

export default function useExpandIcon(item: NoteItem) {
  const { expandItems } = useSettings()
  const noteLocked = useNoteLocked(item.id)

  return useMemo(() => {
    if (item.isLeaf) {
      return iconPlacehodler
    }

    return (
      <CaretRightOutlined
        rotate={expandItems[item.id] && !noteLocked ? 90 : 0}
        className={ss.expandIcon}
        key={item.id}
      />
    )
  }, [expandItems, item.id, item.isLeaf, noteLocked])
}
