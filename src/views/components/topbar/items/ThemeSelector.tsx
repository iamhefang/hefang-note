import { Button, Dropdown, Tooltip } from "antd"
import { useMemo } from "react"

import useGlobalState from "~/hooks/useGlobalState"
import useThemes from "~/hooks/useThemes"

export default function ThemeSelector() {
  const [{ theme }, setState] = useGlobalState()
  const themes = useThemes()
  const items = useMemo(
    () => [
      { label: "选择主题", disabled: true, key: "select-theme" },
      ...Object.entries(themes).map(([key, { label, tooltip, icon }]) => ({
        label: tooltip ? (
          <Tooltip placement="left" title={tooltip}>
            <span>{label}</span>
          </Tooltip>
        ) : (
          label
        ),
        key,
        icon,
        onClick: () => {
          setState({ theme: key })
        },
      })),
    ],
    [themes, setState],
  )

  const themeConfig = useMemo(() => {
    return theme in themes ? themes[theme] : themes.auto
  }, [theme, themes])

  return (
    <Dropdown
      trigger={["click"]}
      arrow={true}
      placement="bottomRight"
      menu={{ items, selectable: true, selectedKeys: [theme] }}
      overlayStyle={{ zIndex: 1002 }}
    >
      <Button size="small" type="text" className="center">
        {themeConfig.icon || themeConfig.label}
      </Button>
    </Dropdown>
  )
}
