import { PlatformType } from "hefang-note-types"
import { ReactElement, useMemo } from "react"

import { usePlatformType } from "$hooks/usePlatform"

export type ShowInPlatformProps = {
  platforms: PlatformType[]
  children: () => ReactElement
}
export default function ShowInPlatform({ platforms, children }: ShowInPlatformProps) {
  const osType = usePlatformType()
  const includes = platforms.includes(osType)

  return useMemo(() => (includes ? children() : null), [includes, children])
}
