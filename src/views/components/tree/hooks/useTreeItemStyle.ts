import { theme } from "antd"
import { CSSProperties, useMemo } from "react"

import { NoteIndentItem } from "~/types"

export default function useTreeItemStyle(item: NoteIndentItem, dataSize: string | number) {
    const { token } = theme.useToken()

    return useMemo(
        (): CSSProperties | Record<string, string> => ({
            height: dataSize,
            marginInline: 10,
            "--hover-bg-color": token.colorPrimaryBgHover,
            "--active-bg-color": token.colorPrimaryBg,
            "--hover-text-color": token.colorBgTextHover,
            "--active-text-color": token.colorPrimaryTextActive,
        }),
        [dataSize, token.colorBgTextHover, token.colorPrimaryBg, token.colorPrimaryBgHover, token.colorPrimaryTextActive],
    )
}