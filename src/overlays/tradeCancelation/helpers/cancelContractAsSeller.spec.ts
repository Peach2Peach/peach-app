import { contract } from '../../../../tests/unit/data/contractData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { MSINADAY } from '../../../constants'
import { getResult } from '../../../utils/result'
import { cancelContractAsSeller } from './cancelContractAsSeller'

const apiSuccess = { success: true }
const apiError = { error: 'UNAUTHORIZED' }
const cancelContractSuccessWithPSBT = { success: true, psbt: 'psbt' }
const cancelContractMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  cancelContract: (...args: any[]) => cancelContractMock(...args),
}))
const patchSellOfferWithRefundTxMock = jest.fn().mockResolvedValue(
  getResult({
    sellOffer,
  }),
)
jest.mock('./patchSellOfferWithRefundTx', () => ({
  patchSellOfferWithRefundTx: (...args: any[]) => patchSellOfferWithRefundTxMock(...args),
}))

describe('cancelContractAsSeller', () => {
  const yesterday = new Date(Date.now() - MSINADAY)
  const tomorrow = new Date(Date.now() + MSINADAY)

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('calls cancelContract with active payment timer', async () => {
    const activeContract = { ...contract, paymentExpectedBy: tomorrow }
    const result = await cancelContractAsSeller(activeContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({
      contract: activeContract,
    })
  })
  it('calls cancelContract with expired payment timer and returns contract update', async () => {
    const expiredContract = { ...contract, paymentExpectedBy: yesterday }
    const result = await cancelContractAsSeller(expiredContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({
      contract: { ...expiredContract, cancelConfirmationDismissed: false, canceled: true },
    })
  })
  it('calls cancelContract', async () => {
    const result = await cancelContractAsSeller(contract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({
      contract: { ...contract, canceled: true },
    })
  })
  it('handles cancelContract error response', async () => {
    cancelContractMock.mockResolvedValueOnce([null, apiError])
    const result = await cancelContractAsSeller(contract)
    expect(result.isError()).toBeTruthy()
    expect(result.getValue()).toEqual({ contract })
  })
  it('also calls patchSellOfferWithRefundTx if result returned psbt and returns updates', async () => {
    cancelContractMock.mockResolvedValueOnce([cancelContractSuccessWithPSBT, null])

    const result = await cancelContractAsSeller(contract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({
      contract: {
        ...contract,
        canceled: true,
      },
      sellOffer,
    })
  })
  it('also handles patchSellOfferWithRefundTx error case', async () => {
    patchSellOfferWithRefundTxMock.mockResolvedValueOnce(getResult({ sellOffer }, apiError.error))
    cancelContractMock.mockResolvedValueOnce([cancelContractSuccessWithPSBT, null])

    const result = await cancelContractAsSeller(contract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toBe(apiError.error)
    expect(result.getValue()).toEqual({
      contract: { ...contract, canceled: true },
      sellOffer,
    })
  })
})
