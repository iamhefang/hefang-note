import { DomEditor, IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import { useEffect, useMemo, useState } from "react"

import { EditorComponent } from "~/plugin/types"

import "@wangeditor/editor/dist/css/style.css"
import ss from "./index.module.scss"
import useWangEditorTheme from "./useWangEditorTheme"

const WangEditor: EditorComponent = ({ value, onChange, onFocus, onBlur, placeholder }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [text, setText] = useState("")
  // const [innerValue, setInnerValue] = useState(value)
  const toolbarConfig = useMemo<Partial<IToolbarConfig>>(
    () => ({
      toolbarKeys: [
        "headerSelect",
        "blockquote",
        "bold",
        "italic",
        "underline",
        "|",
        "bulletedList",
        "numberedList",
        "insertLink",
        "codeBlock",
        "insertTable",
        "emotion",
      ],
    }),
    [],
  )
  const editorConfig = useMemo<Partial<IEditorConfig>>(
    () => ({
      placeholder,
      onChange: (domEditor) => {
        setText(domEditor.getText())
      },
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
    }),
    [onBlur, onFocus, placeholder],
  )

  useEffect(() => {
    editor && onChange?.(editor.getHtml())
  }, [editor, onChange, text])

  const theme = useWangEditorTheme()
  useEffect(() => {
    return () => {
      if (!editor) {
        return
      }
      DomEditor.getToolbar(editor)?.destroy()
      editor?.destroy()
      setEditor(null)
    }
  }, [editor])
  // useEffect(() => {
  //   console.info("收到新内容", value)
  //   setInnerValue(value)
  // }, [value])

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", ...theme }} className={ss.editor}>
      <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: "1px solid var(--w-e-toolbar-border-color)" }} />
      <Editor defaultConfig={editorConfig} value={value} onCreated={setEditor} mode="default" style={{ flex: 1 }} />
    </div>
  )
}

export default WangEditor
