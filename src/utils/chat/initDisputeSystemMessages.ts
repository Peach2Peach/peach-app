import { contractIdToHex } from '../contract'
import { isEmailRequiredForDispute } from '../dispute'
import i18n from '../i18n'
import { createSystemMessage } from './createSystemMessage'

/**
 * @description Method to add system messages to contract chat for dispute cases
 * @param roomId chat room id
 * @param messages messages
 * @param contract contract
 * @returns Messages
 */
export const initDisputeSystemMessages = (roomId: Chat['id'], contract: Contract): Message[] => {
  const messages: Message[] = []

  if (contract.disputeDate && contract.disputeInitiator && contract.disputeReason) {
    const initiator = i18n(contract.disputeInitiator === contract.seller.id ? 'seller' : 'buyer')
    const initiatorId = `Peach${contract.disputeInitiator.substring(0, 8)}`
    const reason = i18n(`dispute.reason.${contract.disputeReason}`)
    messages.push(
      createSystemMessage(
        roomId,
        contract.disputeDate,
        i18n('chat.systemMessage.disputeStarted', initiator, initiatorId, reason),
      ),
    )
    messages.push(createSystemMessage(roomId, contract.disputeDate, i18n('chat.systemMessage.mediatorWillJoinSoon')))

    if (isEmailRequiredForDispute(contract.disputeReason)) {
      messages.push(
        createSystemMessage(
          roomId,
          contract.disputeDate,
          [
            i18n('chat.systemMessage.provideMoreInformation.1'),
            i18n('chat.systemMessage.provideMoreInformation.2', contractIdToHex(contract.id)),
          ].join('\n\n'),
        ),
      )
    }
  }

  return messages
}
