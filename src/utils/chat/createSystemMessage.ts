import { account } from '../account'

/**
 * @description Method to create a system message for chat
 * @param roomId chat room id
 * @param date date of message
 * @param message message
 * @returns Message object for system messages
 */
export const createSystemMessage = (roomId: Message['roomId'], date: Date, message: string): Message => ({
  roomId,
  from: 'system',
  date,
  readBy: [account.publicKey],
  message,
  signature: (Date.now() * Math.random()).toString(),
})
