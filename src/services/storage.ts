import { Transaction, Settings } from '@/types';

const DB_NAME = 'BudgenaDB';
const DB_VERSION = 1;
const TRANSACTIONS_STORE = 'transactions';
const SETTINGS_STORE = 'settings';

class StorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
          const transactionStore = db.createObjectStore(TRANSACTIONS_STORE, { keyPath: 'id' });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
          transactionStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Transactions
  async addTransaction(transaction: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TRANSACTIONS_STORE, 'readwrite');
      const request = store.add(transaction);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TRANSACTIONS_STORE, 'readwrite');
      const request = store.put(transaction);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TRANSACTIONS_STORE, 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TRANSACTIONS_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TRANSACTIONS_STORE);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Settings
  async saveSettings(settings: Settings): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(SETTINGS_STORE, 'readwrite');
      const request = store.put({ id: 'app-settings', ...settings });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<Settings | null> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(SETTINGS_STORE);
      const request = store.get('app-settings');
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { id, ...settings } = result;
          resolve(settings as Settings);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();
