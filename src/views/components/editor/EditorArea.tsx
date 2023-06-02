import NoteUnlocker from "$components/locker/NoteUnlocker"
import useCurrent from "$hooks/useCurrent"
import {usePluginMap} from "$hooks/usePlugins"
import {useSettings} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"
import {contentStore} from "$utils/database"
import {Empty, theme as antTheme} from "antd"
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"

import useNoteLocked from "~/hooks/useNoteLocked"
import {EditorComponent} from "~/plugin/types"
import {useAppDispatch} from "~/redux"
import {updateContent} from "~/redux/noteSlice"

import WangEditor from "./WangEditor"

export default function EditorArea() {
    const t = useTranslate()
    const {editorOptions, editor} = useSettings()
    const {
        token: {colorBgLayout, colorText},
    } = antTheme.useToken()
    const dispatch = useAppDispatch()
    const [changing, setChanging] = useState(false)
    const [reading, setReading] = useState(false)
    const [value, setValue] = useState("")
    const current = useCurrent()
    const plugins = usePluginMap()
    const Editor: EditorComponent = useMemo(() => {
        return editor && plugins[editor]?.Editor ? plugins[editor].Editor! : WangEditor
    }, [editor, plugins])

    const refSaveTimer = useRef<number>(0)
    const onValueChange = useCallback((newValue: string | undefined) => {
        setChanging(true)
        setValue(newValue || "")
    }, [])

    useEffect(
        () => {
            if (!current?.isLeaf || !current?.id || reading) {
                return
            }
            const newContent = {id: current.id, content: value}
            dispatch(updateContent(newContent))
            setChanging(false)
        },
        [current?.id, current?.isLeaf, dispatch, reading, value],
    )

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

    if (noteLocked) {
        // FIXME: 从加锁笔记切换到非加锁笔记时内容区会闪一下
        return <NoteUnlocker item={current!}/>
    }

    if ((current && !current.isLeaf) || !current) {
        return <Empty description={t("尽情记录吧")}/>
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
                <Editor key={current.id} value={value} onChange={onValueChange} placeholder={t("尽情记录吧")} loading={reading}/>
            </div>
        </div>
    )
}
