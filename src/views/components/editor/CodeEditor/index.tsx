import Editor, { EditorProps, loader } from "@monaco-editor/react"
import { Select, Switch, theme as themeAntd } from "antd"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useCallback, useEffect, useMemo } from "react"

import { EditorComponent } from "~/plugin/types"

import { useDefaultEditorOptions, useSettings } from "$hooks/useSelectors"
import { useThemeConfig } from "$hooks/useThemeConfig"
import { rgb2rrggbb } from "$utils/color"

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker()
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker()
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker()
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker()
    }

    return new editorWorker()
  },
}

loader.config({
  monaco,
  "vs/nls": {
    availableLanguages: { "*": "zh-cn" },
  },
})

const CodeEditor: EditorComponent = ({ value, onChange, onBlur, onFocus }) => {
  const { token } = themeAntd.useToken()
  const editorOptions = useDefaultEditorOptions()
  const { theme } = useSettings()
  const { algorithm } = useThemeConfig()

  const setTheme = useCallback(() => {
    monaco.editor.defineTheme(theme, {
      base: algorithm === themeAntd.darkAlgorithm ? "vs-dark" : "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": rgb2rrggbb(token.colorBgLayout),
        "editor.foreground": rgb2rrggbb(token.colorText),
      },
    })
    monaco.editor.setTheme(theme)
  }, [algorithm, theme, token.colorBgLayout, token.colorText])

  const onMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      setTheme()
      onFocus && editor.onDidFocusEditorText(onFocus)
      onBlur && editor.onDidBlurEditorText(onBlur)
      //   console.log(editor.getSupportedActions())
    },
    [onBlur, onFocus, setTheme],
  )

  useEffect(() => setTheme(), [setTheme])
  const options: EditorProps["options"] = useMemo(() => {
    return {
      fontSize: editorOptions.fontSize,
      lineNumbers: editorOptions.showLineNumbers ? "on" : "off",
      contextmenu: true,
      lineHeight: editorOptions.lineHeight,
      minimap: {
        enabled: editorOptions.minimap,
      },
    }
  }, [editorOptions])

  const onValueChange: EditorProps["onChange"] = useCallback(
    (newValue: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => {
      value !== newValue && ev.changes.length && ev.changes[0].text !== newValue && onChange?.(newValue)
    },
    [onChange, value],
  )

  return <Editor language="markdown" value={value} onChange={onValueChange} options={options} onMount={onMount} />
}

const fontSize = [12, 14, 16, 18, 20, 22]
const lineHeight = [1, 1.2, 1.5, 1.8, 2]
CodeEditor.options = [
  {
    name: "showLineNumbers",
    children: <Switch />,
    valuePropName: "checked",
    label: "显示行号",
  },
  {
    name: "minimap",
    children: <Switch />,
    valuePropName: "checked",
    label: "显示内容地图",
  },
  {
    name: "fontSize",
    children: (
      <Select style={{ width: 80 }} optionLabelProp="label">
        {fontSize.map((item) => (
          <Select.Option value={item} key={`fontsize-${item}`} label={`${item}px`}>
            <span style={{ fontSize: item }}>{item}px</span>
          </Select.Option>
        ))}
      </Select>
    ),
    label: "字体大小",
  },
  {
    name: "lineHeight",
    label: "行高",
    children: (
      <Select style={{ minWidth: 110 }}>
        {lineHeight.map((item) => (
          <Select.Option value={item} key={`line-height-${item}`}>
            {item}倍行高
          </Select.Option>
        ))}
      </Select>
    ),
  },
]
export default CodeEditor
