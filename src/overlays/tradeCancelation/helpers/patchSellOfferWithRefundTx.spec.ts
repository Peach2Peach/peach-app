import { Psbt } from 'bitcoinjs-lib'
import { contract } from '../../../../tests/unit/data/contractData'
import { sellOffer } from '../../../../tests/unit/data/offerData'

import { patchSellOfferWithRefundTx } from './patchSellOfferWithRefundTx'

const apiSuccess = { success: true }
const apiError = { error: 'UNAUTHORIZED' }
const patchOfferMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  patchOffer: (...args: any[]) => patchOfferMock(...args),
}))
const getSellOfferFromContractMock = jest.fn().mockReturnValue(sellOffer)
jest.mock('../../../utils/contract/getSellOfferFromContract', () => ({
  getSellOfferFromContract: (...args: any[]) => getSellOfferFromContractMock(...args),
}))
const checkRefundPSBTMock = jest.fn().mockReturnValue({ isValid: true, psbt: new Psbt() })
jest.mock('../../../utils/bitcoin/checkRefundPSBT', () => ({
  checkRefundPSBT: (...args: any[]) => checkRefundPSBTMock(...args),
}))

describe('patchSellOfferWithRefundTx', () => {
  const refundPSBT = 'refundPSBT'
  const refundTx = 'cHNidP8BAAoCAAAAAAAAAAAAAAAA'

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('calls patchOffer', async () => {
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id, refundTx })
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toEqual({
      sellOffer: {
        ...sellOffer,
        refundTx: 'cHNidP8BAAoCAAAAAAAAAAAAAAAA',
      },
    })
  })

  it('returns error result if refund PSBT check returns error', async () => {
    const checkRefundPSBTError = 'RETURN_ADDRESS_MISMATCH'
    checkRefundPSBTMock.mockReturnValueOnce({ isValid: false, psbt: new Psbt(), err: checkRefundPSBTError })
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toEqual(checkRefundPSBTError)
    expect(result.getValue()).toEqual({ sellOffer })
  })
  it('returns error result offer could not be patched', async () => {
    patchOfferMock.mockResolvedValueOnce([null, apiError])
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toEqual(apiError.error)
    expect(result.getValue()).toEqual({ sellOffer })
  })
  it('returns unknown error result offer could not be patched with no reason', async () => {
    patchOfferMock.mockResolvedValueOnce([null, { error: undefined }])
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toEqual('UNKNOWN_ERROR')
    expect(result.getValue()).toEqual({ sellOffer })
  })
  it('returns unknown error result if something else went wrong', async () => {
    checkRefundPSBTMock.mockReturnValueOnce({ isValid: false, psbt: undefined })
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toEqual(new Error('UNKNOWN_ERROR'))
    expect(result.getValue()).toEqual({ sellOffer })
  })
})
