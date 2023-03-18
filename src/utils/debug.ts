import { path } from "@tauri-apps/api"
import { deleteDB } from "idb"

import { isInTauri } from "~/consts"

import { contentStore, database, notesStore, pluginStore, settingsStore } from "./database"
import { decrypt, encrypt } from "./encrypt"


if (import.meta.env.DEV && typeof window !== "undefined") {

    if (isInTauri) {
        void (async () => {
            console.info("appDataDir", await path.appDataDir())
            console.info("appCacheDir", await path.appCacheDir())
            console.info("appConfigDir", await path.appConfigDir())
        })()
    }

    const devTools =
    {
        settingsStore,
        notesStore,
        pluginStore,
        encrypt, decrypt,
        async initPluginsMockData(count: number = 10) {
            const c = Math.abs(count)
            if (count < 0) {
                await (await database).clear("plugins")
            }
            for (let i = 0; i < c; i++) {
                await pluginStore.set({
                    id: crypto.randomUUID(),
                    author: `何方${i}`,
                    name: `插件${i}`,
                    description: "插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述插件描述",
                    version: "1.2.3",
                    homepage: "https://iamhefang.cn",
                    repository: "https://github.com/iamhefang/notes",
                    supports: {
                        platform: ["Darwin", "Linux", "Windows_NT"],
                        version: "0.0.1",
                    },
                    abilities: ["themes"],
                    components: ["Editor"],
                })
            }
        },
        async contentPager({ pageIndex = 1, pageSize = 100, lastId = "" }: { pageIndex: number, pageSize: number, lastId: string }) {
            const req = await (await database).transaction("content", "readonly").objectStore("content").index("id").openCursor(IDBKeyRange.upperBound(lastId))
        },
        async initContentsMockData(count: number = 10) {
            for (let i = 0; i < count; i++) {
                const id = crypto.randomUUID()
                const isLeaf = Math.random() > .5
                await notesStore.set({
                    id,
                    title: `笔记标题${i}`,
                    isLeaf,
                    createTime: Date.now(),
                    modifyTime: Date.now(),
                })

                isLeaf && await contentStore.set(id, `这是内容${i} `.repeat(100))
                if (!isLeaf) {
                    for (let j = 0; j < count; j++) {
                        const childId = crypto.randomUUID()
                        await notesStore.set({
                            id: childId,
                            title: `笔记标题${i}-${j}`,
                            parentId: id,
                            isLeaf: true,
                            createTime: Date.now(),
                            modifyTime: Date.now(),
                        })
                        await contentStore.set(childId, `这是内容${i}-${j} `.repeat(100))
                    }
                }
            }
        },
        exportPluginIndex() {
            // eslint-disable-next-line no-console
            void pluginStore.getAll().then(console.log)
        },
        async clearData() {
            await deleteDB("hefang-note")
            window.location.reload()
        },
    }
    Object.defineProperty(window, "devTools", { value: devTools })
}
