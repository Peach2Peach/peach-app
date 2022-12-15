import { MMKVInstance } from 'react-native-mmkv-storage'

/**
 * @description indexer.maps.getAll() returns an object with keys 0, 1, 2 ... n
 * Each item is a tuble consisting of [id, value]
 * This method helps us to make the data usable
 */
export const getIndexedMap = async (storage: MMKVInstance): Promise<Record<string, unknown>> => {
  const map = await storage.indexer.maps.getAll()

  if (map) return Object.values(map).reduce((obj, [, val]) => {
    obj[val.id] = val
    return obj
  }, {})

  return {}
}
