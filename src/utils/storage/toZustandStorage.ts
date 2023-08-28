import { MMKVInstance } from 'react-native-mmkv-storage'
import { StateStorage } from 'zustand/middleware'
import { error } from '../log'
import { dateTimeReviver } from '../system'

export const toZustandStorage = (storage: MMKVInstance): StateStorage => ({
  setItem: async (name: string, value: unknown) => {
    await storage.setItem(name, JSON.stringify(value))
  },
  getItem: async (name: string) => {
    const value = await storage.getItem(name)
    try {
      if (typeof value === 'string') return JSON.parse(value, dateTimeReviver)
    } catch (e) {
      error(e)
    }
    return null
  },
  removeItem: (name: string) => {
    storage.removeItem(name)
  },
})
