/**
 * @description Method to get unread chat notifications from contract
 * @param contract contract
 * @returns unread chat notifications for contract
 */
export const getContractChatNotification = (contract: Contract) => {
  if (typeof contract.unreadMessages !== 'undefined') {
    return contract.unreadMessages
  }

  return 0
}
