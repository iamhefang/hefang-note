import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons"
import { theme } from "antd"
import { useMemo } from "react"

import type { Themes } from "~/types"

import useIsDarkScheme from "./useIsDarkScheme"

import Iconfont from "$components/icons/Iconfont"
import usePlugins from "$plugin/hooks/usePlugins"

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
        icon: <Iconfont type="sun" />,
        token: { colorPrimary: "#fc6a4c" },
      },
      dark: {
        label: "深色",
        algorithm: theme.darkAlgorithm,
        icon: <Iconfont type="moon" />,
        token: { colorPrimary: "#fc6a4c" },
      },
      eyeshield: {
        label: "护眼",
        icon: <EyeOutlined />,
        token: { colorBgBase: "#bcf7c7", colorPrimary: "#49a35a" },
      },
      "anti-blue-ray": {
        label: "防蓝光",
        icon: <Iconfont type="sunglasses" />,
        token: { colorBgBase: "#fcf6e5", colorPrimary: "#9a843b" },
      },
    }

    for (const plugin of plugins) {
      if (plugin.abilities?.includes("theme") && plugin.theme) {
        themes[plugin.id] = plugin.theme
      }
    }

    return themes
  }, [isDark, plugins])
}
