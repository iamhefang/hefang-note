import dayjs from "dayjs"
import { useMemo } from "react"

import { useLocaleDefine } from "$hooks/useTranslate"

export default function useDayjs(): typeof dayjs {
  const locale = useLocaleDefine()

  return useMemo(() => {
    dayjs.locale(locale.dayjs)

    return dayjs
  }, [locale.dayjs])
}
