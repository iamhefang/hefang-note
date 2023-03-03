import { appWindow } from "@tauri-apps/api/window"
import _ from "lodash"
import { useEffect, useState } from "react"

export default function useMaximized() {
  const [value, setValue] = useState(window.outerWidth === screen.width && window.outerHeight + 100 >= screen.height)
  useEffect(() => {
    appWindow.isMaximized().then(setValue).catch(console.error)
    const onResize = _.throttle(() => {
      setTimeout(() => {
        appWindow.isMaximized().then(setValue).catch(console.error)
      }, 0)
    }, 300)
    window.addEventListener("resize", onResize)

    return () => window.removeEventListener("resize", onResize)
  }, [])

  return value
}
