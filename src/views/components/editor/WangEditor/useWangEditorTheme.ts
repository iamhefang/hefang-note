import { theme } from "antd"
import { useMemo } from "react"


export default function useWangEditorTheme(): Record<string, string | number> {
    const { token } = theme.useToken()

    return useMemo(() => ({
        // textarea - css vars
        "--w-e-textarea-bg-color": token.colorBgLayout,
        "--w-e-textarea-color": token.colorTextBase,
        "--w-e-textarea-border-color": "#ccc",
        "--w-e-textarea-slight-border-color": "#e8e8e8",
        "--w-e-textarea-slight-color": "#d4d4d4",
        "--w-e-textarea-slight-bg-color": "#f5f2f0",
        "--w-e-textarea-selected-border-color": "#B4D5FF", // 选中的元素，如选中了分割线
        "--w-e-textarea-handler-bg-color": "#4290f7", // 工具，如图片拖拽按钮
        "--w-e-text-placeholder-color": token.colorTextPlaceholder,

        // toolbar - css vars
        "--w-e-toolbar-color": token.colorTextBase,
        "--w-e-toolbar-bg-color": token.colorBgLayout,
        "--w-e-toolbar-active-color": token.colorPrimaryTextActive,
        "--w-e-toolbar-active-bg-color": token.colorPrimaryBg,
        "--w-e-toolbar-disabled-color": "#999",
        "--w-e-toolbar-border-color": token.colorBorder,
        "--w-e-toolbar-border-radius": `${token.borderRadius}px`,

        // modal - css vars
        "--w-e-modal-button-bg-color": "#fafafa",
        "--w-e-modal-button-border-color": "#d9d9d9",
    }), [
        token.borderRadius, token.colorBgLayout, token.colorBorder, token.colorPrimaryBg,
        token.colorPrimaryTextActive, token.colorTextBase, token.colorTextPlaceholder,
    ])
}