import { account } from '../account'
import { getChat } from './getChat'

/**
 * @description Method to get saved chat
 * @param id chat id
 * @returns chat
 */
export const getChats = (): Chat[] => Object.keys(account.chats).map(c => getChat(c))
