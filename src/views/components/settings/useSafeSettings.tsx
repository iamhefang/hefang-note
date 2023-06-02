import {Form, Input, Space, Switch} from "antd"
import {ReactNode, useMemo, useState} from "react"

import {useSettings} from "~/hooks/useSelectors"

import {useTranslate} from "$hooks/useTranslate"

export default function useSafeSettings(): Record<string, ReactNode> {
    const {lock} = useSettings()
    const [immediately, setImmediately] = useState(lock.immediately)
    const t = useTranslate()

    return useMemo(
        () => ({
            [t("锁定时不再弹窗提示")]: (
                <Space>
                    {immediately && (
                        <Form.Item name={["lock", "password"]} label="解锁密码" dependencies={["lockImmediately"]}>
                            <Input.Password maxLength={6} placeholder="请输入解锁密码" style={{width: 120}} size="small"/>
                        </Form.Item>
                    )}
                    <Form.Item name={["lock", "immediately"]} valuePropName="checked" noStyle>
                        <Switch onChange={setImmediately}/>
                    </Form.Item>
                </Space>
            ),
        }),
        [immediately, t],
    )
}
