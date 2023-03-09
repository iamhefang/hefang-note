import { ReactElement, useMemo } from "react"

import usePlatform, { PlatformType } from "$hooks/usePlatform"

export type ShowInPlatformProps = {
  platforms: PlatformType[]
  children: () => ReactElement
}
export default function ShowInPlatform({ platforms, children }: ShowInPlatformProps) {
  const osType = usePlatform()
  const includes = platforms.includes(osType)

  return useMemo(() => (includes ? children() : null), [includes, children])
}
