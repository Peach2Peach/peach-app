import create from 'zustand'
import { persist } from 'zustand/middleware'
import { concatMessages } from '../chat'
import { chatStorage } from './chatStorage'
import { toZustandStorage } from './toZustandStorage'

export type ChatStorage = Chat & {
  setLastSeen: (date: Date) => void
  setDraft: (draftMessage: string) => void
  addMessages: (messages: Message[]) => void
}

export const useChatStore = (id: string) =>
  create<ChatStorage>()(
    persist(
      (set) => ({
        id,
        lastSeen: new Date(0),
        messages: [] as Message[],
        draftMessage: '',
        setLastSeen: (lastSeen: Date) => set((state) => ({ ...state, lastSeen })),
        setDraft: (draftMessage: string) => set((state) => ({ ...state, draftMessage })),
        addMessages: (messages: Message[]) =>
          set((state) => ({ ...state, messages: concatMessages(state.messages, messages) })),
      }),
      {
        name: id,
        version: 0,
        getStorage: () => toZustandStorage(chatStorage),
      },
    ),
  )()
