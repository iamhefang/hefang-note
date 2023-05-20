import { useSelector } from "react-redux"

import { DefaultEditorOptions, NoteState, PluginState, Settings, StoreState, UIState } from "~/types"

export function useSettings(): Settings {
    return useSelector<StoreState, Settings>(s => s.settings)
}

export function useStates(): UIState {
    return useSelector<StoreState, UIState>(s => s.states)
}
export function usePluginState(): PluginState {
    return useSelector<StoreState, PluginState>(s => s.plugins)
}
export function useNotes(): NoteState {
    return useSelector<StoreState, NoteState>(s => s.notes)
}

/**
 * 获取插件自定义配置项
 * @param pluginId 插件ID
 * @returns 插件配置项
 */
export function usePluginSettings<T = unknown>(pluginId: string): T {
    return useSelector<StoreState, T>(s => (s.settings[pluginId] || {}) as T)
}

export function useEditorOptions<T extends (DefaultEditorOptions | object) = object>(): T {
    return useSelector<StoreState, T>(s => {
        const editor = s.settings.editor

        return s.settings[editor === "default" ? "editorOptions" : editor] as T
    })
}
export function useDefaultEditorOptions(): DefaultEditorOptions {
    return useSelector<StoreState, DefaultEditorOptions>(s => s.settings.editorOptions)
}