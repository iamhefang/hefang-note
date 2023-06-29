import { SettingOutlined } from "@ant-design/icons"
import { appWindow } from "@tauri-apps/api/window"
import { Empty, Modal, Space, Tabs, TabsProps } from "antd"
import { useCallback, useEffect, useMemo } from "react"

import { isInClient } from "~/consts"
import { useAppDispatch } from "~/redux"
import { showSettingModal } from "~/redux/uiSlice"

import About from "$components/about"
import { PluginManager } from "$components/plugins"
import PluginSettingForm from "$components/settings/PluginSettingForm"
import SettingForm from "$components/settings/SettingForm"
import usePluginSettings from "$components/settings/usePluginSettings"
import { useSettings, useStates } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"
import usePlugins from "$plugin/hooks/usePlugins"

export default function SettingsModal() {
  const {
    lock: { locked },
  } = useSettings()
  const t = useTranslate()
  const { showSettingsModal } = useStates()
  const dispatch = useAppDispatch()
  const plugins = usePlugins()
  const onCancel = useCallback(() => {
    dispatch(showSettingModal(false))
  }, [dispatch])
  useEffect(() => {
    if (!isInClient) {
      return
    }
    const unlisteners = Object.entries({
      showSettingsModal: "settings",
      showAboutModal: "about",
      showPluginModal: "plugins",
    }).map(async ([eventName, key]) => {
      return appWindow.listen(eventName, (event) => {
        if (!locked) {
          dispatch(showSettingModal(key))
        }
      })
    })

    return () => {
      unlisteners.forEach(async (unlistener) => unlistener.then((fun) => fun()))
    }
  }, [dispatch, locked, showSettingsModal])
  usePluginSettings()
  const pluginItems = useMemo<TabsProps["items"]>(() => {
    return plugins
      .map((plugin) => {
        if (!plugin.abilities?.includes("settings")) {
          return null
        }
        if (!plugin.settings) {
          return {
            key: plugin.id,
            label: plugin.name,
            children: <Empty />,
          }
        }

        return {
          key: plugin.id,
          label: plugin.settings.name ? (
            <span title={`${plugin.name}提供的配置项`}>{plugin.settings.name}</span>
          ) : (
            plugin.name
          ),
          children: <PluginSettingForm plugin={plugin} key={`settings-${plugin.id}`} />,
        }
      })
      .filter((item) => !!item) as TabsProps["items"]
  }, [plugins])
  const onChange = useCallback(
    (key: string) => {
      dispatch(showSettingModal(key))
    },
    [dispatch],
  )

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>{t("首选项")}</span>
        </Space>
      }
      destroyOnClose
      footer={null}
      maskClosable={false}
      open={!!showSettingsModal && !locked}
      onCancel={onCancel}
      width="97vw"
      style={{
        maxWidth: 800,
        top: "calc(var(--top-bar-height) + 10px)",
      }}
    >
      <Tabs
        tabPosition="left"
        activeKey={showSettingsModal ? showSettingsModal : undefined}
        onChange={onChange}
        items={
          [
            {
              key: "settings",
              label: t("设置"),
              children: <SettingForm />,
            },
            isInClient
              ? {
                  key: "plugins",
                  label: t("插件管理"),
                  children: <PluginManager />,
                }
              : null,
            ...(pluginItems ?? []),
            {
              key: "about",
              label: t("关于"),
              children: <About />,
            },
          ].filter(Boolean) as TabsProps["items"]
        }
      />
    </Modal>
  )
}
