import { useMemo } from "react"

import { treeSorter } from "~/utils/sort"

import useGlobalState from "./useGlobalState"

export default function useItemArray(needSort: boolean = false) {
  const [{ items, sort }] = useGlobalState()

  const sorter = useMemo(() => treeSorter(sort), [sort])

  return useMemo(() => (needSort ? Object.values(items).sort(sorter) : Object.values(items)), [items, needSort, sorter])
}
