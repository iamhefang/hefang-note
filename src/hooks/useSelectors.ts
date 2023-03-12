import { useSelector } from "react-redux"

import { NoteState, PluginState, Settings, StoreState, UIState } from "~/types"

export function useSettings() {
    return useSelector<StoreState, Settings>(s => s.settings)
}

export function useStates() {
    return useSelector<StoreState, UIState>(s => s.states)
}

export function usePluginState() {
    return useSelector<StoreState, PluginState>(s => s.plugins)
}
export function useNotes() {
    return useSelector<StoreState, NoteState>(s => s.notes)
}