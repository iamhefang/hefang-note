import { InitReady, prosePluginsCtx } from "@milkdown/core"
import { createSlice, createTimer, Ctx, MilkdownPlugin, Timer } from "@milkdown/ctx"
import { Plugin, PluginKey } from "@milkdown/prose/state"
import type { EditorView } from "@milkdown/prose/view"

export const placeholderCtx = createSlice("尽情记录吧", "placeholder")
export const placeholderTimerCtx = createSlice([] as Timer[], "editorStateTimer")

export const PlaceholderReady = createTimer("PlaceholderReady")

const key = new PluginKey("MILKDOWN_PLACEHOLDER")

export const placeholder: MilkdownPlugin = (ctx: Ctx) => {
    ctx.inject(placeholderCtx).record(PlaceholderReady)

    return async () => {
        const prosePlugins = ctx.get(prosePluginsCtx)

        const update = (view: EditorView) => {
            const placeholderValue = ctx.get(placeholderCtx)

            const isEmptyParagraph = view.dom.firstChild instanceof HTMLParagraphElement && view.dom.firstChild.innerHTML === "<br class=\"ProseMirror-trailingBreak\">"

            if (view.editable && view.state.doc.childCount === 1 && isEmptyParagraph) {
                view.dom.setAttribute("data-placeholder", placeholderValue)
            } else {
                view.dom.removeAttribute("data-placeholder")
            }
        }

        const plugins = [
            ...prosePlugins,
            new Plugin({
                key,
                view(view) {
                    update(view)

                    return { update }
                },
            }),
        ]

        ctx.set(prosePluginsCtx, plugins)
        ctx.done(PlaceholderReady)
    }
}