import { theme as antTheme, Empty } from "antd"
import { debounce } from "lodash"
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"

import { CONTENT_SAVE_DELAY } from "~/config"
import useNoteLocked from "~/hooks/useNoteLocked"
import { EditorComponent } from "~/plugin"
import { useAppDispatch } from "~/redux"
import { updateContent } from "~/redux/noteSlice"

import CkEditor from "./CkEditor"

import NoteUnlocker from "$components/locker/NoteUnlocker"
import useCurrent from "$hooks/useCurrent"
import { useSettings } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import { usePluginMap } from "$plugin/hooks/usePlugins"
import { contentStore } from "$utils/database"

export default function EditorArea() {
  const t = useTranslate()
  const { editorOptions, editor } = useSettings()
  const {
    token: { colorBgLayout, colorText },
  } = antTheme.useToken()
  const dispatch = useAppDispatch()
  const [changing, setChanging] = useState(false)
  const [reading, setReading] = useState(false)
  const [value, setValue] = useState("")
  const current = useCurrent()
  const plugins = usePluginMap()
  const Editor: EditorComponent = useMemo(() => {
    return editor && plugins[editor]?.Editor ? plugins[editor].Editor! : CkEditor
  }, [editor, plugins])

  const onValueChange = useCallback(
    (newValue: string | undefined) => {
      if (reading) {
        return
      }
      setChanging(true)
      setValue(newValue || "")
    },
    [reading],
  )

  const saveContent = useMemo(
    () =>
      debounce((id: string, newContent: string) => {
        dispatch(updateContent({ id, content: newContent }))
        setChanging(false)
      }, CONTENT_SAVE_DELAY),
    [dispatch],
  )

  useEffect(() => {
    if (!current?.isLeaf || !current?.id || reading) {
      return
    }
    saveContent(current?.id, value)
  }, [current?.id, current?.isLeaf, dispatch, reading, saveContent, value])

  const noteLocked = useNoteLocked(current?.id)
  useLayoutEffect(() => {
    if (!current?.isLeaf || !current?.id) {
      setValue("")

      return
    }
    setReading(true)
    contentStore
      .get(current?.id, "")
      .then(setValue)
      .catch(console.error)
      .finally(() => setTimeout(() => setReading(false), 0))
  }, [current?.id, current?.isLeaf])

  const onBlur = useCallback(() => {
    if (!current?.isLeaf || !current?.id || reading) {
      return
    }
    saveContent(current?.id, value)
    saveContent.flush()
  }, [current?.id, current?.isLeaf, reading, saveContent, value])

  if (noteLocked) {
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
        <Editor
          key={current.id}
          value={value}
          onChange={onValueChange}
          placeholder={t("尽情记录吧")}
          loading={reading}
          noteId={current.id}
          onBlur={onBlur}
        />
      </div>
    </div>
  )
}
