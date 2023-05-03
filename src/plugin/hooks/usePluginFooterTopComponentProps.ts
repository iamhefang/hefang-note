import { useMemo } from "react"
import { useAppDispatch } from "~/redux"
import { noteSlice } from "~/redux/noteSlice"
import { settingSlice } from "~/redux/settingSlice"
import { uiSlice } from "~/redux/uiSlice"

/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 09:47:11
 * @Date: 2023-05-03 09:45:33
 * @Description: 
 */
export default function usePluginFooterTopComponentProps() {
    const dispatch = useAppDispatch()

    return useMemo(() => ({ dispatch, settingSlice, uiSlice, noteSlice }), [dispatch])
}