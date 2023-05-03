import { FormItemProps, GlobalToken, ThemeConfig } from "antd"
import { ComponentClass, FC, ReactNode } from "react"

import store from "~/redux"
import { noteSlice } from "~/redux/noteSlice"
import { settingSlice } from "~/redux/settingSlice"
import { uiSlice } from "~/redux/uiSlice"
import { NoteItem, ThemeDefine, ThemeType } from "~/types"

import { PlatformType } from "$hooks/usePlatform"

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
export interface IPluginObject extends Partial<IPluginHooks>, Partial<IPluginComponents>, Partial<IPluginAbility>, Partial<IPluginLifecycle> {}

export interface IPlugin extends IPluginInfo, IPluginObject {}

export interface IEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  noteId: string
}

export interface IPluginHooks {
  /**
   * 主题变动后回调
   * @param theme 变化后的主题
   * @param token  变化后的主题颜色定义
   */
  onThemeChange(theme: ThemeType, token: GlobalToken): void
  /**
   * 笔记保存到数据库后回调
   * @param note 保存的笔记信息
   * @param content 保存的笔记内容
   */
  onContentSave(note: NoteItem, content: string): void
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

export type PluginTheme = ThemeConfig & { tooltip?: string; icon: ReactNode }

export type EditorComponent = (ComponentClass<IEditorProps> | FC<IEditorProps>) & { editorName?: string; options?: IEditorOptions[] }

export interface IEditorOptions extends Omit<FormItemProps, "noStyle"> {}

export interface IFooterTopComponentProps {
  dispatch: typeof store.dispatch
  settingSlice: typeof settingSlice
  noteSlice: typeof noteSlice
  uiSlice: typeof uiSlice
}

export type FooterTopComponent = (ComponentClass<IFooterTopComponentProps> | FC<IFooterTopComponentProps>) & {
  order?: number
}

/**
 * 插件提供的组件
 */
export interface IPluginComponents {
  Editor: EditorComponent
  FooterLeft: FooterTopComponent
  FooterRight: FooterTopComponent
  TopLeft: FooterTopComponent
  TopRight: FooterTopComponent
}

/**
 * 插件提供的能力
 */
export interface IPluginAbility {
  theme: ThemeDefine
}
