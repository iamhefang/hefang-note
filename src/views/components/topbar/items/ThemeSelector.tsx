/*
 * @Author: iamhefang he@hefang.link
 * @LastEditors: iamhefang he@hefang.link
 * @LastEditTime: 2023-05-03 09:20:22
 * @Date: 2023-05-03 08:46:29
 * @Description:
 */
import { Button, Dropdown, Tooltip } from "antd"
import { useMemo } from "react"

import { useAppDispatch } from "~/redux"
import { changeTheme } from "~/redux/settingSlice"

import { useSettings } from "$hooks/useSelectors"
import useThemes from "$hooks/useThemes"
import { useTranslate } from "$hooks/useTranslate"
import usePlugins from "$plugin/hooks/usePlugins"
import { FooterTopComponent, PluginHookOccasion, ThemeChangeEvent } from "$plugin/types"

const ThemeSelector: FooterTopComponent = () => {
  const { theme } = useSettings()
  const t = useTranslate()
  const dispatch = useAppDispatch()
  const themes = useThemes()
  const plugins = usePlugins()
  const items = useMemo(
    () => [
      { label: t("选择主题"), disabled: true, key: "select-theme" },
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
          const themeEvent = new ThemeChangeEvent({ currentTarget: { theme }, occasion: PluginHookOccasion.before })
          for (const plugin of plugins) {
            if (!themeEvent.bubble) {
              break
            }
            plugin.hooks?.includes?.("onThemeChange") && plugin.onThemeChange?.(themeEvent)
          }
          themeEvent.isDefaultPrevented() || dispatch(changeTheme(key))
        },
      })),
    ],
    [t, themes, theme, dispatch, plugins],
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

ThemeSelector.order = 10
export default ThemeSelector
