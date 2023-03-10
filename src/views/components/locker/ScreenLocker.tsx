import { LockOutlined, UnlockOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { App, Button, Form, Input, Modal, theme } from "antd"
// eslint-disable-next-line import/no-internal-modules
import { useCallback, useEffect } from "react"
import { isInTauri } from "~/consts"

import useGlobalState from "~/hooks/useGlobalState"

import ss from "./ScreenLocker.module.scss"

export default function ScreenLocker() {
  const [
    {
      lock: { locked, password, immediately },
    },
    setState,
  ] = useGlobalState()
  const { modal, message } = App.useApp()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const [lockForm] = Form.useForm()
  const [unlockForm] = Form.useForm()

  const onLockClick = useCallback(() => {
    if (immediately && password) {
      setState({ lock: { locked: true, password, immediately } })

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
          setState({ lock: { locked: true, password: values.password, immediately } })
          closeModal()
        })
      },
    })
  }, [lockForm, password, modal, setState, immediately])

  const onUnlockClick = useCallback(
    ({ password: pwd }: { password: string }) => {
      if (!pwd) {
        void message.error("请输入密码")
      } else if (pwd !== password) {
        void message.error("密码错误")
      } else {
        unlockForm.resetFields()
        setState({ lock: { locked: false, password, immediately } })
      }
    },
    [password, message, unlockForm, setState, immediately],
  )

  useEffect(() => {
    if (locked || !isInTauri) {
      return
    }
    const unlistener = appWindow.listen("toggleLock", onLockClick)

    return () => void unlistener.then((unlisten) => unlisten())
  }, [locked, onLockClick])

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
