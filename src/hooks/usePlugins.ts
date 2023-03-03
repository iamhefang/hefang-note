import { BaseDirectory, createDir, exists, readDir, readTextFile } from "@tauri-apps/api/fs"
import { join } from "@tauri-apps/api/path"
import { GlobalToken, ThemeConfig } from "antd"
import { ClassicComponentClass, ComponentClass, FC, ReactNode, useEffect, useMemo, useRef, useState } from "react"

import { GlobalState, ThemeDefine, Themes, ThemeType } from "~/types"

import useGlobalState from "./useGlobalState"
import { PlatformType } from "./usePlatform"

export interface IPluginInfo {
  id: string
  name: string
  version: string
  logo?: string
  description?: string
  author?: string
  license?: string
  homepage?: string
  repository?: string
  dependencies?: string[]
  supports: PluginSupport
  abilities?: PluginAbility[]
  hooks?: PluginHookKeys[]
  components?: PluginComponents[]
  enable?: boolean
}
export type PluginSupport = { platform: PlatformType[], version: string }
export type PluginAbility = "themes"
export type PluginComponents = "Editor"
export type PluginHookKeys = keyof IPluginHooks;
export interface IPlugin extends IPluginInfo, Partial<IPluginHooks>, Partial<IPluginComponents>, Partial<IPluginAbility> {

}
export interface IEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
}
export type IEditor = (ComponentClass<IEditorProps> | FC<IEditorProps>) & { editorName?: string }
export interface IPluginHooks {
  onInstall(): void
  onUninstall(): void
  onEnable(): void
  onDisable(): void
  onUpdate(): void
  onThemeChange(theme: ThemeType, token: GlobalToken): void
  // FIXME: 插件提供的组件实现方案需要改
  onCreateEditor(state: GlobalState, themeToken: GlobalToken): IEditor | void
  onRenderFooter(state: GlobalState, themeToken: GlobalToken): ReactNode | void
}
export type PluginTheme = ThemeConfig & { tooltip?: string, icon: ReactNode }
export interface IPluginComponents {
  Editor: IEditor
}
export interface IPluginAbility {
  theme: ThemeDefine
}
async function require(path: string): Promise<IPlugin> {
  const js = await readTextFile(path)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exports: any = {}
  const module: {
    exports: ({ __esModule?: false | undefined } & IPlugin) | { __esModule: true; default: IPlugin }
  } = { exports }
  // eslint-disable-next-line no-eval
  eval(`${js}`)
  const pluginsInstance: IPlugin = module.exports?.__esModule ? module.exports?.default : module.exports

  return pluginsInstance
}

export default function usePlugins(includeDisabled: boolean = false): IPlugin[] {
  const [installedPlugins, setPlugins] = useState<IPlugin[]>([])
  const [pluginsInfos, setPluginInfos] = useState<IPluginInfo[]>([])
  const pluginPath = useRef<Record<string, string>>({})
  const [{ plugins }] = useGlobalState()

  useEffect(() => {
    if (!window.__TAURI_IPC__) { return }
    void (async () => {
      const options = {
        dir: BaseDirectory.AppData,
        recursive: false,
      }
      if (!(await exists("plugins", options))) {
        await createDir("plugins", options)
      }
      const pluginDirs = await readDir("plugins", options)
      const ps: IPluginInfo[] = []
      for (const { name, path } of pluginDirs) {
        if (!name) {
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
            console.error(`加载插件"${name}"时出现错误`, error)
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
          infos[i] = { ...pluginInstance, description: "", license: "", ...plugin }
        }
      }
      setPlugins(infos)
    })()
  }, [pluginsInfos, plugins])

  return useMemo(
    () =>
      installedPlugins.filter((item) => includeDisabled || item.enable),
    [installedPlugins, includeDisabled],
  )
}

export function usePluginMap(includeDisabled: boolean = false): Record<string, IPlugin> {
  const plugins = usePlugins(includeDisabled)

  return useMemo(() => Object.fromEntries(plugins.map(item => [item.id, item])), [plugins])
}
