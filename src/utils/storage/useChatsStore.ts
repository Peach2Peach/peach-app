import create from 'zustand'
import { chatsStorage } from './chatsStorage'

export type ChatStorage = {
  chats: Record<Chat['id'], Chat>
  setChat: (chat: Chat) => void
  get: (id: Chat['id']) => Chat
  iterator: () => Chat[]
}

export const useChatsStore = create<ChatStorage>()((set, get) => ({
  chats: {},
  setChat: (chat: Chat) =>
    set((state) => {
      chatsStorage.setMap(chat.id, chat)
      return { ...state, [chat.id]: chat }
    }),
  iterator: () => Object.values(get().chats),
  get: (id: Chat['id']) => get().chats[id],
}))
