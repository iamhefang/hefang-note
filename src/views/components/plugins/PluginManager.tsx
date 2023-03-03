import { AppstoreAddOutlined, AppstoreOutlined } from "@ant-design/icons"
import { Input, Tabs } from "antd"
import { ChangeEvent, useCallback, useMemo, useState } from "react"

import { PluginInstalled } from "./PluginInstalled"
import { PluginStore } from "./PluginStore"

export function PluginManager() {
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
  const tabBarExtraContent = useMemo(
    () => <Input.Search placeholder="搜索插件" value={searchCache[activeKey]} onChange={onChange} onSearch={onSearch} allowClear key={activeKey} />,
    [activeKey, onChange, onSearch, searchCache],
  )

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
              已安装插件
            </div>
          ),
          children: <PluginInstalled search={search.installed} />,
        },
        {
          key: "store",
          label: (
            <div>
              <AppstoreAddOutlined />
              插件商店
            </div>
          ),
          children: <PluginStore search={search.store} />,
        },
      ]}
    />
  )
}
