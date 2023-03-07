import create, { createStore, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../../utils/storage'

export type NotificationsConfig = {
  notifications: number
}

type NotificationsState = NotificationsConfig & {
  reset: () => void
  setNotifications: (notifications: number) => void
}

const defaultState: NotificationsConfig = {
  notifications: 0,
}

export const notificationStorage = createStorage('notifications')

export const notificationStore = createStore(
  persist<NotificationsState>(
    (set) => ({
      ...defaultState,
      reset: () => set(() => defaultState),
      setNotifications: (notifications) => set((state) => ({ ...state, notifications })),
    }),
    {
      name: 'notifications',
      version: 0,
      getStorage: () => toZustandStorage(notificationStorage),
    },
  ),
)

export const useNotificationStore = <T, >(
  selector: (state: NotificationsState) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(notificationStore, selector, equalityFn)
