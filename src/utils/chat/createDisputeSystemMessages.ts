import { isEmailRequired } from '../../views/dispute/Dispute'
import { getOfferIdfromContract } from '../contract'
import i18n from '../i18n'
import { info } from '../log'
import { createSystemMessage } from './createSystemMessage'

/**
 * @description Method to add system messages to contract chat for dispute cases
 * @param roomId chat room id
 * @param messages messages
 * @param contract contract
 * @returns Messages
 */
export const initDisputeSystemMessages = (roomId: Chat['id'], contract: Contract): Message[] => {
  let messages: Message[] = []
  info('dispute date: ' + contract.disputeDate)
  info('dispute initiator: ' + contract.disputeInitiator)

  if (contract.disputeDate && contract.disputeInitiator) {
    const initiator = i18n(contract.disputeInitiator === contract.seller.id ? 'seller' : 'buyer')
    const initiatorId = `Peach${contract.disputeInitiator.substring(0, 8)}`
    const reason = i18n(`dispute.reason.${contract.disputeReason || 'disputeOther'}`)
    messages = messages.concat([
      createSystemMessage(
        roomId,
        new Date(Date.now()),
        i18n('chat.systemMessage.disputeStarted', initiator, initiatorId, reason),
      ),
      createSystemMessage(roomId, contract.disputeDate, i18n('chat.systemMessage.mediatorWillJoinSoon')),
    ])

    if (isEmailRequired(contract.disputeReason!)) {
      messages = messages.concat([
        createSystemMessage(
          roomId,
          contract.disputeDate,
          [
            i18n('chat.systemMessage.provideMoreInformation.1'),
            i18n('chat.systemMessage.provideMoreInformation.2', getOfferIdfromContract(contract)),
          ].join('\n\n'),
        ),
      ])
    }
  }

  return messages
}

export const endDisputeSystemMessages = (roomId: Chat['id'], contract: Contract): Message[] => {
  const messages: Message[] = []

  if (contract.disputeResolvedDate && contract.disputeInitiator) {
    if (contract.disputeWinner) {
      const initiator = i18n(contract.disputeWinner)
      const initiatorId = `Peach${contract.disputeInitiator.substring(0, 8)}`
      messages.push(
        createSystemMessage(
          roomId,
          new Date(Date.now()),
          i18n('chat.systemMessage.disputeResolved', initiator, initiatorId),
        ),
      )
      messages.push(
        createSystemMessage(roomId, contract.disputeResolvedDate, i18n('chat.systemMessage.noLongerMediated')),
      )
    } else {
      messages.push(
        createSystemMessage(roomId, contract.disputeResolvedDate, i18n('chat.systemMessage.disputeResolved.nonDispute')),
      )
    }
  }

  return messages
}
