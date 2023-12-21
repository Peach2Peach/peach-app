import { responseUtils } from 'test-utils'
import { contract } from '../../../../peach-api/src/testData/contract'
import { peachAPI } from '../../../utils/peachAPI'
import { submitRaiseDispute } from './submitRaiseDispute'

const raiseDisputeMock = jest.spyOn(peachAPI.private.contract, 'raiseDispute')

describe('submitRaiseDispute', () => {
  const mockContract = { ...contract }
  it('should return [false, null] if contract is undefined', async () => {
    const [result, err] = await submitRaiseDispute({
      contract: undefined,
      reason: 'noPayment.buyer',
      symmetricKey: undefined,
    })
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, null] if contract.symmetricKey is undefined', async () => {
    const [result, err] = await submitRaiseDispute({
      contract: mockContract,
      reason: 'noPayment.buyer',
      symmetricKey: undefined,
    })
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, null] if raiseDispute returns no result and no error', async () => {
    raiseDisputeMock.mockResolvedValue(responseUtils)
    const [result, err] = await submitRaiseDispute({
      contract: mockContract,
      reason: 'noPayment.buyer',
      symmetricKey: undefined,
    })
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, error] if raiseDispute returns no result and an error', async () => {
    raiseDisputeMock.mockResolvedValue({ error: { error: 'INTERNAL_SERVER_ERROR' }, ...responseUtils })
    const [result, err] = await submitRaiseDispute({
      contract: mockContract,
      reason: 'noPayment.buyer',
      symmetricKey: 'TODO',
    })
    expect(result).toBe(false)
    expect(err).toStrictEqual({ error: 'INTERNAL_SERVER_ERROR' })
  })
  it('should return [true, null] if raiseDispute returns a result and no error', async () => {
    raiseDisputeMock.mockResolvedValue({ result: { success: true }, ...responseUtils })
    const [result, err] = await submitRaiseDispute({
      contract: mockContract,
      reason: 'noPayment.buyer',
      symmetricKey: 'TODO',
    })
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
})
