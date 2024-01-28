import {IpcEvents} from "~/common/ipcEvents"
import {isInElectron, isInTauri, versionName} from "~/consts"

export interface INativeBridge {
    readonly version: string,
    readonly type: "electron" | "tauri" | "browser",
    readonly platform?: typeof process.platform,
    readonly arch?: typeof process.arch,
    readonly debug: boolean,
    readonly api?: INativeBridgeApi
}

export interface INativeBridgeApi {
    setThemeColor(color: IThemeColor): void;

    setAlwaysOnTop(value: boolean): void;

    isAlwaysOnTop(): Promise<boolean>;

    exit(): void;

    readonly window: IWindowAction
    readonly listeners: IListeners
}

export interface IListeners {
    on(event: IpcEvents, listener: () => void): IListeners;

    once(event: IpcEvents, listener: () => void): IListeners;

    off(event: IpcEvents, listener: () => void): IListeners;

    removeAllListeners(event: IpcEvents): IListeners;
}

export interface IThemeColor {
    readonly bgColor?: string
    readonly fgColor?: string
}

export interface IWindowAction {
    minimize(): void;

    maximize(): void;

    restore(): void;

    toggle(): void;

    isMaximized(): Promise<boolean>;

    isMinimized(): Promise<boolean>;
}

if (!isInElectron) {
    const shell: INativeBridge = {
        version: versionName,
        type: isInTauri ? "tauri" : "browser",
        debug: false,
    }
    if (isInTauri) {
        const {appWindow} = await import("@tauri-apps/api/window")
        const {exit} = await import("@tauri-apps/api/process")
        Object.defineProperty(shell, "api", {
            value: {
                window: {
                    minimize(): void {
                        void appWindow.minimize()
                    },
                    maximize(): void {
                        void appWindow.maximize()
                    },
                    restore(): void {
                        void appWindow.unmaximize()
                    },
                    toggle(): void {
                        void appWindow.isMaximized().then((maximized) => {
                            if (maximized) {
                                void appWindow.unmaximize()
                            } else {
                                void appWindow.maximize()
                            }
                        })
                    },
                    async isMaximized(): Promise<boolean> {
                        return appWindow.isMaximized()
                    },
                    async isMinimized(): Promise<boolean> {
                        return appWindow.isMinimized()
                    },
                },
                exit(): void {
                    void exit(0)
                },
                async isAlwaysOnTop(): Promise<boolean> {
                    return Promise.resolve(false)
                },
                setAlwaysOnTop(value: boolean): void {
                    void appWindow.setAlwaysOnTop(value)
                },
                setThemeColor(color: IThemeColor): void {
                },
            },
        })
    }
    Object.defineProperty(window, "shell", {
        value: shell,
        writable: false,
        configurable: false,
    })
}