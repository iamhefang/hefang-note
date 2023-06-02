import { GlobalToken } from "antd"

import { ThemeType } from "~/types"

import { PluginHookEvent } from "./base"

export class ThemeChangeEvent extends PluginHookEvent<{ theme: ThemeType, token?: GlobalToken }> {
    // TODO: 待完善
}

