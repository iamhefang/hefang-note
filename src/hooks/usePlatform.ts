import { arch, Arch, OsType, platform, Platform, type } from "@tauri-apps/api/os"
import { useEffect, useState } from "react"

import { isInTauri } from "~/consts"

export type PlatformType = OsType | "Browser"
export function usePlatformType(): PlatformType {
  const [value, setValue] = useState<PlatformType>("Browser")
  useEffect(() => {
    isInTauri && type().then(setValue).catch(console.error)
  }, [])

  return value
}

export function usePlatform(): Platform | undefined {
  const [value, setValue] = useState<Platform>()
  useEffect(() => {
    isInTauri && platform().then(setValue).catch(console.error)
  }, [])

  return value
}

export function useArch(): Arch | undefined {
  const [value, setValue] = useState<Arch>()
  useEffect(() => {
    isInTauri && arch().then(setValue).catch(console.error)
  }, [])

  return value
}

export function useOsTypr(): OsType | undefined {
  const [value, setValue] = useState<OsType>()
  useEffect(() => {
    isInTauri && type().then(setValue).catch(console.error)
  }, [])

  return value
}