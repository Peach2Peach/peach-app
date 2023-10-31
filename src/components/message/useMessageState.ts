import { create } from 'zustand'

export const defaultState: MessageState = {
  level: 'DEFAULT',
  keepAlive: false,
  time: 0,
}

type MessageActions = {
  updateMessage: (newState: MessageState) => void
}

export const useMessageState = create<MessageState & MessageActions>((set) => ({
  ...defaultState,
  updateMessage: (newState) =>
    set({
      msgKey: newState.msgKey,
      bodyArgs: newState.bodyArgs,
      level: newState.level,
      onClose: newState.onClose || undefined,
      action: newState.action,
      keepAlive: newState.keepAlive || false,
      time: Date.now(),
    }),
}))
