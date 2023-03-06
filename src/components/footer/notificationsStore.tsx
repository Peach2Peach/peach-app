import create from 'zustand'
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

export const notificationStore = create(
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
