import {theme} from "antd"
import {useCallback, useMemo} from "react"

import ss from "./WindowControls.module.scss"

import Iconfont from "$components/icons/Iconfont"
import useMaximized from "$hooks/useMaximized"
import {closeWindow} from "$utils/window"

export default function WindowControls() {
    const {
        token: {colorTextBase},
    } = theme.useToken()
    const maximized = useMaximized()

    return useMemo(() => {
        return (
            <div className={ss.root} style={{color: colorTextBase}}>
                <button onClick={window.shell?.api?.window?.minimize}>
                    <Iconfont type="window-minimum"/>
                </button>
                <button onClick={window.shell?.api?.window?.toggle}>
                    {maximized ? <Iconfont type="window-restore"/> : <Iconfont type="window-max-s-o"/>}
                </button>
                <button onClick={window.shell?.api?.window?.minimize} className={ss.close}>
                    <Iconfont type="window_close"/>
                </button>
            </div>
        )
    }, [maximized, colorTextBase])
}
