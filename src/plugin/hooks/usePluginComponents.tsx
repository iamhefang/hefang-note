/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:05:46
 * @Date: 2023-05-03 09:48:20
 * @Description:
 */

import { ReactElement, useMemo } from "react"

import { IPluginComponents, IPluginDataSlice, PluginComponent } from "~/plugin"

import usePluginFooterTopComponentProps from "./usePluginFooterTopComponentProps"
import usePlugins from "./usePlugins"

export default function usePluginComponents<K extends keyof Omit<IPluginComponents, "Editor">>(
  type: K,
): (ReactElement<IPluginDataSlice, PluginComponent> | null)[] {
  const plugins = usePlugins()
  const props = usePluginFooterTopComponentProps()

  return useMemo(() => {
    const hasComponents = plugins.filter((item) => item.components?.includes(type) && item[type])

    return hasComponents
      .sort((a, b) => (a[type]?.order ?? 0) - (b[type]?.order ?? 0))
      .map((plugin) => {
        try {
          const Component: PluginComponent = plugin[type]!

          return <Component {...props} key={`${type}-${plugin.id}`} />
        } catch (e) {
          console.error(`渲染插件组件(${type})时出错`, plugin, e)

          return null
        }
      })
  }, [plugins, type, props])
}
