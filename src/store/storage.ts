import { del, get, set } from 'idb-keyval';
import type { StateStorage } from 'zustand/middleware';

/** IndexedDB-backed storage with a localStorage fallback (private browsing, old WebViews). */
export const idbStorage: StateStorage = {
  async getItem(name) {
    try {
      return (await get<string>(name)) ?? null;
    } catch {
      return localStorage.getItem(name);
    }
  },
  async setItem(name, value) {
    try {
      await set(name, value);
    } catch {
      localStorage.setItem(name, value);
    }
  },
  async removeItem(name) {
    try {
      await del(name);
    } finally {
      localStorage.removeItem(name);
    }
  },
};

/** Asks the browser not to evict our data under storage pressure. */
export function requestPersistentStorage(): void {
  if (navigator.storage?.persist) void navigator.storage.persist().catch(() => undefined);
}
