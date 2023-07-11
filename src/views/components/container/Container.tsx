import { App as Antd, ConfigProvider } from "antd"
import { PropsWithChildren } from "react"

import { useThemeConfig } from "$hooks/useThemeConfig"
import { useLocaleDefine } from "$hooks/useTranslate"
import usePluginEffect from "$plugin/hooks/usePluginEffect"

export default function Container({ children }: PropsWithChildren) {
  usePluginEffect()
  const themeConfig = useThemeConfig()
  const locale = useLocaleDefine()

  return (
    <ConfigProvider autoInsertSpaceInButton={false} locale={locale.antd} theme={themeConfig}>
      <Antd message={{ top: 40 }} notification={{ top: 40 }}>
        {children}
      </Antd>
    </ConfigProvider>
  )
}
