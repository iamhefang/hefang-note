import { shell } from "@tauri-apps/api"

import { isInClient } from "~/consts"

export function openInNative(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isInClient || !e.currentTarget?.href) {
        return
    }
    e.preventDefault()
    void shell.open(e.currentTarget.href)
}