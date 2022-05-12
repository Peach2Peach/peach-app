import { account, saveAccount } from '../account'
import { session } from '../session'


/**
 * @description Method to add contract to contract list
 * @param contract the contract
*/
export const saveChat = (id: string, chat: Partial<Chat>): void => {
  if (!account.chats[id]) {
    account.chats[id] = {
      lastSeen: new Date(0),
      messages: [],
      id,
      ...chat
    }
  } else {
    account.chats[id] = {
      ...account.chats[id],
      ...chat
    }
  }
  if (session.password) saveAccount(account, session.password)
}