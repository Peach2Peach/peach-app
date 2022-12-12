import { StateStorage } from 'zustand/middleware'
import { createStorage } from './createStorage'

export const createZustandStorage = (instanceId: string): StateStorage => {
  const storage = createStorage(instanceId)

  return {
    setItem: storage.setItem as (name: string, value: string) => void | Promise<void>,
    getItem: storage.getItem as (name: string) => string | Promise<string | null> | null,
    removeItem: storage.removeItem as (name: string) => void | Promise<void>,
  }
}
