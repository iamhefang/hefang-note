import { App } from "antd"
import { useEffect } from "react"

import { versionName } from "~/consts"

import Html from "$components/utils/Html"
import { useTranslate } from "$hooks/useTranslate"
import { html } from "^/CHANGELOG.md"


export default function useVersionInfoModal() {
  const { modal } = App.useApp()
  const t = useTranslate()
  useEffect(() => {
    if (localStorage.getItem("firstRun") !== versionName) {
      modal.info({
        title: t("更新日志"),
        content: (
          <Html className="changelog-container" data-selectable>
            {html}
          </Html>
        ),
        okText: t("知道了"),
        width: "90%",
        centered: true,
        style: { maxWidth: 600 },
        onOk() {
          localStorage.setItem("firstRun", versionName)
        },
      })
    }
  }, [modal, t])
}
