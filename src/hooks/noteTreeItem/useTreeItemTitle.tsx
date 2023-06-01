import {Input} from "antd"
import {useMemo} from "react"

import {NAME_MAX_LENGTH} from "~/config"
import {NoteItem} from "~/types"

import useOnRenameKeyDown from "./useOnRenameKeyDown"
import useOnRenamingBlur from "./useOnRenamingBlur"

import {stopPropagation} from "$components/utils/event"
import Html from "$components/utils/Html"
import useSearchValue from "$hooks/useSearchValue"
import {useNotes} from "$hooks/useSelectors"
import {useThemeConfig} from "$hooks/useThemeConfig"

export default function useTreeItemTitle(item: NoteItem) {
    const onRenamingBlur = useOnRenamingBlur(item)
    const onRenameKeyDown = useOnRenameKeyDown()
    const {renamingId} = useNotes()
    const [search] = useSearchValue()
    const {token} = useThemeConfig()

    return useMemo(
        () =>
            renamingId === item.id ? (
                <Input
                    key={`rename-input-${item.id}`}
                    autoFocus
                    size="small"
                    placeholder={item.title}
                    defaultValue={item.title}
                    onKeyDown={onRenameKeyDown}
                    onBlur={onRenamingBlur}
                    maxLength={NAME_MAX_LENGTH}
                    onContextMenu={stopPropagation}
                />
            ) : (
                <Html title={item.title} style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                    {search ? item.title.replaceAll(search, `<span style="color:${token?.colorPrimary}">${search}</span>`) : item.title}
                </Html>
            ),
        [item.id, item.title, onRenameKeyDown, onRenamingBlur, renamingId, search, token?.colorPrimary],
    )
}
