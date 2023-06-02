import {Form} from "antd"
import {ReactNode, useMemo} from "react"

import ShortcutsView from "$components/shortcusts/ShortcutsView"
import {useTranslate} from "$hooks/useTranslate"

export default function useShortcutSettings(): Record<string, ReactNode> {
    const t = useTranslate()

    return useMemo(
        () => ({
            [t("锁定软件")]: (
                <Form.Item name={["shortcut", "lock"]} noStyle>
                    <ShortcutsView/>
                </Form.Item>
            ),
            [t("关闭窗口")]: (
                <Form.Item name={["shortcut", "closeWindow"]} noStyle>
                    <ShortcutsView/>
                </Form.Item>
            ),
        }),
        [t],
    )
}