import { FileTextOutlined, FolderOpenOutlined, FolderOutlined } from "@ant-design/icons"
import { NoteItem } from "hefang-note-types"
import { useMemo } from "react"

import useNoteLocked from "$hooks/useNoteLocked"
import { useSettings } from "$hooks/useSelectors"

export default function useTreeItemIcon(item: NoteItem) {
  const { expandItems } = useSettings()
  const noteLocked = useNoteLocked(item.id)

  return useMemo(() => {
    if (item.isLeaf) {
      return <FileTextOutlined />
    }
    if (noteLocked || !expandItems[item.id]) {
      return <FolderOutlined />
    }

    return <FolderOpenOutlined />
  }, [expandItems, item.id, item.isLeaf, noteLocked])
}
