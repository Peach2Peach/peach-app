import { Psbt } from 'bitcoinjs-lib'
import { contract } from '../../../../peach-api/src/testData/contract'
import { sellOffer } from '../../../../tests/unit/data/offerData'

import { responseUtils } from 'test-utils'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { peachAPI } from '../../../utils/peachAPI'
import { setWallet } from '../../../utils/wallet/setWallet'
import { patchSellOfferWithRefundTx } from './patchSellOfferWithRefundTx'

const patchOfferMock = jest.spyOn(peachAPI.private.offer, 'patchOffer')
const getSellOfferFromContractMock = jest.fn().mockReturnValue(sellOffer)
jest.mock('../../../utils/contract/getSellOfferFromContract', () => ({
  getSellOfferFromContract: (...args: unknown[]) => getSellOfferFromContractMock(...args),
}))
const checkRefundPSBTMock = jest.fn().mockReturnValue({ isValid: true, psbt: new Psbt() })
jest.mock('../../../utils/bitcoin/checkRefundPSBT', () => ({
  checkRefundPSBT: (...args: unknown[]) => checkRefundPSBTMock(...args),
}))

describe('patchSellOfferWithRefundTx', () => {
  const refundPSBT = 'refundPSBT'
  const refundTx = 'cHNidP8BAAoCAAAAAAAAAAAAAAAA'
  beforeEach(() => {
    setWallet(createTestWallet())
  })
  it('calls patchOffer', async () => {
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id, refundTx })
    expect(result.result).toEqual({
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
    expect(result.error).toEqual(checkRefundPSBTError)
    expect(result.result).toEqual({ sellOffer })
  })
  it('returns error result offer could not be patched', async () => {
    patchOfferMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.error).toBe('UNAUTHORIZED')
    expect(result.result).toEqual({ sellOffer })
  })
  it('returns unknown error result offer could not be patched with no reason', async () => {
    // @ts-expect-error testing with invalid response
    patchOfferMock.mockResolvedValueOnce({ error: { error: undefined }, ...responseUtils })
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.error).toBe('UNKNOWN_ERROR')
    expect(result.result).toEqual({ sellOffer })
  })
  it('returns unknown error result if something else went wrong', async () => {
    checkRefundPSBTMock.mockReturnValueOnce({ isValid: false, psbt: undefined })
    const result = await patchSellOfferWithRefundTx(contract, refundPSBT)
    expect(result.error).toBe('UNKNOWN_ERROR')
    expect(result.result).toEqual({ sellOffer })
  })
})
