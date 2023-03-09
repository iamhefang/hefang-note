import { SettingOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { Modal, Space, Tabs } from "antd"
import { useCallback, useEffect } from "react"

import { isInTauri } from "~/consts"
import { useSettings, useStates } from "~/hooks/useSelectors"
import { useAppDispatch } from "~/redux"
import { toggleSettingsModal } from "~/redux/stateSlice"
import { PluginManager } from "~/views/components/plugins"
import SettingForm from "~/views/components/settings/SettingForm"

export default function SettingsModal() {
  const {
    lock: { locked },
  } = useSettings()
  const { showSettingsModal } = useStates()
  const dispatch = useAppDispatch()
  const onCancel = useCallback(() => {
    dispatch(toggleSettingsModal(null))
  }, [dispatch])
  useEffect(() => {
    if (!isInTauri) {
      return
    }
    const unlisten = appWindow.listen("toggleSettingsModal", (event) => {
      if (!locked) {
        dispatch(toggleSettingsModal(null))
      }
    })

    return () => {
      unlisten.then((callback) => callback()).catch(console.error)
    }
  }, [dispatch, locked, showSettingsModal])

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>设置</span>
        </Space>
      }
      destroyOnClose
      footer={null}
      maskClosable={false}
      open={showSettingsModal && !locked}
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
