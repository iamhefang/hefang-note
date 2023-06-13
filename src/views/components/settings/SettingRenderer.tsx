import { List } from "antd"
import { isValidElement, ReactNode, useMemo } from "react"

export  type SettingRendererProps = {
    formItems: Record<string, ReactNode> | ReactNode
}
export default function SettingRenderer({ formItems }: SettingRendererProps) {
    return useMemo(() => {
        let formBody: ReactNode
        if (isValidElement(formItems)) {
            formBody = (
                <div style={{ display: "block", width: "100%" }}>
                    {formItems as ReactNode}
                </div>
            )
        } else {
            formBody = (
                <List style={{ width: "100%" }}>
                    {Object.entries(formItems as Record<string, ReactNode>).map(([label, dom]) => (
                        <List.Item extra={dom} key={`form-label-${label}`}>
                            {label}
                        </List.Item>
                    ))}
                </List>
            )
        }

        return formBody
    }, [formItems])
}