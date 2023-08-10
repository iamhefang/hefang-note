import { PluginHookEvent, PluginHookKeys } from "hefang-note-types"

export function callPluginsHook<D, E extends PluginHookEvent<D>>(hook: PluginHookKeys, event: E): E {
  for (const plugin of window.notebook.plugins) {
    if (!event.bubble) {
      break
    }
    // @ts-ignore
    Array.isArray(plugin.hooks) && plugin.hooks.includes(hook) && plugin[hook]?.(event)
  }

  return event
}
