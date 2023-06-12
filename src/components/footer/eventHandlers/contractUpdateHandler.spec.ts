import { contract } from '../../../../tests/unit/data/contractData'
import { contractUpdateHandler } from './contractUpdateHandler'

const getContractMock = jest.fn().mockReturnValue(contract)
jest.mock('../../../utils/contract/getContract', () => ({
  getContract: () => getContractMock(),
}))
const saveContractMock = jest.fn()
jest.mock('../../../utils/contract/saveContract', () => ({
  saveContract: (...args: any[]) => saveContractMock(...args),
}))

describe('contractUpdateHandler', () => {
  const now = Date.now()
  const paymentMadeEvent: ContractUpdate = {
    contractId: contract.id,
    event: 'paymentMade',
    data: {
      date: now,
    },
  }
  const paymentConfirmedEvent: ContractUpdate = {
    contractId: contract.id,
    event: 'paymentConfirmed',
    data: {
      date: now,
    },
  }

  it('does nothing if contract cannot be found', () => {
    getContractMock.mockReturnValueOnce(undefined)
    contractUpdateHandler(paymentMadeEvent)
    expect(saveContractMock).not.toHaveBeenCalled()
  })
  it('handles contract updates for paymentMade events', () => {
    contractUpdateHandler(paymentMadeEvent)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      paymentMade: new Date(now),
    })
  })
  it('handles contract updates for paymentConfirmed events', () => {
    contractUpdateHandler(paymentConfirmedEvent)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      paymentConfirmed: new Date(now),
    })
  })
})
