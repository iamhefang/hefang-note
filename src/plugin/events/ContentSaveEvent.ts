import {NoteItem} from "~/types"

import {PluginHookEvent} from "./base"

export class ContentSaveEvent extends PluginHookEvent<{ note: NoteItem, nextContent: string }> {
}

