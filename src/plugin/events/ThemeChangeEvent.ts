import {GlobalToken} from "antd"

import {ThemeType} from "~/types"

import {PluginHookEvent} from "./base"

/**
 * 主题改变事件的detail
 */
export type ThemeChangeEventDetail = {
    /**
     * occasion为before时可以被插件修改
     */
    theme: ThemeType
    readonly token?: Readonly<GlobalToken>
}

/**
 * 主题改变事件
 */
export class ThemeChangeEvent extends PluginHookEvent<ThemeChangeEventDetail> {
}

