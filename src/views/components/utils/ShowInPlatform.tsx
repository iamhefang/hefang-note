import { ReactElement, useMemo } from "react"

import { PlatformType } from "$hooks/usePlatform"

export type ShowInPlatformProps = {
  platforms: PlatformType[]
  children: () => ReactElement
}
export default function ShowInPlatform({ platforms, children }: ShowInPlatformProps) {
  // const osType = usePlatformType()
  const includes = platforms.includes(window.shell?.platform ?? "Browser")

  return useMemo(() => (includes ? children() : null), [includes, children])
}
