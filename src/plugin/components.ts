import { FormItemProps } from "antd"
import { ComponentClass, FC } from "react"

import store from "~/redux"
import { noteSlice } from "~/redux/noteSlice"
import { settingSlice } from "~/redux/settingSlice"
import { uiSlice } from "~/redux/uiSlice"

export type EditorComponent = (ComponentClass<IEditorProps> | FC<IEditorProps>) & { editorName?: string; options?: IEditorOptions[] }

export interface IEditorOptions extends Omit<FormItemProps, "noStyle"> { }

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

export interface IEditorProps {
    value: string
    onChange: (value: string | undefined) => void
    placeholder?: string
    onFocus?: () => void
    onBlur?: () => void
    noteId: string
}