import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { error } from '../../utils/log'
import { createStorage } from '../../utils/storage'
import { dateTimeReviver } from '../../utils/system'

export type NotificationsConfig = {
  notifications: number
}

type NotificationsState = NotificationsConfig & {
  reset: () => void
  setNotifications: (notifications: number) => void
}

export const defaultNotificationState: NotificationsConfig = {
  notifications: 0,
}

export const notificationStorage = createStorage('notifications')

export const useNotificationStore = create(
  persist<NotificationsState>(
    (set) => ({
      ...defaultNotificationState,
      reset: () => set(() => defaultNotificationState),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: 'notifications',
      version: 0,
      storage: createJSONStorage(() => ({
        setItem: async (name: string, value: unknown) => {
          await notificationStorage.setItem(name, JSON.stringify(value))
        },
        getItem: async (name: string) => {
          const value = await notificationStorage.getItem(name)
          try {
            if (typeof value === 'string') return JSON.parse(value, dateTimeReviver)
          } catch (e) {
            error(e)
          }
          return null
        },
        removeItem: (name: string) => {
          notificationStorage.removeItem(name)
        },
      })),
    },
  ),
)
