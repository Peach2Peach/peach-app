import { decryptSymmetric } from '../pgp'

/**
 * @description Method to decrypt chat messages, if message cannot be decrypted, null will be returned instead
 * @param chat chat object
 * @param symmetricKey symmetric key to decrypt with
 * @returns decrypted chat messages
 */
export const decryptMessage = (
  chat: Chat,
  symmetricKey: Contract['symmetricKey']
) => async (message: Message): Promise<Message> => {
  const existingMessage = chat.messages.find(m =>
    m.date.getTime() === message.date.getTime() && m.from === message.from
  )
  let decryptedMessage: string|null = existingMessage?.message || null
  try {
    if (message.message && symmetricKey) {
      decryptedMessage = decryptedMessage || await decryptSymmetric(message.message, symmetricKey)
    }
  } catch (e) {
    decryptedMessage = null
  }
  return {
    ...message,
    message: decryptedMessage,
  }
}