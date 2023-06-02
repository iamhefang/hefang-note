import {FormItemProps} from "antd"
import {ComponentClass, FC} from "react"

import store from "~/redux"
import {noteSlice} from "~/redux/noteSlice"
import {settingSlice} from "~/redux/settingSlice"
import {uiSlice} from "~/redux/uiSlice"

export type EditorComponent = (ComponentClass<IEditorProps> | FC<IEditorProps>) & { editorName?: string; options?: IEditorOptions[] }

export interface IEditorOptions extends Omit<FormItemProps, "noStyle"> {
}

export interface IFooterTopComponentProps {
    dispatch: typeof store.dispatch
    settingSlice: typeof settingSlice
    noteSlice: typeof noteSlice
    uiSlice: typeof uiSlice
}

export type PluginComponent = (ComponentClass<IFooterTopComponentProps> | FC<IFooterTopComponentProps>) & {
    order?: number
}

/**
 * 插件提供的组件
 */
export interface IPluginComponents {
    /**
     * 编辑器
     */
    Editor: EditorComponent
    /**
     * 状态栏左侧
     */
    FooterLeft: PluginComponent
    /**
     * 状态栏右侧
     */
    FooterRight: PluginComponent
    /**
     * 标题栏右侧
     */
    TopLeft: PluginComponent
    /**
     * 标题栏右侧
     */
    TopRight: PluginComponent
    /**
     * 悬浮窗
     * 悬浮窗和主界面渲染到同一级, 需要每个组件自行设置为fixed定位
     */
    Float: PluginComponent
}

export interface IEditorProps {
    /**
     * 正在编辑的内容
     */
    value: string
    /**
     * 内容变化时回调
     * @param value 新内容
     */
    onChange: (value: string | undefined) => void
    placeholder?: string
    onFocus?: () => void
    onBlur?: () => void
    noteId: string
    /**
     * 内容是否正在加载
     */
    loading: boolean
}