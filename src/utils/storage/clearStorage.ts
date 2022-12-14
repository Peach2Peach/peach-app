import { MMKVInstance } from 'react-native-mmkv-storage'

export const clearStorage = async (storage: MMKVInstance) =>
  ((await storage.indexer.getKeys()) || []).forEach((key) => storage.removeItem(key))
