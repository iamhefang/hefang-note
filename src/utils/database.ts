import {openDB} from "idb"
import _ from "lodash"

import {versionCode} from "~/consts"
import {IPluginInfo} from "~/plugin/types"
import {NoteItem, Settings} from "~/types"

import {decrypt, encrypt} from "./encrypt"

import changelog from "^/CHANGELOG.md?raw"
import pkg from "^/package.json"


export const database = openDB(pkg.name, versionCode, {
    async upgrade(db, oldVersion, newVersion, transaction, event) {
        let storeContent
        let storeSettings
        const nv = newVersion || 0
        if (oldVersion === 0) {
            console.info("正在创建初始数据库")
            const example: NoteItem = {
                id: crypto.randomUUID(),
                title: "更新日志",
                isLeaf: true,
                createTime: Date.now(),
                modifyTime: Date.now(),
                content: changelog,
            }
            storeSettings = db.createObjectStore("settings")
            storeContent = db.createObjectStore("content", {keyPath: "id"})
            db.createObjectStore("plugins", {keyPath: "id"})

            await storeContent.add(example)
            await storeSettings.add(example.id, "current")
        }
        let storeContents
        if (nv >= 10 && oldVersion < 10) {
            console.info(`正在把数据库从${oldVersion}升级到v0.1.0`)
            if (!storeContent) {
                storeContent = transaction.objectStore("content")
            }
            const storeNote = db.createObjectStore("notes", {keyPath: "id"})
            storeContents = db.createObjectStore("contents")
            const allContent: NoteItem[] = await (storeContent)?.getAll() || []
            for (const {content, ...item} of allContent) {
                await storeNote.put(item)
                await storeContents.put(content, item.id)
            }
            db.deleteObjectStore("content")
        }
        if (nv >= 20 && oldVersion < 20) {
            console.info(`正在把数据库从${oldVersion}升级到v0.2.0`)
            if (!storeContents) {
                storeContents = transaction.objectStore("contents")
            }
            if (!storeSettings) {
                storeSettings = transaction.objectStore("settings")
            }
            const allKeys = await storeContents.getAllKeys() || []
            console.info("upgrade keys", allKeys)
            const allContents = await storeContents.getAll() || []
            const lockedContents = await storeSettings.get("lockedContents")
            for (let i = 0; i < allKeys.length; i++) {
                const key = allKeys[i]
                const conetent = allContents[i]
                const newContent = encrypt(JSON.stringify(conetent))
                await storeContents.put(newContent, key).catch(console.error)
            }
            await storeSettings.put(encrypt(JSON.stringify(lockedContents)), "lockedContents").catch(console.error)
        }
        await transaction.done.catch(console.error)
    },
    async blocked(currentVersion, blockedVersion, event) {
        console.warn("Database blocked", currentVersion, blockedVersion, event)
    },
})

export interface IKeyValueDbStore<T extends object> {
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

function createKeyValueDbStore<T extends object, K extends keyof T = keyof T>(storeName: string, needEncrypt: boolean | K[] = false): IKeyValueDbStore<T> {

    function shouldEncrypt(key: K) {
        return needEncrypt === true || Array.isArray(needEncrypt) && needEncrypt.includes(key)
    }

    return {
        async get(name: K, defaultValue?: T[K]): Promise<T[K]> {
            const db = await database
            const value = await db.get(storeName, name as string)

            return _.isUndefined(value) ? defaultValue : (shouldEncrypt(name) ? JSON.parse(decrypt(value)) : value)
        },
        async set(name: K, value: T[K]): Promise<void> {
            await (await database).put(storeName, shouldEncrypt(name) ? encrypt(JSON.stringify(value)) : value, name as string)
        },
        async setObject(values: Partial<T>): Promise<void> {
            const tx = (await database).transaction(storeName, "readwrite")

            for (const [key, value] of Object.entries(values)) {
                await tx.store.put(shouldEncrypt(key as K) ? encrypt(JSON.stringify(value)) : value, key)
            }
            await tx.done
        },
        async getObject(): Promise<T> {
            const db = await database
            const keys = await db.getAllKeys(storeName)
            const values = await db.getAll(storeName)
            const data: Partial<T> = {}
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i] as K
                const value = values[i]
                data[key] = shouldEncrypt(key) ? JSON.parse(decrypt(value)) : value
            }

            return data as T
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
            const db = await database

            const tx = db.transaction(storeName, "readwrite")
            await Promise.all(value.map(async item => {
                await tx.store.put(item)
            }).concat(tx.done))
        },
        async delete(...ids: string[]) {
            const db = await database
            const tx = db.transaction(storeName, "readwrite")
            await Promise.all(ids.map(async id => tx.store.delete(id)).concat(tx.done))
        },
        async getBy(range: IDBKeyRange) {
            const db = await database
            let cursor = await db.transaction(storeName, "readonly").objectStore(storeName).index("id").openCursor(range)
            const values = []
            while (cursor) {
                values.push(cursor.value)
                cursor = await cursor.continue()
            }

            return values
        },
    }
}

// export const settingsStore = createKeyValueDbStore<Settings>("settings")
// export const contentStore = createKeyValueDbStore<{ [id: string]: string }>("contents")


export const settingsStore = createKeyValueDbStore<Settings>("settings", ["lockedContents"])
export const contentStore = createKeyValueDbStore<{ [id: string]: string }>("contents", true)
export const notesStore = createRecordsDbStore<NoteItem>("notes")
export const pluginStore = createRecordsDbStore<Omit<IPluginInfo, "path">>("plugins")