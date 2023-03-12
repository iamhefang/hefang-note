import { dialog, shell } from "@tauri-apps/api"
import { Modal } from "antd"
import { openDB } from "idb"
import _ from "lodash"

import { isInTauri, productName } from "~/consts"
import { NoteItem, Settings } from "~/types"

import { IPluginInfo } from "$hooks/usePlugins"
import pkg from "^/package.json"


export const database = openDB(pkg.name, 10, {
  async upgrade(db, oldVersion, newVersion, transaction, event) {
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
      void db.createObjectStore("settings").add(example.id, "current")
      storeContent = db.createObjectStore("content", { keyPath: "id" })
      void storeContent.add(example)
      db.createObjectStore("plugins", { keyPath: "id" })
    }
    if ((newVersion || 0) >= 10) {
      console.info(`正在把数据库从${oldVersion}升级到${newVersion}`)
      if (!storeContent) {
        storeContent = transaction.objectStore("content")
      }
      const storeNote = db.createObjectStore("notes", { keyPath: "id" })
      const storeContents = db.createObjectStore("contents")
      const allContent: NoteItem[] = await (storeContent)?.getAll() || []
      for (const { content, ...item } of allContent) {
        await storeNote.put(item)
        await storeContents.put(content, item.id)
      }
      db.deleteObjectStore("content")
    }
    await transaction.done
  },
  async blocking(currentVersion, blockedVersion, event) {
    const title = `您已经使用过新版本的${productName}`
    const content = "您使用的当前版本低于之前使用的版本"
    if (isInTauri) {
      await dialog.message(`${content}，请下载使用新版本`, { title })
      void shell.open("https://github.com/iamhefang/hefang-note/releases")
    } else {
      Modal.info({
        title, content: `${content}，请刷新后使用`,
        onOk() {
          window.location.reload()
        },
      })
    }
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
      const _db = await database
      const value = await _db.get(storeName, name as string)

      return _.isUndefined(value) ? defaultValue : value
    },
    async set(name: keyof T, value: T[keyof T]): Promise<void> {
      await (await database).put(storeName, value, name as string)
    },
    async setObject(values: Partial<T>): Promise<void> {
      const tx = (await database).transaction(storeName, "readwrite")
      await Promise.all(Object.entries(values).map(async ([key, value]) => {
        await tx.store.put(value, key)
      }).concat(tx.done))
    },
    async getObject(): Promise<T> {
      const _db = (await database)
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
      return (await database).get(storeName, key) as Promise<T>
    },
    async getAll() {
      return (await database).getAll(storeName) as unknown as Promise<T[]>
    },
    async getAllIds() {
      return (await database).getAllKeys(storeName) as Promise<string[]>
    },
    async set(...value) {
      const _db = await database

      const tx = _db.transaction(storeName, "readwrite")
      await Promise.all(value.map(async item => { await tx.store.put(item) }).concat(tx.done))
    },
    async delete(...ids: string[]) {
      const _db = await database
      const tx = _db.transaction(storeName, "readwrite")
      await Promise.all(ids.map(async id => tx.store.delete(id)).concat(tx.done))
    },
    async getBy(range: IDBKeyRange) {
      const _db = await database
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