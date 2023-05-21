/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 10:28:00
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import { BaseDirectory, createDir, exists, readDir, readTextFile } from "@tauri-apps/api/fs"
import { join } from "@tauri-apps/api/path"
import { useEffect, useMemo, useRef, useState } from "react"

import { isInTauri } from "~/consts"
import { IPlugin, IPluginInfo } from "~/plugin/types"

import { createObjectURL } from "$utils/url"
import { useSettings } from "$hooks/useSelectors"

async function require(path: string): Promise<IPlugin> {
  const js = await readTextFile(path)

  return (await import(/* @vite-ignore */ createObjectURL(js, { type: "application/javascript; charset=utf-8" }))).default
}

export default function usePlugins(includeDisabled: boolean = false): IPlugin[] {
  const [installedPlugins, setPlugins] = useState<IPlugin[]>([])
  const [pluginsInfos, setPluginInfos] = useState<IPluginInfo[]>([])
  const { plugins } = useSettings()
  const pluginPath = useRef<Record<string, string>>({})

  useEffect(() => {
    if (!isInTauri) {
      return
    }
    void (async () => {
      const options = {
        dir: BaseDirectory.AppData,
        recursive: true,
      }
      if (!(await exists("plugins", options))) {
        console.info("插件目录不存在，正在创建")
        await createDir("plugins", options)
      }
      const pluginDirs = await readDir("plugins", options)
      const ps: IPluginInfo[] = []
      for (const { name: pluginId, path, children } of pluginDirs) {
        if (!pluginId || !children?.length) {
          continue
        }
        const jsonFile = await join(path, "index.json")
        const jsFile = await join(path, "index.js")
        if (await exists(jsonFile)) {
          try {
            const json = await readTextFile(jsonFile)
            const instance: IPluginInfo = JSON.parse(json)
            Reflect.deleteProperty(instance, "$schema")
            ps.push(instance)
            pluginPath.current[instance.id] = jsFile
          } catch (error) {
            console.error(`加载插件"${pluginId}"时出现错误`, error)
          }
        }
      }
      setPluginInfos(ps)
    })()
  }, [])
  useEffect(() => {
    void (async () => {
      const infos: IPlugin[] = [...pluginsInfos]
      for (let i = 0; i < pluginsInfos.length; i++) {
        const plugin = pluginsInfos[i]
        plugin.enable = plugins.includes(plugin.id)
        if (plugin.enable) {
          const pluginInstance = await require(pluginPath.current[plugin.id])
          infos[i] = { ...pluginInstance, description: null, license: null, ...plugin }
        }
      }
      setPlugins(infos)
    })()
  }, [pluginsInfos, plugins])

  return useMemo(() => (includeDisabled ? installedPlugins : installedPlugins.filter((item) => item.enable)), [installedPlugins, includeDisabled])
}

export function usePluginMap(includeDisabled: boolean = false): Record<string, IPlugin> {
  const plugins = usePlugins(includeDisabled)

  return useMemo(() => Object.fromEntries(plugins.map((plugin) => [plugin.id, plugin])), [plugins])
}
