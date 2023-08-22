import { PluginHookEvent, PluginHookKeys, PluginHookOccasion } from "hefang-note-types"

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

export function callPluginsHooks<D, E extends PluginHookEvent<D>>(
  hook: PluginHookKeys,
  event: E,
  callback?: (detail: D) => Promise<void> | void,
) {
  const e = callPluginsHook(hook, event.clone({ occasion: PluginHookOccasion.before }))
  if (!e.isDefaultPrevented()) {
    const res = callback?.(e.detail)
    if (res?.then) {
      res.then(() => callPluginsHook(hook, e.clone({ occasion: PluginHookOccasion.after }))).catch(console.error)
    } else {
      callPluginsHook(hook, e.clone({ occasion: PluginHookOccasion.after }))
    }
  }
}
