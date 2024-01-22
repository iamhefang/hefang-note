import {BrowserWindow, app, Menu, shell, ipcMain} from "electron"
import path from "path"
import {IpcEvents} from "~/common/ipcEvents"

let window: BrowserWindow | null = null

app.on("ready", () => {
    app.applicationMenu = Menu.buildFromTemplate([
        {
            label: "何方笔记",
            role: "appMenu",
            submenu: [
                {
                    label: "关于何方笔记",
                    click() {
                        ipcMain.emit(IpcEvents.OPEN_ABOUT)
                    },
                },
                {
                    label: "检查更新",
                    click() {
                        ipcMain.emit(IpcEvents.CHECK_UPDATE)
                    },
                },
                {type: "separator"},
                {
                    label: "设置...",
                    click() {
                        ipcMain.emit(IpcEvents.OPEN_SETTINGS)
                    },
                },
                {
                    label: "插件管理...",
                    click() {
                        ipcMain.emit(IpcEvents.OPEN_PLUGIN_MANAGER)
                    },
                },
                {type: "separator"},
                {
                    label: "重新启动",
                    accelerator: "Command+Shift+R",
                    click() {
                        app.relaunch()
                        app.exit(0)
                    },
                },
                {
                    label: "退出",
                    role: "quit",
                },
            ],
        },
        {
            label: "文件",
            role: "fileMenu",
            submenu: [
                {
                    label: "新建笔记",
                    accelerator: "Command+N",
                    click() {
                        console.log("新建笔记")
                    },
                },
                {
                    label: "新建文件夹",
                    accelerator: "Command+Shift+N",
                    click() {
                        console.log("新建文件夹")
                    },
                },
            ],
        },
        {
            label: "编辑",
            role: "editMenu",
            submenu: [
                {
                    label: "撤销",
                    role: "undo",
                },
                {
                    label: "重做",
                    role: "redo",
                },
                {type: "separator"},
                {
                    label: "剪切",
                    role: "cut",
                },
                {
                    label: "复制",
                    role: "copy",
                },
                {
                    label: "粘贴",
                    role: "paste",
                },
                {
                    label: "删除",
                    role: "delete",
                },
                {
                    label: "全选",
                    role: "selectAll",
                },
            ],
        },
        {
            label: "视图",
            role: "viewMenu",
            submenu: [
                {
                    label: "打开/关闭侧边栏",
                },
                {
                    label: "切换全屏",
                    role: "togglefullscreen",
                },
                {
                    label: "锁定软件",
                },
            ],
        },
        {
            label: "帮助",
            role: "help",
            submenu: [
                {
                    label: "反馈/建议",
                    click() {
                        shell.openExternal("https://github.com/iamhefang/hefang-note/issues")
                    },
                },
                {type: "separator"},
                {label: "打开/关闭开发者工具", role: "toggleDevTools"},
            ],
        },
    ])
    window = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: false,
        titleBarStyle: "hiddenInset",
        webPreferences: {
            preload: path.resolve(__dirname, "../preload/preload.mjs"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    // window.loadFile("index.html")
    window.loadURL("http://localhost:8888")
})