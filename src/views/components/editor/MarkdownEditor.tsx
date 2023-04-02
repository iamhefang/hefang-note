import "@milkdown-lab/plugin-menu/style.css"
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core"
import { Ctx } from "@milkdown/ctx"
import { clipboard } from "@milkdown/plugin-clipboard"
import { listener, listenerCtx } from "@milkdown/plugin-listener"
import { prism, prismConfig } from "@milkdown/plugin-prism"
import { commonmark, headingAttr, headingIdGenerator } from "@milkdown/preset-commonmark"
import { gfm } from "@milkdown/preset-gfm"
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react"
import { nord } from "@milkdown/theme-nord"
import "@milkdown/theme-nord/style.css"
import { Switch } from "antd"
import "prism-themes/themes/prism-nord.css"
import { useCallback, useEffect, useState } from "react"
import cpp from "refractor/lang/cpp"
import css from "refractor/lang/css"
import javascript from "refractor/lang/javascript"
import jsx from "refractor/lang/jsx"
import markdown from "refractor/lang/markdown"
import tsx from "refractor/lang/tsx"
import typescript from "refractor/lang/typescript"

import { EditorComponent, IEditorProps } from "~/plugin/types"

import ss from "./MarkdownEditor.module.scss"
import { useSettings } from "$hooks/useSelectors"

function MilkdownEditor({ value, onChange, onBlur, onFocus, onEditorCreated }: IEditorProps & { onEditorCreated: (editor: Editor) => void }) {
  const { loading, get: getEditor } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, value)
        const manager = ctx.get(listenerCtx)
        manager.markdownUpdated((_ctx, _pre, newMarkdown) => {
          onChange(newMarkdown || "")
        })
        manager.blur((_ctx) => onBlur?.())
        manager.focus((_ctx) => onFocus?.())
        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(markdown)
            refractor.register(css)
            refractor.register(javascript)
            refractor.register(typescript)
            refractor.register(jsx)
            refractor.register(tsx)
            refractor.register(cpp)
          },
        })
      })
      .use(commonmark)
      .use(gfm)
      .use(headingIdGenerator)
      .use(headingAttr)
      .use(listener)
      .use(clipboard)
      .use(prism),
  )

  useEffect(() => {
    const editor = getEditor()
    editor && onEditorCreated(editor)
  }, [getEditor, loading, onEditorCreated])

  return (
    <div className={ss.editor}>
      <Milkdown />
    </div>
  )
}

const MarkdownEditor: EditorComponent = (props) => {
  const [ctx, setCtx] = useState<Ctx>()
  const { editorStyle } = useSettings()

  const onEditorCreated = useCallback((editor: Editor) => {
    setCtx(editor.ctx)
  }, [])

  return (
    <MilkdownProvider>
      <div className={ss.root}>
        {/* <MarkdownEditorToolbar items={defaultToolbarItems} ctx={ctx} /> */}
        <MilkdownEditor {...props} onEditorCreated={onEditorCreated} />
      </div>
    </MilkdownProvider>
  )
}

export default MarkdownEditor
MarkdownEditor.editorName = "内置编辑器"
MarkdownEditor.options = [{ name: "showToolbar", label: "显示工具栏", children: <Switch />, valuePropName: "checked" }]
