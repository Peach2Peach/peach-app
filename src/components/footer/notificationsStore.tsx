import create from 'zustand'

export type NotificationsConfig = {
  notifications: number
}

type NotificationsState = NotificationsConfig & {
  setNotifications: (notificationsConfiguration: Partial<NotificationsConfig>) => void
}

const defaultState: NotificationsConfig = {
  notifications: 0,
}

export const useNotificationsState = create<NotificationsState>()((set) => ({
  ...defaultState,
  setNotifications: (notificationsConfiguration) => set({ ...defaultState, ...notificationsConfiguration }),
}))
