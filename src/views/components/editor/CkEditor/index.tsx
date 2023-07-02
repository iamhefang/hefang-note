import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { Switch } from "antd"
import { useCallback, useMemo, useRef } from "react"
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing"

import { EditorComponent } from "$plugin/index"
import useEditorSettings from "$components/settings/useEditorSettings"
import { useEditorOptions } from "$hooks/useSelectors"

import "./index.module.scss"

const CkEditor: EditorComponent = ({ value, onChange, onFocus, onBlur, placeholder, loading, noteId }) => {
  const onValueChange = useCallback(
    (event, editor) => {
      const data = editor.getData()
      console.log({ event, editor, data })
      onChange(data)
    },
    [onChange],
  )

  const opt = useEditorOptions<{ showSource: boolean }>()

  const toolbar = useMemo(
    () =>
      [
        "undo",
        "redo",
        "|",
        "heading",
        "bold",
        "italic",
        "todoList",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "link",
        "codeBlock",
        opt.showSource ? "sourceEditing" : undefined,
      ].filter(Boolean) as string[],
    [opt.showSource],
  )

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={onValueChange}
      onBlur={onBlur}
      onFocus={onFocus}
      config={{
        placeholder,
        language: "zh-cn",
        toolbar,
        ui: {
          poweredBy: {
            position: "inside",
            side: "right",
            label: "基于",
            verticalOffset: 10,
            horizontalOffset: 10,
            forceVisible: true,
          },
        },
      }}
      // eslint-disable-next-line react/jsx-no-bind
      onReady={(editor) => {
        editor.editing.view.change((writer) => {
          const toolbarDom = document.querySelector(".ck.ck-editor__top.ck-reset_all") as HTMLDivElement
          const height = Math.ceil(toolbarDom.getBoundingClientRect().height)
          writer.setStyle(
            "height",
            `calc(100vh - var(--top-bar-height) - ${height}px - var(--status-bar-height))`,
            editor.editing.view.document.getRoot()!,
          )
        })
      }}
    />
  )
}

CkEditor.editorName = "CkEditor"
CkEditor.options = [
  {
    label: "显示源代码",
    name: "showSource",
    children: <Switch />,
    valuePropName: "checked",
  },
]

export default CkEditor
