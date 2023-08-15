import { IPlugin } from "hefang-note-types"
import { useEffect, useMemo, useState } from "react"

import { usePluginState, useSettings } from "$hooks/useSelectors"

export default function usePlugins(includeDisabled: boolean = false): IPlugin[] {
  const { plugins: pIds } = useSettings()
  const { entities } = usePluginState()
  const [plugins, setPlugins] = useState(Object.values(entities))

  useEffect(() => {
    setPlugins(Object.values(entities).map((item) => ({ ...item, enable: pIds.includes(item.id) })))
  }, [entities, pIds])

  return useMemo(() => (includeDisabled ? plugins : plugins.filter((p) => p.enable)), [includeDisabled, plugins])
}

export function usePluginMap(includeDisabled: boolean = false): Record<string, IPlugin> {
  const plugins = usePlugins(includeDisabled)

  return useMemo(() => Object.fromEntries(plugins.map((plugin) => [plugin.id, plugin])), [plugins])
}
