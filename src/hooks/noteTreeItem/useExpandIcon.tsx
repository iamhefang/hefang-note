import { CaretRightOutlined } from "@ant-design/icons"
import { useMemo } from "react"

import { NoteItem } from "~/types"

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

    return <CaretRightOutlined rotate={expandItems[item.id] && !noteLocked ? 90 : 0} className={ss.expandIcon} />
  }, [expandItems, item.id, item.isLeaf, noteLocked])
}
