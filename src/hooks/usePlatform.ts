import { OsType, type } from "@tauri-apps/api/os"
import { noop } from "lodash"
import { useEffect, useState } from "react"

export type PlatformType = OsType | "Browser"
export default function usePlatform(): PlatformType {
  const [value, setValue] = useState<PlatformType>("Browser")
  useEffect(() => {
    type().then(setValue).catch(noop)
  }, [])

  return value
}
