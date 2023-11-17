import { contract } from '../../../../tests/unit/data/contractData'
import { apiSuccess, unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { cancelContractAsBuyer } from './cancelContractAsBuyer'

const cancelContractMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  cancelContract: (...args: unknown[]) => cancelContractMock(...args),
}))

describe('cancelContractAsBuyer', () => {
  it('calls cancelContract and returns contract update', async () => {
    const result = await cancelContractAsBuyer(contract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.result).toBeTruthy()
    expect(result.result).toEqual({
      contract: {
        ...contract,
        canceled: true,
      },
    })
  })

  it('handles cancelContract error response', async () => {
    cancelContractMock.mockResolvedValueOnce([null, unauthorizedError])
    const result = await cancelContractAsBuyer(contract)
    expect(result.error).toBeTruthy()
    expect(result.error).toBe(unauthorizedError.error)
    expect(result.result).toEqual({ contract })
  })
})
