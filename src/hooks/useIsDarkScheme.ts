import { useEffect, useState } from "react"

export default function useIsDarkScheme() {
  const [dark, setDark] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    matcher.addEventListener("change", onChange)

    return () => {
      matcher.removeEventListener("change", onChange)
    }
  }, [])

  return dark
}
