import { ReactNode, useCallback, useEffect } from "react"
import { Virtuoso } from "react-virtuoso"

import useGlobalState from "~/hooks/useGlobalState"
import useItemsTree from "~/hooks/useItemsTree"
import type { NoteIndentItem } from "~/types"

import NoteTreeItem from "./NoteTreeItem"
export type NoteTreeProps = {
  search: string
}

const itemCache: Map<string, ReactNode> = new Map()

export default function NoteTree({ search }: NoteTreeProps) {
  const [{ current, expandItems }, setState] = useGlobalState()
  const data = useItemsTree(search)

  const itemContentRenderer = useCallback((_index: number, item: NoteIndentItem) => {
    // if (!itemCache.has(item.id)) {
    //   itemCache.set(item.id, <NoteTreeItem key={item.id} item={item} indent={item.indent} />)
    // }

    // return itemCache.get(item.id)
    return <NoteTreeItem key={item.id} item={item} indent={item.indent} />
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!current) {
        return
      }
      if (e.key === "ArrowLeft" && expandItems[current]) {
        setState({ expandItems: { ...expandItems, [current]: false } })
      } else if (e.key === "ArrowRight" && !expandItems[current]) {
        setState({ expandItems: { ...expandItems, [current]: true } })
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [current, expandItems, setState])

  return <Virtuoso data={data} totalCount={data.length} itemContent={itemContentRenderer} fixedItemHeight={28} />
}
