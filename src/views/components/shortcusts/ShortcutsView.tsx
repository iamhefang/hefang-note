import {EditOutlined} from "@ant-design/icons"
import {App, Button, Space, theme} from "antd"
import _ from "lodash"
import {CSSProperties, ReactNode, useCallback, useMemo, useRef, useState} from "react"
import {Shortcut} from "shortcuts"

import {shortcuts} from "$utils/shortcuts"

export type ShortcutsViewProps = {
    value?: string
    onChange?: (newValue: string) => void
    placeholder?: ReactNode
}

export default function ShortcutsView({value, onChange, placeholder = <span>未设置</span>}: ShortcutsViewProps) {
    const {token} = theme.useToken()
    const [recording, setRecording] = useState<string>()
    const {message, modal} = App.useApp()
    const style = useMemo((): CSSProperties => {
        return {
            color: token.colorText,
            backgroundColor: token.colorBgBase,
            borderColor: token.colorBorder,
            boxShadow: `inset 0 -1px 0 ${token.colorBorder}`,
        }
    }, [token.colorBgBase, token.colorBorder, token.colorText])
    const renderKeys = useCallback(
        (keys: string) =>
            keys.split("+").map((k) => (
                <kbd key={`${value}-${k}`} style={style}>
                    {Shortcut.shortcut2symbols(k)}
                </kbd>
            )),
        [style, value],
    )
    const refLastKeys = useRef<string>("")
    const onEditClick = useCallback(() => {
        setRecording("")
        const stopRecord = shortcuts.record((newValue) => {
            const [key, modifier] = newValue.replace(refLastKeys.current, "").trim().split(" ").slice(-2)

            if (Shortcut.hasModifierKey(Shortcut.shortcut2id(key)[0])) {
                setRecording(key)
            } else {
                refLastKeys.current = newValue
                void message.error("请输入组合键")
            }

            if (modifier) {
                stopRecord()
            }
            if (modifier === "Enter") {
                setRecording(undefined)
                refLastKeys.current = newValue
                onChange?.(key)
            } else if (modifier === "Escape") {
                setRecording(undefined)
                refLastKeys.current = newValue
            }
        })
    }, [message, onChange])

    return _.isString(recording) ? (
        <Space size="small">请按下组合键{recording ? renderKeys(recording) : ""}</Space>
    ) : (
        <Space size="small">
            {value?.length ? renderKeys(value) : placeholder}
            <Button icon={<EditOutlined/>} type="text" size="small" onClick={onEditClick}/>
        </Space>
    )
}
