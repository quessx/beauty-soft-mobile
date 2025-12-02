import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TIndexedDB } from './indexed-bd.types';
import { DB_SETTING } from './indexed-db-settings';

@Injectable({
    providedIn: 'root'
})
export class IndexedDbService {
    private readonly db: Promise<IDBPDatabase>;

    constructor() {
        this.db = this.initDB();
    }

    private async initDB(): Promise<IDBPDatabase> {
        return openDB(DB_SETTING.name, DB_SETTING.version, {
            upgrade(db: IDBPDatabase<unknown>) {
                if (!db.objectStoreNames.contains(DB_SETTING.storeName)) {
                    db.createObjectStore(DB_SETTING.storeName, { keyPath: 'id' });
                }
            },
        });
    }

    async add(item: TIndexedDB): Promise<any> {
        const db = await this.db;
        return db.add(DB_SETTING.storeName, item);
    }

    async get(key: string): Promise<TIndexedDB | undefined> {
        const db = await this.db;
        return db.get(DB_SETTING.storeName, key);
    }

    async getAll(): Promise<TIndexedDB[]> {
        const db = await this.db;
        return db.getAll(DB_SETTING.storeName);
    }

    async update(item: TIndexedDB): Promise<void> {
        const db = await this.db;
        await db.put(DB_SETTING.storeName, item);
    }

    async delete(key: string): Promise<void> {
        const db = await this.db;
        await db.delete(DB_SETTING.storeName, key);
    }
}
