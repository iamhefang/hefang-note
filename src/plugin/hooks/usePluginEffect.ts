import {theme as antdTheme} from "antd"
import {useEffect, useRef} from "react"

import {IPlugin, PluginHookOccasion, ScreenLockEvent, ThemeChangeEvent} from "~/plugin"

import {useSettings, useStates} from "$hooks/useSelectors"
import usePlugins from "$plugin/hooks/usePlugins"

/**
 * 主题变化后回调
 */
function useThemePluginEffect() {
    const {theme} = useSettings()
    const plugins = usePlugins()
    const {launching} = useStates()
    const {token} = antdTheme.useToken()
    useEffect(() => {
        if (launching) {
            return
        }
        const themeEvent = new ThemeChangeEvent({detail: {theme, token}, occasion: PluginHookOccasion.after})
        for (const plugin of plugins) {
            if (!themeEvent.bubble) {
                break
            }
            plugin.hooks?.includes?.("onThemeChange") && plugin.onThemeChange?.(themeEvent)
        }
    }, [theme, plugins, token, launching])
}

/**
 * 锁屏状态变化后回调
 */
function useScreenLockPluginEffect() {
    const plugins = usePlugins()
    const {lock} = useSettings()
    const {launching} = useStates()
    useEffect(() => {
        if (launching) {
            return
        }
        const event = new ScreenLockEvent({detail: {...lock}, occasion: PluginHookOccasion.after})
        for (const plugin of plugins) {
            if (!event.bubble) {
                break
            }
            plugin.hooks?.includes("onScreenLock") && plugin.onScreenLock?.(event)
        }
    }, [launching, lock, plugins])
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