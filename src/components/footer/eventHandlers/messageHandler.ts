import { account } from '../../../utils/account'
import { getContract, saveContract } from '../../../utils/contract'

export const messageHandler = async (message: Message) => {
  if (!message.message || !message.roomId || message.from === account.publicKey) return
  const contract = getContract(message.roomId.replace('contract-', ''))
  if (!contract) return

  saveContract({
    ...contract,
    unreadMessages: contract.unreadMessages + 1,
  })
}
