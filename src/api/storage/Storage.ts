import BrowserAPI from "../browser-api";

const Storage = {
  async getStorageValue<R>(key: string): Promise<{ [key: string]: R }> {
    const storageValue = await BrowserAPI.storage.sync.get(key);

    return storageValue;
  },

  async setStorageValue<T>(key: string, value: T) {
    await BrowserAPI.storage.sync.set({ [key]: value });
  },
};

export default Storage;
