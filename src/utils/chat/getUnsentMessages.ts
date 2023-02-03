import { account } from '../account'

export const getUnsentMessages = (messages: Message[]): Message[] =>
  messages.filter((m) => m.from === account.publicKey).filter((m) => m.readBy?.length === 0)
