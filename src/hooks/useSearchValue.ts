import {useCallback, useMemo} from "react"

import {useAppDispatch} from "~/redux"
import {setSearchValue} from "~/redux/uiSlice"

import {useStates} from "$hooks/useSelectors"

export default function useSearchValue(): [string, (value: string) => void] {
    const dispatch = useAppDispatch()
    const {search} = useStates()
    const setSearch = useCallback((value: string) => {
        dispatch(setSearchValue(value))
    }, [dispatch])

    return useMemo(() => [search, setSearch], [search, setSearch])
}