import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons"
import { theme } from "antd"
import { useMemo } from "react"

import type { Themes } from "~/types"
import IconMoon from "~/views/icons/moon.svg"
import IconSun from "~/views/icons/sun.svg"
import IconSunglasses from "~/views/icons/sunglasses.svg"

import useIsDarkScheme from "./useIsDarkScheme"
import usePlugins from "./usePlugins"

export default function useThemes(): Themes {
  const isDark = useIsDarkScheme()
  const plugins = usePlugins()

  return useMemo(() => {
    const themes: Themes = {
      auto: {
        label: "自动",
        icon: <ClockCircleOutlined />,
        tooltip: "根据系统颜色模式自动选择深色或浅色",
        token: { colorPrimary: "#fc6a4c" },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      },
      light: {
        label: "浅色",
        icon: <IconSun />,
        token: { colorPrimary: "#fc6a4c" },
      },
      dark: {
        label: "深色",
        algorithm: theme.darkAlgorithm,
        icon: <IconMoon />,
        token: { colorPrimary: "#fc6a4c" },
      },
      eyeshield: {
        label: "护眼",
        icon: <EyeOutlined />,
        token: { colorBgBase: "#bcf7c7", colorPrimary: "#49a35a" },
      },
      "anti-blue-ray": {
        label: "防蓝光",
        icon: <IconSunglasses />,
        token: { colorBgBase: "#fcf6e5", colorPrimary: "#9a843b" },
      },
    }

    for (const plugin of plugins) {
      if (plugin.abilities?.includes("themes") && plugin.theme) {
        console.info(`插件${plugin.name}提供了主题`, plugin.theme)
        themes[plugin.id] = plugin.theme
      }
    }

    return themes
  }, [isDark, plugins])
}
