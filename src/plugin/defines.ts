
import {ThemeDefine} from "~/types"

import {IPluginComponents} from "./components"
import {ContentSaveEvent, ScreenLockEvent, ThemeChangeEvent} from "./events"

import {PlatformType} from "$hooks/usePlatform"

/**
 * 插件信息
 * 在插件目录下的 index.json 里面定义这些信息
 */
export interface IPluginInfo {
    id: string
    name: string
    version: string
    logo?: string | null
    description?: string | null
    author?: string | null
    license?: string | null
    homepage?: string | null
    repository?: string | null
    dependencies?: string[] | null
    /**
     * 插件支持的平台和版本
     */
    supports: PluginSupport
    /**
     * 插件提供的能力
     */
    abilities?: PluginAbility[]
    hooks?: PluginHookKeys[]
    /**
     * 插件提供的组件
     */
    components?: PluginComponents[]
    enable?: boolean
}

export type PluginSupport = { platform: PlatformType[]; version: string }
export type PluginAbility = keyof IPluginAbility
export type PluginComponents = keyof IPluginComponents
export type PluginHookKeys = keyof IPluginHooks

/**
 * 插件代码导出的信息
 */
export interface IPluginObject extends Partial<IPluginHooks>, Partial<IPluginComponents>, Partial<IPluginAbility>, Partial<IPluginLifecycle> {
}

export interface IPlugin extends IPluginInfo, IPluginObject {
}

export interface IPluginHooks {
    /**
     * 主题变动前回调
     */
    onThemeChange(event: ThemeChangeEvent): void

    /**
     * 笔记保存到数据库前回调
     */
    onContentSave(event: ContentSaveEvent): void

    /**
     * 锁屏状态变化时回调
     * @param event
     */
    onScreenLock(event: ScreenLockEvent): void
}

export interface IPluginLifecycle {
    /**
     * 插件安装时回调
     */
    onInstall(): void

    /**
     * 插件卸载时回调
     */
    onUninstall(): void

    /**
     */
    onEnable(): void

    /**
     * 插件禁用时回调
     */
    onDisable(): void

    /**
     * 插件升级时回调
     */
    onUpdate(): void
}

/**
 * 插件提供的能力
 */
export interface IPluginAbility {
    theme: ThemeDefine
}

export interface INotebook {
    get plugins(): IPlugin[]
}

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        notebook: INotebook
    }
}