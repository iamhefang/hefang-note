import { App, Avatar, Button, Space, Upload, UploadProps } from "antd"
import { useCallback } from "react"

import { useAppDispatch } from "~/redux"
import { loadPlugins } from "~/redux/pluginSlice"

import Html from "$components/utils/Html"
import { IPlugin } from "$plugin/index"
import { pluginScriptStore, pluginStore } from "$utils/database"

export default function LocalPluginLoader() {
  const { modal } = App.useApp()
  const dispatch = useAppDispatch()
  const beforeUpload = useCallback<Required<UploadProps>["beforeUpload"]>(
    async (file, fileList) => {
      const url = URL.createObjectURL(file)
      const pluginContext = (await import(/* @vite-ignore */ url)).default as IPlugin

      const {
        id,
        name,
        version,
        logo,
        description,
        supports,
        components,
        abilities,
        author,
        hooks,
        homepage,
        repository,
        license,
      } = pluginContext
      console.info("已加载本地插件", pluginContext)
      modal.confirm({
        title: `确定要安装本地插件“${name}”吗`,
        content: (
          <>
            <Space>
              <Avatar shape="square" src={logo} />
              <b>
                {name} v{version}
              </b>
            </Space>
            {description && <Html>{description}</Html>}
          </>
        ),
        okText: "安装",
        onOk: async () => {
          const code = await file.text()
          Promise.all([
            pluginStore.set({
              id,
              name,
              version,
              logo,
              description,
              supports,
              components,
              abilities,
              author,
              hooks,
              homepage,
              repository,
              license,
            }),
            pluginScriptStore.set(id, code),
          ])
            .then(() => {
              void dispatch(loadPlugins())
            })
            .catch(console.error)
        },
      })

      return false
    },
    [dispatch, modal],
  )

  return (
    <Upload accept="text/javascript" beforeUpload={beforeUpload} showUploadList={false}>
      <Button type="text" size="small" key="load-dev-plugin">
        加载本地插件
      </Button>
    </Upload>
  )
}
