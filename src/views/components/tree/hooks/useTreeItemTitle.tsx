import { Input } from "antd"
import { useMemo } from "react"

import { NAME_MAX_LENGTH } from "~/config"
import { NoteItem } from "~/types"

import useOnRenameKeyDown from "./useOnRenameKeyDown"
import useOnRenamingBlur from "./useOnRenamingBlur"

import { stopPropagation } from "$components/utils/event"
import { useNotes } from "$hooks/useSelectors"

export default function useTreeItemTitle(item: NoteItem) {
  const onRenamingBlur = useOnRenamingBlur(item)
  const onRenameKeyDown = useOnRenameKeyDown(item)
  const { renamingId } = useNotes()

  return useMemo(
    () =>
      renamingId === item.id ? (
        <Input
          key={`rename-input-${item.id}`}
          autoFocus
          size="small"
          placeholder={item.title}
          defaultValue={item.title}
          onKeyDown={onRenameKeyDown}
          onBlur={onRenamingBlur}
          maxLength={NAME_MAX_LENGTH}
          onContextMenu={stopPropagation}
        />
      ) : (
        <div title={item.title} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </div>
      ),
    [item.id, item.title, onRenameKeyDown, onRenamingBlur, renamingId],
  )
}
