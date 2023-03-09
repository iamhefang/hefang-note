import { openDB } from "idb"

import { IPluginInfo } from "~/hooks/usePlugins"
import { NoteItem, Settings } from "~/types"

import pkg from "^/package.json"
import _ from "lodash"

const db = openDB(pkg.name, 10, {
  async upgrade(database, oldVersion, newVersion, transaction, event) {
    let storeContent
    if (oldVersion === 0) {
      console.info("正在创建初始数据库")
      const example: NoteItem = {
        id: crypto.randomUUID(),
        title: "示例笔记",
        isLeaf: true,
        createTime: Date.now(),
        modifyTime: Date.now(),
        content: `感谢使用${pkg.productName}`,
      }
      void database.createObjectStore("settings").add(example.id, "current")
      storeContent = database.createObjectStore("content", { keyPath: "id" })
      void storeContent.add(example)
      database.createObjectStore("plugins", { keyPath: "id" })
    }
    if ((newVersion || 0) >= 10) {
      console.info(`正在把数据库从${oldVersion}升级到${newVersion}`)
      if (!storeContent) {
        storeContent = transaction.objectStore("content")
      }
      const storeNote = database.createObjectStore("notes", { keyPath: "id" })
      const storeContents = database.createObjectStore("contents")
      const allContent: NoteItem[] = await (storeContent)?.getAll() || []
      for (const { content, ...item } of allContent) {
        await storeNote.put(item)
        await storeContents.put(content, item.id)
      }
      database.deleteObjectStore("content")
    }
    await transaction.done
  },
})

export interface IKeyValueDbStore<T extends Record<string, unknown>> {
  get(name: keyof T, defaultValue?: T[keyof T]): Promise<T[keyof T]>
  set(name: keyof T, value: T[keyof T]): Promise<void>
  setObject(values: Partial<T>): Promise<void>
  getObject(): Promise<T>
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
      const value = await _db.get(storeName, name as string)

      return _.isUndefined(value) ? defaultValue : value
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
    async getObject(): Promise<T> {
      const _db = (await db)
      const keys = await _db.getAllKeys(storeName)
      const values = await _db.getAll(storeName)
      //@ts-ignore
      const data: T = {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        //@ts-ignore
        data[String(key)] = values[i]
      }

      return data
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
export const notesStore = createRecordsDbStore<NoteItem>("notes")
export const contentStore = createKeyValueDbStore<{ [id: string]: string }>("contents")
export const pluginStore = createRecordsDbStore<Omit<IPluginInfo, "path">>("plugins")

if (import.meta.env.DEV && typeof window !== "undefined") {

  // @ts-ignore
  window.contentPager = async ({ pageIndex = 1, pageSize = 100, lastId = "" }: { pageIndex: number, pageSize: number, lastId: string }) => {
    const req = await (await db).transaction("content", "readonly").objectStore("content").index("id").openCursor(IDBKeyRange.upperBound(lastId))
  }

  // @ts-ignore
  window.settingsStore = settingsStore
  // @ts-ignore
  window.contentStore = notesStore
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
  }

  // @ts-ignore
  window.exportPluginIndex = function () {
    // eslint-disable-next-line no-console
    void pluginStore.getAll().then(console.log)
  }

}
