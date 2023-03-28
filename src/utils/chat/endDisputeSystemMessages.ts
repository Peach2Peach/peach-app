import i18n from '../i18n'
import { createSystemMessage } from './createSystemMessage'

export const endDisputeSystemMessages = (roomId: Chat['id'], contract: Contract): Message[] => {
  const messages: Message[] = []

  if (contract.disputeResolvedDate && contract.disputeOutcome) {
    messages.push(
      createSystemMessage(
        roomId,
        contract.disputeResolvedDate,
        i18n('chat.systemMessage.dispute.outcome.' + contract.disputeOutcome),
      ),
    )

    messages.push(createSystemMessage(roomId, contract.disputeResolvedDate, i18n('chat.systemMessage.noLongerMediated')))
  }

  return messages
}
