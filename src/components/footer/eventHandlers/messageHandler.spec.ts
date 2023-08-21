import { account1 } from '../../../../tests/unit/data/accountData'
import { contract } from '../../../../tests/unit/data/contractData'
import { setAccount } from '../../../utils/account'
import { messageHandler } from './messageHandler'

const getContractMock = jest.fn().mockReturnValue(contract)
jest.mock('../../../utils/contract/getContract', () => ({
  getContract: () => getContractMock(),
}))
const saveContractMock = jest.fn()
jest.mock('../../../utils/contract/saveContract', () => ({
  saveContract: (...args: unknown[]) => saveContractMock(...args),
}))

describe('messageHandler', () => {
  const now = new Date()
  const message: Message = {
    roomId: contract.id,
    from: contract.buyer.id,
    date: now,
    message: 'message',
    readBy: [],
    signature: 'signature',
  }
  it('does nothing if message is missing important data', () => {
    messageHandler({ ...message, message: '' })
    messageHandler({ ...message, roomId: '' })
    expect(saveContractMock).not.toHaveBeenCalled()
  })
  it('does nothing if message is from sending user', () => {
    setAccount(account1)
    messageHandler({ ...message, from: account1.publicKey })
    expect(saveContractMock).not.toHaveBeenCalled()
  })
  it('does nothing if contract cannot be found', () => {
    getContractMock.mockReturnValueOnce(undefined)
    messageHandler(message)
    expect(saveContractMock).not.toHaveBeenCalled()
  })
  it('adds +1 to unread messages', () => {
    messageHandler(message)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      unreadMessages: contract.unreadMessages + 1,
    })
  })
})
