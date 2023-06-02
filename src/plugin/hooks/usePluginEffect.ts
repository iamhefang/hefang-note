import {theme as antdTheme} from "antd"
import {useEffect, useRef} from "react"

import {IPlugin, PluginHookOccasion, ScreenLockEvent, ThemeChangeEvent} from "~/plugin"

import {useSettings} from "$hooks/useSelectors"
import usePlugins from "$plugin/hooks/usePlugins"

function useThemePluginEffect() {
    const {theme, language} = useSettings()
    const plugins = usePlugins()
    const {token} = antdTheme.useToken()
    useEffect(() => {
        const themeEvent = new ThemeChangeEvent({currentTarget: {theme, token}, occasion: PluginHookOccasion.after})
        for (const plugin of plugins) {
            if (!themeEvent.bubble) {
                break
            }
            plugin.hooks?.includes?.("onThemeChange") && plugin.onThemeChange?.(themeEvent)
        }
    }, [theme, plugins, token])
}

/**
 * 锁屏状态变化后回调
 */
function useScreenLockPluginEffect() {
    const plugins = usePlugins()
    const {lock: {locked}} = useSettings()
    useEffect(() => {
        const event = new ScreenLockEvent({currentTarget: {lock: locked}, occasion: PluginHookOccasion.after})
        for (const plugin of plugins) {
            if (!event.bubble) {
                break
            }
            plugin.hooks?.includes("onScreenLock") && plugin.onScreenLock?.(event)
        }
    }, [locked, plugins])
}

export default function usePluginEffect() {
    const plugins = usePlugins(true)
    const refPlugins = useRef<IPlugin[]>(plugins)

    useEffect(() => {
        refPlugins.current = plugins
    }, [plugins])

    useEffect(() => {
        window.notebook || Object.defineProperty(window, "notebook", {
            value: {
                get plugins() {
                    return refPlugins.current
                },
            },
            writable: false,
            configurable: false,
            enumerable: false,
        })
    }, [])

    useThemePluginEffect()
    useScreenLockPluginEffect()
}

