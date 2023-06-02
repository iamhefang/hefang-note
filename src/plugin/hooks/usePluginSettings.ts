import {useSelector} from "react-redux"

import {StoreState} from "~/types"

/**
 * 获取插件自定义配置项
 * @param pluginId 插件ID
 * @returns 插件配置项
 */
export default function usePluginSettings<T = unknown>(pluginId: string): T {
    return useSelector<StoreState, T>((s) => (s.settings[pluginId] || {}) as T)
}
