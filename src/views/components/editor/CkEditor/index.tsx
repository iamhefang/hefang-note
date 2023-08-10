import "@ckeditor/ckeditor5-build-classic/build/translations/de"
import "@ckeditor/ckeditor5-build-classic/build/translations/en-gb"
import "@ckeditor/ckeditor5-build-classic/build/translations/ja"
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn"
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { Switch } from "antd"
import { EditorComponent } from "hefang-note-types"
import { useCallback, useEffect, useMemo } from "react"

import { ckEditorPlugins } from "./configs/ckEditorPlugins"
import useCodeBlockConfig from "./configs/useCodeBlockConfig"
import ss from "./index.module.scss"
import useCkEditorTheme from "./useCkEditorTheme"

import { useEditorOptions } from "$hooks/useSelectors"
import { useLocaleDefine } from "$hooks/useTranslate"

const CkEditor: EditorComponent = ({ value, onChange, onFocus, onBlur, placeholder, loading, noteId }) => {
  const onValueChange = useCallback(
    (event: unknown, editor: { getData: () => string }) => {
      const data = editor.getData()
      onChange(data)
    },
    [onChange],
  )

  useEffect(() => {
    const txt = document.querySelector(".ck-source-editing-area textarea") as HTMLTextAreaElement | undefined
    if (txt) {
      txt.placeholder = placeholder ?? ""
    }
  }, [placeholder])

  const codeBlockConfig = useCodeBlockConfig()

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
        "strikethrough",
        "|",
        "todoList",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "link",
        "code",
        "codeBlock",
        "insertTable",
        opt.showSource ? "sourceEditing" : undefined,
      ].filter(Boolean) as string[],
    [opt.showSource],
  )

  const locale = useLocaleDefine()
  const theme = useCkEditorTheme()

  return (
    <div style={theme} className={ss.root} key={`${locale.name}${JSON.stringify(opt)}`}>
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        onChange={onValueChange}
        onBlur={onBlur}
        onFocus={onFocus}
        config={{
          placeholder,
          language: locale.ckEditor,
          toolbar,
          plugins: ckEditorPlugins,
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          codeBlock: codeBlockConfig,
          ui: {
            poweredBy: {
              position: "inside",
              side: "right",
              label: null,
              verticalOffset: 2,
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
    </div>
  )
}

CkEditor.editorName = "CkEditor"
CkEditor.options = [
  {
    label: "启用源代码编辑功能",
    name: "showSource",
    children: <Switch />,
    valuePropName: "checked",
  },
]

export default CkEditor
