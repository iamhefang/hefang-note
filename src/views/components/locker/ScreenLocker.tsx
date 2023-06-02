import {LockOutlined, UnlockOutlined} from "@ant-design/icons"
import {appWindow} from "@tauri-apps/api/window"
import {App, Button, Form, Input, Modal, theme} from "antd"
import {useCallback, useEffect} from "react"

import {isInTauri} from "~/consts"
import {FooterTopComponent, PluginHookOccasion, ScreenLockEvent} from "~/plugin"
import {useAppDispatch} from "~/redux"
import {lockScreen} from "~/redux/settingSlice"
import {LockSetting} from "~/types"

import ss from "./ScreenLocker.module.scss"

import {useSettings} from "$hooks/useSelectors"
import {useTranslate} from "$hooks/useTranslate"
import usePlugins from "$plugin/hooks/usePlugins"
import {shortcuts} from "$utils/shortcuts"

const ScreenLocker: FooterTopComponent = () => {
    const {
        lock,
        shortcut,
    } = useSettings()
    const t = useTranslate()
    const dispatch = useAppDispatch()
    const {modal, message} = App.useApp()
    const {
        token: {colorBgContainer},
    } = theme.useToken()

    const [lockForm] = Form.useForm()
    const [unlockForm] = Form.useForm()
    const plugins = usePlugins()

    const dispatchScreenLock = useCallback((payload: Partial<LockSetting>) => {
        const event = new ScreenLockEvent({currentTarget: {...lock, ...payload}, occasion: PluginHookOccasion.before})
        for (const plugin of plugins) {
            if (!event.bubble) {
                break
            }
            plugin.hooks?.includes("onScreenLock") && plugin.onScreenLock?.(event)
        }
        if (event.isDefaultPrevented()) {
            return false
        }
        dispatch(lockScreen(payload))

        return true
    }, [dispatch, lock, plugins])

    const onLockClick = useCallback(() => {
        if (lock.immediately && lock.password) {
            dispatchScreenLock({locked: true})

            return
        }
        lockForm.setFieldsValue({password: lock.password})
        modal.confirm({
            title: t("锁定软件"),
            icon: <UnlockOutlined/>,
            style: {top: 40},
            content: (
                <Form form={lockForm} layout="vertical" initialValues={{password: lock.password}}>
                    <Form.Item name="password" label={t("请输入解锁密码")} rules={[{required: true, message: t("请输入解锁密码")}]}>
                        <Input.Password placeholder={t("请输入解锁密码")} maxLength={6}/>
                    </Form.Item>
                </Form>
            ),
            okText: t("锁定"),
            onOk(closeModal: () => void) {
                void lockForm.validateFields().then((values) => {
                    dispatchScreenLock({locked: true, password: values.password}) && closeModal()
                })
            },
        })
    }, [lock.immediately, lock.password, lockForm, modal, t, dispatchScreenLock])

    const onUnlockClick = useCallback(
        ({password: pwd}: { password: string }) => {
            if (!pwd) {
                void message.error("请输入密码")
            } else if (pwd !== lock.password) {
                void message.error("密码错误")
            } else {
                dispatchScreenLock({locked: false}) && unlockForm.resetFields()
            }
        },
        [lock.password, message, dispatchScreenLock, unlockForm],
    )

    useEffect(() => {
        if (lock.locked || !isInTauri) {
            return
        }
        const unlistener = appWindow.listen("toggleLock", onLockClick)

        return () => void unlistener.then((unlisten) => unlisten())
    }, [lock.locked, onLockClick])

    useEffect(() => {
        if (shortcut?.lock) {
            shortcuts.register({shortcut: shortcut.lock, handler: onLockClick})
        }

        return () => {
            shortcuts.remove({shortcut: shortcut.lock, handler: onLockClick})
        }
    }, [onLockClick, shortcut.lock])

    return (
        <>
            {lock.locked || <Button type="text" size="small" onClick={onLockClick} icon={<LockOutlined/>}/>}
            <Modal
                open={lock.locked}
                closable={false}
                destroyOnClose
                centered
                footer={null}
                rootClassName={ss.locker}
                maskStyle={{background: colorBgContainer}}
                width={350}
            >
                <Form layout="inline" onFinish={onUnlockClick} form={unlockForm} initialValues={{password: ""}}>
                    <Form.Item name="password" style={{width: 228}}>
                        <Input.Password placeholder={t("请输入解锁密码")} size="large" maxLength={6}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" icon={<UnlockOutlined/>} size="large"/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

ScreenLocker.order = 5
export default ScreenLocker
