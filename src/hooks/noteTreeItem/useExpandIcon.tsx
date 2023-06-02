import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons"
import {useMemo} from "react"

import {NoteItem} from "~/types"

import {iconPlacehodler} from "$components/icons/IconPlaceholder"
import useNoteLocked from "$hooks/useNoteLocked"
import {useSettings} from "$hooks/useSelectors"


export default function useExpandIcon(item: NoteItem) {
    const {expandItems} = useSettings()
    const noteLocked = useNoteLocked(item.id)

    return useMemo(() => {
        if (item.isLeaf) {
            return iconPlacehodler
        }
        if (!expandItems[item.id] || noteLocked) {
            return <CaretRightOutlined/>
        }

        return <CaretDownOutlined/>
    }, [expandItems, item.id, item.isLeaf, noteLocked])
}
