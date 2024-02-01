import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { createStorage } from "../../utils/storage/createStorage";

export type NotificationsConfig = {
  notifications: number;
};

type NotificationsState = NotificationsConfig & {
  reset: () => void;
  setNotifications: (notifications: number) => void;
};

export const defaultNotificationState: NotificationsConfig = {
  notifications: 0,
};

export const notificationStorage = createStorage("notifications");
const storage = createPersistStorage<NotificationsState>(notificationStorage);

export const useNotificationStore = create(
  persist<NotificationsState>(
    (set) => ({
      ...defaultNotificationState,
      reset: () => set(() => defaultNotificationState),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: "notifications",
      version: 0,
      storage,
    },
  ),
);
