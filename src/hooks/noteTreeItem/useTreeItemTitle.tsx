import { Input } from "antd"
import { useCallback, useMemo } from "react"

import { NAME_MAX_LENGTH } from "~/config"
import { NoteItem } from "~/types"

import useOnRenameKeyDown from "./useOnRenameKeyDown"
import useOnRenamingBlur from "./useOnRenamingBlur"

import { stopPropagation } from "$components/utils/event"
import Html from "$components/utils/Html"
import useSearchValue from "$hooks/useSearchValue"
import { useNotes } from "$hooks/useSelectors"
import { useThemeConfig } from "$hooks/useThemeConfig"
import { hilightKeywords } from "$utils/string"

export default function useTreeItemTitle(item: NoteItem) {
  const onRenamingBlur = useOnRenamingBlur(item)
  const onRenameKeyDown = useOnRenameKeyDown()
  const { renamingId } = useNotes()
  const [search] = useSearchValue()
  const { token } = useThemeConfig()
  const onFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }, [])

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
          onFocus={onFocus}
          maxLength={NAME_MAX_LENGTH}
          onContextMenu={stopPropagation}
        />
      ) : (
        <Html title={item.title} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {hilightKeywords(item.title, search, token?.colorPrimary)}
        </Html>
      ),
    [item.id, item.title, onFocus, onRenameKeyDown, onRenamingBlur, renamingId, search, token?.colorPrimary],
  )
}
