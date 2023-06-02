import {DomEditor, IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor"
import {Editor, Toolbar} from "@wangeditor/editor-for-react"

import "@wangeditor/editor/dist/css/style.css"
import {App} from "antd"
import {useEffect, useMemo, useState} from "react"

import {EditorComponent} from "~/plugin/types"

import ss from "./index.module.scss"
import useWangEditorTheme from "./useWangEditorTheme"

const WangEditor: EditorComponent = ({value, onChange, onFocus, onBlur, placeholder, loading}) => {
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const {message} = App.useApp()
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
                onChange?.(domEditor.isEmpty() ? "" : domEditor.getHtml())
            },
            onFocus: () => onFocus?.(),
            onBlur: () => onBlur?.(),
            customAlert: (info, type) => {
                void message.open({type, content: info})
            },
            MENU_CONF: {
                "uploadImage": {
                    base64LimitSize: 5 * 1024 * 1024, // 5mb
                },
            },
        }),
        [message, onBlur, onChange, onFocus, placeholder],
    )

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

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column", ...theme}} className={ss.editor}>
            <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="simple" style={{borderBottom: "1px solid var(--w-e-toolbar-border-color)"}}/>
            <div style={{flex: 1, overflow: "hidden", position: "relative"}}>
                <Editor
                    defaultConfig={editorConfig}
                    value={value}
                    onCreated={setEditor}
                    mode="simple"
                    style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}}
                />
            </div>
        </div>
    )
}

export default WangEditor
