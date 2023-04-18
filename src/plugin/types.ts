import { FormItemProps, GlobalToken, ThemeConfig } from "antd"
import { ComponentClass, FC, ReactNode } from "react"

import store from "~/redux"
import { noteSlice } from "~/redux/noteSlice"
import { settingSlice } from "~/redux/settingSlice"
import { uiSlice } from "~/redux/uiSlice"
import { NoteItem, ThemeDefine, ThemeType } from "~/types"

import { PlatformType } from "$hooks/usePlatform"

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
export interface IPlugin extends IPluginInfo, Partial<IPluginHooks>, Partial<IPluginComponents>, Partial<IPluginAbility>, Partial<IPluginLifecycle> {}

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
  onInstall(): void
  onUninstall(): void
  onEnable(): void
  onDisable(): void
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

export interface IPluginComponents {
  Editor: EditorComponent
  FooterLeft: FooterTopComponent
  FooterRight: FooterTopComponent
  TopLeft: FooterTopComponent
  TopRight: FooterTopComponent
}

export interface IPluginAbility {
  theme: ThemeDefine
}
