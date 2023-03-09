import { LockOutlined, UnlockOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { App, Button, Form, Input, Modal, theme } from "antd"
import _ from "lodash"
import { useCallback, useEffect } from "react"

import { isInTauri } from "~/consts"
import { useSettings } from "~/hooks/useSelectors"
import { useAppDispatch } from "~/redux"
import { lockScreen } from "~/redux/settingSlice"

import ss from "./ScreenLocker.module.scss"

export default function ScreenLocker() {
  const {
    lock: { locked, password, immediately },
    shortcut,
  } = useSettings()
  const dispatch = useAppDispatch()
  const { modal, message } = App.useApp()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const [lockForm] = Form.useForm()
  const [unlockForm] = Form.useForm()

  const onLockClick = useCallback(() => {
    if (immediately && password) {
      dispatch(lockScreen({ locked: true }))

      return
    }
    lockForm.setFieldsValue({ password })
    modal.confirm({
      title: "锁定屏幕",
      icon: <UnlockOutlined />,
      style: { top: 40 },
      content: (
        <Form form={lockForm} layout="vertical" initialValues={{ password }}>
          <Form.Item name="password" label="请输入解锁密码" rules={[{ required: true, message: "请输入解锁密码" }]}>
            <Input.Password placeholder="请输入解锁密码" maxLength={6} />
          </Form.Item>
        </Form>
      ),
      okText: "锁定",
      onOk(closeModal: () => void) {
        void lockForm.validateFields().then((values) => {
          dispatch(lockScreen({ locked: true, password: values.password }))
          closeModal()
        })
      },
    })
  }, [immediately, password, lockForm, modal, dispatch])

  const onUnlockClick = useCallback(
    ({ password: pwd }: { password: string }) => {
      if (!pwd) {
        void message.error("请输入密码")
      } else if (pwd !== password) {
        void message.error("密码错误")
      } else {
        unlockForm.resetFields()
        dispatch(lockScreen({ locked: false }))
      }
    },
    [password, message, unlockForm, dispatch],
  )

  useEffect(() => {
    if (locked || !isInTauri) {
      return
    }
    const unlistener = appWindow.listen("toggleLock", onLockClick)

    return () => void unlistener.then((unlisten) => unlisten())
  }, [locked, onLockClick])

  useEffect(() => {
    if (shortcut?.lock) {
      const keys = shortcut.lock.split("+")
      const metaKey = keys.includes("Meta")
      const shiftKey = keys.includes("Shift")
      const ctrlKey = keys.includes("Ctrl")
      const altKey = keys.includes("Alt")
      const onWindowKeyPress = (e: KeyboardEvent) => {
        if (e.metaKey === metaKey && e.shiftKey === shiftKey && e.ctrlKey === ctrlKey && e.altKey === altKey && e.key.toUpperCase() === _.last(keys)) {
          onLockClick()
        }
      }
      window.addEventListener("keypress", onWindowKeyPress)

      return () => {
        window.removeEventListener("keypress", onWindowKeyPress)
      }
    }
  }, [onLockClick, shortcut.lock])

  return (
    <>
      {locked || <Button type="text" size="small" onClick={onLockClick} icon={<LockOutlined />} />}
      <Modal
        open={locked}
        closable={false}
        destroyOnClose
        centered
        footer={null}
        rootClassName={ss.locker}
        maskStyle={{ background: colorBgContainer }}
        width={350}
      >
        <Form layout="inline" onFinish={onUnlockClick} form={unlockForm} initialValues={{ password: "" }}>
          <Form.Item name="password" style={{ width: 228 }}>
            <Input.Password placeholder="输入解锁密码" size="large" maxLength={6} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" icon={<UnlockOutlined />} size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
