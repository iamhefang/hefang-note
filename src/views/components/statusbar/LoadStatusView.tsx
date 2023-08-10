import { InfoCircleOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import { useMemo } from "react"

import { useNotes } from "$hooks/useSelectors"
import { useTranslate } from "$hooks/useTranslate"

export default function LoadStatusView() {
  const { status } = useNotes()
  const t = useTranslate()

  return useMemo(() => {
    if (status === "failed") {
      return <InfoCircleOutlined />
    }
    if (status === "idle") {
      return null
    }

    return (
      <span title={t("数据量大，正在加载，请稍候")}>
        <Spin size="small" />
      </span>
    )
  }, [status, t])
}
