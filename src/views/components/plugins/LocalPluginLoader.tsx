import { App, Avatar, Button, Form, Input, Space, Upload, UploadProps } from "antd"
import React, { useCallback, useState } from "react"

import { useAppDispatch } from "~/redux"
import { loadPlugins } from "~/redux/pluginSlice"

import Html from "$components/utils/Html"
import { IPlugin } from "$plugin/index"
import { pluginScriptStore, pluginStore } from "$utils/database"

/**
 * 加载本地编译后的js文件
 * @returns
 */
function LocalFilePluginLoader() {
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
            .then(() => void dispatch(loadPlugins()))
            .catch(console.error)
        },
      })

      return false
    },
    [dispatch, modal],
  )

  return (
    <Upload accept="text/javascript" beforeUpload={beforeUpload} showUploadList={false}>
      <Button type="text" size="small" key="load-dev-plugin-file">
        加载本地插件
      </Button>
    </Upload>
  )
}

function LocalServePluginLoader() {
  const { modal } = App.useApp()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  const onClick = useCallback(() => {
    modal.confirm({
      title: "加载本地开发中的插件",
      content: (
        <Form
          initialValues={{ url: `${window.location.protocol}//${window.location.host}/src/index.tsx` }}
          form={form}
          layout="vertical"
        >
          <Form.Item name="url" label="插件脚本链接" required rules={[{ required: true, message: "请输入脚本链接" }]}>
            <Input type="url" maxLength={256} placeholder="请输入脚本地址" />
          </Form.Item>
        </Form>
      ),
      okText: "加载",
      onOk: async () => {
        const { url } = await form.validateFields().catch(console.error)
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

        pluginStore
          .set({
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
            scriptUrl: url,
          })
          .then((res) => void dispatch(loadPlugins()))
          .catch(console.error)
      },
    })
  }, [dispatch, form, modal])

  return (
    <Button type="text" size="small" key="load-dev-plugin-url" onClick={onClick}>
      加载本地插件
    </Button>
  )
}

export default function LocalPluginLoader() {
  return <LocalServePluginLoader />
}
