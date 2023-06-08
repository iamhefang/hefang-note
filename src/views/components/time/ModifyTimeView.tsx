import dayjs from "dayjs"
import {useMemo} from "react"

import useCurrent from "$hooks/useCurrent"
import {useSettings} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"

export default function ModifyTimeView() {
    const current = useCurrent()
    const {
        showEditTime,
    } = useSettings()
    const t = useTranslate()

    return useMemo(() => (
            current?.modifyTime && showEditTime ? <span>
                {t("最近编辑")}: <span
                title={dayjs(current?.modifyTime).format("YYYY-M-D H:m:s")}
                >{dayjs(current?.modifyTime).fromNow()}</span>
            </span> : null
        ),
        [current?.modifyTime, showEditTime, t],
    )
}