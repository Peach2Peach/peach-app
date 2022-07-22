import { isEmailRequired } from '../../views/dispute/Dispute'
import { contractIdToHex } from '../contract'
import i18n from '../i18n'

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
  message,
  signature: ''
})


/**
 * @description Method to add system messages to contract chat for dispute cases
 * @param roomId chat room id
 * @param messages messages
 * @param contract contract
 * @returns Messages
 */
export const createDisputeSystemMessages = (roomId: Chat['id'], contract: Contract): Message[] => {
  let messages: Message[] = []
  if (contract.disputeDate && contract.disputeInitiator) {
    const initiator = i18n(contract.disputeInitiator === contract.seller.id ? 'seller' : 'buyer')
    const initiatorId = `Peach${contract.disputeInitiator.substring(0, 8)}`
    const reason = i18n(`dispute.reason.${contract.disputeReason || 'disputeOther'}`)
    messages = messages.concat([
      createSystemMessage(
        roomId,
        contract.disputeDate,
        i18n('chat.systemMessage.disputeStarted', initiator, initiatorId, reason)
      ),
      createSystemMessage(
        roomId,
        contract.disputeDate,
        i18n('chat.systemMessage.mediatorWillJoinSoon')
      ),
    ])
    if (isEmailRequired(contract.disputeReason!)) {
      messages = messages.concat([
        createSystemMessage(
          roomId,
          contract.disputeDate,
          [
            i18n('chat.systemMessage.provideMoreInformation.1'),
            i18n('chat.systemMessage.provideMoreInformation.2', contractIdToHex(contract.id)),
          ].join('\n\n')
        )
      ])
    }
  }
  if (contract.disputeResolvedDate && contract.disputeInitiator) {
    if (contract.disputeWinner) {
      const initiator = i18n(contract.disputeWinner)
      const initiatorId = `Peach${contract.disputeInitiator.substring(0, 8)}`
      messages.push(createSystemMessage(
        roomId,
        contract.disputeResolvedDate,
        i18n('chat.systemMessage.disputeResolved', initiator, initiatorId)
      ))
    }
    messages.push(createSystemMessage(
      roomId,
      contract.disputeResolvedDate,
      i18n('chat.systemMessage.noLongerMediated')
    ))
  }

  return messages
}