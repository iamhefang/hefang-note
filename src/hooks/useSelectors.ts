import { DefaultEditorOptions, Settings } from "hefang-note-types"
import { useSelector } from "react-redux"

import { NoteState, StoreState, UIState } from "~/types"

import { PluginState } from "$plugin/redux"

export function useSettings(): Settings {
  return useSelector<StoreState, Settings>((s) => s.settings)
}

export function useStates(): UIState {
  return useSelector<StoreState, UIState>((s) => s.states)
}

export function usePluginState(): PluginState {
  return useSelector<StoreState, PluginState>((s) => s.plugins)
}

export function useNotes(): NoteState {
  return useSelector<StoreState, NoteState>((s) => s.notes)
}

export function useEditorOptions<T extends DefaultEditorOptions | object = object>(): T {
  return useSelector<StoreState, T>((s) => {
    const editor = s.settings.editor

    return s.settings[editor === "default" ? "editorOptions" : editor] as T
  })
}

export function useDefaultEditorOptions(): DefaultEditorOptions {
  return useSelector<StoreState, DefaultEditorOptions>((s) => s.settings.editorOptions as DefaultEditorOptions)
}
