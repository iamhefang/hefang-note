import {useCallback} from "react"

import {useAppDispatch} from "~/redux"
import {loadSettings} from "~/redux/settingSlice"

export default function useSettingsLoader() {
    const dispatch = useAppDispatch()

    return useCallback(() => dispatch(loadSettings()), [dispatch])
}
