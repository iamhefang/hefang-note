import { theme as antTheme, Empty } from "antd"
import { debounce, throttle } from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CONTENT_SAVE_DELAY } from "~/config"
import useNoteLocked from "~/hooks/useNoteLocked"
import { EditorComponent } from "~/plugin/types"
import { useAppDispatch } from "~/redux"
import { updateContent } from "~/redux/noteSlice"

import MarkdownEditor from "./MarkdownEditor"

import NoteUnlocker from "$components/locker/NoteUnlocker"
import useCurrent from "$hooks/useCurrent"
import { usePluginMap } from "$hooks/usePlugins"
import { useNotes, useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import { contentStore } from "$utils/database"

export default function EditorArea() {
  const t = useTranslate()
  const { ids } = useNotes()
  const { editorOptions, editor } = useSettings()
  const {
    token: { colorBgLayout, colorText },
  } = antTheme.useToken()
  const dispatch = useAppDispatch()
  const [changing, setChanging] = useState(false)
  const [value, setValue] = useState("")
  const current = useCurrent()
  const plugins = usePluginMap()
  const Editor: EditorComponent = useMemo(() => {
    return editor && plugins[editor]?.Editor ? plugins[editor].Editor! : MarkdownEditor
  }, [editor, plugins])

  const refSaveTimer = useRef(0)
  const saveContent = useCallback(
    throttle((content: string) => {
      if (!current?.isLeaf || !current?.id) {
        return
      }
      const newContent = { id: current.id, content }
      console.info("正在保存笔记", newContent)
      dispatch(updateContent(newContent))
    }, CONTENT_SAVE_DELAY),
    [current?.id, current?.isLeaf, dispatch],
  )
  const onValueChange = useCallback(
    (newValue: string | undefined) => {
      // setChanging(true)
      // setValue(newValue || "")
      // saveContent(newValue || "")
      if (!current?.isLeaf || !current?.id) {
        return
      }
      console.info("正在保存笔记", current.id, newValue)
      dispatch(updateContent({ id: current.id, content: newValue || "" }))
    },
    [current?.id, current?.isLeaf, dispatch],
  )
  const noteLocked = useNoteLocked(current?.id)
  useEffect(() => {
    if (!current?.isLeaf || !current?.id) {
      setValue("")

      return
    }
    contentStore.get(current?.id, "").then(setValue).catch(console.error)
  }, [current?.id, current?.isLeaf])

  if (noteLocked) {
    // FIXME: 从加锁笔记切换到非加锁笔记时内容区会闪一下
    return <NoteUnlocker item={current!} />
  }

  if ((current && !current.isLeaf) || !current) {
    return <Empty description={t("尽情记录吧")} />
  }

  return (
    <div
      className="editor-container"
      style={{
        backgroundColor: colorBgLayout,
        color: colorText,
      }}
    >
      <div className="editor-wrapper" style={editorOptions}>
        <Editor note={current} value={value} onChange={onValueChange} placeholder={t("尽情记录吧")} />
      </div>
    </div>
  )
}
