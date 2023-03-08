import { theme as antTheme, Divider, Empty } from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CONTENT_SAVE_DELAY } from "~/config"
import useContentLoader from "~/hooks/useContentLoader"
import useGlobalState from "~/hooks/useGlobalState"
import { IEditor, usePluginMap } from "~/hooks/usePlugins"
import type { NoteItem } from "~/types"
import { contentStore } from "~/utils/database"
import { findNoteParents } from "~/utils/notes"

import DefaultEditor from "./DefaultEditor"

export default function Editor() {
  const [state] = useGlobalState()
  const { items, current, editor, showTimeAboveEditor, editorStyle } = state
  const loadContent = useContentLoader()
  const {
    token: { colorBgLayout, colorText },
  } = antTheme.useToken()
  const [changing, setChanging] = useState(false)
  const [value, setValue] = useState("")
  const [item, setItem] = useState<NoteItem>()
  const plugins = usePluginMap()
  const EditorComponent: IEditor = useMemo(() => {
    return editor && plugins[editor]?.Editor ? plugins[editor].Editor! : DefaultEditor
  }, [editor, plugins])

  const refLastSaveTimer = useRef(0)
  const saveContent = useCallback(
    (content: string) => {
      if (!item || !item.isLeaf || item.content === content) {
        return
      }
      refLastSaveTimer.current && clearTimeout(refLastSaveTimer.current)
      refLastSaveTimer.current = window.setTimeout(() => {
        const modifyTime = Date.now()
        const newItem: NoteItem = { ...item, content, modifyTime }
        const newItems = findNoteParents(items, item.id)
          .map((me) => ({ ...me, modifyTime }))
          .concat(newItem)
        console.info("保存笔记", Date.now(), newItems)
        void contentStore.set(...newItems).then(() => {
          setChanging(false)
          setItem(newItem)
          loadContent()
        })
      }, CONTENT_SAVE_DELAY)
    },
    [item, items, loadContent],
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
    contentStore
      .get(current)
      .then((note) => {
        if (note?.isLeaf) {
          setValue(note.content || "")
        }
        setItem(note)
      })
      .catch(console.error)
  }, [current])

  if ((item && !item.isLeaf) || _.isEmpty(items) || !item) {
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
        <EditorComponent value={value} onChange={onValueChange} placeholder="尽情记录吧!" onBlur={loadContent} />
      </div>
    </div>
  )
}
