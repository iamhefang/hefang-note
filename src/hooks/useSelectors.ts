import { useSelector } from "react-redux"

import { StoreState } from "~/redux"
import { NoteState } from "~/redux/noteSlice"
import { PluginState } from "~/redux/pluginSlice"
import { States } from "~/redux/stateSlice"
import { Settings } from "~/types"

export function useSettings() {
    return useSelector<StoreState, Settings>(s => s.settings)
}

export function useStates() {
    return useSelector<StoreState, States>(s => s.states)
}

export function usePluginState() {
    return useSelector<StoreState, PluginState>(s => s.plugins)
}
export function useNotes() {
    return useSelector<StoreState, NoteState>(s => s.notes)
}