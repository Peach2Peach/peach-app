import { MMKVInstance } from 'react-native-mmkv-storage'
import { StateStorage } from 'zustand/middleware'

export const toZustandStorage = (storage: MMKVInstance): StateStorage => ({
  setItem: storage.setItem as (name: string, value: string) => void | Promise<void>,
  getItem: storage.getItem as (name: string) => string | Promise<string | null> | null,
  removeItem: storage.removeItem as (name: string) => void | Promise<void>,
})
