import { contract } from '../../../../tests/unit/data/contractData'
import { account } from '../../../utils/account'
import { submitRaiseDispute } from './submitRaiseDispute'

const raiseDisputeMock = jest.fn()
jest.mock('../../../utils/peachAPI', () => ({
  raiseDispute: (...args: any) => raiseDisputeMock(...args),
}))

describe('submitRaiseDispute', () => {
  const mockContract = { ...contract }
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should return [false, null] if contract is undefined', async () => {
    const [result, err] = await submitRaiseDispute(undefined, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, null] if contract.symmetricKey is undefined', async () => {
    const [result, err] = await submitRaiseDispute({ ...mockContract, symmetricKey: undefined }, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, null] if raiseDispute returns no result and no error', async () => {
    raiseDisputeMock.mockResolvedValue([null, null])
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, error] if raiseDispute returns no result and an error', async () => {
    raiseDisputeMock.mockResolvedValue([null, 'error'])
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe('error')
  })
  it('should return [true, null] if raiseDispute returns a result and no error', async () => {
    raiseDisputeMock.mockResolvedValue([{}, null])
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
  it('should save chat', async () => {
    raiseDisputeMock.mockResolvedValue([{}, null])

    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(true)
    expect(err).toBe(null)
    expect(account.chats[mockContract.id]).toEqual({
      draftMessage: '',
      id: '14-15',
      lastSeen: new Date(0),
      messages: [],
      seenDisputeDisclaimer: false,
    })
  })
})
