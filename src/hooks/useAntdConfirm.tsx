import {App, ModalFuncProps} from "antd"
import {useCallback} from "react"

export type AntdConfirmProps = Pick<ModalFuncProps, "icon" | "title" | "content" | "okText" | "cancelText" | "okButtonProps">
export default function useAntdConfirm() {
    const {modal} = App.useApp()

    return useCallback(
        async (props: AntdConfirmProps): Promise<boolean> => {
            return new Promise((resovle, reject) => {
                modal.confirm({
                    ...props,
                    onOk() {
                        resovle(true)
                    },
                    onCancel(...args) {
                        resovle(false)
                    },
                })
            })
        },
        [modal],
    )
}
