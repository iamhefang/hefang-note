import { arch, Arch, OsType, platform, Platform, type } from "@tauri-apps/api/os"
import { PlatformType } from "hefang-note-types"
import { useEffect, useState } from "react"

import { isInClient } from "~/consts"

export function usePlatformType(): PlatformType {
  const [value, setValue] = useState<PlatformType>("Browser")
  useEffect(() => {
    isInClient && type().then(setValue).catch(console.error)
  }, [])

  return value
}

export function usePlatform(): Platform | undefined {
  const [value, setValue] = useState<Platform>()
  useEffect(() => {
    isInClient && platform().then(setValue).catch(console.error)
  }, [])

  return value
}

export function useArch(): Arch | undefined {
  const [value, setValue] = useState<Arch>()
  useEffect(() => {
    isInClient && arch().then(setValue).catch(console.error)
  }, [])

  return value
}

export function useOsTypr(): OsType | undefined {
  const [value, setValue] = useState<OsType>()
  useEffect(() => {
    isInClient && type().then(setValue).catch(console.error)
  }, [])

  return value
}
