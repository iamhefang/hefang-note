/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:05:46
 * @Date: 2023-05-03 09:48:20
 * @Description:
 */

import { ReactElement, useMemo } from "react"

import usePluginFooterTopComponentProps from "./usePluginFooterTopComponentProps"
import usePlugins from "./usePlugins"

import { FooterTopComponent, IFooterTopComponentProps, IPluginComponents } from "$plugin/types"

export default function usePluginFooterTopComponents<K extends keyof Omit<IPluginComponents, "Editor">>(
  type: K,
): ReactElement<IFooterTopComponentProps, FooterTopComponent>[] {
  const plugins = usePlugins()
  const props = usePluginFooterTopComponentProps()

  return useMemo(() => {
    const hasComponents = plugins.filter((item) => item.components?.includes(type) && item[type])

    return hasComponents
      .sort((a, b) => (a[type]?.order ?? 0) - (b[type]?.order ?? 0))
      .map((plugin) => {
        const Component: FooterTopComponent = plugin[type]!

        return <Component {...props} key={`${type}-${plugin.id}`} />
      })
  }, [plugins, type, props])
}
