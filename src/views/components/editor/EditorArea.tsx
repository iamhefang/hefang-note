import { theme as antTheme, Divider, Empty } from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CONTENT_SAVE_DELAY } from "~/config"
import useNoteLocked from "~/hooks/useNoteLocked"
import { EditorComponent } from "~/plugin/types"
import { useAppDispatch } from "~/redux"
import { updateContent } from "~/redux/noteSlice"

import DefaultEditor from "./DefaultEditor"

import NoteUnlocker from "$components/locker/NoteUnlocker"
import { usePluginMap } from "$hooks/usePlugins"
import { useNotes, useSettings } from "$hooks/useSelectors"
import { contentStore } from "$utils/database"

export default function EditorArea() {
  const { entities, ids } = useNotes()
  const { current, editorStyle, showTimeAboveEditor, editor } = useSettings()
  const {
    token: { colorBgLayout, colorText },
  } = antTheme.useToken()
  const dispatch = useAppDispatch()
  const [changing, setChanging] = useState(false)
  const [value, setValue] = useState("")
  const item = useMemo(() => entities[current], [current, entities])
  const plugins = usePluginMap()
  const Editor: EditorComponent = useMemo(() => {
    return editor && plugins[editor]?.Editor ? plugins[editor].Editor! : DefaultEditor
  }, [editor, plugins])

  const refSaveTimer = useRef(0)
  const saveContent = useCallback(
    (content: string) => {
      if (!item?.isLeaf) {
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
  const noteLocked = useNoteLocked(item?.id)
  useEffect(() => {
    if (!item?.isLeaf) {
      return
    }
    contentStore.get(current, "").then(setValue).catch(console.error)
  }, [current, item?.isLeaf])

  if (noteLocked) {
    // FIXME: 从加锁笔记切换到非加锁笔记时内容区会闪一下
    return <NoteUnlocker item={item} />
  }

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
        <Editor value={value} onChange={onValueChange} placeholder="尽情记录吧!" />
      </div>
    </div>
  )
}
