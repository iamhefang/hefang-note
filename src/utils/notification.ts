import {isPermissionGranted, Options, requestPermission, sendNotification} from "@tauri-apps/api/notification"

export async function trySendNativeNotification(options: Options | string) {
    const hasPermission = await isPermissionGranted()
    if (!hasPermission) {
        const permission = await requestPermission()
        if (permission !== "granted") {
            throw new Error("没有通知权限")
        }
    }
    sendNotification(options)
}

export async function trySendNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission !== "granted" && (await Notification.requestPermission()) !== "granted") {
        return
    }

    return new Notification(title, options)
}

if (import.meta.env.DEV) {
    // @ts-ignore
    window.trySendNotification = trySendNotification
}
