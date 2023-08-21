import { PluginHookEvent, PluginHookKeys } from "hefang-note-types"

import { logger } from "$utils/logger"

export function callPluginsHook<D, E extends PluginHookEvent<D>>(hook: PluginHookKeys, event: E): E {
  logger.info("正在调用插件钩子", hook, event)
  for (const plugin of window.notebook.plugins) {
    if (!event.bubble) {
      break
    }
    // @ts-ignore
    Array.isArray(plugin.hooks) && plugin.hooks.includes(hook) && plugin[hook]?.(event)
  }

  return event
}
