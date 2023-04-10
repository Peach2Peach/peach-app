import { contract } from '../../../../tests/unit/data/contractData'
import { cancelContractAsBuyer } from './cancelContractAsBuyer'

const apiSuccess = { success: true }
const apiError = { error: 'UNAUTHORIZED' }
const cancelContractMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  cancelContract: (...args: any[]) => cancelContractMock(...args),
}))

describe('cancelContractAsBuyer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('calls cancelContract and returns contract update', async () => {
    const result = await cancelContractAsBuyer(contract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({
      contract: {
        ...contract,
        canceled: true,
        cancelConfirmationDismissed: false,
      },
    })
  })

  it('handles cancelContract error response', async () => {
    cancelContractMock.mockResolvedValueOnce([null, apiError])
    const result = await cancelContractAsBuyer(contract)
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toBe(apiError.error)
    expect(result.getValue()).toEqual({ contract })
  })
})
