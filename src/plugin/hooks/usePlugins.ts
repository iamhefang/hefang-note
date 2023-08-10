/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:28:00
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import { IPlugin } from "hefang-note-types"
import { useMemo } from "react"

import { usePluginState } from "$hooks/useSelectors"

export default function usePlugins(includeDisabled: boolean = false): IPlugin[] {
  const { entities } = usePluginState()

  return useMemo(() => {
    const plugins = Object.values(entities)

    return includeDisabled ? plugins : plugins.filter((p) => p.enable)
  }, [entities, includeDisabled])
}

export function usePluginMap(includeDisabled: boolean = false): Record<string, IPlugin> {
  const plugins = usePlugins(includeDisabled)

  return useMemo(() => Object.fromEntries(plugins.map((plugin) => [plugin.id, plugin])), [plugins])
}
