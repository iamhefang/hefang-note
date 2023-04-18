import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core"
import { Ctx } from "@milkdown/ctx"
import { clipboard } from "@milkdown/plugin-clipboard"
import { diagram } from "@milkdown/plugin-diagram"
import { history } from "@milkdown/plugin-history"
import { listener, listenerCtx } from "@milkdown/plugin-listener"
import { katexOptionsCtx, math } from "@milkdown/plugin-math"
import { prism, prismConfig } from "@milkdown/plugin-prism"
import { commonmark, headingAttr, headingIdGenerator } from "@milkdown/preset-commonmark"
import { gfm } from "@milkdown/preset-gfm"
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react"
import { nord } from "@milkdown/theme-nord"
import "@milkdown/theme-nord/style.css"
import { replaceAll } from "@milkdown/utils"
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react"
import { Select, Switch } from "antd"
import "prism-themes/themes/prism-nord.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import cpp from "refractor/lang/cpp"
import css from "refractor/lang/css"
import javascript from "refractor/lang/javascript"
import jsx from "refractor/lang/jsx"
import markdown from "refractor/lang/markdown"
import matlab from "refractor/lang/matlab"
import rust from "refractor/lang/rust"
import tsx from "refractor/lang/tsx"
import typescript from "refractor/lang/typescript"

import { EditorComponent, IEditorProps } from "~/plugin/types"
import { DefaultEditorOptions } from "~/types"

import ss from "./MarkdownEditor.module.scss"
import { placeholder, placeholderCtx } from "./MarkdownEditorPlaceholder"
import MarkdownEditorToolbar, { defaultToolbarItems } from "./MarkdownEditorToolbar"

import { useEditorOptions } from "$hooks/useSelectors"

import "katex/dist/katex.min.css"
import _ from "lodash"

function MilkdownEditor({
  value,
  onChange,
  onBlur,
  onFocus,
  onEditorCreated,
  placeholder: placeholderContent,
  noteId,
}: IEditorProps & { onEditorCreated: (editor: Editor) => void }) {
  const [lastNoteId, setLastNoteId] = useState<string>()
  const onMarkdownUpdated = useCallback(
    (ctx: Ctx, markdownValue: string, prevMarkdown: string | null) => {
      console.info("markdown变化", markdownValue.length, prevMarkdown?.length)
      if (markdownValue !== prevMarkdown && markdownValue !== value && lastNoteId === noteId) {
        onChange?.(markdownValue)
      }
    },
    [lastNoteId, noteId, onChange, value],
  )
  const { loading, get: getEditor } = useEditor((root) => {
    const editor = Editor.make()
    editor
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, value)
        ctx.set(placeholderCtx, placeholderContent || "尽情记录吧")
        ctx.set(katexOptionsCtx.key, { output: "mathml", throwOnError: false, colorIsTextColor: true, trust: true })
        const manager = ctx.get(listenerCtx)
        manager
          .markdownUpdated(onMarkdownUpdated)
          .blur((_ctx) => onBlur?.())
          .focus((_ctx) => onFocus?.())
        // options.highlightCodeBlock &&
        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(markdown)
            refractor.register(css)
            refractor.register(javascript)
            refractor.register(typescript)
            refractor.register(jsx)
            refractor.register(tsx)
            refractor.register(cpp)
            refractor.register(rust)
            refractor.register(matlab)
          },
        })
      })
      .use(commonmark)
      .use(gfm)
      .use(headingIdGenerator)
      .use(headingAttr)
      .use(listener)
      .use(clipboard)
      .use(history)
      .use(diagram)
      .use(math)
      .use(placeholder)
      .use(prism)
    // options.highlightCodeBlock &&

    return editor
  }, [])

  useEffect(() => {
    const editor = getEditor()
    editor && onEditorCreated(editor)
  }, [getEditor, loading, onEditorCreated])

  useEffect(() => {
    if (lastNoteId === noteId) {
      return
    }
    const editor = getEditor()
    editor?.action(replaceAll(value))
    setLastNoteId(noteId)
    editor?.ctx.set(defaultValueCtx, value)
  }, [value, getEditor, lastNoteId, noteId])

  return useMemo(
    () => (
      <div className={ss.editor}>
        <Milkdown />
      </div>
    ),
    [],
  )
}

const MarkdownEditor: EditorComponent = (props) => {
  const [ctx, setCtx] = useState<Ctx>()
  const editorOptions = useEditorOptions<DefaultEditorOptions>()

  const onEditorCreated = useCallback((editor: Editor) => {
    setCtx(editor.ctx)
  }, [])

  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <div className={ss.root}>
          <MarkdownEditorToolbar items={defaultToolbarItems} ctx={ctx} />
          <MilkdownEditor {...props} onEditorCreated={onEditorCreated} />
        </div>
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  )
}

MarkdownEditor.editorName = "内置编辑器"
MarkdownEditor.options = [
  {
    name: "showToolbar",
    label: "显示工具栏",
    children: <Switch />,
    valuePropName: "checked",
  },
  {
    name: "fontFamily",
    label: "字体",
    children: (
      <Select style={{ minWidth: 120 }}>
        <Select.Option value="inherit">自动字体</Select.Option>
        <Select.Option value="serif">
          <span style={{ fontFamily: "serif" }}>衬线字体</span>
        </Select.Option>
        <Select.Option value="sans-serif">
          <span style={{ fontFamily: "sans-serif" }}>无衬线字体</span>
        </Select.Option>
      </Select>
    ),
  },
  {
    name: "lineHeight",
    label: "行高",
    children: (
      <Select style={{ minWidth: 110 }}>
        <Select.Option value="inherit">自动行高</Select.Option>
        <Select.Option value={1}>1倍行高</Select.Option>
        <Select.Option value={1.2}>1.2倍行高</Select.Option>
        <Select.Option value={1.5}>1.5倍行高</Select.Option>
        <Select.Option value={1.7}>1.7倍行高</Select.Option>
        <Select.Option value={2}>2倍行高</Select.Option>
      </Select>
    ),
  },
  {
    name: "highlightCodeBlock",
    label: "代码块语法高亮",
    children: <Switch />,
    valuePropName: "checked",
  },
]

export default MarkdownEditor
