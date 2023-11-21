import { useAccountStore } from '../account/account'

export const getUnsentMessages = (messages: Message[]) => {
  const publicKey = useAccountStore.getState().account.publicKey
  return messages.filter((m) => m.from === publicKey).filter((m) => m.readBy?.length === 0)
}
