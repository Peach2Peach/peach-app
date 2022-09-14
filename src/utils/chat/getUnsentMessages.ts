import { account } from '../account'

/**
 * @description Method to add contract to contract list
 * @param id chat room id
 * @param contract the contract
 * @param [save] if true save account
*/
export const getUnsentMessages = (chat: Chat): Message[] => chat.messages
  .filter(m => m.from === account.publicKey)
  .filter(m => m.readBy.length === 0)