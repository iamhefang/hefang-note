import { useCallback } from "react"

import { contentStore } from "~/utils/database"

import useGlobalState from "./useGlobalState"

export default function useContentLoader() {
  const [{}, setState] = useGlobalState()

  return useCallback(() => {
    console.info("正在加载笔记")
    contentStore
      .getAll()
      .then((items) =>
        setState({
          items: Object.fromEntries(
            items.map((item) => {
              delete item.content

              return [item.id, { ...item }]
            }),
          ),
          loading: false,
        }),
      )
      .catch(console.error)
  }, [setState])
}
