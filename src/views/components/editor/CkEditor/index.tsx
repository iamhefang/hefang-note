import { Autoformat } from "@ckeditor/ckeditor5-autoformat"
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles"
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote"
import "@ckeditor/ckeditor5-build-classic/build/translations/de"
import "@ckeditor/ckeditor5-build-classic/build/translations/en-gb"
import "@ckeditor/ckeditor5-build-classic/build/translations/ja"
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn"
import { CodeBlock, CodeBlockEditing, CodeBlockUI } from "@ckeditor/ckeditor5-code-block"
import type { EditorConfig } from "@ckeditor/ckeditor5-core"
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic"
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { Essentials } from "@ckeditor/ckeditor5-essentials"
import { Heading } from "@ckeditor/ckeditor5-heading"
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line"
import { Image, ImageCaption } from "@ckeditor/ckeditor5-image"
import { Link } from "@ckeditor/ckeditor5-link"
import { List, TodoList } from "@ckeditor/ckeditor5-list"
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm"
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed"
import { Paragraph } from "@ckeditor/ckeditor5-paragraph"
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing"
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table"
import { Switch } from "antd"
import { useCallback, useMemo } from "react"

import ss from "./index.module.scss"
import useCkEditorTheme from "./useCkEditorTheme"

import { useEditorOptions } from "$hooks/useSelectors"
import { useLocaleDefine, useTranslate } from "$hooks/useTranslate"
import { EditorComponent } from "$plugin/index"

const CkEditor: EditorComponent = ({ value, onChange, onFocus, onBlur, placeholder, loading, noteId }) => {
  const onValueChange = useCallback(
    (event: unknown, editor: { getData: () => string }) => {
      const data = editor.getData()
      console.log({ event, editor, data })
      onChange(data)
    },
    [onChange],
  )

  const t = useTranslate()

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

  const locale = useLocaleDefine()
  const plugins = useMemo<EditorConfig["plugins"]>(
    () => [
      Markdown,
      SourceEditing,
      Heading,
      Essentials,
      Bold,
      Italic,
      Paragraph,
      //   ImageUpload,
      //   EasyImage,
      //   UploadAdapter,
      BlockQuote,
      //   CKFinder,
      Image,
      ImageCaption,
      Link,
      List,
      TodoList,
      MediaEmbed,
      PasteFromOffice,
      Table,
      TableToolbar,
      Autoformat,
      HorizontalLine,
      CodeBlock,
      CodeBlockEditing,
      CodeBlockUI,
    ],
    [],
  )
  const theme = useCkEditorTheme()

  return (
    <div style={theme} className={ss.root}>
      <CKEditor
        key={locale.name}
        editor={ClassicEditor}
        data={value || ""}
        onChange={onValueChange}
        onBlur={onBlur}
        onFocus={onFocus}
        config={{
          placeholder,
          language: locale.ckEditor,
          toolbar,
          plugins,
          codeBlock: {
            languages: [
              { language: "plaintext", label: t("纯文本") },
              { language: "c", label: "C" },
              { language: "cs", label: "C#" },
              { language: "cpp", label: "C++" },
              { language: "css", label: "CSS" },
              { language: "diff", label: "Diff" },
              { language: "html", label: "HTML" },
              { language: "java", label: "Java" },
              { language: "javascript", label: "JavaScript" },
              { language: "php", label: "PHP" },
              { language: "python", label: "Python" },
              { language: "ruby", label: "Ruby" },
              { language: "typescript", label: "TypeScript" },
              { language: "xml", label: "XML" },
            ],
          },
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
    label: "显示源代码",
    name: "showSource",
    children: <Switch />,
    valuePropName: "checked",
  },
]

export default CkEditor
