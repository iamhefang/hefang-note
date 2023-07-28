import { PluginHookKeys } from "$plugin/defines";
import { PluginHookEvent } from "$plugin/events";

export function callPluginsHook<D, E extends PluginHookEvent<D>>(hook: PluginHookKeys, event: E): E {
    for (const plugin of window.notebook.plugins) {
        if (!event.bubble) {
            break;
        }
        // @ts-ignore
        Array.isArray(plugin.hooks) && plugin.hooks.includes(hook) && plugin[hook]?.(event);
    }

    return event;
}