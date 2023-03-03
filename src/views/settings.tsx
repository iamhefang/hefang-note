import { SettingOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { Modal, Space, Tabs } from "antd"
import { useCallback, useEffect } from "react"
import { isInTauri } from "~/consts"

import useGlobalState from "~/hooks/useGlobalState"
import { PluginManager } from "~/views/components/plugins"
import SettingForm from "~/views/components/settings/SettingForm"

export default function SettingsModal() {
  const [
    {
      showSettingModal,
      lock: { locked },
    },
    setState,
  ] = useGlobalState()
  const onCancel = useCallback(() => {
    setState({ showSettingModal: false })
  }, [setState])
  useEffect(() => {
    if (!isInTauri) {
      return
    }
    const unlisten = appWindow.listen("toggleSettingsModal", (event) => {
      if (!locked) {
        setState({ showSettingModal: !showSettingModal })
      }
    })

    return () => {
      unlisten.then((callback) => callback()).catch(console.error)
    }
  }, [locked, setState, showSettingModal])

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>设置</span>
        </Space>
      }
      footer={null}
      maskClosable={false}
      open={showSettingModal && !locked}
      onCancel={onCancel}
      width="90%"
      style={{
        maxHeight: "90%",
        maxWidth: 1000,
        top: "calc(var(--top-bar-height) + 10px)",
      }}
    >
      <Tabs
        tabPosition="left"
        items={[
          {
            key: "settings",
            label: "设置",
            children: <SettingForm />,
          },
          {
            key: "plugins",
            label: "插件",
            children: <PluginManager />,
          },
        ]}
      />
    </Modal>
  )
}
