import { useEffect, useState } from "react"

import { isInClient } from "~/consts"
export type Platform = typeof window.shell.platform
export type Arch = typeof window.shell.arch
export type PlatformType = Platform | "Browser"

export function usePlatformType(): PlatformType {
  const [value, setValue] = useState<PlatformType>(window.shell?.platform ?? "Browser")
  //   useEffect(() => {
  //     isInClient && type().then(setValue).catch(console.error)
  //   }, [])

  return value
}

export function usePlatform(): Platform | undefined {
  const [value, setValue] = useState<Platform>(window.shell.platform)
  //   useEffect(() => {
  //     isInClient && platform().then(setValue).catch(console.error)
  //   }, [])

  return value
}

export function useArch(): Arch | undefined {
  const [value, setValue] = useState<Arch>(window.shell.arch)
  //   useEffect(() => {
  //     isInClient && arch().then(setValue).catch(console.error)
  //   }, [])

  return value
}
