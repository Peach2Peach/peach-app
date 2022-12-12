import { IOSAccessibleStates, MMKVLoader } from 'react-native-mmkv-storage'
import { StateStorage } from 'zustand/middleware'

export const createStorage = (instanceId: string): StateStorage => {
  const storage = new MMKVLoader()
    .setAccessibleIOS(IOSAccessibleStates.AFTER_FIRST_UNLOCK)
    .withEncryption()
    .withInstanceID(instanceId)
    .initialize()

  return {
    setItem: storage.setItem as (name: string, value: string) => void | Promise<void>,
    getItem: storage.getItem as (name: string) => string | Promise<string | null> | null,
    removeItem: storage.removeItem as (name: string) => void | Promise<void>,
  }
}
