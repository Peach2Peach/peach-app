import create from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage } from './createStorage'

export const chatStorage = createStorage('chats')

type ChatStore = {
  chats: Chats
  setChat: (chat: Chat) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: {},
      setChat: (chat: Chat) => set((state) => ({ ...state, [chat.id]: chat })),
    }),
    {
      name: 'chat-storage',
      version: 0,
      getStorage: () => chatStorage,
    },
  ),
)
