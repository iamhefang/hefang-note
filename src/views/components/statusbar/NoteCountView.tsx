import {useMemo} from "react"

import {useNotes} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"

export default function NoteCountView() {
    const {entities} = useNotes()
    const t = useTranslate()

    return useMemo(() => {
        const values = Object.values(entities)
        const notes = values.filter((item) => item.isLeaf)
        const dirCount = values.length - notes.length
        const noteCount = notes.length

        return <span>{t("共{dirCount}个目录,{noteCount}篇笔记", {dirCount, noteCount})}</span>
    }, [entities, t])
}