import { Divider, Empty, theme as antTheme } from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CONTENT_SAVE_DELAY } from "~/config"
import useNoteLoader from "~/hooks/useContentLoader"
import { IEditor, usePluginMap } from "~/hooks/usePlugins"
import { useNotes, useSettings } from "~/hooks/useSelectors"
import { useAppDispatch } from "~/redux"
import { updateContent } from "~/redux/noteSlice"
import type { NoteItem } from "~/types"
import { contentStore, notesStore } from "~/utils/database"
import { findNoteParents } from "~/utils/notes"

import DefaultEditor from "./DefaultEditor"

export default function Editor() {
  const { entities, ids } = useNotes()
  const { current, editorStyle, showTimeAboveEditor, editor } = useSettings()
  const loadNotesContent = useNoteLoader()
  const {
    token: { colorBgLayout, colorText },
  } = antTheme.useToken()
  const dispatch = useAppDispatch()
  const [changing, setChanging] = useState(false)
  const [value, setValue] = useState("")
  const item = useMemo(() => entities[current], [current, entities])
  const plugins = usePluginMap()
  const EditorComponent: IEditor = useMemo(() => {
    return editor && plugins[editor]?.Editor ? plugins[editor].Editor! : DefaultEditor
  }, [editor, plugins])

  const refSaveTimer = useRef(0)
  const saveContent = useCallback(
    (content: string) => {
      if (!item?.isLeaf || item.content === content) {
        return
      }
      refSaveTimer.current && clearTimeout(refSaveTimer.current)
      refSaveTimer.current = window.setTimeout(() => {
        dispatch(updateContent({ id: item.id, content }))
      }, CONTENT_SAVE_DELAY)
    },
    [item, dispatch],
  )
  const onValueChange = useCallback(
    (newValue: string) => {
      changing || setChanging(true)
      setValue(newValue)
      saveContent(newValue)
    },
    [changing, saveContent],
  )

  useEffect(() => {
    if (!item?.isLeaf) {
      return
    }
    contentStore.get(item.id, "").then(setValue).catch(console.error)
  }, [item?.id, item?.isLeaf])

  if ((item && !item.isLeaf) || _.isEmpty(ids) || !item) {
    return <Empty description="尽情记录吧" />
  }

  return (
    <div
      className="editor-container"
      style={{
        backgroundColor: colorBgLayout,
        color: colorText,
      }}
    >
      {showTimeAboveEditor && (
        <div className="note-info">
          创建时间：{dayjs(item.createTime).format("YYYY年MM月DD日 HH:mm")}
          <Divider type="vertical" />
          修改时间：{dayjs(item.modifyTime).format("YYYY年MM月DD日 HH:mm")}
        </div>
      )}
      <div className="editor" style={editorStyle}>
        <EditorComponent value={value} onChange={onValueChange} placeholder="尽情记录吧!" onBlur={loadNotesContent} />
      </div>
    </div>
  )
}
