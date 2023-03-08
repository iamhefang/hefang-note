import { openDB } from "idb"
import _ from "lodash"

import { versionCode } from "~/consts"
import { IPluginInfo } from "~/hooks/usePlugins"
import { NoteItem, Settings } from "~/types"

import pkg from "^/package.json"

const db = openDB(pkg.name, versionCode, {
  upgrade(database, oldVersion, newVersion, transaction, event) {
    if (oldVersion === 0 && newVersion === 1) {
      const example: NoteItem = {
        id: crypto.randomUUID(),
        title: "示例笔记",
        isLeaf: true,
        createTime: Date.now(),
        modifyTime: Date.now(),
        content: [
          `感谢你使用${pkg.productName}`,
          `${pkg.productName}的所有内容都保存在本地，不通过网络传输，开发者和您的网络运营商都无法获取您的数据。`,
          "在您不清空浏览器数据的情况下数据将一直存在。",
          `${pkg.productName}到后期会开源，如果您想要立即参与${pkg.productName}的开发，可联系我的邮箱 he@hefang.link`,
        ].join("\n\n"),
      }
      void database.createObjectStore("settings").add(example.id, "current")
      void database.createObjectStore("content", { keyPath: "id" }).add(example)
      database.createObjectStore("plugins", { keyPath: "id" })
    }
  },
})

export interface IKeyValueDbStore<T extends Record<string, unknown>> {
  get(name: keyof T, defaultValue?: T[keyof T]): Promise<T[keyof T]>
  set(name: keyof T, value: T[keyof T]): Promise<void>
  setObject(values: Partial<T>): Promise<void>
  getObject(fallback?: T): Promise<T>
}

export interface IRecordDbStore<T> {
  get(key: string): Promise<T>
  set(...value: T[]): Promise<void>
  getAll(): Promise<T[]>;
  getAllIds(): Promise<string[]>
  delete(...ids: string[]): Promise<void>;
  getBy(ranges: IDBKeyRange): Promise<T[]>
}

function createKeyValueDbStore<T extends Record<string, unknown>>(storeName: string): IKeyValueDbStore<T> {
  return {
    async get(name: keyof T, defaultValue?: T[keyof T]): Promise<T[keyof T]> {
      const _db = await db
      const hasKey = (await _db.getAllKeys(storeName, name as string)).includes(name as string)

      return (hasKey ? (await db).get(storeName, name as string) : defaultValue) as T[keyof T]
    },
    async set(name: keyof T, value: T[keyof T]): Promise<void> {
      await (await db).put(storeName, value, name as string)
    },
    async setObject(values: Partial<T>): Promise<void> {
      const tx = (await db).transaction(storeName, "readwrite")
      await Promise.all(Object.entries(values).map(async ([key, value]) => {
        await tx.store.put(value, key)
      }).concat(tx.done))
    },
    async getObject(fallback?: T): Promise<T> {
      const _db = (await db)
      const keys = await _db.getAllKeys<string>(storeName)
      const values = await _db.getAll(storeName)
      //@ts-ignore
      const data: T = {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        //@ts-ignore
        data[String(key)] = values[i]
      }

      return _.merge(fallback || {}, data)
    },
  }
}

function createRecordsDbStore<T>(storeName: string): IRecordDbStore<T> {
  return {
    async get(key) {
      return (await db).get(storeName, key) as Promise<T>
    },
    async getAll() {
      return (await db).getAll(storeName) as unknown as Promise<T[]>
    },
    async getAllIds() {
      return (await db).getAllKeys(storeName) as Promise<string[]>
    },
    async set(...value) {
      const _db = await db

      const tx = _db.transaction(storeName, "readwrite")
      await Promise.all(value.map(async item => { await tx.store.put(item) }).concat(tx.done))
    },
    async delete(...ids: string[]) {
      const _db = await db
      const tx = _db.transaction(storeName, "readwrite")
      await Promise.all(ids.map(async id => tx.store.delete(id)).concat(tx.done))
    },
    async getBy(range: IDBKeyRange) {
      const _db = await db
      let cursor = await _db.transaction(storeName, "readonly").objectStore(storeName).index("id").openCursor(range)
      const values = []
      while (cursor) {
        values.push(cursor.value)
        cursor = await cursor.continue()
      }

      return values
    },
  }
}

export const settingsStore = createKeyValueDbStore<Settings>("settings")
export const contentStore = createRecordsDbStore<NoteItem>("content")
export const pluginStore = createRecordsDbStore<Omit<IPluginInfo, "path">>("plugins")

if (import.meta.env.DEV) {

  // @ts-ignore
  window.contentPager = async ({ pageIndex = 1, pageSize = 100, lastId = "" }: { pageIndex: number, pageSize: number, lastId: string }) => {
    const req = await (await db).transaction("content", "readonly").objectStore("content").index("id").openCursor(IDBKeyRange.upperBound(lastId))
  }

  // @ts-ignore
  window.settingsStore = settingsStore
  // @ts-ignore
  window.contentStore = contentStore
  // @ts-ignore
  window.pluginStore = pluginStore
  // @ts-ignore
  window.initPluginsMockData = async function (count: number = 10) {
    const c = Math.abs(count)
    if (count < 0) {
      void (await db).clear("plugins")
    }
    for (let i = 0; i < c; i++) {
      void pluginStore.set({
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
  }

  // @ts-ignore
  window.initContentsMockData = async function (count: number = 10) {
    for (let i = 0; i < count; i++) {
      const id = crypto.randomUUID()
      const isLeaf = Math.random() > .5
      await contentStore.set({
        id,
        title: `笔记标题${i}`,
        isLeaf,
        createTime: Date.now(),
        modifyTime: Date.now(),
        content: isLeaf ? `这是内容${i}-`.repeat(count) : undefined,
      })
      if (!isLeaf) {
        for (let j = 0; j < count; j++) {
          await contentStore.set({
            id: crypto.randomUUID(),
            title: `笔记标题${i}-${j}`,
            parentId: id,
            isLeaf: true,
            createTime: Date.now(),
            modifyTime: Date.now(),
            content: `这是内容${i}-${j}-`.repeat(count),
          })
        }
      }
    }
  }

  // @ts-ignore
  window.exportPluginIndex = function () {
    // eslint-disable-next-line no-console
    void pluginStore.getAll().then(console.log)
  }

}
