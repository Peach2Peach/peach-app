import { contract } from '../../../../tests/unit/data/contractData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { apiSuccess, unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { MSINADAY } from '../../../constants'
import { getResult } from '../../../utils/result'
import { cancelContractAsSeller } from './cancelContractAsSeller'

const cancelContractSuccessWithPSBT = { success: true, psbt: 'psbt' }
const cancelContractMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  cancelContract: (...args: unknown[]) => cancelContractMock(...args),
}))
const patchSellOfferWithRefundTxMock = jest.fn().mockResolvedValue(
  getResult({
    sellOffer,
  }),
)
jest.mock('./patchSellOfferWithRefundTx', () => ({
  patchSellOfferWithRefundTx: (...args: unknown[]) => patchSellOfferWithRefundTxMock(...args),
}))

describe('cancelContractAsSeller', () => {
  const yesterday = new Date(Date.now() - MSINADAY)
  const tomorrow = new Date(Date.now() + MSINADAY)
  const expiredContract = { ...contract, paymentExpectedBy: yesterday }
  it('calls cancelContract with active payment timer', async () => {
    const activeContract = { ...contract, paymentExpectedBy: tomorrow }
    const result = await cancelContractAsSeller(activeContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({ sellOffer: undefined })
  })
  it('calls cancelContract with expired payment timer and returns contract update', async () => {
    const result = await cancelContractAsSeller(expiredContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({ sellOffer: undefined })
  })
  it('calls cancelContract', async () => {
    const result = await cancelContractAsSeller(expiredContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({ sellOffer: undefined })
  })
  it('handles cancelContract error response', async () => {
    cancelContractMock.mockResolvedValueOnce([null, unauthorizedError])
    const result = await cancelContractAsSeller(contract)
    expect(result.isError()).toBeTruthy()
    expect(result.getValue()).toEqual({ sellOffer: undefined })
  })
  it('also calls patchSellOfferWithRefundTx if result returned psbt and returns updates', async () => {
    cancelContractMock.mockResolvedValueOnce([cancelContractSuccessWithPSBT, null])

    const result = await cancelContractAsSeller(expiredContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({ sellOffer })
  })
  it('also handles patchSellOfferWithRefundTx error case', async () => {
    patchSellOfferWithRefundTxMock.mockResolvedValueOnce(getResult({ sellOffer }, unauthorizedError.error))
    cancelContractMock.mockResolvedValueOnce([cancelContractSuccessWithPSBT, null])

    const result = await cancelContractAsSeller(expiredContract)
    expect(cancelContractMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toBe(unauthorizedError.error)
    expect(result.getValue()).toEqual({ sellOffer })
  })
})
