import { MMKVInstance } from 'react-native-mmkv-storage'
import { StateStorage } from 'zustand/middleware'
import { dateTimeReviver } from '../system'

export const toZustandStorage = (storage: MMKVInstance): StateStorage => ({
  setItem: async (name: string, value: unknown) => {
    await storage.setItem(name, JSON.stringify(value))
  },
  getItem: async (name: string) => {
    const value = await storage.getItem(name)
    try {
      if (value) return JSON.parse(value, dateTimeReviver)
    } catch (e) {}
    return null
  },
  removeItem: storage.removeItem as (name: string) => void | Promise<void>,
})
