import { account, saveAccount } from '../account'
import { session } from '../session'

/**
 * @description Method to add contract to contract list
 * @param contract the contract
*/
export const saveChat = (id: string, messages: Message[]): void => {
  account.chats[id] = messages
  if (session.password) saveAccount(account, session.password)
}