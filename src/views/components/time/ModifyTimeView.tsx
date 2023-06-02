import dayjs from "dayjs"
import {useMemo} from "react"

import useCurrent from "$hooks/useCurrent"
import {useSettings} from "$hooks/useSelectors"

export default function ModifyTimeView() {
    const current = useCurrent()
    const {
        showEditTime,
    } = useSettings()

    return useMemo(() => (
            current?.modifyTime && showEditTime ? <>
                最近编辑: <span title={dayjs(current?.modifyTime).format("YYYY-M-D H:m:s")}>{dayjs(current?.modifyTime).fromNow()}</span>
            </> : null
        ),
        [current?.modifyTime, showEditTime],
    )
}