import Editor, { EditorProps, loader, useMonaco } from "@monaco-editor/react"
import { Select, Spin, Switch, theme as themeAntd } from "antd"
import type { editor } from "monaco-editor"
import { useCallback, useEffect, useMemo } from "react"

import { EditorComponent } from "~/plugin/types"

import { useDefaultEditorOptions, useSettings } from "$hooks/useSelectors"
import { useThemeConfig } from "$hooks/useThemeConfig"
import { useTranslate } from "$hooks/useTranslate"
import { rgb2rrggbb } from "$utils/color"

self.MonacoEnvironment = {
  getWorker(_, label) {
    const getWorkerModule = (moduleUrl: string) => {
      return new Worker(self.MonacoEnvironment!.getWorkerUrl?.(moduleUrl, label) || moduleUrl, {
        name: label,
        type: "module",
      })
    }
    switch (label) {
      case "json":
        return getWorkerModule("../monaco-editor/vs/language/json/json.worker?worker")
      case "css":
      case "scss":
      case "less":
        return getWorkerModule("../monaco-editor/vs/language/css/css.worker?worker")
      case "html":
      case "handlebars":
      case "razor":
        return getWorkerModule("../monaco-editor/vs/language/html/html.worker?worker")
      case "typescript":
      case "javascript":
        return getWorkerModule("../monaco-editor/vs/language/typescript/ts.worker?worker")
      default:
        return getWorkerModule("../monaco-editor/vs/editor/editor.worker?worker")
    }
  },
}

loader.config({
  paths: { vs: "../monaco-editor/vs" },
  "vs/nls": {
    availableLanguages: { "*": "zh-cn" },
  },
})

const CodeEditor: EditorComponent = ({ value, onChange, onBlur, onFocus }) => {
  const { token } = themeAntd.useToken()
  const t = useTranslate()
  const monaco = useMonaco()
  const editorOptions = useDefaultEditorOptions()
  const { theme } = useSettings()
  const { algorithm } = useThemeConfig()

  const setTheme = useCallback(() => {
    if (!monaco) {
      return
    }
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
  }, [algorithm, monaco, theme, token.colorBgLayout, token.colorText])

  const onMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      setTheme()
      onFocus && editorInstance.onDidFocusEditorText(onFocus)
      onBlur && editorInstance.onDidBlurEditorText(onBlur)
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
    (newValue: string | undefined, ev: editor.IModelContentChangedEvent) => {
      value !== newValue && ev.changes.length && ev.changes[0].text !== newValue && onChange?.(newValue)
    },
    [onChange, value],
  )

  return <Editor language="markdown" value={value} onChange={onValueChange} options={options} onMount={onMount} loading={<Spin tip={t("编辑器加载中")} />} />
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
