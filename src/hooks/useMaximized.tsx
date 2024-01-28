import {appWindow} from "@tauri-apps/api/window"
import _ from "lodash"
import {useEffect, useState} from "react"

export default function useMaximized() {
    const [value, setValue] = useState(false)
    useEffect(() => {
        window.shell?.api?.window.isMaximized().then(setValue)
    }, [])

    return value
}
