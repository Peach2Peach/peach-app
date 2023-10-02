import { account } from '../account'

export function isMe (id: string) {
  return account.publicKey === id
}
