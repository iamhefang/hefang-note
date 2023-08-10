import { AppstoreAddOutlined, AppstoreOutlined } from "@ant-design/icons"
import { Input, Space, Tabs } from "antd"
import { ChangeEvent, useCallback, useMemo, useState } from "react"

import { isLocalhost } from "~/consts"

import LocalPluginLoader from "./LocalPluginLoader"
import { PluginInstalled } from "./PluginInstalled"
import { PluginStore } from "./PluginStore"

import { useTranslate } from "$hooks/useTranslate"

export function PluginManager() {
  const t = useTranslate()
  const [search, setSearch] = useState<Record<string, string>>({ installed: "", store: "" })
  const [searchCache, setSearchCache] = useState<Record<string, string>>({ installed: "", store: "" })
  const [activeKey, setActiveKey] = useState<string>("installed")

  const onSearch = useCallback(
    (value: string) => {
      setSearch({ ...search, [activeKey]: value })
    },
    [activeKey, search],
  )
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchCache({ ...searchCache, [activeKey]: e.target.value })
    },
    [activeKey, searchCache],
  )
  const tabBarExtraContent = useMemo(() => {
    const content = [
      <Input.Search
        placeholder={t("搜索插件")}
        value={searchCache[activeKey]}
        onChange={onChange}
        onSearch={onSearch}
        allowClear
        key={activeKey}
      />,
    ]
    if (isLocalhost && activeKey === "installed") {
      content.unshift(<LocalPluginLoader key="local-plugin-loader" />)
    }

    return <Space>{content}</Space>
  }, [activeKey, onChange, onSearch, searchCache, t])

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarExtraContent={{ right: tabBarExtraContent }}
      items={[
        {
          key: "installed",
          label: (
            <div>
              <AppstoreOutlined />
              {t("已安装插件")}
            </div>
          ),
          children: <PluginInstalled search={search.installed} />,
        },
        {
          key: "store",
          label: (
            <div>
              <AppstoreAddOutlined />
              {t("插件商店")}
            </div>
          ),
          children: <PluginStore search={search.store} />,
        },
      ]}
    />
  )
}
