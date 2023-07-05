import { theme } from "antd"
import { useMemo } from "react"


export default function useCkEditorTheme(): Record<string, string> {
    const { token } = theme.useToken()

    return useMemo(() => ({
        "--ck-color-base-foreground": token.colorTextBase,
        "--ck-color-base-background": token.colorBgBase,
        "--ck-color-base-border": token.colorBorder,
        "--ck-color-base-action": "hsl(104, 44%, 48%)",
        "--ck-color-base-focus": "hsl(209, 92%, 70%)",
        "--ck-color-base-text": token.colorTextBase,
        "--ck-color-base-active": token.colorPrimary,
        "--ck-color-base-active-focus": token.colorPrimaryBg,
        "--ck-color-base-error": "hsl(15, 100%, 43%)",

        /* -- Generic colors ------------------------------------------------------------------------ */

        "--ck-color-focus-border": token.colorPrimary,
        "--ck-color-focus-outer-shadow": "hsl(207, 89%, 86%)",
        "--ck-color-focus-disabled-shadow": "hsla(209, 90%, 72%,.3)",
        "--ck-color-focus-error-shadow": "hsla(9,100%,56%,.3)",
        "--ck-color-text": "var(--ck-color-base-text)",
        "--ck-color-shadow-drop": "hsla(0, 0%, 0%, 0.15)",
        "--ck-color-shadow-drop-active": "hsla(0, 0%, 0%, 0.2)",
        "--ck-color-shadow-inner": "hsla(0, 0%, 0%, 0.1)",

        /* -- Buttons ------------------------------------------------------------------------------- */

        "--ck-color-button-default-background": "transparent",
        "--ck-color-button-default-hover-background": token.colorPrimaryBgHover,
        "--ck-color-button-default-active-background": "hsl(0, 0%, 85%)",
        "--ck-color-button-default-active-shadow": "hsl(0, 0%, 75%)",
        "--ck-color-button-default-disabled-background": "transparent",

        "--ck-color-button-on-color": token.colorPrimary,
        "--ck-color-button-on-background": token.colorPrimaryBg,
        "--ck-color-button-on-hover-background": token.colorPrimaryBgHover,
        "--ck-color-button-on-active-background": "hsl(0, 0%, 73%)",
        "--ck-color-button-on-active-shadow": "hsl(0, 0%, 63%)",
        "--ck-color-button-on-disabled-background": "hsl(0, 0%, 87%)",

        "--ck-color-button-action-background": "var(--ck-color-base-action)",
        "--ck-color-button-action-hover-background": "hsl(104, 44%, 43%)",
        "--ck-color-button-action-active-background": "hsl(104, 44%, 41%)",
        "--ck-color-button-action-active-shadow": "hsl(104, 44%, 36%)",
        "--ck-color-button-action-disabled-background": "hsl(104, 44%, 58%)",
        "--ck-color-button-action-text": "var(--ck-color-base-background)",

        "--ck-color-button-save": "hsl(120, 100%, 27%)",
        "--ck-color-button-cancel": "hsl(15, 100%, 43%)",

        "--ck-color-switch-button-off-background": "hsl(0, 0%, 69%)",
        "--ck-color-switch-button-off-hover-background": "hsl(0, 0%, 64%)",
        "--ck-color-switch-button-on-background": "var(--ck-color-button-action-background)",
        "--ck-color-switch-button-on-hover-background": "hsl(104, 44%, 43%)",
        "--ck-color-switch-button-inner-background": "var(--ck-color-base-background)",
        "--ck-color-switch-button-inner-shadow": "hsla(0, 0%, 0%, 0.1)",

        /* -- Dropdown ------------------------------------------------------------------------------ */

        "--ck-color-dropdown-panel-background": "var(--ck-color-base-background)",
        "--ck-color-dropdown-panel-border": "var(--ck-color-base-border)",

        /* -- Input --------------------------------------------------------------------------------- */

        "--ck-color-input-background": "var(--ck-color-base-background)",
        "--ck-color-input-border": "hsl(0, 0%, 78%)",
        "--ck-color-input-error-border": "var(--ck-color-base-error)",
        "--ck-color-input-text": "var(--ck-color-base-text)",
        "--ck-color-input-disabled-background": "hsl(0, 0%, 95%)",
        "--ck-color-input-disabled-border": "hsl(0, 0%, 78%)",
        "--ck-color-input-disabled-text": "hsl(0, 0%, 36%)",

        /* -- List ---------------------------------------------------------------------------------- */

        "--ck-color-list-background": "var(--ck-color-base-background)",
        "--ck-color-list-button-hover-background": "var(--ck-color-button-default-hover-background)",
        "--ck-color-list-button-on-background": "var(--ck-color-base-active)",
        "--ck-color-list-button-on-background-focus": "var(--ck-color-base-active-focus)",
        "--ck-color-list-button-on-text": "var(--ck-color-base-background)",

        /* -- Panel --------------------------------------------------------------------------------- */

        "--ck-color-panel-background": "var(--ck-color-base-background)",
        "--ck-color-panel-border": "var(--ck-color-base-border)",

        /* -- Toolbar ------------------------------------------------------------------------------- */

        "--ck-color-toolbar-background": token.colorBgBase,
        "--ck-color-toolbar-border": "var(--ck-color-base-border)",

        /* -- Tooltip ------------------------------------------------------------------------------- */

        "--ck-color-tooltip-background": "var(--ck-color-base-text)",
        "--ck-color-tooltip-text": "var(--ck-color-base-foreground)",

        /* -- Engine -------------------------------------------------------------------------------- */

        "--ck-color-engine-placeholder-text": "hsl(0, 0%, 44%)",

        /* -- Upload -------------------------------------------------------------------------------- */

        "--ck-color-upload-bar-background": "hsl(209, 92%, 70%)",

        /* -- Link -------------------------------------------------------------------------------- */

        "--ck-color-link-default": "hsl(240, 100%, 47%)",
        "--ck-color-link-selected-background": "hsla(201, 100%, 56%, 0.1)",

        /* -- Others -------------------------------------------------------------------------------- */
        "--ck-focus-outer-shadow": "none",
        "--ck-focus-ring": "none",
    }),
        [
            token.colorBgBase,
            token.colorBorder,
            token.colorPrimary,
            token.colorPrimaryBg,
            token.colorPrimaryBgHover,
            token.colorTextBase,
        ],
    )
}